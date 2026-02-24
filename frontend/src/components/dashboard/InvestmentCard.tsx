import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faLandmark, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { formatNaira, formatDate } from "@/lib/formatters";
import type { UserInvestment } from "@/types";

interface InvestmentCardProps {
  investment: UserInvestment;
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const { investment: inv } = investment;
  const progressPercent = Math.round((inv.raisedAmount / inv.targetAmount) * 100);
  const categoryLabel = inv.category === "agriculture" ? "Agriculture" : "Real Estate";

  return (
    <div className="investment-card">
      {/* Investment image */}
      <div className="investment-card-img-wrapper">
        <img src={inv.imageUrl} alt={inv.title} className="investment-card-img" />
        <span className={`investment-card-badge ${inv.category}`}>
          <FontAwesomeIcon icon={inv.category === "agriculture" ? faSeedling : faLandmark} />
          {categoryLabel}
        </span>
      </div>

      <div className="investment-card-body">
        <h4 className="investment-card-title">{inv.title}</h4>
        <p className="investment-card-location">{inv.location}</p>

        {/* Progress */}
        <div className="investment-progress">
          <div
            className="investment-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="investment-return-badge">
          {inv.expectedReturnPercent}% p.a. returns · {progressPercent}% funded
        </span>

        {/* Details row */}
        <div className="investment-card-details">
          <div className="detail-col">
            <span className="detail-label">Invested</span>
            <span className="detail-value">{formatNaira(investment.amountInvested, false)}</span>
          </div>
          <div className="detail-col">
            <span className="detail-label">Start</span>
            <span className="detail-value">{formatDate(investment.investedAt)}</span>
          </div>
          <div className="detail-col">
            <span className="detail-label">Maturity</span>
            <span className="detail-value">{formatDate(investment.maturityDate)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="investment-card-footer">
          <div>
            <span className="earned-label">Interest Earned</span>
            <span className="earned-value">{formatNaira(investment.interestEarned, false)}</span>
          </div>
          <button className="withdraw-btn">
            Withdraw <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
