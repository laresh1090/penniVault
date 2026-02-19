import Link from "next/link";
import { formatNaira } from "@/lib/formatters";

interface GroupSavingsStatusCardProps {
  name: string;
  memberCount: string;
  poolSize: number;
  contribution: number;
  frequency: string;
  position: number;
  currentRound: string;
  progress: number;
  href: string;
}

export default function GroupSavingsStatusCard({
  name,
  memberCount,
  poolSize,
  contribution,
  frequency,
  position,
  currentRound,
  progress,
  href,
}: GroupSavingsStatusCardProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Link href={href} className="group-status-card">
      <div className="group-status-header">
        <h4 className="group-status-name">{name}</h4>
        <span className="group-status-members">{memberCount} members</span>
      </div>

      <div className="group-status-details">
        <div className="group-status-detail">
          <span className="detail-label">Pool Size</span>
          <span className="detail-value">{formatNaira(poolSize, false)}</span>
        </div>
        <div className="group-status-detail">
          <span className="detail-label">Contribution</span>
          <span className="detail-value">{formatNaira(contribution, false)}</span>
        </div>
        <div className="group-status-detail">
          <span className="detail-label">Frequency</span>
          <span className="detail-value">{frequency}</span>
        </div>
        <div className="group-status-detail">
          <span className="detail-label">Your Position</span>
          <span className="detail-value">#{position}</span>
        </div>
      </div>

      <div className="group-status-round">
        <span>Round {currentRound}</span>
        <span>{clampedProgress}%</span>
      </div>

      <div className="group-status-progress">
        <div
          className="group-status-progress-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </Link>
  );
}
