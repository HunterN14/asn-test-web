const TONES = {
  neutral: 'bg-line/60 text-muted',
  primary: 'bg-primary-soft text-primary-dark',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  accent: 'bg-accent-soft text-accent',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}
