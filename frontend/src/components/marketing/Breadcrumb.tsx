import Link from "next/link";
import type { BreadcrumbItem } from "@/types/marketing";

interface BreadcrumbProps {
  title: string;
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ title, items }: BreadcrumbProps) {
  return (
    <section className="pv-breadcrumb-section">
      <div className="container">
        <h1 className="pv-breadcrumb-title">{title}</h1>
        <nav className="pv-breadcrumb-nav" aria-label="breadcrumb">
          {items.map((item, index) => (
            <span key={index}>
              {index > 0 && <span className="pv-breadcrumb-separator">/</span>}
              {item.href ? (
                <Link href={item.href} className="pv-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="pv-breadcrumb-current">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
