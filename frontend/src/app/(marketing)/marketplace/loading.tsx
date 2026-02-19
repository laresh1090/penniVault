import MarketplaceCardSkeleton from "@/components/skeletons/MarketplaceCardSkeleton";
import SkeletonBone from "@/components/skeletons/SkeletonBone";

export default function MarketplaceLoading() {
  return (
    <>
      <section style={{ background: "#F8FAFC", padding: "48px 0 32px" }}>
        <div className="container">
          <SkeletonBone width={200} height={32} className="mb-2" />
          <SkeletonBone width={400} height={17} />
        </div>
      </section>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="col-md-6 col-lg-4 col-xl-3">
              <MarketplaceCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
