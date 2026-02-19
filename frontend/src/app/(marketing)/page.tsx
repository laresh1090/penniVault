import type { Metadata } from "next";
import HeroBanner from "@/components/marketing/HeroBanner";
import FeaturesStrip from "@/components/marketing/FeaturesStrip";
import SaverVendorSplit from "@/components/marketing/SaverVendorSplit";
import AboutSection from "@/components/marketing/AboutSection";
import ServicesSlider from "@/components/marketing/ServicesSlider";
import HowItWorks from "@/components/marketing/HowItWorks";
import FeaturedListings from "@/components/marketing/FeaturedListings";
import CTASection from "@/components/marketing/CTASection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import ContactSection from "@/components/marketing/ContactSection";

export const metadata: Metadata = {
  title: "PenniVault — Smart Savings, Smarter Future",
  description:
    "PenniVault helps you build disciplined savings habits with goal-based plans, group savings (Ajo), and a vendor marketplace — all in one platform for Nigerians.",
  keywords: [
    "savings",
    "group savings",
    "ajo",
    "esusu",
    "Nigeria savings app",
    "PenniVault",
    "vendor marketplace",
    "goal-based savings",
    "dual wallet",
  ],
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesStrip />
      <SaverVendorSplit />
      <AboutSection />
      <ServicesSlider />
      <HowItWorks />
      <FeaturedListings />
      <CTASection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
