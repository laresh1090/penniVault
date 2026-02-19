import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faBinoculars, faHeart } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import SectionHeading from "@/components/marketing/SectionHeading";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import AccordionBlock from "@/components/marketing/AccordionBlock";
import CTASection from "@/components/marketing/CTASection";
import { aboutAccordionItems, teamMembers } from "@/data/marketing";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about PenniVault's mission to empower Nigerians with smart savings tools, group savings (Ajo), and a trusted vendor marketplace for structured asset acquisition.",
};

const values = [
  {
    icon: faBullseye,
    iconBg: "#FFF3EE",
    iconColor: "#EB5310",
    title: "Our Mission",
    description:
      "To empower every Nigerian to save intentionally, build wealth, and achieve financial freedom through community-driven tools and structured acquisition plans.",
  },
  {
    icon: faBinoculars,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Our Vision",
    description:
      "To become Africa's leading savings and asset acquisition platform, making homeownership, vehicle acquisition, and financial goals accessible to all.",
  },
  {
    icon: faHeart,
    iconBg: "#FDF2F8",
    iconColor: "#EC4899",
    title: "Our Values",
    description:
      "Transparency, trust, and community are at the heart of everything we do. We believe that when people save together with accountability, everyone wins.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        title="About PenniVault"
        items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Our Story Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <ScrollReveal animation="fadeInLeft">
                <div className="pv-about-img-wrapper">
                  <img
                    src="/images/marketing/about-img.png"
                    alt="About PenniVault - Our Story"
                    className="img-fluid"
                  />
                  <div className="pv-about-stat">
                    <span className="stat-number">10K+</span>
                    <div className="stat-label">Active Savers</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-6">
              <ScrollReveal animation="fadeInRight">
                <SectionHeading
                  subtitle="Our Story"
                  title="Building a Culture of"
                  titleHighlight="Intentional Savings"
                  align="left"
                />
                <p style={{ color: "var(--pv-text-muted)", lineHeight: 1.7 }}>
                  PenniVault was born from a simple but powerful idea — what if we could take
                  the trusted tradition of Ajo (community savings) and make it digital,
                  transparent, and accessible to every Nigerian?
                </p>
                <p style={{ color: "var(--pv-text-muted)", lineHeight: 1.7 }}>
                  Founded in Lagos, Nigeria, PenniVault is a fintech platform that combines
                  goal-based savings, group savings (Ajo/Esusu), and a verified vendor
                  marketplace. We help individuals and families save intentionally towards
                  real assets — from their first apartment to their dream car.
                </p>
                <p style={{ color: "var(--pv-text-muted)", lineHeight: 1.7 }}>
                  Our innovative midpoint-turn model for group savings ensures fairness and
                  trust, while our dual wallet system gives you complete control over your
                  finances. Every naira you save is protected with bank-grade security and
                  full transaction transparency.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-spacing" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <SectionHeading
            subtitle="What Drives Us"
            title="Our Mission, Vision &"
            titleHighlight="Values"
          />
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={value.title} className="col-lg-4">
                <ScrollReveal delay={index * 150}>
                  <div className="pv-value-card">
                    <div
                      className="value-icon"
                      style={{
                        backgroundColor: value.iconBg,
                        color: value.iconColor,
                      }}
                    >
                      <FontAwesomeIcon icon={value.icon} />
                    </div>
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-spacing">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <ScrollReveal animation="fadeInLeft">
                <SectionHeading
                  subtitle="Why PenniVault"
                  title="Why Thousands Choose"
                  titleHighlight="PenniVault"
                  align="left"
                />
                <p style={{ color: "var(--pv-text-muted)", lineHeight: 1.7, marginBottom: "24px" }}>
                  PenniVault is not just another savings app. We combine the power of
                  community savings with modern fintech tools to create a platform that
                  truly helps you acquire real assets. Here&apos;s what makes us different:
                </p>
                <Link href="/services" className="ul-btn ul-btn-primary">
                  Explore Our Services
                </Link>
              </ScrollReveal>
            </div>
            <div className="col-lg-6">
              <ScrollReveal animation="fadeInRight">
                <AccordionBlock
                  items={aboutAccordionItems}
                  defaultOpenId={1}
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <SectionHeading
            subtitle="Meet The Team"
            title="The People Behind"
            titleHighlight="PenniVault"
          />
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="col-lg-3 col-md-6">
                <ScrollReveal delay={index * 100}>
                  <div className="pv-team-card">
                    <div className="team-avatar">
                      {member.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
