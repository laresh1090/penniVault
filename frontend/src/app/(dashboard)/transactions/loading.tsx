import DashCardSkeleton from "@/components/skeletons/DashCardSkeleton";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function TransactionsLoading() {
  return (
    <div aria-label="Loading transactions">
      <div className="row g-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-md-4">
            <DashCardSkeleton />
          </div>
        ))}
      </div>
      <DataTableSkeleton rows={8} columns={5} />
    </div>
  );
}
