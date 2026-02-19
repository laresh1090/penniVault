import WalletCardSkeleton from "@/components/skeletons/WalletCardSkeleton";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function WalletLoading() {
  return (
    <div aria-label="Loading wallet">
      <div className="row g-4 mb-4">
        {[1, 2].map((i) => (
          <div key={i} className="col-md-6">
            <WalletCardSkeleton />
          </div>
        ))}
      </div>
      <DataTableSkeleton rows={6} columns={5} />
    </div>
  );
}
