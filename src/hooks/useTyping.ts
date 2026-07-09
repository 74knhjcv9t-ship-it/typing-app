import { useState, useCallback, useRef, useEffect } from 'react'
import { calculateStats, TypingStats } from '../utils/stats'

export interface TypingState {
  text: string
  currentIndex: number
  typedChars: string[]
  isActive: boolean
  isFinished: boolean
  startTime: number | null
  endTime: number | null
  stats: TypingStats | null
}

export function useTyping(initialText: string = '') {
  const [state, setState] = useState<TypingState>({
    text: initialText,
    currentIndex: 0,
    typedChars: [],
    isActive: false,
    isFinished: false,
    startTime: null,
    endTime: null,
    stats: null,
  })

  const [composingText, setComposingText] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const reset = useCallback((newText?: string) => {
    const text = newText ?? state.text
    setState({
      text,
      currentIndex: 0,
      typedChars: [],
      isActive: false,
      isFinished: false,
      startTime: null,
      endTime: null,
      stats: null,
    })
    setComposingText('')
    if (inputRef.current) inputRef.current.value = ''
  }, [state.text])

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
    }))
    setTimeout(() => {
      inputRef.current?.focus()
      if (inputRef.current) inputRef.current.value = ''
    }, 50)
  }, [])

  // 批量录入
  const advanceChars = useCallback((chars: string[]) => {
    setState((prev) => {
      if (!prev.isActive || prev.isFinished) return prev

      const newTypedChars = [...prev.typedChars]
      let newIndex = prev.currentIndex

      for (const ch of chars) {
        if (newIndex >= prev.text.length) break
        newTypedChars.push(ch)
        newIndex++
      }

      const isFinished = newIndex >= prev.text.length

      if (isFinished) {
        const now = Date.now()
        const duration = now - (prev.startTime ?? now)
        const correctChars = newTypedChars.filter(
          (c, i) => i < prev.text.length && c === prev.text[i]
        ).length
        return {
          ...prev,
          currentIndex: newIndex,
          typedChars: newTypedChars,
          isFinished: true,
          isActive: false,
          endTime: now,
          stats: calculateStats(
            newTypedChars.length,
            correctChars,
            duration,
            prev.text.length
          ),
        }
      }

      return {
        ...prev,
        currentIndex: newIndex,
        typedChars: newTypedChars,
      }
    })
  }, [])

  // 通道1: keydown → 英文/符号直接输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keyCode = (e.nativeEvent as KeyboardEvent).keyCode

    // 退格
    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    // 单个可见字符，且不是IME输入（keyCode=229）
    if (e.key.length === 1 && keyCode !== 229 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      advanceChars([e.key])
    }
  }, [advanceChars])

  // IME 拼音更新
  const handleCompositionUpdate = useCallback((e: React.CompositionEvent) => {
    setComposingText(e.data)
  }, [])

  // 通道2: compositionend → IME组合完成
  const handleCompositionEnd = useCallback((e: React.CompositionEvent) => {
    setComposingText('')
    if (inputRef.current) inputRef.current.value = ''

    const composed = e.data
    if (composed && composed.length > 0) {
      advanceChars(composed.split(''))
    }
  }, [advanceChars])

  // IME 组合开始（无需特殊处理）
  const handleCompositionStart = useCallback(() => {}, [])

  useEffect(() => {
    if (initialText) {
      reset(initialText)
    }
  }, [initialText, reset])

  useEffect(() => {
    if (containerRef.current && state.currentIndex > 0) {
      const chars = containerRef.current.querySelectorAll('.char-item')
      if (chars[state.currentIndex]) {
        chars[state.currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [state.currentIndex])

  return {
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
  }
}
