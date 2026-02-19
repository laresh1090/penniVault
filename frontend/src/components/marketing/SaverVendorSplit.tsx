import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function SaverVendorSplit() {
  return (
    <section className="pv-split-section">
      <div className="row g-0">
        {/* Saver Side */}
        <div className="col-lg-6">
          <div className="pv-split-block pv-split-dark">
            <h2>Start Saving Today</h2>
            <p>
              Whether you&apos;re saving for your first home, a new car, or
              building an emergency fund — PenniVault makes it simple.
            </p>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>Set personalized savings goals</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>Track your progress in real-time</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>Earn up to 8% annual interest</span>
              </li>
            </ul>
            <Link href="/register" className="ul-btn ul-btn-primary">
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Vendor Side */}
        <div className="col-lg-6">
          <div className="pv-split-block pv-split-orange">
            <h2>Become A Vendor</h2>
            <p>
              List your properties, vehicles, and other assets on
              PenniVault&apos;s marketplace. Reach thousands of motivated buyers
              saving towards their purchases.
            </p>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>List unlimited products</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>Get verified vendor badge</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                <span>Receive guaranteed payments</span>
              </li>
            </ul>
            <Link href="/register?role=vendor" className="ul-btn ul-btn-white">
              Apply as Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
