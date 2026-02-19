import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#F8FAFC" }}>
      <div className="text-center">
        <h1 className="display-1 fw-bold" style={{ color: "#EB5310" }}>404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="mb-4" style={{ color: "#64748B" }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn btn-primary px-4">Go Home</Link>
      </div>
    </div>
  );
}
