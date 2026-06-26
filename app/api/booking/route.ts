import { NextRequest, NextResponse } from "next/server";
import { sendSalonNotification, sendCustomerConfirmation } from "@/lib/sendEmail";

const ALLOWED_SERVICES = [
  "Digital Perm",
  "Cold Perm / C-Curl",
  "Colour / Tint / Balayage",
  "Bleach / Ombré",
  "Nanoplasty Straightening",
  "Keratin Smoothing",
  "Chemical Straightening (Shiseido)",
  "Cut & Styling",
];

// Simple in-memory rate limiter: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function extractEmail(contact: string): string | null {
  const match = contact.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return fail("Too many requests. Please try again later.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body.");
  }

  const { name, contact, service, datetime, honeypot } = body as Record<string, string>;

  // Honeypot — silently succeed to not tip off bots
  if (honeypot) {
    return NextResponse.json({ success: true, message: "Booking request received." });
  }

  if (!name?.trim()) return fail("All fields are required.");
  if (!contact?.trim()) return fail("All fields are required.");
  if (!datetime?.trim()) return fail("All fields are required.");
  if (!service || !ALLOWED_SERVICES.includes(service)) return fail("Please select a valid service.");

  const details = {
    name: name.trim(),
    contact: contact.trim(),
    service,
    datetime: datetime.trim(),
  };

  try {
    await sendSalonNotification(details);

    const email = extractEmail(contact);
    if (email) {
      await sendCustomerConfirmation(details, email);
    }
  } catch (err) {
    console.error("Email send error:", err);
    // Don't expose email config errors to the client
    return NextResponse.json(
      { success: false, error: "Failed to send booking request. Please call us directly on 0451 212 233." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Booking request received." });
}
