import SkeletonBone from "./SkeletonBone";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function DataTableSkeleton({
  rows = 5,
  columns = 4,
}: DataTableSkeletonProps) {
  return (
    <div
      className="card"
      style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}
      aria-busy="true"
      aria-label="Loading table data"
    >
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th
                  key={i}
                  style={{
                    background: "#F8FAFC",
                    padding: "14px 16px",
                    border: "none",
                  }}
                >
                  <SkeletonBone width="70%" height={14} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td
                    key={colIdx}
                    style={{ padding: "14px 16px", borderColor: "#F1F5F9" }}
                  >
                    <SkeletonBone
                      width={`${55 + ((colIdx * 10) % 40)}%`}
                      height={14}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
