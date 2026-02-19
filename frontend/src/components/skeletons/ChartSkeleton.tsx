import SkeletonBone from "./SkeletonBone";

interface ChartSkeletonProps {
  height?: number;
}

export default function ChartSkeleton({ height = 250 }: ChartSkeletonProps) {
  const barHeights = [40, 65, 50, 80, 55, 70, 90, 60, 45, 75, 85, 50];

  return (
    <div
      className="card p-4"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      aria-busy="true"
      aria-label="Loading chart"
    >
      <SkeletonBone width={160} height={18} className="mb-4" />
      <div className="d-flex align-items-end gap-2" style={{ height }}>
        {barHeights.map((h, i) => (
          <SkeletonBone
            key={i}
            width="100%"
            height={`${h}%`}
            borderRadius="4px 4px 0 0"
          />
        ))}
      </div>
    </div>
  );
}
