"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TextLogo from "@/components/ui/TextLogo";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Marketplace", href: "/marketplace" },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  // Close sidebar when pathname changes (navigation occurred)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <div
        className={`mobile-sidebar-overlay${isOpen ? " open" : ""}`}
        onClick={onClose}
      />
      <div className={`mobile-sidebar${isOpen ? " open" : ""}`}>
        <div className="mobile-sidebar-header">
          <TextLogo variant="dark" size="md" />
          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <ul className="mobile-sidebar-nav">
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

        <div className="mobile-sidebar-actions">
          <Link href="/login" className="btn btn-outline-primary">
            Login
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
