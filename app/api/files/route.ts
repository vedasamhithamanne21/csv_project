import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''

  try {
    const client = await pool.connect()
    try {
      const query = `
        SELECT * FROM files
        WHERE filename ILIKE $1
        ORDER BY upload_date DESC
      `
      const result = await client.query(query, [`%${search}%`])
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Error fetching files' }, { status: 500 })
  }
}

