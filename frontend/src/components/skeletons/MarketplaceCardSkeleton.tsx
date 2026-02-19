import SkeletonBone from "./SkeletonBone";

export default function MarketplaceCardSkeleton() {
  return (
    <div
      className="card overflow-hidden"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      aria-busy="true"
      aria-label="Loading marketplace item"
    >
      <SkeletonBone width="100%" height={200} borderRadius={0} />
      <div style={{ padding: "16px 16px 20px" }}>
        <SkeletonBone width="80%" height={18} className="mb-2" />
        <SkeletonBone width="50%" height={14} className="mb-2" />
        <SkeletonBone width={120} height={24} className="mb-3" />
        <div className="d-flex gap-2">
          <SkeletonBone width="50%" height={36} borderRadius={8} />
          <SkeletonBone width="50%" height={36} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}
