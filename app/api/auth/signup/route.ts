import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { username, password, role, first_name, last_name, gender, dob, address } =
    await req.json()

  if (!username || !password || !first_name || !last_name) {
    return NextResponse.json(
      { error: "Username, password, first name and last name required" },
      { status: 400 }
    )
  }

  const hashed = await bcrypt.hash(password, 10)
  const created_at = new Date()

  try {
    const [result]: any = await db.query(
      `INSERT INTO admin 
       (username, password, role, created_at, first_name, last_name, gender, dob, address) 
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [username, hashed, role, created_at, first_name, last_name, gender, dob, address]
    )

    return NextResponse.json({ success: true, admin_id: result.insertId })
  } catch (err: any) {
    return NextResponse.json(
      { error: "Username might already exist or invalid data" },
      { status: 400 }
    )
  }
}