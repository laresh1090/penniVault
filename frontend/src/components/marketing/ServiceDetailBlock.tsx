import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import type { ServiceDetail } from "@/types/marketing";
import { cn } from "@/lib/utils";

interface ServiceDetailBlockProps {
  service: ServiceDetail;
  className?: string;
}

export default function ServiceDetailBlock({
  service,
  className,
}: ServiceDetailBlockProps) {
  const isImageLeft = service.imagePosition === "left";

  return (
    <section
      id={service.id}
      className={cn("pv-service-detail section-spacing", className)}
      style={{ backgroundColor: service.bgColor }}
    >
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          <div
            className={cn(
              "col-lg-6",
              isImageLeft ? "order-lg-1" : "order-lg-2"
            )}
          >
            <div className="pv-service-detail-img">
              <img
                src={service.image}
                alt={service.title}
                className="img-fluid"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              />
            </div>
          </div>
          <div
            className={cn(
              "col-lg-6",
              isImageLeft ? "order-lg-2" : "order-lg-1"
            )}
          >
            <div className="pv-service-detail-content">
              <div
                className="pv-service-icon-lg"
                style={{
                  background: service.iconBg,
                  color: service.iconColor,
                }}
              >
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <h2 className="pv-service-detail-title">{service.title}</h2>
              <p className="pv-service-detail-desc">{service.description}</p>
              <ul className="pv-service-list">
                {service.features.map((feature, index) => (
                  <li key={index}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="pv-check-icon"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
