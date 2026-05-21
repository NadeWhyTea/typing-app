import { useState, useEffect } from 'react'
import { TypingTest } from './components/TypingTest'

const BACKGROUNDS = {
  space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  flower: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
  ocean: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
  autumn: 'https://images.unsplash.com/photo-1507371341162-763b5e419408?w=1920&q=80',
  handwritten: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1920&q=80',
}

function App() {
  // Read theme from localStorage to match TypingTest's initial theme
  const savedPrefs = JSON.parse(localStorage.getItem('typing-test-prefs') || '{}')
  const [theme, setTheme] = useState(savedPrefs.theme || 'space')

  useEffect(() => {
    // Check initial theme
    const initialTheme = document.documentElement.getAttribute('data-theme')
    if (initialTheme) setTheme(initialTheme)
    
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'space'
      setTheme(currentTheme)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const bgImage = BACKGROUNDS[theme]

  return (
    <main
      style={{
        padding: '48px 24px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage}) center/cover fixed`
          : '#f7f5f0',
      }}
    >
      <TypingTest onComplete={(result) => console.log(result)} />
    </main>
  )
}

export default App