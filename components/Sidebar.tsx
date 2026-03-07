"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">SFMS</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link href="/students" className="hover:bg-gray-700 p-2 rounded">
          Students
        </Link>
        <Link href="/payments" className="hover:bg-gray-700 p-2 rounded">
          Payments
        </Link>
        <Link href="/fees" className="hover:bg-gray-700 p-2 rounded">
          Fees
        </Link>
        <Link href="/penalties" className="hover:bg-gray-700 p-2 rounded">
          Penalties
        </Link>
      </nav>
    </div>
  )
}