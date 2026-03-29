import { useRef } from 'react'
import axios from 'axios'

export default function Uploader({ onResult, onLoading, onError }) {
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    onError(null)
    onResult(null)
    onLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('/api/remove-bg', formData, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(res.data)
      onResult(url)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Please try again.'
      onError(msg)
    } finally {
      onLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 transition"
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-gray-400 text-sm">Drag & drop or click to upload</p>
      <p className="text-gray-300 text-xs mt-1">JPG, PNG, WebP — max 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
