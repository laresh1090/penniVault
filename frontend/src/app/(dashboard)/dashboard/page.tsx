"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPiggyBank,
  faChartLine,
  faSeedling,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/auth-context";
import { useWallet, useTransactions, useSavingsPlans, useInvestments, useListings } from "@/hooks";
import { useUserInvestments } from "@/hooks/useUserInvestments";
import { savingsService, SavingsSummary } from "@/services/savings.service";
import BalanceCard from "@/components/dashboard/BalanceCard";
import SavingsProductGrid from "@/components/dashboard/SavingsProductGrid";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { formatNaira } from "@/lib/formatters";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { wallet, isLoading: walletLoading } = useWallet();
  const { transactions, isLoading: txnLoading } = useTransactions();
  const { investments: userInvestments, summary: investSummary, isLoading: investLoading } = useUserInvestments();
  const { plans: savingsPlans, isLoading: plansLoading } = useSavingsPlans({ status: "active" });
  const { investments: featuredInvestments, isLoading: featInvestLoading } = useInvestments({ status: "open", perPage: 3 });
  const { listings, isLoading: listingsLoading } = useListings({ perPage: 4 });
  const [savingsSummary, setSavingsSummary] = useState<SavingsSummary | null>(null);

  useEffect(() => {
    savingsService.getSavingsSummary().then(setSavingsSummary).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.firstName || "User";

  const walletBalance = wallet?.realBalance ?? 0;
  const totalSavings = savingsSummary?.totalSavings ?? 0;
  const totalInvested = investSummary?.totalInvested ?? 0;
  const totalBalance = walletBalance + totalSavings;

  const savingsBreakdown = savingsSummary?.savingsBreakdown ?? {
    pennisave: 0,
    pennilock: 0,
    targetsave: 0,
    penniajo: 0,
  };

  const recentTxns = transactions.slice(0, 5);
  const activePlans = savingsPlans.slice(0, 3);

  if (walletLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ padding: "60px 0" }}>
        <div className="spinner-border" role="status" style={{ color: "#EB5310" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Section 1: Welcome + Balance */}
      <BalanceCard
        greeting={`${timeGreeting}, ${firstName}`}
        totalBalance={totalBalance}
      />

      {/* Section 2: Wallet Breakdown Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="wallet-summary-card">
            <div className="wallet-summary-icon" style={{ background: "rgba(235, 83, 16, 0.1)", color: "#EB5310" }}>
              <FontAwesomeIcon icon={faWallet} />
            </div>
            <div>
              <p className="wallet-summary-label">Wallet Balance</p>
              <p className="wallet-summary-amount">{formatNaira(walletBalance)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="wallet-summary-card">
            <div className="wallet-summary-icon" style={{ background: "rgba(5, 150, 105, 0.1)", color: "#059669" }}>
              <FontAwesomeIcon icon={faPiggyBank} />
            </div>
            <div>
              <p className="wallet-summary-label">Total Savings</p>
              <p className="wallet-summary-amount">{formatNaira(totalSavings)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="wallet-summary-card">
            <div className="wallet-summary-icon" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366F1" }}>
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div>
              <p className="wallet-summary-label">Total Invested</p>
              <p className="wallet-summary-amount">{formatNaira(totalInvested)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Savings & Investments Product Grid */}
      <h5 className="dash-section-title">Savings & Investments</h5>
      <SavingsProductGrid balances={savingsBreakdown} />

      {/* Section 4: Active Savings Plans */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Active Savings Plans</h3>
          <Link href="/savings" className="card-action">
            View All
          </Link>
        </div>
        {plansLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : activePlans.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>
            No active savings plans. <Link href="/savings" style={{ color: "#EB5310" }}>Start one today!</Link>
          </p>
        ) : (
          <div className="savings-plans-preview">
            {activePlans.map((plan) => {
              const progress = plan.targetAmount > 0
                ? Math.min(100, Math.round((plan.currentAmount / plan.targetAmount) * 100))
                : 0;
              const productLabels: Record<string, string> = {
                pennisave: "PenniSave",
                pennilock: "PenniLock",
                targetsave: "TargetSave",
              };
              const productColors: Record<string, string> = {
                pennisave: "#EB5310",
                pennilock: "#6366F1",
                targetsave: "#059669",
              };
              return (
                <Link
                  key={plan.id}
                  href={`/savings/${plan.id}`}
                  className="savings-plan-row"
                >
                  <div className="savings-plan-info">
                    <span
                      className="savings-plan-badge"
                      style={{ background: `${productColors[plan.productType] ?? "#64748B"}15`, color: productColors[plan.productType] ?? "#64748B" }}
                    >
                      {productLabels[plan.productType] ?? plan.productType}
                    </span>
                    <span className="savings-plan-name">{plan.name}</span>
                  </div>
                  <div className="savings-plan-progress-wrap">
                    <div className="savings-plan-amounts">
                      <span>{formatNaira(plan.currentAmount, false)}</span>
                      <span className="savings-plan-target">/ {formatNaira(plan.targetAmount, false)}</span>
                    </div>
                    <div className="savings-progress" style={{ height: 6 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%`, background: productColors[plan.productType] ?? "#EB5310" }}
                      />
                    </div>
                  </div>
                  <span className="savings-plan-percent">{progress}%</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 5: Active Investments */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">My Investments</h3>
          <Link href="/investments" className="card-action">
            View All
          </Link>
        </div>
        {investLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : userInvestments.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>
            You haven&apos;t made any investments yet. <Link href="/investments" style={{ color: "#EB5310" }}>Browse opportunities</Link>.
          </p>
        ) : (
          <div className="row g-3">
            {userInvestments.slice(0, 3).map((inv) => (
              <div key={inv.id} className="col-md-6 col-lg-4">
                <InvestmentCard investment={inv} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 6: Featured Investments */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Featured Investments</h3>
          <Link href="/investments" className="card-action">
            Browse All
          </Link>
        </div>
        {featInvestLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : featuredInvestments.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>
            No investment opportunities available right now.
          </p>
        ) : (
          <div className="row g-3 p-3">
            {featuredInvestments.slice(0, 3).map((inv) => {
              const funded = Math.round((inv.raisedAmount / inv.targetAmount) * 100);
              return (
                <div key={inv.id} className="col-md-6 col-lg-4">
                  <Link href={`/investments/${inv.id}`} className="featured-invest-card">
                    <div className="featured-invest-img-wrap">
                      <img src={inv.imageUrl} alt={inv.title} />
                      <span className={`featured-invest-badge ${inv.category}`}>
                        <FontAwesomeIcon icon={inv.category === "agriculture" ? faSeedling : faLandmark} />
                        {inv.category === "agriculture" ? "Agriculture" : "Real Estate"}
                      </span>
                    </div>
                    <div className="featured-invest-body">
                      <h6 className="featured-invest-title">{inv.title}</h6>
                      <p className="featured-invest-location">{inv.location}</p>
                      <div className="featured-invest-stats">
                        <span className="featured-invest-return">{inv.expectedReturnPercent}% p.a.</span>
                        <span className="featured-invest-funded">{funded}% funded</span>
                      </div>
                      <div className="featured-invest-meta">
                        <span>Min: {formatNaira(inv.minimumInvestment, false)}</span>
                        <span>{inv.investorsCount} investor{inv.investorsCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 7: Marketplace Highlights */}
      <div className="dash-card mb-4">
        <div className="card-header">
          <h3 className="card-title">Marketplace</h3>
          <Link href="/marketplace" className="card-action">
            View All
          </Link>
        </div>
        {listingsLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>
            No marketplace listings available.
          </p>
        ) : (
          <div className="row g-3 p-3">
            {listings.slice(0, 4).map((item) => {
              const imgSrc = item.primaryImage || item.images?.[0] || "/img/placeholder.jpg";
              const categoryLabels: Record<string, string> = {
                property: "Property",
                car: "Automobile",
                land: "Land",
                other: "Other",
              };
              return (
                <div key={item.id} className="col-6 col-lg-3">
                  <Link href={`/marketplace/${item.id}`} className="marketplace-preview-card">
                    <div className="marketplace-preview-img">
                      <img src={imgSrc} alt={item.title} />
                      <span className="marketplace-preview-badge">
                        {categoryLabels[item.category] ?? item.category}
                      </span>
                    </div>
                    <div className="marketplace-preview-body">
                      <h6 className="marketplace-preview-title">{item.title}</h6>
                      <span className="marketplace-preview-price">{formatNaira(item.price, false)}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 8: Recent Transactions */}
      <div className="dash-card">
        <div className="card-header">
          <h3 className="card-title">Recent Transactions</h3>
          <Link href="/wallet" className="card-action">
            View All
          </Link>
        </div>
        {txnLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border spinner-border-sm" role="status" style={{ color: "#EB5310" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recentTxns.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", padding: 32 }}>
            No transactions yet.
          </p>
        ) : (
          <div className="transaction-list">
            {recentTxns.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
