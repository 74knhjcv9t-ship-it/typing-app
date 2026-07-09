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

  const { state, inputRef, containerRef, start, reset, handleInput, handleCompositionStart, handleCompositionEnd } = useTyping(activeText)

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

  // 获取当前文本的来源信息
  const sourceInfo = useMemo(() => {
    if (mode === 'builtin' && selectedText.source) {
      return selectedText.source
    }
    return null
  }, [mode, selectedText])

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶栏 - 手绘风格 */}
      <header className="border-b-2 border-ink px-6 py-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center bg-pencil -rotate-6">
              <span className="text-ink font-bold font-mono text-sm">T</span>
            </div>
            <h1 className="text-ink font-handwriting text-2xl tracking-wide">TypePrac</h1>
          </div>
          {sourceInfo && (
            <div className="text-ink-lighter text-sm font-handwriting tracking-wider">
              —— {sourceInfo}
            </div>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6">
        {/* 文本选择 */}
        <ModeSelector
          selectedId={selectedText.id}
          onSelect={(t) => { setSelectedText(t); setShowResult(false) }}
          customText={customText}
          onCustomTextChange={(t) => { setCustomText(t); setShowResult(false) }}
          mode={mode}
          onModeChange={(m) => { setMode(m); setShowResult(false) }}
        />

        {/* 统计面板 */}
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

        {/* 打字输入框 */}
        <textarea
          ref={inputRef}
          className="typing-textarea mb-4"
          onInput={handleInput}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={state.isActive ? '' : '在这里打字开始练习……'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rows={3}
        />

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          {!state.isActive && !state.isFinished ? (
            <button className="btn-pencil btn-pencil-primary px-10 py-3 text-base" onClick={start}>
              开始练习 ✎
            </button>
          ) : (
            <button className="btn-pencil px-10 py-3 text-base" onClick={() => reset()}>
              重新开始 ↻
            </button>
          )}
        </div>

        {/* 历史记录 */}
        <HistoryPanel records={history} onRefresh={loadHistory} />
      </main>

      {/* 底部 */}
      <footer className="border-t-2 border-ink px-6 py-4 text-center text-ink-lighter text-xs font-handwriting tracking-wider bg-white/40">
        TypePrac · 慢慢来，比较快
      </footer>

      {/* 结果弹窗 */}
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
