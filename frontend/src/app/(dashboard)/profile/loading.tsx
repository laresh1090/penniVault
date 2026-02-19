import SkeletonBone from "@/components/skeletons/SkeletonBone";

export default function ProfileLoading() {
  return (
    <div aria-label="Loading profile">
      <div
        className="card"
        style={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
      >
        <div className="p-4">
          <div className="d-flex gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBone key={i} width={80} height={36} borderRadius={8} />
            ))}
          </div>
          <div className="d-flex flex-column gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <SkeletonBone width={100} height={14} className="mb-2" />
                <SkeletonBone width="100%" height={44} borderRadius={8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
