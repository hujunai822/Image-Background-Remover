export default function ResultView({ imageUrl }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div
        className="rounded-xl overflow-hidden border border-gray-200 shadow"
        style={{
          background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 20px 20px',
        }}
      >
        <img src={imageUrl} alt="Result" className="max-w-sm max-h-80 object-contain" />
      </div>
      <a
        href={imageUrl}
        download="background-removed.png"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
      >
        Download PNG
      </a>
    </div>
  )
}
