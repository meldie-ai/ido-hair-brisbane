import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

interface BookingDetails {
  name: string;
  contact: string;
  service: string;
  datetime: string;
}

function aestTimestamp(): string {
  return new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendSalonNotification(details: BookingDetails) {
  await transporter.sendMail({
    from: `"Ido Hair Website" <${process.env.SENDER_EMAIL}>`,
    to: process.env.SALON_EMAIL,
    subject: `New Booking Request — ${details.service} — ${details.name}`,
    text: `You have a new booking enquiry from the website.

Name:           ${details.name}
Contact:        ${details.contact}
Service:        ${details.service}
Requested time: ${details.datetime}
Submitted:      ${aestTimestamp()} AEST

Please follow up with the customer directly to confirm.`,
  });
}

export async function sendCustomerConfirmation(details: BookingDetails, email: string) {
  const firstName = details.name.split(" ")[0];
  await transporter.sendMail({
    from: `"Ido Hair Brisbane" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "We received your booking request — Ido Hair Brisbane",
    text: `Hi ${firstName},

Thanks for reaching out to Ido Hair Brisbane!

We've received your booking enquiry for:
  Service:        ${details.service}
  Requested time: ${details.datetime}

We'll be in touch shortly by phone or message to confirm your appointment.

If you need to reach us urgently:
  📞 0451 212 233
  📍 Level 2 / 187 George St, Brisbane City QLD 4000

See you soon,
Ido Hair Brisbane
instagram.com/idohair_brisbane_official`,
  });
}
