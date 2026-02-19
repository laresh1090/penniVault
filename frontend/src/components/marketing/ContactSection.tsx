"use client";

import SectionHeading from "@/components/marketing/SectionHeading";
import ContactForm from "@/components/marketing/ContactForm";

export default function ContactSection() {
  return (
    <section className="section-spacing">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left - Image */}
          <div className="col-lg-5">
            <div className="pv-contact-img">
              <img
                src="/images/marketing/contact-img.jpg"
                alt="Contact PenniVault"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  minHeight: "400px",
                  borderRadius: "16px",
                }}
              />
            </div>
          </div>

          {/* Right - Form */}
          <div className="col-lg-7">
            <SectionHeading
              subtitle="Questions?"
              title="Get In Touch"
              titleHighlight="With Us"
              align="left"
            />
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
