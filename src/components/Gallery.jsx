import { useReducer, useEffect, useState, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos.js'
import { favouritesReducer, loadFavourites, STORAGE_KEY } from '../favouritesReducer.js'
import PhotoCard from './PhotoCard.jsx'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [query, setQuery] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  // Persist favourites whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])

  // useCallback: keeps the same function identity across renders.
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', id })
  }, [])

  // useMemo: only re-filters when photos or query change, not on every render
  // (for example, not when a heart is toggled).
  const filteredPhotos = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return photos
    return photos.filter((p) => p.author.toLowerCase().includes(q))
  }, [photos, query])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Photo Gallery</h1>

      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder="Search by author name"
        aria-label="Search photos by author name"
        className="mb-8 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:max-w-sm"
      />

      {loading && (
        <div className="flex justify-center py-20" role="status" aria-label="Loading photos">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Could not load photos: {error}. Check your connection and refresh the page.
        </p>
      )}

      {!loading && !error && filteredPhotos.length === 0 && (
        <p className="py-12 text-center text-slate-500">No photos match that author name.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </main>
  )
}
