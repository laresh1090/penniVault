import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reset Password" };
export default function ResetPasswordPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4">
          <h2 className="text-center mb-1">Reset Password</h2>
          <p className="text-center mb-4" style={{ color: "#64748B" }}>Enter your new password below</p>
          <form>
            <div className="mb-3"><input type="password" className="form-control form-control-lg" placeholder="New Password" /></div>
            <div className="mb-3"><input type="password" className="form-control form-control-lg" placeholder="Confirm New Password" /></div>
            <button type="submit" className="btn btn-primary w-100 btn-lg">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
