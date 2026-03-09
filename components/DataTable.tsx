type Column = {
  header: string
  accessor: string
}

type Props = {
  columns: Column[]
  data: any[]
  actions?: (row: any) => React.ReactNode
  rowKey?: string
}

export default function DataTable({
  columns,
  data,
  actions,
  rowKey = "id",
}: Props) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-white/10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-200"
                >
                  {column.header}
                </th>
              ))}

              {actions && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  No records found.
                </td>
              </tr>
            )}

            {data.map((row: any, index) => (
              <tr
                key={row[rowKey] ?? index}
                className="text-sm text-slate-100 transition hover:bg-white/5"
              >
                {columns.map((column) => (
                  <td key={column.accessor} className="px-6 py-4">
                    {column.accessor === "status" ? (
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          String(row[column.accessor]).toLowerCase() === "active"
                            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20"
                            : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20"
                        }`}
                      >
                        {row[column.accessor]}
                      </span>
                    ) : (
                      row[column.accessor]
                    )}
                  </td>
                ))}

                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}