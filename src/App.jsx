import { TypingTest } from './components/TypingTest'

function App() {
  return (
    <main style={{ padding: '48px 24px', background: '#0f0f0f', minHeight: '100vh' }}>
      <TypingTest onComplete={(result) => console.log(result)} />
    </main>
  )
}

export default App