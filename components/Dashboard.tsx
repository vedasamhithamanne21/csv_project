'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DashboardData {
  totalFiles: number
  totalRows: number
  recentUploads: Array<{
    id: number
    filename: string
    uploadDate: string
  }>
  processingEvents: Array<{
    id: number
    filename: string
    status: string
    progress: number
  }>
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!dashboardData) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalFiles}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalRows}</div>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {dashboardData.recentUploads.map((upload) => (
              <div key={upload.id} className="mb-2">
                <p className="text-sm font-medium">{upload.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(upload.uploadDate).toLocaleString()}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Processing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {dashboardData.processingEvents.map((event) => (
              <div key={event.id} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{event.filename}</span>
                  <span className="text-sm text-muted-foreground">{event.status}</span>
                </div>
                <Progress value={event.progress} className="w-full" />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

