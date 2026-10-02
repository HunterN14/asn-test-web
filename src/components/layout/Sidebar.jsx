import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ListChecks, Target, ArrowUpDown, History,
  BookOpen, FlaskConical, Settings, X, ShieldCheck,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    title: 'Utama',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Konten',
    items: [
      { to: '/soal', label: 'Bank Soal', icon: ListChecks },
      { to: '/passing-grade', label: 'Passing Grade', icon: Target },
      { to: '/impor-ekspor', label: 'Impor / Ekspor', icon: ArrowUpDown },
    ],
  },
  {
    title: 'Sesi',
    items: [
      { to: '/latihan', label: 'Latihan', icon: BookOpen },
      { to: '/ujian', label: 'Ujian Penuh', icon: FlaskConical },
      { to: '/riwayat', label: 'Riwayat', icon: History },
    ],
  },
  {
    title: 'Lainnya',
    items: [{ to: '/pengaturan', label: 'Pengaturan', icon: Settings }],
  },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white transition-transform lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">ASN Prep</p>
              <p className="text-xs text-white/40 leading-tight">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-white/65 hover:bg-ink-soft hover:text-white'
                      }`
                    }
                  >
                    <Icon size={17} strokeWidth={2} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-ink-line px-5 py-4 text-xs text-white/35">
          Data tersimpan lokal di perangkat ini.
        </div>
      </aside>
    </>
  )
}
