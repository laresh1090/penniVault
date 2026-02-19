import SkeletonBone from "./SkeletonBone";

export default function DashCardSkeleton() {
  return (
    <div
      className="card p-3"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      aria-busy="true"
      aria-label="Loading dashboard card"
    >
      <div className="d-flex align-items-center mb-3">
        <SkeletonBone width={44} height={44} borderRadius={12} className="me-3" />
        <div style={{ flex: 1 }}>
          <SkeletonBone width={80} height={12} className="mb-2" />
          <SkeletonBone width={120} height={22} />
        </div>
      </div>
      <SkeletonBone width="60%" height={12} />
    </div>
  );
}
