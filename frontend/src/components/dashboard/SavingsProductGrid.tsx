import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faLock,
  faBullseye,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { formatNaira } from "@/lib/formatters";

interface SavingsProduct {
  name: string;
  description: string;
  balance: number;
  icon: IconDefinition;
  accentColor: string;
  href: string;
}

const products: Omit<SavingsProduct, "balance">[] = [
  {
    name: "PenniSave",
    description: "Automated savings",
    icon: faPiggyBank,
    accentColor: "#3B82F6",
    href: "/savings?type=pennisave",
  },
  {
    name: "PenniLock",
    description: "Lock & earn interest",
    icon: faLock,
    accentColor: "#10B981",
    href: "/savings?type=pennilock",
  },
  {
    name: "TargetSave",
    description: "Save towards a goal",
    icon: faBullseye,
    accentColor: "#8B5CF6",
    href: "/savings?type=targetsave",
  },
  {
    name: "PenniAjo",
    description: "Group savings",
    icon: faPeopleGroup,
    accentColor: "#EB5310",
    href: "/savings/groups",
  },
];

interface SavingsProductGridProps {
  balances: {
    pennisave: number;
    pennilock: number;
    targetsave: number;
    penniajo: number;
  };
}

export default function SavingsProductGrid({ balances }: SavingsProductGridProps) {
  const balanceMap: Record<string, number> = {
    PenniSave: balances.pennisave,
    PenniLock: balances.pennilock,
    TargetSave: balances.targetsave,
    PenniAjo: balances.penniajo,
  };

  return (
    <div className="savings-product-grid">
      {products.map((product) => (
        <Link key={product.name} href={product.href} className="product-card">
          <div
            className="product-icon"
            style={{ background: `${product.accentColor}22` }}
          >
            <FontAwesomeIcon
              icon={product.icon}
              style={{ color: product.accentColor }}
            />
          </div>
          <span className="product-name">{product.name}</span>
          <span className="product-desc">{product.description}</span>
          <span className="product-balance">
            {formatNaira(balanceMap[product.name] || 0)}
          </span>
        </Link>
      ))}
    </div>
  );
}
