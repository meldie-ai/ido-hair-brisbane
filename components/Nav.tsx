"use client";

import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <a className="nav-logo" href="#">Ido<span>·</span>Hair</a>

      {/* Desktop links */}
      <ul className="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#promotions">Offers</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="#visit">Visit</a></li>
        <li><a href="#booking" className="nav-book">Book Now</a></li>
      </ul>

      {/* Hamburger button */}
      <button
        className={`nav-hamburger${open ? " open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="nav-mobile-drawer">
          {["#services", "#about", "#promotions", "#team", "#reviews", "#visit"].map((href) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
            </a>
          ))}
          <a href="#booking" className="nav-mobile-book" onClick={() => setOpen(false)}>
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
