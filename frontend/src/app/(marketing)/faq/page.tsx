import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import FAQContent from "@/components/marketing/FAQContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to common questions about PenniVault savings plans, group savings, wallet system, security, and more.",
};

export default function FAQPage() {
  return (
    <>
      <Breadcrumb
        title="Frequently Asked Questions"
        items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <section className="section-spacing">
        <div className="container">
          <FAQContent />
        </div>
      </section>
      <div className="pv-faq-cta">
        <div className="container">
          <h3>Still Have Questions?</h3>
          <p>
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help.
          </p>
          <Link href="/contact" className="ul-btn ul-btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </>
  );
}
