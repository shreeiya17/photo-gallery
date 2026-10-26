# Photo Gallery

A small React app that fetches photos from the [Picsum Photos API](https://picsum.photos/), shows them in a responsive grid, lets you search by author name, and lets you mark favourites that persist across page refreshes.

Built with React, Vite and Tailwind CSS. No other UI libraries.

## Features

- Fetches 30 photos on load, with a loading spinner and an error message if the request fails
- Responsive grid: 4 columns on desktop, 2 on tablet, 1 on mobile
- Real-time search by author name, filtering the already-fetched data (no extra API calls)
- Favourite toggle on each card, managed with `useReducer` and saved to `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  hooks/useFetchPhotos.js     Custom hook: fetches photos, returns { photos, loading, error }
  favouritesReducer.js        Reducer for favourites + localStorage loader
  components/Gallery.jsx      Main component: search, grid, loading/error states
  components/PhotoCard.jsx    Single photo card with author and heart button
  App.jsx, main.jsx           App entry
```

## Implementation notes

- **`useFetchPhotos`** keeps the data-fetching logic out of the UI. It uses an `AbortController` to cancel the request if the component unmounts.
- **`useReducer`** manages the favourites list through a single `TOGGLE_FAVOURITE` action. A lazy initializer reads the saved list from `localStorage` on first render, and an effect saves it on every change.
- **`useMemo`** computes the filtered photo list, so it only recalculates when the photos or the search text change, not when a favourite is toggled.
- **`useCallback`** keeps the search and toggle handlers stable between renders.

## Tech stack

React 18, Vite, Tailwind CSS 4