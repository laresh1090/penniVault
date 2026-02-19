import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faHandshake,
  faShoppingCart,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/marketing/Breadcrumb";
import SectionHeading from "@/components/marketing/SectionHeading";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import ServiceDetailBlock from "@/components/marketing/ServiceDetailBlock";
import CTASection from "@/components/marketing/CTASection";
import type { ServiceDetail } from "@/types/marketing";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore PenniVault's comprehensive tools — goal-based savings, group savings (Ajo/Esusu), a verified vendor marketplace, and a dual wallet system designed for Nigerians.",
};

const serviceOverview = [
  {
    icon: faBullseye,
    iconBg: "#FFF3EE",
    iconColor: "#EB5310",
    title: "Goal-Based Savings",
    description: "Set targets, choose a timeline, and watch your savings grow with optional interest.",
    href: "#goal-savings",
  },
  {
    icon: faHandshake,
    iconBg: "#FFF8EB",
    iconColor: "#FAA019",
    title: "Group Savings (Ajo)",
    description: "Join trusted savings groups with our transparent midpoint-turn payout model.",
    href: "#group-savings",
  },
  {
    icon: faShoppingCart,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Vendor Marketplace",
    description: "Browse verified vendor listings and save directly towards real estate and automobiles.",
    href: "#marketplace",
  },
  {
    icon: faWallet,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    title: "Dual Wallet System",
    description: "Manage finances with Real Wallet for deposits and Virtual Wallet for group entitlements.",
    href: "#dual-wallet",
  },
];

const serviceDetails: ServiceDetail[] = [
  {
    id: "goal-savings",
    icon: faBullseye,
    iconBg: "#FFF3EE",
    iconColor: "#EB5310",
    title: "Goal-Based Savings",
    description:
      "Set your financial goal, pick a plan, and watch your savings grow. Whether you're saving for a car, land, an apartment, or an emergency fund — PenniVault gives you the tools to stay disciplined and reach your target on time.",
    features: [
      "Set custom savings targets with specific timelines",
      "Choose daily, weekly, or monthly contribution frequency",
      "Earn up to 8% annual interest on your savings",
      "Link your plan to a specific marketplace product",
      "Track progress with visual charts and milestone alerts",
    ],
    image: "/images/marketing/service-detail-1.jpg",
    imagePosition: "right",
    bgColor: "#F8FAFC",
  },
  {
    id: "group-savings",
    icon: faHandshake,
    iconBg: "#FFF8EB",
    iconColor: "#FAA019",
    title: "Group Savings (Ajo/Esusu)",
    description:
      "PenniVault digitizes the trusted tradition of Ajo — community-based rotating savings. Create or join a group, contribute regularly, and receive your payout through our innovative midpoint-turn model that ensures fairness for all members.",
    features: [
      "Create or join verified savings groups",
      "Transparent midpoint-turn payout model",
      "Automatic contribution tracking and reminders",
      "Real-time group progress and member status",
      "Protected by escrow and KYC verification",
    ],
    image: "/images/marketing/service-detail-2.jpg",
    imagePosition: "left",
    bgColor: "#FFFFFF",
  },
  {
    id: "marketplace",
    icon: faShoppingCart,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Vendor Marketplace",
    description:
      "Browse our curated marketplace of verified vendors offering real estate, automobiles, and more. Link your savings plan directly to a product and save towards it with full transparency and documentation at every step.",
    features: [
      "Browse verified vendor listings (real estate and automobiles)",
      "Save directly towards specific products",
      "Verified vendors with quality guarantees",
      "Installment payment options available",
      "Full transaction history and documentation",
    ],
    image: "/images/marketing/service-detail-3.jpg",
    imagePosition: "right",
    bgColor: "#F8FAFC",
  },
  {
    id: "dual-wallet",
    icon: faWallet,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    title: "Dual Wallet System",
    description:
      "PenniVault's unique dual wallet system gives you complete financial clarity. Your Real Wallet holds actual deposited funds, while your Virtual Wallet tracks group savings entitlements — ensuring you always know exactly where your money stands.",
    features: [
      "Real Wallet for actual deposits and withdrawals",
      "Virtual Wallet for group savings entitlements",
      "Instant transfers between wallets on payout",
      "Multiple funding options (bank transfer, card, and USSD)",
      "Complete transaction audit trail",
    ],
    image: "/images/marketing/service-detail-4.jpg",
    imagePosition: "left",
    bgColor: "#FFFFFF",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        title="Our Services"
        items={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      {/* Services Overview Grid */}
      <section className="section-spacing">
        <div className="container">
          <SectionHeading
            subtitle="What We Offer"
            title="Comprehensive Tools for"
            titleHighlight="Your Financial Goals"
            description="PenniVault provides everything you need to save smarter, grow faster, and acquire real assets with confidence."
          />
          <div className="row g-4">
            {serviceOverview.map((service, index) => (
              <div key={service.title} className="col-lg-3 col-md-6">
                <ScrollReveal delay={index * 100}>
                  <Link
                    href={service.href}
                    className="pv-value-card d-block text-decoration-none"
                    style={{ color: "inherit" }}
                  >
                    <div
                      className="value-icon"
                      style={{
                        backgroundColor: service.iconBg,
                        color: service.iconColor,
                      }}
                    >
                      <FontAwesomeIcon icon={service.icon} />
                    </div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                  </Link>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Blocks */}
      {serviceDetails.map((service) => (
        <ServiceDetailBlock key={service.id} service={service} />
      ))}

      {/* CTA */}
      <CTASection />
    </>
  );
}
