import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface ContactInfoCardsProps {
  className?: string;
}

export default function ContactInfoCards({ className }: ContactInfoCardsProps) {
  const cards = [
    {
      icon: faMapMarkerAlt,
      title: "Visit Our Office",
      lines: ["42 Marina Road, Victoria Island,", "Lagos, Nigeria"],
    },
    {
      icon: faEnvelope,
      title: "Email Us",
      lines: ["hello@pennivault.com", "support@pennivault.com"],
    },
    {
      icon: faPhone,
      title: "Call Us",
      lines: ["+234 123 456 7890", "Mon - Fri, 8am - 6pm WAT"],
    },
  ];

  return (
    <div className={cn("row g-4", className)}>
      {cards.map((card, index) => (
        <div key={index} className="col-lg-4">
          <div className="pv-contact-info-card">
            <div className="pv-contact-info-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <h4 className="pv-contact-info-title">{card.title}</h4>
            {card.lines.map((line, i) => (
              <p key={i} className="pv-contact-info-text">
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
