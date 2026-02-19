import KpiCardSkeleton from "@/components/skeletons/KpiCardSkeleton";
import ChartSkeleton from "@/components/skeletons/ChartSkeleton";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function VendorDashboardLoading() {
  return (
    <div aria-label="Loading vendor dashboard">
      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-md-6 col-xl-3">
            <KpiCardSkeleton />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <ChartSkeleton />
      </div>
      <DataTableSkeleton rows={5} columns={5} />
    </div>
  );
}
