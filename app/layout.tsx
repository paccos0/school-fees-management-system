import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SFMS",
  description: "School Fees Management System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-screen text-white bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="page-overlay min-h-screen">{children}</div>
      </body>
    </html>
  )
}