import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const [rows]: any = await db.query("SELECT * FROM admin WHERE username = ?", [username])
  const user = rows[0]

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: "Invalid password" }, { status: 401 })

  // Use NextResponse cookies instead of token
  const res = NextResponse.json({ role: user.role, first_name: user.first_name })
  res.cookies.set({
    name: "sfms_session",
    value: String(user.admin_id),
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  })
  return res
}