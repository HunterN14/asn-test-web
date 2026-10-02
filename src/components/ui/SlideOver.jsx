import { X } from 'lucide-react'

export default function SlideOver({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Tutup panel"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-canvas focus-ring">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
