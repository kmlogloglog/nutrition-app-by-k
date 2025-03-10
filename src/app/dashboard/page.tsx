"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { MetricsForm } from "@/components/dashboard/MetricsForm"
import { NutritionQuestionnaire } from "@/components/forms/NutritionQuestionnaire"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [metrics, setMetrics] = useState([])
  const [nutritionPlans, setNutritionPlans] = useState([])
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchMetrics()
      fetchNutritionPlans()
      fetchSubscription()
    }
  }, [status])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNutritionPlans = async () => {
    try {
      const response = await fetch("/api/nutrition-plans")
      if (response.ok) {
        const data = await response.json()
        setNutritionPlans(data)
      }
    } catch (error) {
      console.error("Error fetching nutrition plans:", error)
    }
  }

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error)
    }
  }

  const handleMetricsSubmit = async (data) => {
    try {
      const response = await fetch("/api/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchMetrics()
      }
    } catch (error) {
      console.error("Error submitting metrics:", error)
    }
  }

  const handleQuestionnaireSubmit = async (data) => {
    try {
      const response = await fetch("/api/nutrition-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionnaire: data }),
      })

      if (response.ok) {
        setShowQuestionnaire(false)
        fetchNutritionPlans()
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error)
    }
  }

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            {metrics.length > 0 ? (
              <ProgressChart data={metrics} />
            ) : (
              <p className="text-gray-500">
                No progress data yet. Start tracking your metrics!
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Nutrition Plans</h2>
            {nutritionPlans.length > 0 ? (
              <div className="space-y-4">
                {nutritionPlans.map((plan) => (
                  <div key={plan.id} className="border p-4 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Plan created on {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {plan.status}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/plan/${plan.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View Plan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You don't have any nutrition plans yet.
                </p>
                {subscription?.status === "active" ? (
                  <button
                    onClick={() => setShowQuestionnaire(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Request Nutrition Plan
                  </button>
                ) : (
                  <Link
                    href="/pricing"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Subscribe to Get a Plan
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Add Metrics */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Metrics</h2>
            <MetricsForm onSubmit={handleMetricsSubmit} />
          </div>

          {subscription?.status === "active" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Nutrition Plan</h2>
              {!showQuestionnaire ? (
                <button
                  onClick={() => setShowQuestionnaire(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Request New Plan
                </button>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Complete the Questionnaire
                  </h3>
                  <NutritionQuestionnaire onSubmit={handleQuestionnaireSubmit} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}