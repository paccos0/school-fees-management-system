import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

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
        <Toaster richColors position="top-right" duration={1000} />
      </body>
    </html>
  )
}