import KpiCardSkeleton from "@/components/skeletons/KpiCardSkeleton";
import ChartSkeleton from "@/components/skeletons/ChartSkeleton";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function AdminDashboardLoading() {
  return (
    <div aria-label="Loading admin dashboard">
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-6 col-md-4 col-xl-2">
            <KpiCardSkeleton />
          </div>
        ))}
      </div>
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ChartSkeleton />
        </div>
        <div className="col-lg-6">
          <ChartSkeleton />
        </div>
      </div>
      <DataTableSkeleton rows={5} columns={5} />
    </div>
  );
}
