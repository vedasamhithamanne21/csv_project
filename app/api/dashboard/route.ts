import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const totalFilesResult = await client.query('SELECT COUNT(*) FROM files')
      const totalRowsResult = await client.query('SELECT SUM(row_count) FROM files')
      const recentUploadsResult = await client.query(
        'SELECT id, filename, upload_date FROM files ORDER BY upload_date DESC LIMIT 5'
      )

      // Simulated processing events (in a real application, this would come from a separate table or queue)
      const processingEvents = [
        { id: 1, filename: 'data1.csv', status: 'Processing', progress: 75 },
        { id: 2, filename: 'data2.csv', status: 'Queued', progress: 0 },
        { id: 3, filename: 'data3.csv', status: 'Completed', progress: 100 },
      ]

      const dashboardData = {
        totalFiles: parseInt(totalFilesResult.rows[0].count),
        totalRows: parseInt(totalRowsResult.rows[0].sum) || 0,
        recentUploads: recentUploadsResult.rows,
        processingEvents,
      }

      return NextResponse.json(dashboardData)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 })
  }
}

