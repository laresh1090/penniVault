export default function ProfilePage() {
  return (
    <div>
      <h2 className="mb-4" style={{ fontSize: 24, fontWeight: 800 }}>Profile & Settings</h2>
      <div className="card p-4">
        <h5 className="mb-4">Personal Information</h5>
        <form>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>First Name</label><input type="text" className="form-control" defaultValue="Adebayo" /></div>
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>Last Name</label><input type="text" className="form-control" defaultValue="Johnson" /></div>
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>Email</label><input type="email" className="form-control" defaultValue="adebayo@test.com" /></div>
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>Phone</label><input type="tel" className="form-control" defaultValue="+2348012345678" /></div>
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>City</label><input type="text" className="form-control" defaultValue="Lagos" /></div>
            <div className="col-md-6"><label className="form-label fw-bold" style={{ fontSize: 14 }}>State</label><input type="text" className="form-control" defaultValue="Lagos" /></div>
            <div className="col-12"><button type="submit" className="btn btn-primary">Save Changes</button></div>
          </div>
        </form>
      </div>
    </div>
  );
}
