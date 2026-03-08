type Column = {
  header: string
  accessor: string
}

type Props = {
  columns: Column[]
  data: any[]
  actions?: (row: any) => React.ReactNode
}

export default function DataTable({ columns, data, actions }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                >
                  {column.header}
                </th>
              ))}

              {actions && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}

            {data.map((row: any, index) => (
              <tr
                key={row.student_id || row.id || index}
                className="text-sm text-gray-700 transition hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.accessor} className="px-6 py-4">
                    {row[column.accessor]}
                  </td>
                ))}

                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">{actions(row)}</div>
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