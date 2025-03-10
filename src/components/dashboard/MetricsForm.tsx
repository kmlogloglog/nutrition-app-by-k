import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const metricsSchema = z.object({
  weight: z.number().min(30).max(300),
  bodyFat: z.number().min(3).max(50).optional(),
  waist: z.number().min(50).max(200).optional(),
  chest: z.number().min(50).max(200).optional(),
  arms: z.number().min(20).max(100).optional(),
  thighs: z.number().min(30).max(100).optional(),
  notes: z.string().max(500).optional(),
})

type MetricsInputs = z.infer<typeof metricsSchema>

interface MetricsFormProps {
  onSubmit: (data: MetricsInputs) => Promise<void>
}

export const MetricsForm = ({ onSubmit }: MetricsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetricsInputs>({
    resolver: zodResolver(metricsSchema),
  })

  const handleFormSubmit = async (data: MetricsInputs) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Error submitting metrics:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg) *</label>
          <input
            type="number"
            step="0.1"
            {...register('weight', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body Fat %</label>
          <input
            type="number"
            step="0.1"
            {...register('bodyFat', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.bodyFat && (
            <p className="text-red-500 text-sm">{errors.bodyFat.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Waist (cm)</label>
          <input
            type="number"
            step="0.1"
            {...register('waist', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Chest (cm)</label>
          <input
            type="number"
            step="0.1"
            {...register('chest', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Arms (cm)</label>
          <input
            type="number"
            step="0.1"
            {...register('arms', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thighs (cm)</label>
          <input
            type="number"
            step="0.1"
            {...register('thighs', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          {...register('notes')}
          className="w-full p-2 border rounded h-24"
          placeholder="Add any notes about your progress..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Metrics'}
      </button>
    </form>
  )
}