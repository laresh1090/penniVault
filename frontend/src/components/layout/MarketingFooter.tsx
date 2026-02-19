"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import TextLogo from "@/components/ui/TextLogo";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Structured Savings", href: "/services#structured-savings" },
  { label: "Group Savings", href: "/services#group-savings" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Dual Wallet", href: "/services#dual-wallet" },
  { label: "Installment Plans", href: "/services#installment-plans" },
];

const SOCIAL_LINKS = [
  { icon: faFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: faTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: faInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: faLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ul-footer">
      {/* Contact Bar */}
      <div className="ul-footer-top">
        <div className="footer-contact-grid">
          <div className="footer-contact-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>Lagos, Nigeria</span>
          </div>
          <div className="footer-contact-item">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>hello@pennivault.com</span>
          </div>
          <div className="footer-contact-item">
            <FontAwesomeIcon icon={faPhone} />
            <span>+234 800 000 0000</span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="ul-footer-middle">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-about">
            <TextLogo variant="white" size="md" />
            <p>
              PenniVault helps you save smarter, spend wisely, and grow your
              wealth through structured savings plans, group contributions, and
              a curated marketplace for high-value assets.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h4 className="footer-heading">Contact &amp; Newsletter</h4>
            <p>Lagos, Nigeria</p>
            <p>hello@pennivault.com</p>
            <p>+234 800 000 0000</p>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="ul-footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; {currentYear} PenniVault. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
