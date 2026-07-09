import React, { useState, useCallback, useEffect, useMemo } from 'react'
import TextDisplay from './components/TextDisplay'
import StatsPanel from './components/StatsPanel'
import ModeSelector from './components/ModeSelector'
import ResultModal from './components/ResultModal'
import HistoryPanel from './components/HistoryPanel'
import { useTyping } from './hooks/useTyping'
import { PracticeText, practiceTexts } from './data/texts'
import { saveRecord, getHistory, PracticeRecord } from './utils/history'

const App: React.FC = () => {
  const [mode, setMode] = useState<'builtin' | 'custom'>('builtin')
  const [selectedText, setSelectedText] = useState<PracticeText>(practiceTexts[0])
  const [customText, setCustomText] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [history, setHistory] = useState<PracticeRecord[]>([])

  const activeText = useMemo(() => {
    if (mode === 'custom') return customText.trim() || practiceTexts[0].content
    return selectedText.content
  }, [mode, customText, selectedText])

  const {
    state,
    composingText,
    inputRef,
    containerRef,
    start,
    reset,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
    handleInput,
  } = useTyping(activeText)

  const loadHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (state.stats && !showResult) {
      const title = mode === 'builtin' ? selectedText.title : '自定义文本'
      saveRecord({
        wpm: state.stats.wpm,
        accuracy: state.stats.accuracy,
        duration: state.stats.duration,
        totalChars: state.stats.totalChars,
        correctChars: state.stats.correctChars,
        errors: state.stats.errors,
        textTitle: title,
        textId: mode === 'builtin' ? selectedText.id : 'custom',
      })
      loadHistory()
      setShowResult(true)
    }
  }, [state.stats, showResult, mode, selectedText, loadHistory])

  const handleSelectText = useCallback((text: PracticeText) => {
    setSelectedText(text)
    setShowResult(false)
  }, [])

  const handleCustomTextChange = useCallback((text: string) => {
    setCustomText(text)
    setShowResult(false)
  }, [])

  const handleRestart = useCallback(() => {
    setShowResult(false)
    reset()
  }, [reset])

  const handleModeChange = useCallback((newMode: 'builtin' | 'custom') => {
    setMode(newMode)
    setShowResult(false)
  }, [])

  const correctCount = state.typedChars.filter(
    (ch, i) => i < state.text.length && ch === state.text[i]
  ).length

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="border-b border-bg-tertiary px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold font-mono text-sm">T</span>
            </div>
            <h1 className="text-text-primary font-semibold text-lg">TypePrac</h1>
          </div>
          <div className="text-text-secondary text-xs">
            点击开始或直接打字即可开始练习
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <ModeSelector
          selectedId={selectedText.id}
          onSelect={handleSelectText}
          customText={customText}
          onCustomTextChange={handleCustomTextChange}
          mode={mode}
          onModeChange={handleModeChange}
        />

        <StatsPanel
          stats={state.stats}
          totalLength={activeText.length}
          typedCount={state.typedChars.length}
          isActive={state.isActive}
          currentIndex={state.currentIndex}
          correctCount={correctCount}
          startTime={state.startTime}
        />

        <div className="relative">
          <TextDisplay
            ref={containerRef}
            text={activeText}
            currentIndex={state.currentIndex}
            typedChars={state.typedChars}
            composingText={composingText}
          />
          <input
            ref={inputRef}
            className="typing-input"
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {!state.isActive && !state.isFinished ? (
            <button className="btn-primary px-8 py-3 text-base" onClick={start}>
              开始练习
            </button>
          ) : state.isActive ? (
            <button className="btn-secondary px-8 py-3 text-base" onClick={() => reset()}>
              重新开始
            </button>
          ) : null}
        </div>

        {!state.isActive && !state.isFinished && (
          <div className="text-center text-text-secondary/50 text-xs mb-8">
            或直接按任意键开始
          </div>
        )}

        <HistoryPanel records={history} onRefresh={loadHistory} />
      </main>

      <footer className="border-t border-bg-tertiary px-6 py-3 text-center text-text-secondary/40 text-xs">
        TypePrac - 专注打字练习
      </footer>

      {showResult && state.stats && (
        <ResultModal
          stats={state.stats}
          textTitle={mode === 'builtin' ? selectedText.title : '自定义文本'}
          onRestart={handleRestart}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  )
}

export default App
