"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import AccordionBlock from "@/components/marketing/AccordionBlock";
import SectionHeading from "@/components/marketing/SectionHeading";
import { faqCategories, faqItems } from "@/data/marketing";
import type { AccordionItem } from "@/types/marketing";

export default function FAQContent() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return faqItems;
    return faqItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const accordionItems: AccordionItem[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer,
  }));

  const midpoint = Math.ceil(accordionItems.length / 2);
  const leftColumn = accordionItems.slice(0, midpoint);
  const rightColumn = accordionItems.slice(midpoint);

  return (
    <>
      <SectionHeading
        subtitle="FAQ"
        title="Common Questions"
        titleHighlight="Answered"
        description="Everything you need to know about PenniVault savings plans, group savings, wallets, and more."
      />

      {/* Category Filter */}
      <div className="pv-faq-categories">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "pv-faq-category-btn",
              activeCategory === category.id && "active"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Two-Column Accordion Layout */}
      <div className="row g-4">
        <div className="col-lg-6">
          <AccordionBlock
            items={leftColumn}
            defaultOpenId={leftColumn[0]?.id}
          />
        </div>
        <div className="col-lg-6">
          <AccordionBlock items={rightColumn} />
        </div>
      </div>
    </>
  );
}
