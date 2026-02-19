import type { Metadata } from "next";
export const metadata: Metadata = { title: "Forgot Password" };
export default function ForgotPasswordPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4">
          <h2 className="text-center mb-1">Forgot Password</h2>
          <p className="text-center mb-4" style={{ color: "#64748B" }}>Enter your email and we&apos;ll send you a reset link</p>
          <form>
            <div className="mb-3"><input type="email" className="form-control form-control-lg" placeholder="Email Address" /></div>
            <button type="submit" className="btn btn-primary w-100 btn-lg">Send Reset Link</button>
          </form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px", color: "#64748B" }}>
            Remember your password? <a href="/login" style={{ color: "#EB5310" }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
