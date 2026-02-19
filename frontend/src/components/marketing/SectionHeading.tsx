import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  titleHighlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "pv-section-heading",
        align === "center" && "text-center",
        className
      )}
    >
      <span className="pv-section-subtitle">{subtitle}</span>
      <h2 className="pv-section-title">
        {title} {titleHighlight && <span>{titleHighlight}</span>}
      </h2>
      {description && (
        <p className="pv-section-description">{description}</p>
      )}
    </div>
  );
}
