import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const questionnaireSchema = z.object({
  currentDiet: z.string().min(10).max(1000),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  sleepHours: z.number().min(3).max(12),
  stressLevel: z.enum(['low', 'moderate', 'high']),
  physicalActivityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  workoutFrequency: z.number().min(0).max(7),
  workoutType: z.array(z.string()).optional(),
  goals: z.array(z.string()).min(1),
  timeframe: z.string(),
  additionalInfo: z.string().max(1000).optional(),
})

type QuestionnaireInputs = z.infer<typeof questionnaireSchema>

interface NutritionQuestionnaireProps {
  onSubmit: (data: QuestionnaireInputs) => Promise<void>
}

export const NutritionQuestionnaire = ({ onSubmit }: NutritionQuestionnaireProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionnaireInputs>({
    resolver: zodResolver(questionnaireSchema),
  })

  const handleFormSubmit = async (data: QuestionnaireInputs) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Describe your current diet *
        </label>
        <textarea
          {...register('currentDiet')}
          className="w-full p-2 border rounded h-32"
          placeholder="Please describe what you typically eat in a day..."
        />
        {errors.currentDiet && (
          <p className="text-red-500 text-sm">{errors.currentDiet.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Do you have any dietary restrictions?
        </label>
        <div className="space-y-2">
          {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Kosher', 'Halal'].map(
            (restriction) => (
              <label key={restriction} className="flex items-center">
                <input
                  type="checkbox"
                  value={restriction}
                  {...register('dietaryRestrictions')}
                  className="mr-2"
                />
                {restriction}
              </label>
            )
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Allergies</label>
        <input
          type="text"
          {...register('allergies')}
          className="w-full p-2 border rounded"
          placeholder="List any food allergies..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Medical Conditions</label>
        <input
          type="text"
          {...register('medicalConditions')}
          className="w-full p-2 border rounded"
          placeholder="List any relevant medical conditions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Average Sleep Hours *
        </label>
        <input
          type="number"
          {...register('sleepHours', { valueAsNumber: true })}
          className="w-full p-2 border rounded"
          min="3"
          max="12"
        />
        {errors.sleepHours && (
          <p className="text-red-500 text-sm">{errors.sleepHours.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stress Level *</label>
        <select {...register('stressLevel')} className="w-full p-2 border rounded">
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Physical Activity Level *
        </label>
        <select
          {...register('physicalActivityLevel')}
          className="w-full p-2 border rounded"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Workout Frequency (days per week) *
        </label>
        <input
          type="number"
          {...register('workoutFrequency', { valueAsNumber: true })}
          className="w-full p-2 border rounded"
          min="0"
          max="7"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Workout Types</label>
        <div className="space-y-2">
          {[
            'Weight Training',
            'Cardio',
            'HIIT',
            'Yoga',
            'Sports',
            'Other',
          ].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                value={type}
                {...register('workoutType')}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Goals *</label>
        <div className="space-y-2">
          {[
            'Weight Loss',
            'Muscle Gain',
            'Maintenance',
            'Better Energy',
            'Sports Performance',
            'General Health',
          ].map((goal) => (
            <label key={goal} className="flex items-center">
              <input
                type="checkbox"
                value={goal}
                {...register('goals')}
                className="mr-2"
              />
              {goal}
            </label>
          ))}
        </div>
        {errors.goals && (
          <p className="text-red-500 text-sm">{errors.goals.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Desired Timeframe *
        </label>
        <select {...register('timeframe')} className="w-full p-2 border rounded">
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="over 12 months">Over 12 months</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Additional Information</label>
        <textarea
          {...register('additionalInfo')}
          className="w-full p-2 border rounded h-32"
          placeholder="Any other information you'd like to share..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
      </button>
    </form>
  )
}