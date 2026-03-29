export default function Header({ lang, onLangChange, t }) {
  return (
    <header className="w-full border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✂️</span>
        <span className="font-bold text-gray-800 text-lg">{t.navLogo}</span>
      </div>
      <button
        onClick={() => onLangChange(lang === 'en' ? 'zh' : 'en')}
        className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg transition"
      >
        {lang === 'en' ? '中文' : 'English'}
      </button>
    </header>
  )
}
