"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const calculatorSchema = z.object({
  age: z.number().min(15).max(100),
  gender: z.enum(['male', 'female']),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain'])
})

type CalculatorInputs = z.infer<typeof calculatorSchema>

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
}

const goalMultipliers = {
  lose: 0.8,
  maintain: 1,
  gain: 1.2
}

export const MacroCalculator = () => {
  const [results, setResults] = useState<{
    calories: number
    protein: number
    carbs: number
    fats: number
  } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CalculatorInputs>({
    resolver: zodResolver(calculatorSchema)
  })

  const calculateMacros = (data: CalculatorInputs) => {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[data.activityLevel]
    
    // Adjust calories based on goal
    const calories = Math.round(tdee * goalMultipliers[data.goal])

    // Calculate macros
    const protein = Math.round(data.weight * 2.2) // 2.2g per kg of body weight
    const fats = Math.round((calories * 0.25) / 9) // 25% of calories from fat
    const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4) // Remaining calories from carbs

    setResults({ calories, protein, carbs, fats })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Macro Calculator</h2>
      
      <form onSubmit={handleSubmit(calculateMacros)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select {...register('gender')} className="w-full p-2 border rounded">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              {...register('weight', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              {...register('height', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <select {...register('activityLevel')} className="w-full p-2 border rounded">
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <select {...register('goal')} className="w-full p-2 border rounded">
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </form>

      {results && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Daily Macros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-600">Calories</p>
              <p className="text-2xl font-bold">{results.calories}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Protein</p>
              <p className="text-2xl font-bold">{results.protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Carbs</p>
              <p className="text-2xl font-bold">{results.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Fats</p>
              <p className="text-2xl font-bold">{results.fats}g</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}