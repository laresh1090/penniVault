interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "light";
  label?: string;
}

const sizeMap = { sm: 16, md: 32, lg: 48 };

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  label = "Loading...",
}: LoadingSpinnerProps) {
  const colorMap = {
    primary: "#EB5310",
    secondary: "#64748B",
    light: "#FFFFFF",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      role="status"
    >
      <div
        className="spinner-border"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          color: colorMap[variant],
        }}
        aria-hidden="true"
      />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
