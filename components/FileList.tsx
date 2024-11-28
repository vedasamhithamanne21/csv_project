'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DataVisualization from './DataVisualization'

interface FileMetadata {
  id: number
  filename: string
  uploadDate: string
  rowCount: number
  columns: string[]
}

export default function FileList() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [fileContents, setFileContents] = useState<string[][]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/files?search=${encodeURIComponent(searchTerm)}`)
        if (response.ok) {
          const data = await response.json()
          setFiles(data)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }

    fetchFiles()
    const interval = setInterval(fetchFiles, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [searchTerm])

  const handleViewFile = async (file: FileMetadata) => {
    try {
      const response = await fetch(`/api/files/${file.id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedFile(file)
        setFileContents(data.contents)
      }
    } catch (error) {
      console.error('Error fetching file contents:', error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Uploaded Files</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Row Count</TableHead>
            <TableHead>Columns</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.filename}</TableCell>
              <TableCell>{new Date(file.uploadDate).toLocaleString()}</TableCell>
              <TableCell>{file.rowCount}</TableCell>
              <TableCell>{file.columns.join(', ')}</TableCell>
              <TableCell>
                <Button onClick={() => handleViewFile(file)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedFile && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">
            File Contents: {selectedFile.filename}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                {selectedFile.columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileContents.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {fileContents.length > 10 && (
            <p className="mt-2 text-sm text-gray-500">
              Showing first 10 rows. Total rows: {fileContents.length}
            </p>
          )}
          <DataVisualization data={fileContents} columns={selectedFile.columns} />
        </div>
      )}
    </div>
  )
}

