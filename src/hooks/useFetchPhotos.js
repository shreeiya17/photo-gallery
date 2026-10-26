import { useState, useEffect } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

// Fetches photos once on mount and returns { photos, loading, error }.
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Guards against setting state after the component has unmounted.
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        const data = await res.json()
        setPhotos(data)
        setError(null)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Something went wrong')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchPhotos()
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
