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

  const advanceChar = useCallback((ch: string) => {
    setState((prev) => {
      if (!prev.isActive || prev.isFinished) return prev

      const newIndex = prev.currentIndex + 1
      const newTypedChars = [...prev.typedChars, ch]
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

  // 通道1: keydown → 英文/符号/空格直接输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keyCode = (e.nativeEvent as KeyboardEvent).keyCode

    // keyCode 229 = IME 正在处理，跳过
    if (keyCode === 229) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    // 单个可见字符（英文、数字、符号、空格等）
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      advanceChar(e.key)
    }
  }, [advanceChar])

  // 通道2: compositionend → IME 组合完成的汉字
  const handleCompositionEnd = useCallback((e: React.CompositionEvent) => {
    const composed = e.data
    if (composed && composed.length > 0) {
      // 清空输入框
      if (inputRef.current) inputRef.current.value = ''
      // 逐字录入
      for (const ch of composed) {
        advanceChar(ch)
      }
    }
  }, [advanceChar])

  // IME 开始组合
  const handleCompositionStart = useCallback(() => {
    // 无需特殊处理
  }, [])

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
    inputRef,
    containerRef,
    start,
    reset,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  }
}
