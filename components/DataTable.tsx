type Props = {
  columns: string[]
  data: any[]
}

export default function DataTable({ columns, data }: Props) {

  return (
    <table className="w-full border">

      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} className="border p-2">
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>

        {data.map((row: any, index) => (
          <tr key={index}>

            {Object.values(row).map((v: any, i) => (
              <td key={i} className="border p-2">
                {v}
              </td>
            ))}

          </tr>
        ))}

      </tbody>

    </table>
  )
}