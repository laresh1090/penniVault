import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { features } from "@/data/marketing";

export default function FeaturesStrip() {
  return (
    <section className="pv-features-strip">
      <div className="container">
        <div className="row g-3">
          {features.map((feature) => (
            <div key={feature.id} className="col-xl-3 col-lg-3 col-sm-6">
              <div className="pv-feature-card">
                <div className="pv-feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h4 className="pv-feature-title">{feature.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
