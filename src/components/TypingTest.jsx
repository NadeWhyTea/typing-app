import { useState, useRef, useEffect, useCallback } from 'react'
import { useTypingTest } from '../hooks/useTypingTest'
import './TypingTest.css'

const DIFFICULTIES = ['easy', 'normal', 'hard']
const MODES = ['words', 'time']
const TIME_OPTIONS = [15, 30, 60]
const WORD_OPTIONS = [10, 25, 50, 100]
const IDLE_TIMEOUT = 60000 // 60 seconds
const THEMES = ['space', 'flower', 'ocean', 'autumn', 'handwritten']

const STORAGE_KEY = 'typing-test-prefs'

function loadPrefs() {
  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    // Force space theme as default
    if (!prefs.theme || prefs.theme === 'cyber') {
      prefs.theme = 'space'
    }
    return prefs
  } catch { return {} }
}

function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export function TypingTest({ onComplete }) {
  const saved = loadPrefs()
  const [difficulty, setDifficulty] = useState(saved.difficulty || 'easy')
  const [mode, setMode] = useState(saved.mode || 'words')
  const [timeLimit, setTimeLimit] = useState(saved.timeLimit || 30)
  const [wordCount, setWordCount] = useState(saved.wordCount || 30)
  const [useSentences, setUseSentences] = useState(saved.useSentences || false)
  const [theme, setTheme] = useState(saved.theme || 'space')
  const [isFocused, setIsFocused] = useState(true)
  const [idleExpired, setIdleExpired] = useState(false)
  const [showHint, setShowHint] = useState(false) // Controls overlay visibility
  const [isTyping, setIsTyping] = useState(false) // Track if user is actively typing
  const hasBeenFocusedRef = useRef(false) // Track if user ever focused
  const inputRef  = useRef(null)
  const wordsRef  = useRef(null)
  const idleTimerRef = useRef(null)

  const testParams = mode === 'time'
    ? { difficulty, mode, timeLimit, useSentences }
    : { difficulty, mode, wordCount, useSentences }

  const {
    words, sentences, currentIndex, input, wordResults, charData, wrongWords, wpmHistory,
    status, timeElapsed, timeRemaining, wpm, accuracy, totalChars,
    handleInput, reset, isSentencesMode,
  } = useTypingTest(testParams)

  const displayTime = mode === 'time' ? timeRemaining : timeElapsed

  // Calculate progress for the progress bar
  const progress = mode === 'time'
    ? ((timeLimit - timeRemaining) / timeLimit) * 100
    : ((currentIndex + (input.length / Math.max(words[currentIndex]?.length || 1))) / words.length) * 100

  // Track typing state - fade elements when user starts typing
  useEffect(() => {
    if (status === 'idle') {
      setIsTyping(false)
    } else if (status === 'running' || status === 'finished') {
      setIsTyping(true)
    }
  }, [status])

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  useEffect(() => { focusInput() }, [focusInput])

  // Track tab/window focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      const focused = !document.hidden
      setIsFocused(focused)
      if (focused && !hasBeenFocusedRef.current) {
        hasBeenFocusedRef.current = true
      }
      // Show hint when tab becomes unfocused (after having been focused)
      setShowHint(status === 'idle' && hasBeenFocusedRef.current && !focused)
    }
    const handleFocus = () => {
      setIsFocused(true)
      setShowHint(false) // Hide hint on focus
      if (!hasBeenFocusedRef.current) {
        hasBeenFocusedRef.current = true
      }
    }
    const handleBlur = () => {
      setIsFocused(false)
      // Show hint when losing focus (after having been focused)
      setShowHint(status === 'idle' && hasBeenFocusedRef.current)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Check initial focus state
    if (!document.hidden && document.hasFocus()) {
      hasBeenFocusedRef.current = true
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [status])

  // Idle timer: reset when user starts typing, start when idle
  useEffect(() => {
    if (status !== 'idle') {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
      setIdleExpired(false)
      return
    }

    // Start idle timer if not already running (only after user has focused at least once)
    if (!idleTimerRef.current && isFocused && hasBeenFocusedRef.current) {
      idleTimerRef.current = setTimeout(() => {
        setIdleExpired(true)
        setShowHint(true) // Show hint on idle timeout
      }, IDLE_TIMEOUT)
    }

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
    }
  }, [status, input, isFocused])

  useEffect(() => {
    const container = wordsRef.current
    if (!container) return
    const current = container.querySelector('[data-current="true"]')
    if (!current) return
    const cTop = container.getBoundingClientRect().top
    const wTop = current.getBoundingClientRect().top
    if (wTop - cTop > container.clientHeight * 0.55)
      current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentIndex])

  useEffect(() => {
    if (status === 'finished' && onComplete) onComplete({ wpm, accuracy, difficulty })
  }, [status]) // eslint-disable-line

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const changeDifficulty = (d) => {
    setDifficulty(d)
    savePrefs({ ...loadPrefs(), difficulty: d })
    reset({ difficulty: d, mode, timeLimit, wordCount, useSentences })
    setTimeout(focusInput, 50)
  }

  const changeTheme = (t) => {
    setTheme(t)
    savePrefs({ ...loadPrefs(), theme: t })
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', t)
  }

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const changeMode = (m) => {
    setMode(m)
    savePrefs({ ...loadPrefs(), mode: m })
    const newParams = m === 'time'
      ? { difficulty, mode: m, timeLimit, useSentences }
      : { difficulty, mode: m, wordCount, useSentences }
    reset(newParams)
    setTimeout(focusInput, 50)
  }

  const toggleSentences = () => {
    const newUseSentences = !useSentences
    setUseSentences(newUseSentences)
    savePrefs({ ...loadPrefs(), useSentences: newUseSentences })
    const newParams = mode === 'time'
      ? { difficulty, mode, timeLimit, useSentences: newUseSentences }
      : { difficulty, mode, wordCount, useSentences: newUseSentences }
    reset(newParams)
    setTimeout(focusInput, 50)
  }

  const changeTimeLimit = (t) => {
    setTimeLimit(t)
    savePrefs({ ...loadPrefs(), timeLimit: t })
    reset({ difficulty, mode, timeLimit: t, useSentences })
    setTimeout(focusInput, 50)
  }

  const changeWordCount = (w) => {
    setWordCount(w)
    savePrefs({ ...loadPrefs(), wordCount: w })
    reset({ difficulty, mode, wordCount: w, useSentences })
    setTimeout(focusInput, 50)
  }

  const restartSameMode = () => {
    reset(testParams)
    setTimeout(focusInput, 50)
  }

  // Get character class based on status from charData
  const getCharClass = (status) => {
    switch (status) {
      case 'clean': return 'char-clean'
      case 'corrected': return 'char-corrected'
      case 'error': return 'char-error'
      default: return 'char-pending'
    }
  }

  const renderCurrentWord = () => {
    const word = words[currentIndex] ?? ''
    const wordCharData = charData[currentIndex] || []
    const len = Math.max(word.length, input.length)
    
    return Array.from({ length: len }, (_, i) => {
      const expected = word[i]
      const typed = input[i]
      const charInfo = wordCharData[i]
      
      if (i >= input.length) {
        // Not typed yet
        const cls = i === input.length ? 'char char-cursor' : 'char char-pending'
        return <span key={i} className={cls}>{expected || ''}</span>
      }
      
      // Use tracked status if available, otherwise calculate on the fly
      const status = charInfo?.status || (typed === expected ? 'clean' : 'error')
      const cls = `char ${getCharClass(status)}`
      return <span key={i} className={cls}>{expected || typed}</span>
    })
  }

  // Render a completed word with character-level colors
  const renderCompletedWord = (wordIdx) => {
    const word = isSentencesMode 
      ? (sentences[0]?.[wordIdx] || words[wordIdx]) 
      : words[wordIdx]
    const wordCharInfo = charData[wordIdx] || []
    
    return word.split('').map((char, i) => {
      const charInfo = wordCharInfo[i]
      const status = charInfo?.status || 'clean'
      const cls = `char ${getCharClass(status)}`
      return <span key={i} className={cls}>{char}</span>
    })
  }

  // Word styling - only applies to the word wrapper now, not individual chars
  const wordClass = (isCurrent, isCompleted) => {
    if (isCompleted) return 'word word-done'
    if (isCurrent) return 'word word-active'
    return 'word word-dim'
  }

  // ── Stats page ───────────────────────────────────────────────────────────────
  if (status === 'finished') {
    const timeUsed = mode === 'time' ? (timeLimit - (timeRemaining || 0)) : timeElapsed
    const charsPerMin = timeUsed > 0 ? Math.round((totalChars / timeUsed) * 60) : 0
    const correctCount = wordResults.filter(r => r === 'correct').length
    const chartData = [...wpmHistory, { label: 'final', wpm }]
    const maxWpm = Math.max(...chartData.map(h => h.wpm), 1)

    return (
      <div className="tt-root">
        <p className="tt-results-title">complete.</p>

        {/* Main stats */}
        <div className="tt-stats-grid">
          <div className="tt-stat-card tt-stat-card--accent">
            <span className="tt-stat-card-num">{wpm}</span>
            <span className="tt-stat-card-label">wpm</span>
          </div>
          <div className="tt-stat-card">
            <span className="tt-stat-card-num">{accuracy}%</span>
            <span className="tt-stat-card-label">accuracy</span>
          </div>
          <div className="tt-stat-card">
            <span className="tt-stat-card-num">{correctCount}/{mode === 'time' ? wordResults.length : words.length}</span>
            <span className="tt-stat-card-label">correct words</span>
          </div>
          <div className="tt-stat-card">
            <span className="tt-stat-card-num">{formatTime(timeUsed)}</span>
            <span className="tt-stat-card-label">time</span>
          </div>
          <div className="tt-stat-card">
            <span className="tt-stat-card-num">{charsPerMin}</span>
            <span className="tt-stat-card-label">chars / min</span>
          </div>
        </div>

        {/* WPM chart */}
        {chartData.length > 1 && (
          <div className="tt-chart-section">
            <p className="tt-section-label">wpm over time</p>
            <div className="tt-chart">
              {chartData.map((h, i) => (
                <div key={i} className="tt-chart-col">
                  <span className="tt-chart-val">{h.wpm}</span>
                  <div className="tt-chart-bar-wrap">
                    <div
                      className="tt-chart-bar"
                      style={{ height: `${Math.round((h.wpm / maxWpm) * 100)}%` }}
                    />
                  </div>
                  <span className="tt-chart-label">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wrong words */}
        {wrongWords.length > 0 && (
          <div className="tt-wrong-section">
            <p className="tt-section-label">missed words ({wrongWords.length})</p>
            <div className="tt-wrong-list">
              {wrongWords.map((w, i) => (
                <div key={i} className="tt-wrong-word">
                  <span className="tt-wrong-expected">{w.expected}</span>
                  <span className="tt-wrong-arrow">→</span>
                  <span className="tt-wrong-typed">{w.typed}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="tt-actions">
          <button className="tt-reset-btn" onClick={restartSameMode}>
            try again ↺
          </button>
        </div>
      </div>
    )
  }

  // ── Typing test ──────────────────────────────────────────────────────────────
  return (
    <div className={`tt-root ${isTyping ? 'tt-root--typing' : ''}`} onClick={focusInput}>
      {/* Progress Bar */}
      <div className="tt-progress-bar">
        <div className="tt-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        {isTyping && (
          <div className="tt-progress-label">
            {mode === 'time' ? formatTime(displayTime) : `${currentIndex}/${words.length}`}
          </div>
        )}
      </div>
      <div className="tt-stats">
        <div className="tt-stat">
          <span className="tt-stat-label">time</span>
          <span className={`tt-stat-value ${mode === 'time' && timeRemaining <= 10 ? 'tt-stat-value--urgent' : ''}`}>
            {formatTime(displayTime)}
          </span>
        </div>
        <div className="tt-stat">
          <span className="tt-stat-label">wpm</span>
          <span className="tt-stat-value">{wpm}</span>
        </div>
        <div className="tt-stat">
          <span className="tt-stat-label">acc</span>
          <span className="tt-stat-value">{accuracy > 0 ? `${accuracy}%` : '—'}</span>
        </div>
        <div className="tt-mode-selector">
          {MODES.map(m => (
            <button
              key={m}
              className={`tt-mode-btn ${mode === m ? 'tt-mode-btn--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); changeMode(m) }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Mode settings row */}
      <div className="tt-settings-row">
        <div className="tt-diff-selector">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`tt-diff-btn ${difficulty === d ? `tt-diff-btn--active tt-diff-btn--${d}` : ''}`}
              onClick={(e) => { e.stopPropagation(); changeDifficulty(d) }}
            >
              {d}
            </button>
          ))}
        </div>
        {mode === 'time' ? (
          <div className="tt-option-selector">
            {TIME_OPTIONS.map(t => (
              <button
                key={t}
                className={`tt-option-btn ${timeLimit === t ? 'tt-option-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); changeTimeLimit(t) }}
              >
                {t}s
              </button>
            ))}
          </div>
        ) : (
          <div className="tt-option-selector">
            {WORD_OPTIONS.map(w => (
              <button
                key={w}
                className={`tt-option-btn ${wordCount === w ? 'tt-option-btn--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); changeWordCount(w) }}
              >
                {w}
              </button>
            ))}
          </div>
        )}
        {/* Sentences toggle */}
        <button
          className={`tt-option-btn ${useSentences ? 'tt-option-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleSentences() }}
        >
          sentences
        </button>

        {/* Theme selector */}
        <div className="tt-theme-selector">
          <span className="tt-theme-label">theme</span>
          {THEMES.map(t => (
            <button
              key={t}
              className={`tt-theme-btn ${theme === t ? 'tt-theme-btn--active' : ''}`}
              data-theme={t}
              onClick={(e) => { e.stopPropagation(); changeTheme(t) }}
              title={t}
            />
          ))}
        </div>
      </div>

      <div className={`tt-words-wrap ${showHint ? 'tt-words-wrap--blurred' : ''}`} ref={wordsRef}>
        {showHint && (
          <div className="tt-hint-overlay" onClick={(e) => { e.stopPropagation(); focusInput(); }}>
            <p className="tt-hint">start typing to begin</p>
          </div>
        )}
        <div className="tt-words">
          {isSentencesMode ? (
            // Sentences mode: each sentence on its own line
            sentences.map((sentenceWords, sentenceIdx) => {
              const isCurrentSentence = sentenceIdx === 0
              
              return (
                <div key={sentenceIdx} className="tt-sentence-line">
                  {sentenceWords.map((word, wordIdx) => {
                    const isCurrentWord = isCurrentSentence && wordIdx === currentIndex
                    const isCompleted = isCurrentSentence && wordIdx < currentIndex
                    
                    return (
                      <span
                        key={wordIdx}
                        className={wordClass(isCurrentWord, isCompleted)}
                        data-current={isCurrentWord ? 'true' : undefined}
                      >
                        {isCurrentWord 
                          ? renderCurrentWord() 
                          : isCompleted 
                            ? renderCompletedWord(wordIdx)
                            : word}
                      </span>
                    )
                  })}
                </div>
              )
            })
          ) : (
            // Normal word/time mode
            words.map((word, i) => (
              <span
                key={i}
                className={wordClass(i === currentIndex, i < currentIndex)}
                data-current={i === currentIndex ? 'true' : undefined}
              >
                {i === currentIndex 
                  ? renderCurrentWord() 
                  : i < currentIndex 
                    ? renderCompletedWord(i)
                    : word}
              </span>
            ))
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        className="tt-input"
        value={input}
        onChange={e => handleInput(e.target.value)}
        disabled={status === 'finished'}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        aria-label="Type here"
      />
    </div>
  )
}