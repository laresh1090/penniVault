import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  number: number;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("pv-step-indicator", className)}>
      {steps.map((step, index) => (
        <div key={step.number} style={{ display: "contents" }}>
          {index > 0 && (
            <div
              className={cn(
                "step-line",
                step.number <= currentStep && "active",
                step.number < currentStep && "completed"
              )}
            />
          )}
          <div className="step">
            <div
              className={cn(
                "step-circle",
                step.number === currentStep && "active",
                step.number < currentStep && "completed"
              )}
            >
              {step.number < currentStep ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                step.number
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
