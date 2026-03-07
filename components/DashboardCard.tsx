"use client"

interface DashboardCardProps {
  title: string
  value: number | string
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center justify-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value ?? 0}</p>
    </div>
  )
}