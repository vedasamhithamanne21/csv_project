import Dashboard from '@/components/Dashboard'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Scientific Data Viewer</h1>
      <Dashboard />
      <div className="mt-8">
        <FileUpload />
        <SearchBar />
        <FileList />
      </div>
    </main>
  )
}

