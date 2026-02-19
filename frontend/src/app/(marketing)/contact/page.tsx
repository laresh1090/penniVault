import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import ContactInfoCards from "@/components/marketing/ContactInfoCards";
import ContactForm from "@/components/marketing/ContactForm";
import SectionHeading from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with PenniVault. Visit our office in Victoria Island Lagos, email us, or call our support team.",
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        title="Contact Us"
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="section-spacing">
        <div className="container">
          <ContactInfoCards className="mb-5" />
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-5">
              <div className="pv-contact-img">
                <img
                  src="/images/marketing/contact-img.jpg"
                  alt="Contact PenniVault"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <SectionHeading
                subtitle="Get In Touch"
                title="Send Us a"
                titleHighlight="Message"
                align="left"
              />
              <ContactForm showSubjectSelect />
            </div>
          </div>
        </div>
      </section>
      <div className="pv-map-placeholder">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="map-icon" />
        <p>Interactive map will be embedded here</p>
        <p>42 Marina Road, Victoria Island, Lagos</p>
      </div>
    </>
  );
}
