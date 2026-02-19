"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import CounterAnimation from "@/components/marketing/CounterAnimation";

export default function AboutSection() {
  return (
    <section className="section-spacing">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left Column - Image */}
          <div className="col-lg-6">
            <div className="pv-about-img-wrapper">
              <img
                src="/images/marketing/about-img.png"
                alt="About PenniVault"
                className="img-fluid"
                style={{ borderRadius: "16px" }}
              />
              <div className="pv-about-stat">
                <div className="stat-number">
                  <CounterAnimation target={10} suffix="K+" />
                </div>
                <div className="stat-label">Active Savers</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="col-lg-6">
            <ScrollReveal>
              <span className="pv-section-subtitle">About PenniVault</span>
              <h2>
                Building a Culture of{" "}
                <span>Intentional Savings</span> in Africa
              </h2>
              <p>
                PenniVault was born from a simple idea — what if we could take
                the trusted tradition of Ajo (community savings) and make it
                digital, transparent, and accessible to every Nigerian?
              </p>
              <p>
                Today, we&apos;re building a platform that combines goal-based
                savings, group savings, and a vendor marketplace to help
                individuals and families achieve their financial goals.
              </p>

              {/* Mission Block */}
              <div className="pv-mission-block">
                <div className="pv-mission-icon">
                  <FontAwesomeIcon icon={faBullseye} />
                </div>
                <div className="pv-mission-content">
                  <h4>Our Mission</h4>
                  <p>
                    To empower every Nigerian to save intentionally, build
                    wealth, and achieve financial freedom through
                    community-driven tools.
                  </p>
                </div>
              </div>

              {/* Vision Block */}
              <div className="pv-mission-block">
                <div className="pv-mission-icon">
                  <FontAwesomeIcon icon={faEye} />
                </div>
                <div className="pv-mission-content">
                  <h4>Our Vision</h4>
                  <p>
                    To become Africa&apos;s leading savings and asset acquisition
                    platform, making homeownership and financial goals accessible
                    to all.
                  </p>
                </div>
              </div>

              <Link href="/about" className="ul-btn ul-btn-primary mt-3">
                Learn More
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
