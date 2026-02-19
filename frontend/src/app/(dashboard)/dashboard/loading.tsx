import DashCardSkeleton from "@/components/skeletons/DashCardSkeleton";
import ChartSkeleton from "@/components/skeletons/ChartSkeleton";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function DashboardLoading() {
  return (
    <div aria-label="Loading dashboard">
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-sm-6 col-lg-3">
            <DashCardSkeleton />
          </div>
        ))}
      </div>
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ChartSkeleton />
        </div>
        <div className="col-lg-4">
          <ChartSkeleton height={180} />
        </div>
      </div>
      <DataTableSkeleton rows={5} columns={5} />
    </div>
  );
}
