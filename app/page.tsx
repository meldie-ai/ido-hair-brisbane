import BookingForm from "@/components/BookingForm";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayIndex = new Date().getDay();

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#">Ido<span>·</span>Hair</a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#promotions">Offers</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#visit">Visit</a></li>
          <li><a href="#booking" className="nav-book">Book Now</a></li>
        </ul>
      </nav>

      {/* EVENT STRIP */}
      <div className="event-strip">
        Morning Special 9:45–11:00 am<span>·</span>Tue–Fri 20% off &nbsp;·&nbsp; Sat–Mon 15% off<span>·</span>Pre-book 1 day ahead to apply
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Korean · Japanese · Brisbane CBD</p>
          <h1 className="hero-title">
            Hair done<br /><em>right</em>,<br />from Seoul<br />to George St.
          </h1>
          <p className="hero-subtitle">아이두 헤어 브리즈번</p>
          <p className="hero-desc">
            Government-certified hairdressers and educators — qualified across Australia, Korea, Japan, and the UK — bringing precision technique to Level 2, 187 George Street.
          </p>
          <div className="hero-ctas">
            <a href="#booking" className="btn-primary">Book a Visit</a>
            <a href="#services" className="btn-ghost">See Services</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">4.7★</div>
              <div className="stat-label">Google Rating</div>
            </div>
            <div>
              <div className="stat-num">2,033</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div>
              <div className="stat-num">28K</div>
              <div className="stat-label">Instagram</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <svg width="500" height="500" viewBox="0 0 500 500" style={{ opacity: 0.22, position: "absolute" }}>
            <path d="M80 300 Q160 80 260 260 Q360 440 440 220" stroke="#8B6F5E" strokeWidth="2.5" fill="none" />
            <path d="M60 340 Q140 100 250 300 Q360 480 460 240" stroke="#C8A99A" strokeWidth="2" fill="none" />
            <path d="M100 280 Q200 60 280 240 Q360 420 450 200" stroke="#8B6F5E" strokeWidth="1.5" fill="none" />
            <path d="M120 320 Q190 140 270 280 Q350 420 430 260" stroke="#C8A99A" strokeWidth="2.5" fill="none" />
            <path d="M40 260 Q180 20 300 240 Q400 440 500 200" stroke="#8B6F5E" strokeWidth="1" fill="none" />
            <path d="M200 100 Q240 200 200 320 Q180 400 210 460" stroke="#C8A99A" strokeWidth="1.5" fill="none" />
            <path d="M300 80 Q280 200 310 340 Q320 400 300 460" stroke="#8B6F5E" strokeWidth="2" fill="none" />
            <circle cx="250" cy="250" r="160" stroke="#C8A99A" strokeWidth="0.5" fill="none" />
            <circle cx="250" cy="250" r="90" stroke="#8B6F5E" strokeWidth="0.4" fill="none" />
          </svg>
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ zIndex: 1, position: "relative" }}>
            <text x="120" y="105" textAnchor="middle" fontFamily="Noto Serif KR, serif" fontSize="18" fill="#8B6F5E" opacity="0.7">아이두 헤어</text>
            <text x="120" y="135" textAnchor="middle" fontFamily="Noto Serif KR, serif" fontSize="12" fill="#8B6F5E" opacity="0.5">브리즈번</text>
            <circle cx="120" cy="120" r="100" stroke="#C8A99A" strokeWidth="0.8" fill="none" opacity="0.4" />
            <circle cx="120" cy="120" r="80" stroke="#8B6F5E" strokeWidth="0.5" fill="none" opacity="0.3" />
          </svg>
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
            { icon: "🌊", name: "Digital Perm", desc: "Korean-machine digital waves with lasting curl definition — from loose beach waves to defined spirals.", price: "From $200 · Main chemical work" },
            { icon: "🌸", name: "Colour & Tint", desc: "Full tint, ombré, balayage, foils, and bleach using premium Italian non-ammonia products.", price: "From $200 · Consultation required" },
            { icon: "✨", name: "Nanoplasty Straightening", desc: "Authentic Nanoplasty technology — ultra-smooth, frizz-free results with genuine premium products.", price: "From $200 · Premium product" },
            { icon: "🪄", name: "Keratin Smoothing", desc: "Japanese Shiseido and Korean-technique keratin for silky, manageable hair.", price: "From $200 · Consultation included" },
            { icon: "💫", name: "Cold Perm / C-Curl", desc: "Korean Create ATS premium wave solution for natural, bouncy curls with lasting hold.", price: "From $200 · Made in Korea" },
            { icon: "✂️", name: "Cut & Styling", desc: "Precision cuts from hairdressers certified across Australia, UK, Korea, and Japan.", price: "Consultation pricing" },
          ].map((s) => (
            <div className="service-card" key={s.name}>
              <span className="service-icon">{s.icon}</span>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-price">{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div>
          <p className="section-eyebrow">Our Story</p>
          <h2 className="section-title">Qualified across<br />four countries</h2>
          <p className="section-body">Ido Hair is owner-operated by an Australian government-certified hair professional and educator — with qualifications spanning Australia, the UK, Korea, and Japan. We&apos;ve published a hairdressing book, <em>The Basic of Scissors</em>, in Korea, and even designed our own professional scissors.</p>
          <div className="credentials-list">
            {[
              { flag: "🇦🇺", title: "Australia — Government-Certified Professional & Educator", body: "Registered hairdresser and certified hairdressing instructor" },
              { flag: "🇰🇷", title: "Korea — Qualified Hairdresser", body: "Published authors of The Basic of Scissors · Designed professional scissors used in-salon" },
              { flag: "🇯🇵", title: "Japan — Qualified Hairdresser", body: "Japanese Shiseido straightening specialists" },
              { flag: "🇬🇧", title: "United Kingdom — Qualified Hairdresser", body: "European colour and technique foundation" },
            ].map((c) => (
              <div className="cred-item" key={c.flag}>
                <div className="cred-flag">{c.flag}</div>
                <div className="cred-text"><strong>{c.title}</strong>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual">
          <div className="about-visual-inner">
            <div style={{ fontSize: "3.5rem", opacity: 0.35, marginBottom: 16 }}>📖</div>
            <div style={{ fontStyle: "italic", fontSize: "1rem", opacity: 0.5, marginBottom: 8 }}>The Basic of Scissors</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.3, lineHeight: 1.9, marginTop: 32 }}>아이두 헤어<br />브리즈번 CBD<br />George St Level 2</div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team">
        <p className="section-eyebrow">Our Stylists</p>
        <h2 className="section-title">The team behind<br />every great result</h2>
        <div className="team-grid">
          {[
            { icon: "✂️", name: "Andy", role: "Nanoplasty Specialist" },
            { icon: "🌸", name: "Yein", role: "Colour & Styling" },
            { icon: "🌊", name: "Ara", role: "Perm Specialist" },
            { icon: "💫", name: "Nova & Rose", role: "Cut & Colour" },
          ].map((m) => (
            <div className="team-card" key={m.name}>
              <div className="team-avatar">{m.icon}</div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMOTIONS */}
      <section id="promotions">
        <p className="section-eyebrow">Current Offers</p>
        <h2 className="section-title">Morning &amp; weekday discounts</h2>
        <div className="promo-grid">
          <div className="promo-card featured">
            <div className="promo-label">Morning Event — Every Day</div>
            <div style={{ fontSize: "0.9rem", color: "rgba(248,245,240,0.6)", lineHeight: 1.8, marginBottom: 24 }}>Book at least one day in advance and arrive between 9:45–11:00 am to access the current discount. Applies to all main chemical work only. Prices subject to change upon consultation.</div>
            <div className="promo-time">⏰ Window: 9:45 am – 11:00 am &nbsp;·&nbsp; Pre-booking required (1 day prior)</div>
          </div>
          <div className="promo-card">
            <div className="promo-label">Tue – Fri</div>
            <div className="promo-pct">20%</div>
            <div className="promo-day">Off</div>
            <div className="promo-detail">All main chemical services during the morning event window, Tuesday through Friday.</div>
          </div>
          <div className="promo-card">
            <div className="promo-label">Sat – Mon</div>
            <div className="promo-pct">15%</div>
            <div className="promo-day">Off</div>
            <div className="promo-detail">All main chemical services during the morning event window, Saturday through Monday.</div>
          </div>
        </div>
      </section>

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
            { img: "🇮🇹", brand: "Italy / Australia", name: "Premium Italian Tint Colour", price: "Non-ammonia · Australian owned" },
            { img: "🇯🇵", brand: "Japan", name: "Shiseido Straightening", price: "Made in Japan · Chemical straightening" },
            { img: "🇰🇷", brand: "Korea", name: "Create ATS Perm Solution", price: "Made in Korea · Professional wave" },
            { img: "✨", brand: "Authentic", name: "Nanoplasty Treatment", price: "Premium genuine technology" },
          ].map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-img">{p.img}</div>
              <div className="product-brand">{p.brand}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-price">{p.price}</div>
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
            { stars: "★★★★★", text: "I am so impressed with how it turned out! My hairdresser Yein was very welcoming and friendly — she listened well to what I wanted to achieve.", author: "Rina · 3 weeks ago" },
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

      {/* VISIT INFO */}
      <section id="visit">
        <p className="section-eyebrow">Plan Your Visit</p>
        <h2 className="section-title">Find us in<br />Brisbane CBD</h2>
        <div className="visit-grid">
          <div>
            <table className="hours-table">
              <tbody>
                {[
                  { day: "Monday", hours: "9:30 am – 6:30 pm" },
                  { day: "Tuesday", hours: "9:30 am – 6:30 pm" },
                  { day: "Wednesday", hours: "9:30 am – 6:30 pm" },
                  { day: "Thursday", hours: "9:30 am – 6:30 pm" },
                  { day: "Friday", hours: "9:30 am – 6:30 pm" },
                  { day: "Saturday", hours: "9:30 am – 5:00 pm" },
                  { day: "Sunday", hours: "9:30 am – 5:00 pm" },
                ].map((row) => (
                  <tr key={row.day} className={DAYS[todayIndex] === row.day ? "today" : ""}>
                    <td>{row.day}</td>
                    <td>{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="info-pills" style={{ marginTop: 28 }}>
              {["👶 Good for kids", "☕ Beverages provided", "💳 Cards & NFC pay", "🚶 Walk-ins welcome", "🅿️ Paid street parking", "🚽 Toilet on-site"].map((pill) => (
                <span className="pill" key={pill}>{pill}</span>
              ))}
            </div>
          </div>
          <div className="visit-map-placeholder">
            <div style={{ fontSize: "2.5rem", opacity: 0.4 }}>📍</div>
            <div style={{ fontWeight: 500, color: "var(--charcoal)" }}>Level 2 / 187 George St</div>
            <div style={{ fontSize: "0.85rem" }}>Brisbane City QLD 4000</div>
            <div style={{ marginTop: 16 }}>
              <a href="https://maps.google.com/?q=Ido+Hair+Brisbane" target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking">
        <div>
          <p className="section-eyebrow">Reservations</p>
          <h2 className="section-title">Ready to book<br />your visit?</h2>
          <p className="section-body">Call us or fill in the form — we&apos;ll confirm your appointment by phone or message. Walk-ins welcome based on availability.</p>
          <div className="booking-details">
            <div className="detail-item">
              <div className="detail-icon">📍</div>
              <div>
                <div className="detail-label">Location</div>
                <div className="detail-val">Level 2 / 187 George St, Brisbane City QLD 4000</div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">📞</div>
              <div>
                <div className="detail-label">Phone</div>
                <div className="detail-val">0451 212 233 · 0451 212 266 · 0451 212 255</div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">🕐</div>
              <div>
                <div className="detail-label">Hours</div>
                <div className="detail-val">
                  Mon–Fri 9:30 am–6:30 pm &nbsp;·&nbsp; Sat–Sun 9:30 am–5:00 pm<br />
                  <span style={{ fontSize: "0.82rem", color: "rgba(248,245,240,0.4)" }}>Morning event: 9:45–11:00 am daily (pre-book 1 day prior)</span>
                </div>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">📱</div>
              <div>
                <div className="detail-label">Social &amp; Pricing</div>
                <div className="detail-val">
                  <a href="https://www.instagram.com/idohair_brisbane_official/" target="_blank" rel="noopener noreferrer">@idohair_brisbane_official</a> &nbsp;·&nbsp;
                  <a href="https://www.facebook.com/idohairbrisbane/" target="_blank" rel="noopener noreferrer">Facebook</a><br />
                  <span style={{ fontSize: "0.82rem", color: "rgba(248,245,240,0.4)" }}>Current pricing on Instagram stories &amp; Facebook service categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BookingForm />
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
                <li><a href="#team">Team</a></li>
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
          <span>© 2025 Ido Hair Brisbane. All rights reserved.</span>
          <span>Level 2 / 187 George St, Brisbane QLD 4000</span>
        </div>
      </footer>
    </>
  );
}
