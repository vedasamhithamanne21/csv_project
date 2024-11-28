'use client'

import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface DataVisualizationProps {
  data: string[][]
  columns: string[]
}

export default function DataVisualization({ data, columns }: DataVisualizationProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const numericColumns = columns.filter((_, index) => 
      data.every(row => !isNaN(parseFloat(row[index])))
    )

    if (numericColumns.length > 0) {
      const selectedColumn = numericColumns[0]
      const columnIndex = columns.indexOf(selectedColumn)

      const labels = data.map(row => row[0]) // Assuming first column is always a label
      const values = data.map(row => parseFloat(row[columnIndex]))

      setChartData({
        labels,
        datasets: [
          {
            label: selectedColumn,
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      })
    }
  }, [data, columns])

  if (!chartData) {
    return <p>No numeric data available for visualization.</p>
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">Data Visualization</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Data Visualization',
            },
          },
        }}
      />
    </div>
  )
}

