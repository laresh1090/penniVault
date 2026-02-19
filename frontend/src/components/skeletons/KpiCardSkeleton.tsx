import SkeletonBone from "./SkeletonBone";

export default function KpiCardSkeleton() {
  return (
    <div
      className="card p-3"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      aria-busy="true"
    >
      <div className="d-flex align-items-center gap-3">
        <SkeletonBone width={44} height={44} borderRadius={12} />
        <div style={{ flex: 1 }}>
          <SkeletonBone width={60} height={12} className="mb-2" />
          <SkeletonBone width={90} height={20} />
        </div>
      </div>
    </div>
  );
}
