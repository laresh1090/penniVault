"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPiggyBank,
  faChartLine,
  faArrowDown,
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { formatNaira } from "@/lib/formatters";

interface BalanceCardProps {
  greeting: string;
  totalBalance: number;
}

export default function BalanceCard({ greeting, totalBalance }: BalanceCardProps) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  return (
    <div className="balance-hero-card">
      <p className="greeting">{greeting} 👋</p>
      <div className="balance-label">
        Total Balance
        <button
          className="balance-toggle"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide balance" : "Show balance"}
        >
          <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
        </button>
      </div>
      <div className="balance-amount">
        {visible ? formatNaira(totalBalance) : "********"}
      </div>
      <div className="balance-hero-actions">
        <button className="hero-action-btn primary" onClick={() => router.push("/savings")}>
          <FontAwesomeIcon icon={faPiggyBank} /> Save
        </button>
        <button className="hero-action-btn" onClick={() => router.push("/marketplace/investments")}>
          <FontAwesomeIcon icon={faChartLine} /> Invest
        </button>
        <button className="hero-action-btn" onClick={() => router.push("/wallet")}>
          <FontAwesomeIcon icon={faArrowDown} /> Withdraw
        </button>
        <button className="hero-action-btn" onClick={() => router.push("/wallet")}>
          <FontAwesomeIcon icon={faArrowRightArrowLeft} /> Transfer
        </button>
      </div>
    </div>
  );
}
