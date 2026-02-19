import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface HeroSlide {
  id: number;
  subtitle: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage: string;
  thumbnailImage: string;
}

export interface FeatureItem {
  id: number;
  icon: IconDefinition;
  title: string;
}

export interface SplitBlock {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface MissionVisionBlock {
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface ServiceCard {
  id: number;
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export interface ListingItem {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  colSize: number;
  href: string;
}

export interface CTAData {
  subtitle: string;
  title: string;
  ctaText: string;
  ctaHref: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface TestimonialsOverview {
  rating: number;
  description: string;
  reviewerAvatars: string[];
}

export interface FAQCategory {
  id: string;
  label: string;
}

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

export interface ValueCard {
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  imagePosition: "left" | "right";
  bgColor: string;
}

export interface ContactInfoItem {
  icon: IconDefinition;
  title: string;
  lines: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
