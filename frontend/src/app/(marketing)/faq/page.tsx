import type { Metadata } from "next";
export const metadata: Metadata = { title: "FAQ" };
export default function FaqPage() {
  const faqs = [
    { q: "What is PenniVault?", a: "PenniVault is an asset acquisition infrastructure that helps property developers and auto dealerships manage installment plans, structured savings, and referral systems." },
    { q: "How does the installment system work?", a: "Partners set up payment plans with customizable milestones. Customers make payments tracked in real-time with automated reminders for upcoming dues." },
    { q: "Is my money safe?", a: "PenniVault integrates with licensed payment processors. We never directly hold customer funds \u2014 all transactions are processed through regulated financial institutions." },
    { q: "Can I save towards a specific asset?", a: "Yes! You can link a savings plan to a specific property or vehicle from the marketplace and track your progress towards ownership." },
    { q: "How do group savings work?", a: "Group savings (Ajo/Esusu) allow members to pool resources in rotating savings circles with transparent tracking and scheduled payouts." },
  ];
  return (
    <div className="container py-5">
      <h1 className="mb-2">Frequently Asked Questions</h1>
      <p className="lead mb-5" style={{ color: "#64748B" }}>Find answers to common questions about PenniVault.</p>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, i) => (
          <div className="accordion-item" key={i}>
            <h2 className="accordion-header">
              <button className={`accordion-button ${i > 0 ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${i}`}>
                {faq.q}
              </button>
            </h2>
            <div id={`faq-${i}`} className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`} data-bs-parent="#faqAccordion">
              <div className="accordion-body" style={{ color: "#64748B" }}>{faq.a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
