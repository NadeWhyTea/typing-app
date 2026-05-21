import { useState, useEffect } from 'react'
import { TypingTest } from './components/TypingTest'
import { Analytics } from '@vercel/analytics/react'

const BACKGROUNDS = {
  space:       '/space-bg.jpg',
  flower:      '/flower-bg.jpg',
  ocean:       '/ocean-bg.jpg',
  autumn:      '/autumn-bg.jpg',
  handwritten: '/handwritten-bg.jpg',
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
      <Analytics />
    </main>
  )
}

export default App