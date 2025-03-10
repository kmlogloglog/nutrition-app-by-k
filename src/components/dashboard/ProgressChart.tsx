import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ProgressChartProps {
  data: {
    date: string
    weight: number
    bodyFat?: number
  }[]
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: data.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Body Fat %',
        data: data.map(entry => entry.bodyFat),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        hidden: !data.some(entry => entry.bodyFat !== undefined),
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progress Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <Line options={options} data={chartData} />
    </div>
  )
}