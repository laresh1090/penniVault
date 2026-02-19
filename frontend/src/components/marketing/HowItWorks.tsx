"use client";

import SectionHeading from "@/components/marketing/SectionHeading";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { steps } from "@/data/marketing";

export default function HowItWorks() {
  return (
    <section className="section-spacing" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="container">
        <SectionHeading
          subtitle="Simple & Transparent"
          title="How It"
          titleHighlight="Works"
        />

        <div className="row g-4 pv-steps-row">
          {steps.map((step, index) => (
            <div key={step.number} className="col-lg-3 col-md-6">
              <ScrollReveal delay={index * 150}>
                <div className="pv-step-card">
                  <div className="pv-step-number">{step.number}</div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
