# Ido Hair Brisbane — Booking System Technical Spec

## Context

This is a spec for the backend booking system for **Ido Hair Brisbane**, a small Korean/Japanese hair salon at Level 2, 187 George St, Brisbane CBD.

A frontend website prototype already exists (`ido_hair_brisbane.html`) with a booking enquiry form that collects:
- Customer name
- Phone or email
- Service type (dropdown)
- Preferred date & time

This spec covers everything needed to make that form actually work end-to-end — confirmation flow, salon notifications, data safety, and hosting.

---

## Goals

1. Customer submits the form → gets an immediate "we received your request" confirmation
2. Ido Hair gets an email notification with the booking details
3. Salon owner manually confirms by calling/texting the customer (they prefer this)
4. Data is handled safely and the form is protected from spam

No database or admin dashboard needed for v1. Keep it simple.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | HTML/CSS (existing) | Already built |
| Backend | Node.js + Express | Lightweight, easy to deploy |
| Email sending | Nodemailer + Gmail SMTP or SendGrid | Free tier sufficient for low volume |
| Spam protection | Honeypot field (invisible to humans) | Simpler than reCAPTCHA, no API key needed |
| Hosting | Vercel (frontend) + Vercel Serverless Functions or Railway (backend) | Free tier, automatic HTTPS |
| Environment secrets | `.env` file, never committed to git | Keeps credentials safe |

---

## Flow Diagram

```
Customer fills form
        ↓
Frontend sends POST /api/booking (JSON)
        ↓
Backend validates fields (all required, basic format check)
        ↓
    [Spam check: honeypot field filled? → reject silently]
        ↓
Send email #1 → Salon inbox (idohair booking details)
Send email #2 → Customer (auto-reply: "received, we'll confirm soon")
        ↓
Return { success: true } → Frontend shows confirmation message
```

---

## API Endpoint

### `POST /api/booking`

**Request body (JSON):**
```json
{
  "name": "Jane Smith",
  "contact": "jane@email.com",
  "service": "Digital Perm",
  "datetime": "Friday 10am",
  "honeypot": ""
}
```

**Validation rules:**
- `name` — required, non-empty string
- `contact` — required, non-empty (phone or email, don't force format)
- `service` — required, must match one of the allowed service values
- `datetime` — required, non-empty string
- `honeypot` — must be empty string; if filled, return `200 OK` silently (don't tell the bot it failed)

**Success response:**
```json
{ "success": true, "message": "Booking request received." }
```

**Error response:**
```json
{ "success": false, "error": "All fields are required." }
```

---

## Email Templates

### Email 1 — To Salon (Ido Hair inbox)

```
Subject: New Booking Request — [Service] — [Name]

You have a new booking enquiry from the website.

Name:     Jane Smith
Contact:  jane@email.com
Service:  Digital Perm
Requested time: Friday 10am
Submitted: 2025-06-26 09:42 AEST

Please follow up with the customer directly to confirm.
```

### Email 2 — To Customer (auto-reply)

```
Subject: We received your booking request — Ido Hair Brisbane

Hi Jane,

Thanks for reaching out to Ido Hair Brisbane!

We've received your booking enquiry for:
  Service: Digital Perm
  Requested time: Friday 10am

We'll be in touch shortly by phone or message to confirm your appointment.

If you need to reach us urgently:
  📞 0451 212 233
  📍 Level 2 / 187 George St, Brisbane City QLD 4000

See you soon,
Ido Hair Brisbane
instagram.com/idohair_brisbane_official
```

> **Note:** Only send the auto-reply if the customer provided an email address. If they gave a phone number only, skip email #2 — the salon will contact them directly anyway.

---

## Spam Protection

Add a hidden honeypot field to the HTML form:

```html
<!-- Honeypot — hidden from real users via CSS, bots will fill it -->
<div style="display:none;" aria-hidden="true">
  <label for="website">Leave this blank</label>
  <input type="text" id="website" name="honeypot" tabindex="-1" autocomplete="off" />
</div>
```

On the backend, if `honeypot` is not an empty string → silently return success without sending any emails.

---

## Frontend Changes Needed

In `ido_hair_brisbane.html`, update the form submit button to call the API instead of doing nothing:

```javascript
document.querySelector('.form-submit').addEventListener('click', async () => {
  const payload = {
    name: document.querySelector('#field-name').value,
    contact: document.querySelector('#field-contact').value,
    service: document.querySelector('#field-service').value,
    datetime: document.querySelector('#field-datetime').value,
    honeypot: document.querySelector('#honeypot').value,
  };

  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.success) {
    // Show success message, hide form
  } else {
    // Show error message
  }
});
```

Also add `id` attributes to the form inputs so JS can target them:
- `id="field-name"`
- `id="field-contact"`
- `id="field-service"`
- `id="field-datetime"`

---

## Environment Variables (`.env`)

```
SALON_EMAIL=idohairbrisbane@gmail.com     # wherever the salon checks email
SENDER_EMAIL=noreply@idohairbrisbane.com  # or a Gmail account used for sending
SENDER_PASSWORD=xxxxxxxxxxxx              # Gmail app password (not the account password)
PORT=3000
```

> **Important:** Add `.env` to `.gitignore`. Never commit credentials.

---

## File Structure

```
ido-hair-brisbane/
├── public/
│   └── ido_hair_brisbane.html     # existing frontend
├── api/
│   └── booking.js                 # POST /api/booking handler
├── utils/
│   └── sendEmail.js               # Nodemailer setup, reusable send function
├── .env                           # secrets (gitignored)
├── .gitignore
├── package.json
└── README.md
```

---

## Security Checklist

- [ ] HTTPS enforced — Vercel does this automatically, no config needed
- [ ] `.env` in `.gitignore` — never push credentials to GitHub
- [ ] Honeypot spam protection on form
- [ ] Input validation on the backend (don't trust the frontend)
- [ ] No sensitive customer data stored — emails go to inbox, nothing persisted to disk or DB
- [ ] Rate limiting — optional for v1, but consider adding `express-rate-limit` to prevent flooding (e.g. max 5 requests per IP per 10 minutes)
- [ ] Privacy policy page — required under Australian Privacy Act since you're collecting names and contact details

---

## Australian Privacy Act Note

Ido Hair is collecting personal information (name + contact details) from customers. Under the **Privacy Act 1988 (Australia)**, they need:

- A brief privacy notice on the booking form (e.g. "Your details are used only to confirm your appointment and won't be shared.")
- A way for customers to request their data be deleted (an email to the salon is sufficient at this scale)

This doesn't need to be elaborate — a single short sentence near the form submit button is enough for v1.

---

## Out of Scope for v1

These are good ideas for later but **not** needed now:

- Admin dashboard / appointment calendar
- Online payments or deposits
- SMS confirmations (Twilio)
- Automated scheduling / conflict detection
- Customer accounts / login

---

## What to Build — Summary

1. `api/booking.js` — Express route: validate → honeypot check → send two emails → return JSON
2. `utils/sendEmail.js` — Nodemailer config with env vars
3. Update `ido_hair_brisbane.html` — add field IDs, honeypot field, JS fetch call, success/error UI state
4. `package.json` — dependencies: `express`, `nodemailer`, `dotenv`, optionally `express-rate-limit`
5. Deploy to Vercel or Railway with env vars set in the dashboard
