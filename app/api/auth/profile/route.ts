import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

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

    const first_name = body.first_name?.trim()
    const last_name = body.last_name?.trim()
    const username = body.username?.trim()

    if (!first_name || !last_name || !username) {
      return NextResponse.json(
        { error: "First name, last name and username are required" },
        { status: 400 }
      )
    }

    const [existingUsers]: any = await db.query(
      `
      SELECT admin_id
      FROM admin
      WHERE username = ? AND admin_id != ?
      LIMIT 1
      `,
      [username, adminId]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      )
    }

    await db.query(
      `
      UPDATE admin
      SET username = ?, first_name = ?, last_name = ?
      WHERE admin_id = ?
      `,
      [username, first_name, last_name, adminId]
    )

    const [rows]: any = await db.query(
      `
      SELECT admin_id, username, first_name, last_name, role
      FROM admin
      WHERE admin_id = ?
      LIMIT 1
      `,
      [adminId]
    )

    return NextResponse.json({
      message: "Profile updated successfully",
      user: rows[0],
    })
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}