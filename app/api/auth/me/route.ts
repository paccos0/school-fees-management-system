import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("sfms_session")

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminId = Number(session.value)

    const [rows]: any = await db.query(
      `
      SELECT admin_id, username, first_name, last_name, role
      FROM admin
      WHERE admin_id = ?
      LIMIT 1
      `,
      [adminId]
    )

    const user = rows[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("AUTH ME ERROR:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}