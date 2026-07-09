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

  const { state, inputRef, containerRef, start, reset, handleInput } = useTyping(activeText)

  const loadHistory = useCallback(() => setHistory(getHistory()), [])

  useEffect(() => { loadHistory() }, [loadHistory])

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
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <ModeSelector
          selectedId={selectedText.id}
          onSelect={(t) => { setSelectedText(t); setShowResult(false) }}
          customText={customText}
          onCustomTextChange={(t) => { setCustomText(t); setShowResult(false) }}
          mode={mode}
          onModeChange={(m) => { setMode(m); setShowResult(false) }}
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

        {/* 原文显示区 */}
        <TextDisplay
          ref={containerRef}
          text={activeText}
          currentIndex={state.currentIndex}
          typedChars={state.typedChars}
        />

        {/* 可见输入框 */}
        <textarea
          ref={inputRef}
          className="typing-textarea"
          onInput={handleInput}
          placeholder={state.isActive ? '' : '点击下方按钮开始，或直接在这里打字'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rows={3}
        />

        <div className="flex justify-center gap-3 mt-4 mb-8">
          {!state.isActive && !state.isFinished ? (
            <button className="btn-primary px-8 py-3 text-base" onClick={start}>
              开始练习
            </button>
          ) : (
            <button className="btn-secondary px-8 py-3 text-base" onClick={() => reset()}>
              重新开始
            </button>
          )}
        </div>

        <HistoryPanel records={history} onRefresh={loadHistory} />
      </main>

      <footer className="border-t border-bg-tertiary px-6 py-3 text-center text-text-secondary/40 text-xs">
        TypePrac - 直接在输入框中打字即可
      </footer>

      {showResult && state.stats && (
        <ResultModal
          stats={state.stats}
          textTitle={mode === 'builtin' ? selectedText.title : '自定义文本'}
          onRestart={() => { setShowResult(false); reset() }}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  )
}

export default App
