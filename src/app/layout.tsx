import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/ui/Navigation"
import { SessionProvider } from "@/components/SessionProvider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NutriFit - Nutrition & Fitness App",
  description: "Calculate your macros and get personalized nutrition plans",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navigation />
          <main className="min-h-screen bg-gray-50 pt-16">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
