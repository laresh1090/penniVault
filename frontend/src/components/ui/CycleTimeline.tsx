"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface TimelineStep {
  round: number;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface CycleTimelineProps {
  steps: TimelineStep[];
}

export default function CycleTimeline({ steps }: CycleTimelineProps) {
  return (
    <div className="cycle-timeline">
      {steps.map((step, index) => (
        <div
          key={step.round}
          className={cn("timeline-step", step.status)}
        >
          {index > 0 && <div className="timeline-connector" />}
          <div className="step-dot">
            {step.status === "completed" && (
              <FontAwesomeIcon icon={faCheck} />
            )}
            {step.status === "current" && (
              <span className="current-dot-inner" />
            )}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
