import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { formatNaira } from "@/lib/formatters";

interface MemberCardProps {
  name: string;
  position: number;
  hasPaid: boolean;
  isCurrentTurn: boolean;
  totalContributed: number;
}

export default function MemberCard({
  name,
  position,
  hasPaid,
  isCurrentTurn,
  totalContributed,
}: MemberCardProps) {
  return (
    <div className={cn("member-card", isCurrentTurn && "current-turn")}>
      <div className="member-avatar">{getInitials(name)}</div>
      <div className="member-info">
        <span className="member-name">{name}</span>
        <span className="member-position">Position #{position}</span>
        <span className="member-contributed">
          {formatNaira(totalContributed, false)} contributed
        </span>
      </div>
      <span className={cn("member-status", hasPaid ? "paid" : "unpaid")}>
        {hasPaid ? "Paid" : "Unpaid"}
      </span>
    </div>
  );
}
