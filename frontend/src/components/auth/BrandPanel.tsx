export default function BrandPanel() {
  return (
    <div className="pv-auth-brand" aria-hidden="true">
      <div className="pv-auth-brand-decor pv-auth-brand-decor--1"></div>
      <div className="pv-auth-brand-decor pv-auth-brand-decor--2"></div>
      <div className="pv-auth-brand-decor pv-auth-brand-decor--3"></div>

      <h2 className="pv-auth-brand-logo-text">Penni<span>Vault</span></h2>
      <h2 className="pv-auth-brand-tagline">Your money. Your goals. Your vault.</h2>
      <p className="pv-auth-brand-subtitle">
        Save smarter, invest better, and shop for big-ticket items
        all in one platform.
      </p>
      <span className="pv-auth-brand-accent">Start building your future today</span>
    </div>
  );
}
