"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { NutritionistDashboard } from "@/components/admin/NutritionistDashboard"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "NUTRITIONIST" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
  }

  if (session?.user?.role !== "NUTRITIONIST" && session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Nutritionist Dashboard</h1>
      <NutritionistDashboard />
    </div>
  )
}