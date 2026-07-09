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
  const composingRef = useRef(false)

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
    composingRef.current = false
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

  // 核心：用 keydown 处理所有字符输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keyCode = (e.nativeEvent as KeyboardEvent).keyCode

    // keyCode 229 = IME 正在处理（中文输入法），跳过
    if (keyCode === 229) return

    // 退格键（暂不实现删除功能）
    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    // 只处理单个可见字符
    if (e.key.length !== 1) return

    // 忽略带修饰键的组合
    if (e.ctrlKey || e.metaKey || e.altKey) return

    e.preventDefault()
    advanceChar(e.key)
  }, [advanceChar])

  // IME 组合开始/结束（辅助标记，但核心靠 keyCode 229）
  const handleCompositionStart = useCallback(() => {
    composingRef.current = true
  }, [])

  const handleCompositionEnd = useCallback(() => {
    composingRef.current = false
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
