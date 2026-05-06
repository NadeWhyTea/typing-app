import { useState, useEffect, useRef, useCallback } from 'react'
import { getWords, getSentence, getSentenceByDifficulty } from '../data/wordBank'

const WORDS_BUFFER_SIZE = 50
const SENTENCES_VISIBLE = 5

function getInitialWords(params) {
  const { difficulty = 'easy', mode = 'words', wordCount = 30, useSentences = false } = params
  if (useSentences) {
    // Get actual sentences based on difficulty
    return Array(SENTENCES_VISIBLE).fill(null).map(() => getSentenceByDifficulty(difficulty).split(' '))
  }
  return getWords(difficulty, mode === 'time' ? WORDS_BUFFER_SIZE : wordCount)
}

export function useTypingTest(params = {}) {
  const { difficulty = 'easy', mode = 'words', wordCount = 30, timeLimit = 30, useSentences = false } = params

  const [sentences, setSentences]     = useState(() => getInitialWords(params))
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput]             = useState('')
  const [wordResults, setWordResults] = useState([]) // 'correct' | 'incorrect' for each word
  const [charData, setCharData] = useState([]) // Array of { char, status: 'clean'|'corrected'|'error' }[] for each word
  const [wrongWords, setWrongWords]   = useState([])
  const [wpmHistory, setWpmHistory]   = useState([])
  const [status, setStatus]           = useState('idle')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(mode === 'time' ? timeLimit : null)
  const [wpm, setWpm]                 = useState(0)
  const [accuracy, setAccuracy]       = useState(0)
  const [totalChars, setTotalChars]   = useState(0)

  const timerRef     = useRef(null)
  const startTimeRef = useRef(null)
  const paramsRef    = useRef(params)

  // Get current words array (flat for non-sentences, current sentence for sentences mode)
  const words = useSentences ? sentences[currentSentenceIdx] || [] : sentences

  // Keep params ref updated
  useEffect(() => { paramsRef.current = params }, [params])

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const calcStats = useCallback((results, elapsedSeconds) => {
    if (results.length === 0) return { wpm: 0, accuracy: 0 }
    const minutes = elapsedSeconds / 60
    const correct = results.filter(r => r === 'correct').length
    return {
      wpm:      minutes > 0 ? Math.round(correct / minutes) : 0,
      accuracy: Math.round((correct / results.length) * 100),
    }
  }, [])

  const finishTest = useCallback((finalResults, elapsedSeconds) => {
    stopTimer()
    setStatus('finished')
    const { wpm: w, accuracy: a } = calcStats(finalResults, elapsedSeconds)
    setWpm(w); setAccuracy(a)
  }, [stopTimer, calcStats])

  const handleInput = useCallback((value) => {
    if (status === 'finished') return

    const isTimeMode = paramsRef.current.mode === 'time'
    const isSentencesMode = paramsRef.current.useSentences
    const currentWords = isSentencesMode ? sentences[currentSentenceIdx] || [] : sentences
    const currentWord = currentWords[currentIndex]

    // Start test on first keystroke
    if (status === 'idle' && value.length > 0) {
      setStatus('running')
      startTimeRef.current = Date.now()
      if (isTimeMode) {
        timerRef.current = setInterval(() => {
          setTimeRemaining(tr => {
            if (tr <= 1) {
              setTimeout(() => {
                setWordResults(prev => {
                  const elapsed = paramsRef.current.timeLimit
                  finishTest(prev, elapsed)
                  return prev
                })
              }, 0)
              return 0
            }
            return tr - 1
          })
        }, 1000)
      } else {
        timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000)
      }
    }


    // Track character-level data for the current word
    if (currentWord && value.length > 0) {
      const newCharData = [...charData]
      if (!newCharData[currentIndex]) newCharData[currentIndex] = []
      // Preserve full word history - don't truncate on backspace
      const wordCharData = [...(newCharData[currentIndex] || [])]
      
      for (let i = 0; i < value.length; i++) {
        const typedChar = value[i]
        const expectedChar = currentWord[i]
        const existing = wordCharData[i]
        
        if (expectedChar) {
          if (typedChar === expectedChar) {
            // If it was ever in error, mark as corrected
            const wasEverError = existing && (existing.status === 'error' || existing.wasError)
            if (existing && existing.status === 'error') {
              wordCharData[i] = { char: expectedChar, status: 'corrected', wasError: true }
            } else if (wasEverError) {
              wordCharData[i] = { char: expectedChar, status: 'corrected', wasError: true }
            } else {
              wordCharData[i] = { char: expectedChar, status: 'clean' }
            }
          } else {
            // Mark current as error, always set wasError to true so any correction shows yellow
            wordCharData[i] = { char: expectedChar, status: 'error', wasError: true }
          }
        } else {
          wordCharData[i] = { char: typedChar, status: 'error', wasError: true }
        }
      }
      
      // Mark positions beyond current input as pending (but keep error history)
      for (let i = value.length; i < wordCharData.length; i++) {
        if (wordCharData[i]) {
          wordCharData[i] = { ...wordCharData[i], status: 'pending' }
        }
      }
      
      newCharData[currentIndex] = wordCharData
      setCharData(newCharData)
    }

    if (value.endsWith(' ')) {
      const typed = value.trim()
      if (!typed) { setInput(''); return }

      const expected = currentWords[currentIndex]
      const isCorrect = typed === expected
      const newResults = [...wordResults, isCorrect ? 'correct' : 'incorrect']

      if (!isCorrect) {
        setWrongWords(prev => [...prev, { expected, typed }])
      } else {
        setTotalChars(prev => prev + expected.length)
      }

      setWordResults(newResults)
      setInput('')

      const nextIndex = currentIndex + 1

      // Check if this was the last word in word mode (end immediately)
      if (!isTimeMode && !isSentencesMode && nextIndex >= currentWords.length) {
        const elapsed = timeElapsed + 1 // approximate
        finishTest(newResults, elapsed)
        return
      }

      // Add more words in time mode when running low
      if (isTimeMode && !isSentencesMode && nextIndex > currentWords.length - 10) {
        const currentWordsArray = sentences
        setSentences(prev => [...prev, ...getWords(paramsRef.current.difficulty, WORDS_BUFFER_SIZE)])
      }

      // In sentences mode, advance to next sentence when current one is done
      if (isSentencesMode && nextIndex >= currentWords.length) {
        // Remove completed sentence and add new one at the end (respecting difficulty)
        setSentences(prev => {
          const newSentences = [...prev.slice(1), getSentenceByDifficulty(paramsRef.current.difficulty).split(' ')]
          return newSentences
        })
        setCurrentIndex(0)
        // Trim charData and wordResults to remove the completed sentence words
        const completedWordCount = currentWords.length
        setCharData(prev => prev.slice(completedWordCount))
        // Keep same currentSentenceIdx since we shift sentences
        const elapsed = timeElapsed + 1
        const { wpm: w, accuracy: a } = calcStats(newResults.slice(completedWordCount), elapsed || 1)
        setWpm(w); setAccuracy(a)
        return
      }

      // Snapshot WPM every 10 words or every 10 seconds in time mode
      const shouldSnapshot = isTimeMode
        ? (timeElapsed > 0 && timeElapsed % 10 === 0 && nextIndex % 2 === 0)
        : (nextIndex > 0 && nextIndex % 10 === 0)

      if (shouldSnapshot) {
        const elapsed = isTimeMode
          ? (paramsRef.current.timeLimit - timeRemaining)
          : timeElapsed
        const { wpm: snap } = calcStats(newResults, elapsed || 1)
        setWpmHistory(prev => [...prev, { label: isTimeMode ? `${elapsed}s` : `${nextIndex} words`, wpm: snap }])
      }

      setCurrentIndex(nextIndex)
      const elapsed = isTimeMode
        ? (paramsRef.current.timeLimit - timeRemaining)
        : timeElapsed
      const { wpm: w, accuracy: a } = calcStats(newResults, elapsed || 1)
      setWpm(w); setAccuracy(a)
      return
    }

    setInput(value)

    // Check if last word is complete for word mode (no space needed)
    if (!isTimeMode && !isSentencesMode && currentIndex === currentWords.length - 1 && value === currentWords[currentIndex]) {
      const newResults = [...wordResults, 'correct']
      setWordResults(newResults)
      setTotalChars(prev => prev + value.length)
      const elapsed = timeElapsed + 1
      finishTest(newResults, elapsed)
    }
  }, [status, sentences, currentSentenceIdx, currentIndex, wordResults, charData, timeElapsed, timeRemaining, calcStats, finishTest])

  const reset = useCallback((newParams) => {
    stopTimer()
    const p = newParams ?? paramsRef.current
    const isTimeMode = p.mode === 'time'
    const isSentencesMode = p.useSentences

    if (isSentencesMode) {
      setSentences(Array(SENTENCES_VISIBLE).fill(null).map(() => getSentenceByDifficulty(p.difficulty).split(' ')))
      setCurrentSentenceIdx(0)
    } else {
      setSentences(getWords(p.difficulty, isTimeMode ? WORDS_BUFFER_SIZE : (p.wordCount || 30)))
    }

    setCurrentIndex(0); setInput(''); setWordResults([])
    setCharData([])
    setWrongWords([]); setWpmHistory([])
    setStatus('idle')
    setTimeElapsed(0)
    setTimeRemaining(isTimeMode ? (p.timeLimit || 30) : null)
    setWpm(0); setAccuracy(0); setTotalChars(0)
    startTimeRef.current = null
  }, [stopTimer])

  useEffect(() => () => stopTimer(), [stopTimer])

  return {
    words, sentences, currentSentenceIdx, currentIndex, input, wordResults, charData, wrongWords, wpmHistory,
    status, timeElapsed, timeRemaining, wpm, accuracy, totalChars,
    handleInput, reset, isSentencesMode: params.useSentences
  }
}