import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [activeTermRows]: any = await db.query(`
      SELECT
        t.term_id,
        t.term_name,
        ay.year_id,
        ay.year_name
      FROM term t
      JOIN academic_year ay ON ay.year_id = t.year_id
      WHERE t.is_current = 1
      LIMIT 1
    `)

    const activeTerm = activeTermRows?.[0]

    if (!activeTerm) {
      return NextResponse.json(
        {
          error: "No active term found. Set one term with is_current = 1.",
          totalStudents: 0,
          totalPaid: 0,
          unpaidStudents: 0,
          totalUnpaidBalance: 0,
          totalCredit: 0,
          totalPenalties: 0,
          classDebts: [],
          termSummaries: [],
        },
        { status: 400 }
      )
    }

    const termId = Number(activeTerm.term_id)
    const yearId = Number(activeTerm.year_id)

    const [studentsRows]: any = await db.query(`
      SELECT COUNT(*) AS totalStudents
      FROM student
      WHERE status = 'active'
    `)

    const [statusRows]: any = await db.query(
      `
      SELECT
        s.student_id,
        CONCAT(c.class_name, COALESCE(CONCAT(' ', c.section), '')) AS class_name,
        fs.total_fee,
        COALESCE(SUM(p.amount_paid), 0) AS total_paid,
        fs.total_fee - COALESCE(SUM(p.amount_paid), 0) AS balance
      FROM student s
      JOIN class c
        ON c.class_id = s.class_id
      JOIN fee_structure fs
        ON fs.class_id = s.class_id
       AND fs.term_id = ?
       AND fs.category_id = s.category_id
       AND fs.admission_type = s.admission_type
      LEFT JOIN payment p
        ON p.student_id = s.student_id
       AND p.fee_id = fs.fee_id
      WHERE s.status = 'active'
      GROUP BY
        s.student_id,
        c.class_name,
        c.section,
        fs.fee_id,
        fs.total_fee
      `,
      [termId]
    )

    const totalPaid = statusRows.reduce((sum: number, row: any) => {
      return sum + Number(row.total_paid || 0)
    }, 0)

    const totalUnpaidStudents = statusRows.filter(
      (row: any) => Number(row.balance) > 0
    ).length

    const totalUnpaidBalance = statusRows.reduce((sum: number, row: any) => {
      const balance = Number(row.balance || 0)
      return balance > 0 ? sum + balance : sum
    }, 0)

    const totalCredit = statusRows.reduce((sum: number, row: any) => {
      const balance = Number(row.balance || 0)
      return balance < 0 ? sum + Math.abs(balance) : sum
    }, 0)

    const [penaltyRows]: any = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalPenalties
      FROM student_penalty
      WHERE status = 'unpaid'
    `)

    const classDebtMap = new Map<
      string,
      { class_name: string; unpaidStudents: number; unpaidBalance: number }
    >()

    for (const row of statusRows) {
      const className = row.class_name
      const balance = Number(row.balance || 0)

      if (!classDebtMap.has(className)) {
        classDebtMap.set(className, {
          class_name: className,
          unpaidStudents: 0,
          unpaidBalance: 0,
        })
      }

      if (balance > 0) {
        const current = classDebtMap.get(className)!
        current.unpaidStudents += 1
        current.unpaidBalance += balance
      }
    }

    const classDebts = Array.from(classDebtMap.values())
      .filter((item) => item.unpaidStudents > 0 || item.unpaidBalance > 0)
      .sort((a, b) => {
        if (b.unpaidBalance !== a.unpaidBalance) {
          return b.unpaidBalance - a.unpaidBalance
        }
        return a.class_name.localeCompare(b.class_name)
      })

    const [termSummaryRows]: any = await db.query(
      `
      SELECT
        ay.year_name,
        ay.year_id,
        t.term_name,
        t.term_id
      FROM term t
      JOIN academic_year ay ON ay.year_id = t.year_id
      WHERE ay.year_id = ?
      ORDER BY t.term_id ASC
      `,
      [yearId]
    )

    const termSummaries = []

    for (const term of termSummaryRows) {
      const [rows]: any = await db.query(
        `
        SELECT
          s.student_id,
          fs.total_fee,
          COALESCE(SUM(p.amount_paid), 0) AS total_paid
        FROM student s
        JOIN fee_structure fs
          ON fs.class_id = s.class_id
         AND fs.term_id = ?
         AND fs.category_id = s.category_id
         AND fs.admission_type = s.admission_type
        LEFT JOIN payment p
          ON p.student_id = s.student_id
         AND p.fee_id = fs.fee_id
        WHERE s.status = 'active'
        GROUP BY s.student_id, fs.fee_id, fs.total_fee
        `,
        [term.term_id]
      )

      let expectedFees = 0
      let collectedFees = 0
      let unpaidBalance = 0
      let unpaidStudents = 0

      for (const row of rows) {
        const totalFee = Number(row.total_fee || 0)
        const totalPaid = Number(row.total_paid || 0)
        const balance = totalFee - totalPaid

        expectedFees += totalFee
        collectedFees += totalPaid

        if (balance > 0) {
          unpaidBalance += balance
          unpaidStudents += 1
        }
      }

      const hasRealData =
        expectedFees > 0 ||
        collectedFees > 0 ||
        unpaidBalance > 0 ||
        unpaidStudents > 0

      if (hasRealData) {
        termSummaries.push({
          year_name: term.year_name,
          term_name: term.term_name,
          unpaidStudents,
          expectedFees,
          collectedFees,
          unpaidBalance,
        })
      }
    }

    return NextResponse.json({
      currentTerm: {
        term_id: activeTerm.term_id,
        term_name: activeTerm.term_name,
        year_id: activeTerm.year_id,
        year_name: activeTerm.year_name,
      },
      totalStudents: Number(studentsRows[0]?.totalStudents || 0),
      totalPaid,
      unpaidStudents: totalUnpaidStudents,
      totalUnpaidBalance,
      totalCredit,
      totalPenalties: Number(penaltyRows[0]?.totalPenalties || 0),
      classDebts,
      termSummaries,
    })
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error)

    return NextResponse.json(
      {
        totalStudents: 0,
        totalPaid: 0,
        unpaidStudents: 0,
        totalUnpaidBalance: 0,
        totalCredit: 0,
        totalPenalties: 0,
        classDebts: [],
        termSummaries: [],
      },
      { status: 500 }
    )
  }
}