export default function Footer({ t }) {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} BGRemover · Powered by Remove.bg API</p>
    </footer>
  )
}
