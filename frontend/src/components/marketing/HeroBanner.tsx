"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { heroSlides } from "@/data/marketing";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

export default function HeroBanner() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="pv-hero-banner">
      {/* Main Slider */}
      <Swiper
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[EffectFade, Autoplay, Thumbs]}
        loop={true}
        className="pv-hero-main-slider"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="pv-hero-slide"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
              }}
            >
              <div className="pv-hero-overlay" />
              <div className="container">
                <div className="pv-hero-content">
                  <span className="pv-hero-subtitle">{slide.subtitle}</span>
                  <h1 className="pv-hero-title">
                    {slide.title} <span>{slide.titleHighlight}</span>
                  </h1>
                  <p className="pv-hero-description">{slide.description}</p>
                  <div className="pv-hero-cta">
                    <Link href={slide.ctaHref} className="ul-btn ul-btn-primary">
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Navigation */}
      <div className="pv-hero-thumbs">
        <div className="container">
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={3}
            spaceBetween={12}
            modules={[Thumbs]}
            watchSlidesProgress={true}
            className="pv-hero-thumbs-slider"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="pv-hero-thumb">
                  <img
                    src={slide.thumbnailImage}
                    alt={slide.title}
                    style={{
                      height: "80px",
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
