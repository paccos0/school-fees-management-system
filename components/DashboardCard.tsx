interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
}

export default function DashboardCard({
  title,
  value,
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold text-gray-900">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-gray-400">{subtitle}</p>}
    </div>
  )
}