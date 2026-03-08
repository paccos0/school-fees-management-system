import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("sfms_session")

    if (!session?.value) return null

    const [rows]: any = await db.query(
      `
      SELECT admin_id, username, first_name, last_name, role
      FROM admin
      WHERE admin_id = ?
      LIMIT 1
      `,
      [session.value]
    )

    return rows[0] || null
  } catch (error) {
    console.error("LAYOUT USER ERROR:", error)
    return null
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : ""

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar
            title="SFMS Dashboard"
            userName={fullName}
            role={user?.role}
          />

          <main className="p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}