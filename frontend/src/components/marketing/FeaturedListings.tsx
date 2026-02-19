"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/components/marketing/SectionHeading";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import { listings } from "@/data/marketing";

export default function FeaturedListings() {
  return (
    <section className="section-spacing">
      <div className="container">
        <SectionHeading
          subtitle="Featured On Our Marketplace"
          title="Popular Items People Are"
          titleHighlight="Saving Towards"
        />

        <div className="row g-4">
          {listings.map((listing) => (
            <div key={listing.id} className={`col-lg-${listing.colSize}`}>
              <ScrollReveal>
                <div className="pv-featured-listing">
                  <div className="pv-featured-listing-img">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div className="pv-featured-listing-overlay" />
                    <div className="pv-featured-listing-content">
                      <h4>
                        <Link href={listing.href}>{listing.title}</Link>
                      </h4>
                      <div className="pv-featured-listing-meta">
                        {listing.category} &bull; {listing.price}
                      </div>
                    </div>
                    <Link
                      href={listing.href}
                      className="pv-featured-listing-btn"
                      aria-label={`View ${listing.title}`}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
