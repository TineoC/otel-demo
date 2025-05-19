import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './o11y/main'

function App() {
  const [phrase, setPhrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPhrase()
  }, [])

  // fetch a phrase on component mount (and whenever you want to refresh)
  const fetchPhrase = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://api.quotable.io/random')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPhrase(data.content)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to KCD New York 2025</h1>
      
      <div className="phrase">
        {loading && <p>Loading phrase…</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && phrase && (
          <blockquote style={{ fontStyle: 'italic' }}>
            “{phrase}”
          </blockquote>
        )}
        <button onClick={fetchPhrase} disabled={loading}>
          {loading ? 'Refreshing…' : 'New phrase'}
        </button>
      </div>
    </>
  )
}

export default App
