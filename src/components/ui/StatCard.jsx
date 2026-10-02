export default function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }) {
  const toneMap = {
    primary: 'bg-primary-soft text-primary-dark',
    accent: 'bg-accent-soft text-accent',
    success: 'bg-success-soft text-success',
  }
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-soft">{hint}</p>}
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneMap[tone]}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}
