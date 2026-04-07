import { useState } from 'react'
import Uploader from './components/Uploader'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const [lang, setLang] = useState('en')
  const [originalUrl, setOriginalUrl] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const t = translations[lang]

  const handleReset = () => {
    setOriginalUrl(null)
    setResultUrl(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header lang={lang} onLangChange={setLang} t={t} />

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-500">{t.heroSubtitle}</p>
        </div>

        {/* Upload / Result Area */}
        {!resultUrl && (
          <Uploader
            lang={lang}
            t={t}
            loading={loading}
            onOriginal={setOriginalUrl}
            onResult={setResultUrl}
            onLoading={setLoading}
            onError={setError}
          />
        )}

        {error && (
          <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-600 font-medium"
            >
              {t.retry}
            </button>
          </div>
        )}

        {resultUrl && originalUrl && (
  <div className="w-full max-w-4xl mt-4 flex flex-col items-center gap-6">
    <div className="w-full grid grid-cols-2 gap-4">
      {/* 原图 */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-gray-500">原图</span>
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow">
          <img src={originalUrl} alt="Original" className="w-full h-auto object-contain" />
        </div>
      </div>
      {/* 去背景图 */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-gray-500">去背景</span>
        <div
          className="w-full rounded-xl overflow-hidden border border-gray-200 shadow"
          style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0 / 16px 16px' }}
        >
          <img src={resultUrl} alt="Background removed" className="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
    <div className="flex gap-4">
              <a
                href={resultUrl}
                download="background-removed.png"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg"
              >
                ⬇️ {t.download}
              </a>
              <button
                onClick={handleReset}
                className="px-8 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                🔄 {t.uploadAnother}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer t={t} />
    </div>
  )
}

const translations = {
  en: {
    heroTitle: 'Remove Image Background\nInstantly with AI',
    heroSubtitle: 'Upload an image and get a clean transparent PNG in seconds. Free, no signup required.',
    uploadPrompt: 'Drag & drop or click to upload',
    uploadHint: 'Supports JPG, PNG, WEBP · Max 12MB',
    processing: 'Removing background…',
    download: 'Download PNG',
    uploadAnother: 'Upload Another',
    retry: 'Retry',
    errorFormat: 'Please upload a JPG, PNG or WEBP image.',
    errorSize: 'File too large. Maximum size is 12MB.',
    errorApi: 'Processing failed. Please try again.',
    navLogo: 'BGRemover',
  },
  zh: {
    heroTitle: 'AI 一键去除图片背景',
    heroSubtitle: '上传图片，秒级生成透明 PNG。免费，无需注册。',
    uploadPrompt: '拖拽或点击上传图片',
    uploadHint: '支持 JPG、PNG、WEBP · 最大 12MB',
    processing: '正在处理中…',
    download: '下载 PNG',
    uploadAnother: '重新上传',
    retry: '重试',
    errorFormat: '请上传 JPG、PNG 或 WEBP 格式的图片。',
    errorSize: '文件过大，最大支持 12MB。',
    errorApi: '处理失败，请稍后重试。',
    navLogo: 'AI 抠图',
  },
}
