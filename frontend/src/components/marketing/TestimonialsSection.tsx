"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faQuoteLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/components/marketing/SectionHeading";
import { testimonialsOverview, testimonials } from "@/data/marketing";

import "swiper/css";

export default function TestimonialsSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="section-spacing" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="container">
        <SectionHeading
          subtitle="Trusted by Thousands"
          title="What Our Users"
          titleHighlight="Say"
        />

        <div className="row align-items-center g-4">
          {/* Left - Overview */}
          <div className="col-md-4">
            <div className="pv-testimonial-overview">
              <div className="pv-rating-stars">
                <FontAwesomeIcon icon={faStar} style={{ color: "#F59E0B" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "#F59E0B" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "#F59E0B" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "#F59E0B" }} />
                <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: "#F59E0B" }} />
              </div>
              <div className="pv-rating-value">{testimonialsOverview.rating}</div>
              <p className="pv-rating-desc">{testimonialsOverview.description}</p>
              <div className="pv-reviewer-avatars">
                {testimonialsOverview.reviewerAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="pv-reviewer-avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#E2E8F0",
                      backgroundImage: `url(${avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginLeft: index === 0 ? "0" : "-8px",
                      border: "2px solid white",
                      display: "inline-block",
                      position: "relative",
                      zIndex: testimonialsOverview.reviewerAvatars.length - index,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Slider */}
          <div className="col-md-8">
            <div className="pv-testimonial-slider-wrapper">
              <button
                ref={prevRef}
                className="pv-slider-nav prev"
                aria-label="Previous testimonial"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                ref={nextRef}
                className="pv-slider-nav next"
                aria-label="Next testimonial"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              <Swiper
                slidesPerView={1}
                spaceBetween={24}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    swiper.params.navigation &&
                    typeof swiper.params.navigation !== "boolean"
                  ) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                modules={[Navigation]}
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="pv-testimonial-card">
                      <div className="pv-quote-icon">
                        <FontAwesomeIcon
                          icon={faQuoteLeft}
                          style={{ color: "#EB5310", opacity: 0.2, fontSize: "2rem" }}
                        />
                      </div>
                      <p className="pv-testimonial-text">{testimonial.quote}</p>
                      <div className="pv-testimonial-author">
                        <div
                          className="pv-testimonial-avatar"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "#E2E8F0",
                            backgroundImage: `url(${testimonial.avatar})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <strong>{testimonial.name}</strong>
                          <p className="text-muted mb-0">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
