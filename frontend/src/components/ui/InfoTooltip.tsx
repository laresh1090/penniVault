import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export default function InfoTooltip({ text, className }: InfoTooltipProps) {
  return (
    <span className={cn("info-tooltip", className)}>
      <span className="info-icon">i</span>
      <span className="tooltip-content">{text}</span>
    </span>
  );
}
