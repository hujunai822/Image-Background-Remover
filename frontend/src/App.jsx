import { useState } from 'react'
import Uploader from './components/Uploader'
import ResultView from './components/ResultView'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Background Remover</h1>
      <p className="text-gray-500 mb-8">Upload an image and we'll remove the background instantly.</p>

      <Uploader
        onResult={setResult}
        onLoading={setLoading}
        onError={setError}
      />

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      {loading && (
        <p className="mt-6 text-blue-500 animate-pulse">Processing image...</p>
      )}

      {result && !loading && (
        <ResultView imageUrl={result} />
      )}
    </div>
  )
}
