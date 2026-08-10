import Image from "next/image";
import Nav from "@/components/Nav";
import { isDbConfigured, getDb } from "@/lib/db";
import type { Promotion, BusinessHour, Announcement } from "@/lib/types";
import { Baby, Coffee, CreditCard, DoorOpen, ParkingCircle, Toilet, MapPin, Clock, Share2 } from "lucide-react";

export const revalidate = 30;

// ── Fallback data (used when DATABASE_URL isn't configured yet) ───────────────

const FALLBACK_PROMOTIONS: Promotion[] = [
  { id: "1", label: "Tue – Fri", discount_percent: 20, description: "All main chemical services during the morning event window, Tuesday through Friday.",  time_window_start: "09:45", time_window_end: "11:00", is_active: true },
  { id: "2", label: "Sat – Mon", discount_percent: 15, description: "All main chemical services during the morning event window, Saturday through Monday.", time_window_start: "09:45", time_window_end: "11:00", is_active: true },
];

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const FALLBACK_HOURS: BusinessHour[] = DAY_NAMES.map((_, i) => ({
  id: String(i), day_of_week: i,
  open_time: "09:30",
  close_time: i === 0 || i === 6 ? "17:00" : "18:30",
  is_closed: false,
}));

const FALLBACK_ANNOUNCEMENT: Announcement = {
  id: "1",
  message_text: "Morning Special 9:45–11:00 am · Tue–Fri 20% off · Sat–Mon 15% off · Pre-book 1 day ahead to apply",
  is_active: true,
};

// ── Data fetching ────────────────────────────────────────────────────────────

async function fetchSiteData() {
  if (!isDbConfigured()) {
    return {
      promotions: FALLBACK_PROMOTIONS,
      hours: FALLBACK_HOURS,
      announcement: FALLBACK_ANNOUNCEMENT,
    };
  }
  try {
    const sql = getDb();
    const [promotions, hours, announcementRows] = (await Promise.all([
      sql`SELECT * FROM promotions WHERE is_active = true ORDER BY created_at`,
      sql`SELECT * FROM business_hours ORDER BY day_of_week`,
      sql`SELECT * FROM announcement WHERE is_active = true LIMIT 1`,
    ])) as [Promotion[], BusinessHour[], Announcement[]];
    return {
      promotions:   promotions.length   ? promotions   : FALLBACK_PROMOTIONS,
      hours:        hours.length        ? hours        : FALLBACK_HOURS,
      announcement: announcementRows[0] ?? null,
    };
  } catch {
    return {
      promotions: FALLBACK_PROMOTIONS,
      hours: FALLBACK_HOURS,
      announcement: FALLBACK_ANNOUNCEMENT,
    };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const { promotions, hours, announcement } = await fetchSiteData();
  const today = new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane", weekday: "long" });

  return (
    <>
      {/* NAV */}
      <Nav />

      {/* EVENT STRIP */}
      {announcement && (
        <div className="event-strip">
          {announcement.message_text}
        </div>
      )}

      {/* HERO */}
      <div className="hero" style={{ marginTop: announcement ? 0 : 72 }}>
        <div className="hero-left">
          <p className="hero-eyebrow">Korean · Japanese · Brisbane CBD</p>
          <h1 className="hero-title">
            Hair done<br /><em>right</em>,<br />from Seoul<br />to George St.
          </h1>
          <p className="hero-subtitle">아이두 헤어 브리즈번</p>
          <p className="hero-desc">
            Government-certified hairdressers and educators, qualified across Australia, Korea, Japan, and the UK. Precision technique at Level 2, 187 George Street.
          </p>
          <div className="hero-ctas">
            <a href="#booking" className="btn-primary">Book a Visit</a>
            <a href="#services" className="btn-ghost">See Services</a>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">4.7★</div><div className="stat-label">Google Rating</div></div>
            <div><div className="stat-num">2,033</div><div className="stat-label">Reviews</div></div>
            <div><div className="stat-num">28K</div><div className="stat-label">Instagram</div></div>
          </div>
        </div>
        <div className="hero-right">
          <Image
            src="/images/logo.png"
            alt="Ido Hair Brisbane"
            width={340}
            height={180}
            style={{ objectFit: "contain", position: "relative", zIndex: 1, maxWidth: "80%", height: "auto", filter: "invert(1) brightness(2)" }}
            priority
          />
          <div className="hero-badge">
            <div className="badge-stars">★★★★★</div>
            <div className="badge-score">4.7</div>
            <div className="badge-count">2,033 Google Reviews</div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <p className="section-eyebrow">What We Do</p>
        <h2 className="section-title">Crafted for every hair story</h2>
        <div className="services-grid">
          {[
            { name: "Digital Perm", desc: "Korean-machine digital waves with lasting curl definition. Loose beach waves to defined spirals." },
            { name: "Colour & Tint", desc: "Full tint, ombré, balayage, foils, and bleach using premium Italian non-ammonia products." },
            { name: "Nanoplasty Straightening", desc: "Authentic Nanoplasty technology. Ultra-smooth, frizz-free results with genuine premium products." },
            { name: "Keratin Smoothing", desc: "Japanese Shiseido and Korean-technique keratin for silky, manageable hair." },
            { name: "Cold Perm / C-Curl", desc: "Korean Create ATS premium wave solution for natural, bouncy curls with lasting hold." },
            { name: "Cut & Styling", desc: "Precision cuts from hairdressers certified across Australia, UK, Korea, and Japan." },
          ].map((s) => (
            <div className="service-card" key={s.name}>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div>
          <p className="section-eyebrow">Our Story</p>
          <h2 className="section-title">Qualified across<br />four countries</h2>
          <p className="section-body">Ido Hair is owner-operated by an Australian government-certified hair professional and educator, with qualifications spanning Australia, the UK, Korea, and Japan. We&apos;ve published a hairdressing book, <em>The Basic of Scissors</em>, in Korea, and even designed our own professional scissors.</p>
          <div className="credentials-list">
            {[
              { flag: "🇦🇺", title: "Australia: Government-Certified Professional & Educator", body: "Registered hairdresser and certified hairdressing instructor" },
              { flag: "🇰🇷", title: "Korea: Qualified Hairdresser", body: "Published authors of The Basic of Scissors · Designed professional scissors used in-salon" },
              { flag: "🇯🇵", title: "Japan: Qualified Hairdresser", body: "Japanese Shiseido straightening specialists" },
              { flag: "🇬🇧", title: "United Kingdom: Qualified Hairdresser", body: "European colour and technique foundation" },
            ].map((c) => (
              <div className="cred-item" key={c.flag}>
                <div className="cred-flag">{c.flag}</div>
                <div className="cred-text"><strong>{c.title}</strong>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual" />
      </section>

      {promotions.length > 0 && (
        <section id="promotions">
          <p className="section-eyebrow">Current Offers</p>
          <h2 className="section-title">Morning &amp; weekday discounts</h2>
          <div className="promo-grid">
            <div className="promo-card featured">
              <div className="promo-label">Morning Event · Every Day</div>
              <div style={{ fontSize: "0.9rem", color: "rgba(250,250,250,0.6)", lineHeight: 1.8, marginBottom: 24 }}>
                Book at least one day in advance and arrive between 9:45–11:00 am to access the current discount. Applies to all main chemical work only. Prices subject to change upon consultation.
              </div>
              <div className="promo-time">
                Window: 9:45 am – 11:00 am &nbsp;·&nbsp; Pre-booking required (1 day prior)
              </div>
            </div>
            {promotions.map((p) => (
              <div className="promo-card" key={p.id}>
                <div className="promo-label">{p.label}</div>
                {p.discount_percent != null && (
                  <>
                    <div className="promo-pct">{p.discount_percent}%</div>
                    <div className="promo-day">Off</div>
                  </>
                )}
                {p.description && <div className="promo-detail">{p.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section id="products">
        <div className="products-intro">
          <div>
            <p className="section-eyebrow">Products We Use</p>
            <h2 className="section-title">Only the best,<br />authentic products</h2>
          </div>
        </div>
        <div className="products-grid">
          {[
            { brand: "Italy / Australia", name: "Premium Italian Tint Colour", note: "Non-ammonia · Australian owned" },
            { brand: "Japan", name: "Shiseido Straightening", note: "Made in Japan · Chemical straightening" },
            { brand: "Korea", name: "Create ATS Perm Solution", note: "Made in Korea · Professional wave" },
            { brand: "Authentic", name: "Nanoplasty Treatment", note: "Premium genuine technology" },
          ].map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-brand">{p.brand}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-price">{p.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews">
        <div className="reviews-header">
          <div>
            <p className="section-eyebrow">What Clients Say</p>
            <h2 className="section-title">2,033 reasons to visit</h2>
          </div>
          <div className="reviews-score">
            <div className="score-big">4.7</div>
            <div>
              <div className="score-stars">★★★★★</div>
              <div style={{ fontSize: "0.82rem", color: "var(--soft)" }}>Google Reviews · Brisbane CBD</div>
            </div>
          </div>
        </div>
        <div className="reviews-grid">
          {[
            { stars: "★★★★★", text: "I am so impressed with how it turned out! My hairdresser Yein was very welcoming and friendly. She listened well to what I wanted to achieve.", author: "Rina · 3 weeks ago" },
            { stars: "★★★★★", text: "I had a digital perm done and couldn't be happier. The team was professional, attentive, and really took time to understand the look I wanted.", author: "Yana S. · 2 months ago" },
            { stars: "★★★★★", text: "Easy to find, convenient location. I booked the day before and they were incredibly accommodating in fitting me in last minute.", author: "Manna L. · 1 month ago" },
          ].map((r) => (
            <div className="review-card" key={r.author}>
              <div className="review-stars">{r.stars}</div>
              <div className="review-text">&ldquo;{r.text}&rdquo;</div>
              <div className="review-author">{r.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VISIT INFO — hours live from Supabase */}
      <section id="visit">
        <p className="section-eyebrow">Plan Your Visit</p>
        <h2 className="section-title">Find us in<br />Brisbane CBD</h2>
        <div className="visit-grid">
          <div>
            <table className="hours-table">
              <tbody>
                {hours.map((row) => {
                  const dayName = DAY_NAMES[row.day_of_week];
                  return (
                    <tr key={row.day_of_week} className={dayName === today ? "today" : ""}>
                      <td>{dayName}</td>
                      <td>
                        {row.is_closed
                          ? "Closed"
                          : `${fmtTime(row.open_time)} – ${fmtTime(row.close_time)}`
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="info-pills" style={{ marginTop: 28 }}>
              {[
                { icon: <Baby size={14} />, label: "Good for kids" },
                { icon: <Coffee size={14} />, label: "Beverages provided" },
                { icon: <CreditCard size={14} />, label: "Cards & NFC pay" },
                { icon: <DoorOpen size={14} />, label: "Walk-ins welcome" },
                { icon: <ParkingCircle size={14} />, label: "Paid street parking" },
                { icon: <Toilet size={14} />, label: "Toilet on-site" },
              ].map((pill) => (
                <span className="pill" key={pill.label}>{pill.icon}{pill.label}</span>
              ))}
            </div>
          </div>
          <div className="visit-map-placeholder" style={{ padding: 0, overflow: "hidden", background: "transparent" }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=Ido+Hair+Brisbane,187+George+St+Brisbane+QLD`}
              width="100%"
              height="320"
              style={{ border: 0, display: "block", borderRadius: 4 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ido Hair Brisbane location"
            />
            <div style={{ padding: "14px 0 0", fontSize: "0.85rem", color: "var(--soft)" }}>
              Level 2 / 187 George St, Brisbane City QLD 4000 &nbsp;·&nbsp;
              <a href="https://maps.google.com/?q=Ido+Hair+Brisbane" target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking">
        <p className="section-eyebrow">Reservations</p>
        <h2 className="section-title">Call to book<br />your visit</h2>
        <p className="section-body" style={{ maxWidth: 520 }}>Walk-ins welcome based on availability. For guaranteed appointments, give us a call and we&apos;ll confirm your time and service.</p>
        <div className="call-to-book">
          {[
            { number: "0451 212 233", href: "tel:0451212233" },
            { number: "0451 212 266", href: "tel:0451212266" },
            { number: "0451 212 255", href: "tel:0451212255" },
          ].map((p) => (
            <a key={p.href} href={p.href} className="call-btn">{p.number}</a>
          ))}
        </div>
        <div className="booking-meta">
          <div className="detail-item">
            <div className="detail-icon"><MapPin size={18} /></div>
            <div>
              <div className="detail-label">Location</div>
              <div className="detail-val">Level 2 / 187 George St, Brisbane City QLD 4000</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon"><Clock size={18} /></div>
            <div>
              <div className="detail-label">Hours</div>
              <div className="detail-val">
                Mon–Fri 9:30 am–6:30 pm &nbsp;·&nbsp; Sat–Sun 9:30 am–5:00 pm<br />
                <span style={{ fontSize: "0.82rem", opacity: 0.5 }}>Morning event: 9:45–11:00 am daily (pre-book 1 day prior)</span>
              </div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon"><Share2 size={18} /></div>
            <div>
              <div className="detail-label">Social &amp; Pricing</div>
              <div className="detail-val">
                <a href="https://www.instagram.com/idohair_brisbane_official/" target="_blank" rel="noopener noreferrer">@idohair_brisbane_official</a> &nbsp;·&nbsp;
                <a href="https://www.facebook.com/idohairbrisbane/" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">Ido<span>·</span>Hair</div>
            <div className="footer-tagline">Korean &amp; Japanese Hair Salon · Brisbane CBD</div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                {["Digital Perm", "Colour & Tint", "Nanoplasty", "Keratin", "Cuts"].map((s) => (
                  <li key={s}><a href="#services">{s}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Info</h4>
              <ul>
                <li><a href="#about">About</a></li>
<li><a href="#promotions">Offers</a></li>
                <li><a href="#reviews">Reviews</a></li>
                <li><a href="#visit">Hours &amp; Location</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="tel:0451212233">0451 212 233</a></li>
                <li><a href="https://www.facebook.com/idohairbrisbane/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://www.instagram.com/idohair_brisbane_official/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://maps.google.com/?q=Ido+Hair+Brisbane" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ido Hair Brisbane. All rights reserved.</span>
          <span>Level 2 / 187 George St, Brisbane QLD 4000</span>
        </div>
      </footer>
    </>
  );
}
