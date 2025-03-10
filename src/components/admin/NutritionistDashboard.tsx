import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface NutritionPlan {
  id: string
  userId: string
  planDetails: any
  questionnaire: any
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export const NutritionistDashboard = () => {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<NutritionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null)
  const [generatedPlan, setGeneratedPlan] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAIPlan = async (questionnaire: any) => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionnaire }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const data = await response.json()
      setGeneratedPlan(data.plan)
    } catch (error) {
      console.error('Error generating plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updatePlanStatus = async (planId: string, status: string) => {
    try {
      const response = await fetch(`/api/nutrition-plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update plan status')
      }

      // Update plans list
      setPlans(plans.map(plan => 
        plan.id === planId ? { ...plan, status } : plan
      ))
    } catch (error) {
      console.error('Error updating plan status:', error)
    }
  }

  const submitPlan = async (planId: string, planDetails: any) => {
    try {
      const response = await fetch(`/api/nutrition-plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planDetails, status: 'COMPLETED' }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit plan')
      }

      // Update plans list
      setPlans(plans.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'COMPLETED', planDetails } 
          : plan
      ))
      setSelectedPlan(null)
    } catch (error) {
      console.error('Error submitting plan:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Plans List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Nutrition Plan Requests</h2>
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plan.user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    plan.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : plan.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : plan.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Plan Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Client Information</h3>
              <p>Name: {selectedPlan.user.name}</p>
              <p>Email: {selectedPlan.user.email}</p>
            </div>

            <div>
              <h3 className="font-semibold">Questionnaire Responses</h3>
              <pre className="bg-gray-50 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(selectedPlan.questionnaire, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold">Actions</h3>
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => updatePlanStatus(selectedPlan.id, 'IN_PROGRESS')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Start Working
                </button>
                <button
                  onClick={() => generateAIPlan(selectedPlan.questionnaire)}
                  disabled={isGenerating}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Plan'}
                </button>
              </div>
            </div>

            {generatedPlan && (
              <div>
                <h3 className="font-semibold">Generated Plan</h3>
                <textarea
                  value={generatedPlan}
                  onChange={(e) => setGeneratedPlan(e.target.value)}
                  className="w-full h-64 p-2 border rounded mt-2"
                />
                <button
                  onClick={() => submitPlan(selectedPlan.id, generatedPlan)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                >
                  Submit Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}