import SkeletonBone from "./SkeletonBone";

export default function WalletCardSkeleton() {
  return (
    <div
      className="card p-3"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      aria-busy="true"
      aria-label="Loading wallet information"
    >
      <SkeletonBone width={100} height={14} className="mb-2" />
      <SkeletonBone width={180} height={28} className="mb-3" />
      <SkeletonBone width="60%" height={12} className="mb-2" />
      <SkeletonBone width="100%" height={8} borderRadius={4} />
    </div>
  );
}
