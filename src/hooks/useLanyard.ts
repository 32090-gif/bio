import { useState, useEffect } from 'react'
import { LanyardData, LanyardResponse } from '../types/lanyard'

export function useLanyard(userId: string | undefined) {
  const [data, setData] = useState<LanyardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/presence/${userId}`)
        const json: LanyardResponse = await response.json()
        if (json.success) {
          setData(json.data)
        }
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Lanyard data'))
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [userId])

  return { data, loading, error }
}
