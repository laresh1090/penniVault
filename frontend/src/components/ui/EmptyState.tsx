import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface EmptyStateProps {
  icon?: IconDefinition;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-5 px-3" role="status">
      {icon && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            style={{ fontSize: 32, color: "#CBD5E1" }}
            aria-hidden="true"
          />
        </div>
      )}
      <h4
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1E252F",
          marginBottom: 8,
        }}
      >
        {title}
      </h4>
      <p
        style={{
          color: "#64748B",
          fontSize: 14,
          marginBottom: action ? 24 : 0,
          maxWidth: 400,
          margin: action ? "0 auto 24px" : "0 auto",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="btn"
            style={{
              backgroundColor: "#EB5310",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              padding: "10px 20px",
            }}
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="btn"
            style={{
              backgroundColor: "#EB5310",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              padding: "10px 20px",
            }}
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
