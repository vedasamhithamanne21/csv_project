import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { parse } from 'csv-parse/sync'
import { readFile } from 'fs/promises'
import path from 'path'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM files WHERE id = $1', [id])
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }

      const file = result.rows[0]
      const filePath = path.join(process.cwd(), 'uploads', file.filename)
      const fileContent = await readFile(filePath, 'utf-8')
      const records = parse(fileContent, { columns: true })

      return NextResponse.json({ metadata: file, contents: records })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching file:', error)
    return NextResponse.json({ error: 'Error fetching file' }, { status: 500 })
  }
}

