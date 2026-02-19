import type { Testimonial, TestimonialsOverview } from "@/types/marketing";

export const testimonialsOverview: TestimonialsOverview = {
  rating: 4.9,
  description: "Based on 2,000+ reviews from verified users across Nigeria",
  reviewerAvatars: [
    "/images/marketing/reviewer-1.jpg",
    "/images/marketing/reviewer-2.jpg",
    "/images/marketing/reviewer-3.jpg",
    "/images/marketing/reviewer-4.jpg",
  ],
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "PenniVault transformed how I save. I was able to save \u20A65 million in 8 months towards my first apartment in Lekki. The goal tracker kept me motivated every step of the way!",
    name: "Adaeze Okonkwo",
    role: "Property Buyer, Lagos",
    avatar: "/images/marketing/testimonial-1.jpg",
  },
  {
    id: 2,
    quote: "As an auto dealer, listing on PenniVault has been a game-changer. Buyers save directly towards my vehicles, and I get guaranteed sales. The platform is transparent and trustworthy.",
    name: "Emeka Adeyemi",
    role: "Auto Dealer, Abuja",
    avatar: "/images/marketing/testimonial-2.jpg",
  },
];
