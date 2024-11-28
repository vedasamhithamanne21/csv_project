import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { parse } from 'csv-parse/sync'
import { writeFile } from 'fs/promises'
import path from 'path'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name
  const uploadDate = new Date().toISOString()

  try {
    // Parse CSV
    const records = parse(buffer.toString(), { columns: true })
    const rowCount = records.length
    const columns = Object.keys(records[0])

    // Save file to disk
    const filePath = path.join(process.cwd(), 'uploads', filename)
    await writeFile(filePath, buffer)

    // Save metadata to database
    const client = await pool.connect()
    try {
      await client.query(
        'INSERT INTO files (filename, upload_date, row_count, columns) VALUES ($1, $2, $3, $4)',
        [filename, uploadDate, rowCount, columns]
      )
    } finally {
      client.release()
    }

    return NextResponse.json({ message: 'File uploaded successfully' })
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
  }
}

