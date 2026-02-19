import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  return (
    <div className="table-responsive">
      <table className={cn("dash-table", className)}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
