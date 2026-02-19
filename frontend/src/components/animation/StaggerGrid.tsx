"use client";

import { m, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animation-variants";

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <m.div
      ref={ref}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerGridProps) {
  return (
    <m.div variants={staggerItemVariants} className={className}>
      {children}
    </m.div>
  );
}
