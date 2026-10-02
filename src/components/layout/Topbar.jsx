import { Menu } from 'lucide-react'

export default function Topbar({ title, subtitle, onMenuClick, actions }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-canvas lg:hidden focus-ring"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-text">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
