"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/components/marketing/SectionHeading";
import { services } from "@/data/marketing";

import "swiper/css";
import "swiper/css/navigation";

export default function ServicesSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="section-spacing" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="container">
        <SectionHeading
          subtitle="What We Offer"
          title="Our Core"
          titleHighlight="Services"
        />

        <div className="pv-services-slider-wrapper">
          <button
            ref={prevRef}
            className="pv-slider-nav prev"
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            ref={nextRef}
            className="pv-slider-nav next"
            aria-label="Next slide"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <Swiper
            spaceBetween={24}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2.5 },
              1200: { slidesPerView: 3 },
            }}
          >
            {services.map((service) => (
              <SwiperSlide key={service.id}>
                <div className="pv-service-card">
                  <div className="pv-service-card-img">
                    <img
                      src={service.image}
                      alt={service.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                  </div>
                  <div className="pv-service-card-body">
                    <div
                      className="pv-service-icon"
                      style={{
                        backgroundColor: service.iconBg,
                        color: service.iconColor,
                      }}
                    >
                      <FontAwesomeIcon icon={service.icon} />
                    </div>
                    <h4>
                      <Link href={service.href}>{service.title}</Link>
                    </h4>
                    <p>{service.description}</p>
                    <Link href={service.href} className="pv-service-link">
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
