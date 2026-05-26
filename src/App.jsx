import TypingApp from './TypingApp'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <TypingApp />
      <Analytics />
    </>
  )
}