"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { AccordionItem } from "@/types/marketing";
import { cn } from "@/lib/utils";

interface AccordionBlockProps {
  items: AccordionItem[];
  defaultOpenId?: number;
  className?: string;
}

export default function AccordionBlock({
  items,
  defaultOpenId,
  className,
}: AccordionBlockProps) {
  const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn("pv-accordion", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pv-accordion-item",
            openId === item.id && "active"
          )}
        >
          <button
            className="pv-accordion-header"
            onClick={() => toggle(item.id)}
            aria-expanded={openId === item.id}
          >
            <span className="pv-accordion-title">{item.title}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cn(
                "pv-accordion-icon",
                openId === item.id && "rotated"
              )}
            />
          </button>
          <div
            className="pv-accordion-body"
            style={{
              maxHeight: openId === item.id ? "500px" : "0",
              opacity: openId === item.id ? 1 : 0,
              overflow: "hidden",
              transition:
                "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease",
              padding: openId === item.id ? "16px 20px" : "0 20px",
            }}
          >
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
