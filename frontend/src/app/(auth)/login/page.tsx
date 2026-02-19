import type { Metadata } from "next";
export const metadata: Metadata = { title: "Login" };
export default function LoginPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4">
          <h2 className="text-center mb-1">Welcome Back</h2>
          <p className="text-center mb-4" style={{ color: "#64748B" }}>Sign in to your PenniVault account</p>
          <form>
            <div className="mb-3"><input type="email" className="form-control form-control-lg" placeholder="Email Address" /></div>
            <div className="mb-3"><input type="password" className="form-control form-control-lg" placeholder="Password" /></div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check"><input className="form-check-input" type="checkbox" id="remember" /><label className="form-check-label" htmlFor="remember" style={{ fontSize: "14px" }}>Remember me</label></div>
              <a href="/forgot-password" style={{ fontSize: "14px", color: "#EB5310" }}>Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary w-100 btn-lg">Sign In</button>
          </form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px", color: "#64748B" }}>
            Don&apos;t have an account? <a href="/register" style={{ color: "#EB5310" }}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
