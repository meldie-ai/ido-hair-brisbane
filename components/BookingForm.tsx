"use client";

import { useState } from "react";

const SERVICES = [
  "Digital Perm",
  "Cold Perm / C-Curl",
  "Colour / Tint / Balayage",
  "Bleach / Ombré",
  "Nanoplasty Straightening",
  "Keratin Smoothing",
  "Chemical Straightening (Shiseido)",
  "Cut & Styling",
];

export default function BookingForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [datetime, setDatetime] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, service, datetime, honeypot }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="booking-form-area">
        <div className="form-success">
          <div className="form-success-icon">✓</div>
          <div className="form-success-title">Request received!</div>
          <div className="form-success-body">
            Thanks for reaching out. We&apos;ll be in touch shortly by phone or message to confirm your appointment.
            <br /><br />
            If you need to reach us urgently, call <strong style={{ color: "var(--blush)" }}>0451 212 233</strong>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-area">
      <div className="form-title">Request an appointment</div>
      <form onSubmit={handleSubmit}>
        {/* Honeypot — hidden from real users, bots fill it */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website">Leave this blank</label>
          <input
            type="text"
            id="website"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {status === "error" && (
          <div className="form-error">{errorMsg}</div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="field-name">Your name</label>
          <input
            className="form-input"
            id="field-name"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="field-contact">Phone or email</label>
          <input
            className="form-input"
            id="field-contact"
            type="text"
            placeholder="Contact details"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="field-service">Service</label>
          <select
            className="form-input"
            id="field-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="field-datetime">Preferred date &amp; time</label>
          <input
            className="form-input"
            id="field-datetime"
            type="text"
            placeholder="e.g. Friday 10 am"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>
        <button className="form-submit" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Enquiry →"}
        </button>
        <p className="form-note">
          Your details are used only to confirm your appointment and won&apos;t be shared. We&apos;ll confirm via phone or message within a few hours.
        </p>
      </form>
    </div>
  );
}
