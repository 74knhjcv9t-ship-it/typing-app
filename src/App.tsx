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

  // 当前要练习的文本
  const activeText = useMemo(() => {
    if (mode === 'custom') return customText.trim() || practiceTexts[0].content
    return selectedText.content
  }, [mode, customText, selectedText])

  const {
    state,
    inputRef,
    containerRef,
    start,
    reset,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
  } = useTyping(activeText)

  // 加载历史记录
  const loadHistory = useCallback(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // 练习完成时保存记录
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

  // 处理文本选择
  const handleSelectText = useCallback(
    (text: PracticeText) => {
      setSelectedText(text)
      setShowResult(false)
    },
    []
  )

  // 处理自定义文本变更
  const handleCustomTextChange = useCallback((text: string) => {
    setCustomText(text)
    setShowResult(false)
  }, [])

  // 重新开始
  const handleRestart = useCallback(() => {
    setShowResult(false)
    reset()
  }, [reset])

  // 重新选择文本后重置
  const handleModeChange = useCallback((newMode: 'builtin' | 'custom') => {
    setMode(newMode)
    setShowResult(false)
  }, [])

  // 当前字符中正确的数量
  const correctCount = state.typedChars.filter(
    (ch, i) => i < state.text.length && ch === state.text[i]
  ).length

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* 顶栏 */}
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

      {/* 主内容 */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* 模式与文本选择 */}
        <ModeSelector
          selectedId={selectedText.id}
          onSelect={handleSelectText}
          customText={customText}
          onCustomTextChange={handleCustomTextChange}
          mode={mode}
          onModeChange={handleModeChange}
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

        {/* 原文显示区 + 输入框叠层 */}
        <div className="relative">
          <TextDisplay
            ref={containerRef}
            text={activeText}
            currentIndex={state.currentIndex}
            typedChars={state.typedChars}
          />
          <input
            ref={inputRef}
            className="typing-input"
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onInput={handleInput}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        {/* 控制按钮 */}
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

        {/* 快捷键提示 */}
        {!state.isActive && !state.isFinished && (
          <div className="text-center text-text-secondary/50 text-xs mb-8">
            或直接按任意键开始
          </div>
        )}

        {/* 历史记录 */}
        <HistoryPanel records={history} onRefresh={loadHistory} />
      </main>

      {/* 底部 */}
      <footer className="border-t border-bg-tertiary px-6 py-3 text-center text-text-secondary/40 text-xs">
        TypePrac - 专注打字练习
      </footer>

      {/* 结果弹窗 */}
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
