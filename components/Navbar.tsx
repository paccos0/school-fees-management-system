"use client"

interface NavbarProps {
  title: string
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <div>
        <button className="bg-white text-blue-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  )
}