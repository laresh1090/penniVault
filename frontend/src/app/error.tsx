"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#F8FAFC" }}>
      <div className="text-center">
        <h1 className="display-4 fw-bold mb-3" style={{ color: "#DC2626" }}>Something went wrong</h1>
        <p className="mb-4" style={{ color: "#64748B" }}>An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn btn-primary px-4">Try Again</button>
      </div>
    </div>
  );
}
