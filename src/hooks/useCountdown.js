import { useCallback, useEffect, useRef, useState } from 'react'

export default function useCountdown(onExpire) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback((seconds, stepMs = 100) => {
    stop()
    setDuration(seconds)
    setTimeLeft(seconds)
    const step = stepMs / 1000
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - step
        if (next <= 0) {
          stop()
          onExpireRef.current?.()
          return 0
        }
        return next
      })
    }, stepMs)
  }, [stop])

  useEffect(() => stop, [stop])

  return { timeLeft, duration, start, stop }
}
