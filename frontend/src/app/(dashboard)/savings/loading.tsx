import WalletCardSkeleton from "@/components/skeletons/WalletCardSkeleton";

export default function SavingsLoading() {
  return (
    <div aria-label="Loading savings">
      <div className="row g-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-md-6">
            <WalletCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
