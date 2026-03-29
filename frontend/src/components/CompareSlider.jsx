import { useState, useRef, useCallback } from 'react'

export default function CompareSlider({ originalUrl, resultUrl }) {
  const [sliderPos, setSliderPos] = useState(50) // percentage
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const updateSlider = useCallback((clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }, [])

  const onMouseDown = (e) => {
    dragging.current = true
    updateSlider(e.clientX)
  }

  const onMouseMove = (e) => {
    if (dragging.current) updateSlider(e.clientX)
  }

  const onMouseUp = () => {
    dragging.current = false
  }

  const onTouchMove = (e) => {
    updateSlider(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl cursor-col-resize select-none"
      style={{ aspectRatio: '4/3' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* Result image (right side, checkerboard background) */}
      <div className="absolute inset-0 checkerboard">
        <img
          src={resultUrl}
          alt="Background removed"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Original image (left side, clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: containerRef.current?.clientWidth || '100%' }}
        />
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={(e) => updateSlider(e.touches[0].clientX)}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        Original
      </div>
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        Removed
      </div>
    </div>
  )
}
