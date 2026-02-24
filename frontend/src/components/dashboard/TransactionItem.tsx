import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faArrowRightArrowLeft,
  faPiggyBank,
  faPeopleGroup,
  faChartLine,
  faPercent,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { formatNaira, formatRelativeTime } from "@/lib/formatters";
import type { Transaction } from "@/types";

const typeIcons: Record<string, IconDefinition> = {
  deposit: faArrowDown,
  withdrawal: faArrowUp,
  transfer: faArrowRightArrowLeft,
  savings_contribution: faPiggyBank,
  savings_payout: faPiggyBank,
  group_contribution: faPeopleGroup,
  group_payout: faPeopleGroup,
  investment: faChartLine,
  investment_return: faPercent,
  commission: faCoins,
};

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const icon = typeIcons[transaction.type] || faCoins;
  const isPositive = transaction.amount > 0;

  return (
    <div className="transaction-item">
      <div className={`txn-icon ${transaction.type}`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="txn-info">
        <p className="txn-desc">{transaction.description}</p>
        <p className="txn-date">{formatRelativeTime(transaction.createdAt)}</p>
      </div>
      <span className={`txn-amount ${isPositive ? "positive" : "negative"}`}>
        {isPositive ? "+" : ""}
        {formatNaira(Math.abs(transaction.amount), false)}
      </span>
    </div>
  );
}
