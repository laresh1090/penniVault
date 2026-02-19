import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact Us" };
export default function ContactPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-2">Contact Us</h1>
      <p className="lead mb-5" style={{ color: "#64748B" }}>Get in touch with the PenniVault team.</p>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card p-4">
            <form>
              <div className="row g-3">
                <div className="col-md-6"><input type="text" className="form-control" placeholder="Your Name" /></div>
                <div className="col-md-6"><input type="email" className="form-control" placeholder="Email Address" /></div>
                <div className="col-md-6"><input type="tel" className="form-control" placeholder="Phone Number" /></div>
                <div className="col-md-6"><input type="text" className="form-control" placeholder="Subject" /></div>
                <div className="col-12"><textarea className="form-control" rows={5} placeholder="Your Message" /></div>
                <div className="col-12"><button type="submit" className="btn btn-primary px-4">Send Message</button></div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card p-4 h-100">
            <h5 className="mb-3">Contact Information</h5>
            <p className="mb-2" style={{ color: "#64748B" }}>42 Marina Road, Victoria Island, Lagos</p>
            <p className="mb-2" style={{ color: "#64748B" }}>hello@pennivault.com</p>
            <p className="mb-0" style={{ color: "#64748B" }}>+234 123 456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
}
