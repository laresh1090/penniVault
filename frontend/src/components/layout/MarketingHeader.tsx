"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import TextLogo from "@/components/ui/TextLogo";
import MobileSidebar from "@/components/layout/MobileSidebar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function MarketingHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header className="ul-header">
      {/* Top Bar */}
      <div className="ul-header-top">
        <div className="header-top-inner">
          <div className="header-top-left">
            <span className="header-top-item">
              <FontAwesomeIcon icon={faPhone} />
              1-234-567-8901
            </span>
            <span className="header-top-item">
              <FontAwesomeIcon icon={faEnvelope} />
              hello@pennivault.com
            </span>
          </div>
          <div className="header-top-right">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`ul-header-bottom${isSticky ? " sticky" : ""}`}>
        <div className="header-bottom-inner">
          <div className="logo-container">
            <Link href="/">
              <TextLogo variant="dark" size="md" />
            </Link>
          </div>

          <ul className="ul-header-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ul-header-actions">
            <Link href="/login" className="header-login-link">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="ul-header-sidebar-opener"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileOpen} onClose={closeMobile} />
    </header>
  );
}
