import type { Metadata } from "next";
export const metadata: Metadata = { title: "Register" };
export default function RegisterPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4">
          <h2 className="text-center mb-1">Create Account</h2>
          <p className="text-center mb-4" style={{ color: "#64748B" }}>Join PenniVault and start your journey</p>
          <form>
            <div className="row g-3">
              <div className="col-md-6"><input type="text" className="form-control form-control-lg" placeholder="First Name" /></div>
              <div className="col-md-6"><input type="text" className="form-control form-control-lg" placeholder="Last Name" /></div>
              <div className="col-12"><input type="email" className="form-control form-control-lg" placeholder="Email Address" /></div>
              <div className="col-12"><input type="tel" className="form-control form-control-lg" placeholder="Phone Number" /></div>
              <div className="col-12"><input type="password" className="form-control form-control-lg" placeholder="Create Password" /></div>
              <div className="col-12"><input type="password" className="form-control form-control-lg" placeholder="Confirm Password" /></div>
              <div className="col-12"><button type="submit" className="btn btn-primary w-100 btn-lg">Create Account</button></div>
            </div>
          </form>
          <p className="text-center mt-3 mb-0" style={{ fontSize: "14px", color: "#64748B" }}>
            Already have an account? <a href="/login" style={{ color: "#EB5310" }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
