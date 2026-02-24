"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faLandmark,
  faLocationDot,
  faUsers,
  faChartLine,
  faCalendarDays,
  faMicrochip,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";

import { useInvestments } from "@/hooks/useInvestments";
import { useUserInvestments } from "@/hooks/useUserInvestments";
import { formatNaira, formatDate, formatPercentage } from "@/lib/formatters";
import InvestModal from "@/components/investments/InvestModal";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import type { CrowdInvestment, InvestmentFilters } from "@/types";

function getCategoryIcon(category: string) {
  switch (category) {
    case "agriculture": return faSeedling;
    case "real_estate": return faLandmark;
    case "technology": return faMicrochip;
    default: return faBoxOpen;
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "agriculture": return "Agriculture";
    case "real_estate": return "Real Estate";
    case "technology": return "Technology";
    default: return "Other";
  }
}

function getRiskBadgeColor(risk?: string) {
  switch (risk) {
    case "low": return { bg: "#ECFDF5", color: "#059669" };
    case "medium": return { bg: "#FEF9C3", color: "#CA8A04" };
    case "high": return { bg: "#FEE2E2", color: "#DC2626" };
    default: return { bg: "#F1F5F9", color: "#64748B" };
  }
}

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "portfolio">("browse");

  // Browse tab state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState<InvestmentFilters["sort"]>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [investTarget, setInvestTarget] = useState<CrowdInvestment | null>(null);

  const browseFilters = useMemo<InvestmentFilters>(
    () => ({
      category: categoryFilter as InvestmentFilters["category"],
      riskLevel: riskFilter as InvestmentFilters["riskLevel"],
      sort: sortBy,
      page: currentPage,
      perPage: 6,
    }),
    [categoryFilter, riskFilter, sortBy, currentPage],
  );

  const { investments, meta, isLoading: browseLoading, refetch: refetchBrowse } = useInvestments(browseFilters);
  const { investments: myInvestments, summary, isLoading: portfolioLoading, refetch: refetchPortfolio } = useUserInvestments();

  const totalPages = meta?.totalPages ?? 1;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const handleFilterReset = () => {
    setCategoryFilter("all");
    setRiskFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E252F", marginBottom: 24 }}>
        Investments
      </h2>

      {/* Tabs */}
      <div className="invest-tabs mb-4">
        <button
          className={`invest-tab ${activeTab === "browse" ? "active" : ""}`}
          onClick={() => setActiveTab("browse")}
        >
          <FontAwesomeIcon icon={faChartLine} /> Browse Opportunities
        </button>
        <button
          className={`invest-tab ${activeTab === "portfolio" ? "active" : ""}`}
          onClick={() => setActiveTab("portfolio")}
        >
          <FontAwesomeIcon icon={faCalendarDays} /> My Portfolio
        </button>
      </div>

      {/* ===== BROWSE TAB ===== */}
      {activeTab === "browse" && (
        <>
          {/* Filters */}
          <div className="dash-card mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #E2E8F0", fontSize: 14, background: "#F8FAFC", cursor: "pointer",
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
                  Risk Level
                </label>
                <select
                  value={riskFilter}
                  onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #E2E8F0", fontSize: 14, background: "#F8FAFC", cursor: "pointer",
                  }}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as InvestmentFilters["sort"]); setCurrentPage(1); }}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #E2E8F0", fontSize: 14, background: "#F8FAFC", cursor: "pointer",
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="highest-roi">Highest Return</option>
                  <option value="lowest-minimum">Lowest Minimum</option>
                  <option value="most-funded">Most Funded</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  className="quick-action-btn outline"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleFilterReset}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {browseLoading && (
            <div className="d-flex justify-content-center" style={{ padding: "60px 0" }}>
              <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Investment Cards Grid */}
          {!browseLoading && (
            <div className="row g-4 mb-4">
              {investments.map((inv) => {
                const progressPercent = Math.round((inv.raisedAmount / inv.targetAmount) * 100);
                const riskStyle = getRiskBadgeColor(inv.riskLevel);
                const canInvest = inv.status === "open" || inv.status === "in_progress";

                return (
                  <div key={inv.id} className="col-xl-4 col-md-6">
                    <div className="invest-browse-card">
                      {/* Header image / placeholder */}
                      <div className="invest-browse-card-img">
                        {inv.imageUrl ? (
                          <img src={inv.imageUrl} alt={inv.title} />
                        ) : (
                          <div className="invest-browse-card-placeholder">
                            <FontAwesomeIcon icon={getCategoryIcon(inv.category)} />
                          </div>
                        )}
                        <span className="invest-browse-category">
                          <FontAwesomeIcon icon={getCategoryIcon(inv.category)} />
                          {" "}{getCategoryLabel(inv.category)}
                        </span>
                        {inv.riskLevel && (
                          <span
                            className="invest-browse-risk"
                            style={{ background: riskStyle.bg, color: riskStyle.color }}
                          >
                            {inv.riskLevel.charAt(0).toUpperCase() + inv.riskLevel.slice(1)} Risk
                          </span>
                        )}
                      </div>

                      <div className="invest-browse-card-body">
                        <h4 className="invest-browse-title">{inv.title}</h4>
                        <p className="invest-browse-vendor">{inv.vendorName}</p>
                        <p className="invest-browse-location">
                          <FontAwesomeIcon icon={faLocationDot} /> {inv.location}
                        </p>

                        {/* ROI + Duration row */}
                        <div className="invest-browse-stats">
                          <div className="invest-browse-stat">
                            <span className="stat-value" style={{ color: "#059669" }}>
                              {formatPercentage(inv.expectedReturnPercent)}
                            </span>
                            <span className="stat-label">Return p.a.</span>
                          </div>
                          <div className="invest-browse-stat">
                            <span className="stat-value">{inv.durationDays}d</span>
                            <span className="stat-label">Duration</span>
                          </div>
                          <div className="invest-browse-stat">
                            <span className="stat-value">
                              <FontAwesomeIcon icon={faUsers} style={{ fontSize: 12, marginRight: 3 }} />
                              {inv.investorsCount}
                            </span>
                            <span className="stat-label">Investors</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="invest-browse-progress-row">
                          <div className="invest-browse-progress">
                            <div
                              className="invest-browse-progress-fill"
                              style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            />
                          </div>
                          <span className="invest-browse-progress-label">
                            {progressPercent}% funded
                          </span>
                        </div>

                        <div className="invest-browse-amounts">
                          <span>{formatNaira(inv.raisedAmount, false)} raised</span>
                          <span>of {formatNaira(inv.targetAmount, false)}</span>
                        </div>

                        {/* Min investment + CTA */}
                        <div className="invest-browse-footer">
                          <div>
                            <span className="invest-browse-min-label">Min Investment</span>
                            <span className="invest-browse-min-value">
                              {formatNaira(inv.minimumInvestment, false)}
                            </span>
                          </div>
                          <button
                            className="quick-action-btn primary"
                            style={{ fontSize: 13, padding: "8px 20px" }}
                            disabled={!canInvest}
                            onClick={() => setInvestTarget(inv)}
                          >
                            {canInvest ? "Invest Now" : inv.status === "funded" ? "Fully Funded" : "Closed"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty */}
          {!browseLoading && investments.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No investments found</p>
              <p style={{ marginBottom: 0 }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {!browseLoading && totalPages > 1 && (
            <nav aria-label="Investments pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item${currentPage <= 1 ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
                    Previous
                  </button>
                </li>
                {pageNumbers.map((page) => (
                  <li key={page} className={`page-item${currentPage === page ? " active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                  </li>
                ))}
                <li className={`page-item${currentPage >= totalPages ? " disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* ===== PORTFOLIO TAB ===== */}
      {activeTab === "portfolio" && (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="row g-3 mb-4">
              <div className="col-md-3 col-6">
                <div className="dash-card text-center" style={{ padding: "20px 16px" }}>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Total Invested</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#1E252F", marginBottom: 0 }}>
                    {formatNaira(summary.totalInvested, false)}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="dash-card text-center" style={{ padding: "20px 16px" }}>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Expected Return</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#059669", marginBottom: 0 }}>
                    {formatNaira(summary.totalExpectedReturn, false)}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="dash-card text-center" style={{ padding: "20px 16px" }}>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Interest Earned</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6", marginBottom: 0 }}>
                    {formatNaira(summary.totalActualReturn, false)}
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="dash-card text-center" style={{ padding: "20px 16px" }}>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Active / Matured</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#1E252F", marginBottom: 0 }}>
                    {summary.activeCount} / {summary.maturedCount}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio loading */}
          {portfolioLoading && (
            <div className="d-flex justify-content-center" style={{ padding: "60px 0" }}>
              <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Portfolio investments list */}
          {!portfolioLoading && myInvestments.length > 0 && (
            <div className="row g-3">
              {myInvestments.map((inv) => (
                <div key={inv.id} className="col-md-6 col-lg-4">
                  <InvestmentCard investment={inv} />
                </div>
              ))}
            </div>
          )}

          {/* Empty portfolio */}
          {!portfolioLoading && myInvestments.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                No investments yet
              </p>
              <p style={{ marginBottom: 16 }}>
                Browse investment opportunities and start growing your wealth.
              </p>
              <button
                className="quick-action-btn primary"
                onClick={() => setActiveTab("browse")}
              >
                Browse Opportunities
              </button>
            </div>
          )}
        </>
      )}

      {/* Invest Modal */}
      {investTarget && (
        <InvestModal
          investment={investTarget}
          onClose={() => setInvestTarget(null)}
          onSuccess={() => {
            refetchBrowse();
            refetchPortfolio();
          }}
        />
      )}
    </>
  );
}
