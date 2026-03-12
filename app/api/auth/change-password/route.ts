import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(req: NextRequest) {
  try {
    const session = req.cookies.get("sfms_session")

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminId = Number(session.value)

    if (!adminId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await req.json()
    const current_password = body.current_password
    const new_password = body.new_password

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const [rows]: any = await db.query(
      `
      SELECT admin_id, password
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

    const passwordMatch = await bcrypt.compare(current_password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)

    await db.query(
      `
      UPDATE admin
      SET password = ?
      WHERE admin_id = ?
      `,
      [hashedPassword, adminId]
    )

    return NextResponse.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}