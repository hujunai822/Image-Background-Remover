import { useRef } from 'react'
import axios from 'axios'

const WORKER_URL = import.meta.env.VITE_WORKER_URL || '/api'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 12 * 1024 * 1024

export default function Uploader({ t, loading, onOriginal, onResult, onLoading, onError }) {
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return

    onError(null)
    onResult(null)
    onOriginal(null)

    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError(t.errorFormat)
      return
    }
    if (file.size > MAX_SIZE) {
      onError(t.errorSize)
      return
    }

    // Set original preview
    onOriginal(URL.createObjectURL(file))
    onLoading(true)

    const formData = new FormData()
    formData.append('image_file', file)

    try {
      const res = await axios.post(`${WORKER_URL}/remove-bg`, formData, {
        responseType: 'blob',
        timeout: 30000,
      })
      onResult(URL.createObjectURL(res.data))
    } catch (err) {
      const detail = err.response?.data?.error
      onError(detail || t.errorApi)
      onOriginal(null)
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
      className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
        ${loading
          ? 'border-blue-300 bg-blue-50 cursor-wait'
          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
      onClick={() => !loading && inputRef.current.click()}
      onDrop={!loading ? handleDrop : undefined}
      onDragOver={(e) => e.preventDefault()}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-500 font-medium">{t.processing}</p>
        </div>
      ) : (
        <>
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-gray-600 font-medium text-lg">{t.uploadPrompt}</p>
          <p className="text-gray-400 text-sm mt-2">{t.uploadHint}</p>
        </>
      )}
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
