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

  // 重置
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
  }, [state.text])

  // 开始练习
  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
    }))
    // 聚焦输入框
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // 处理键盘输入
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    setState((prev) => {
      if (!prev.isActive || prev.isFinished) return prev

      // 不允许退格删除已打字符（模拟真实打字机）
      if (e.key === 'Backspace') {
        e.preventDefault()
        return prev
      }

      // 只处理单个字符输入
      if (e.key.length !== 1) return prev

      e.preventDefault()

      const newIndex = prev.currentIndex + 1
      const newTypedChars = [...prev.typedChars, e.key]
      const isFinished = newIndex >= prev.text.length

      // 自动结束
      if (isFinished) {
        const now = Date.now()
        const duration = now - (prev.startTime ?? now)
        const correctChars = newTypedChars.filter(
          (ch, i) => i < prev.text.length && ch === prev.text[i]
        ).length
        const stats = calculateStats(
          newTypedChars.length,
          correctChars,
          duration,
          prev.text.length
        )

        return {
          ...prev,
          currentIndex: newIndex,
          typedChars: newTypedChars,
          isFinished: true,
          isActive: false,
          endTime: now,
          stats,
        }
      }

      return {
        ...prev,
        currentIndex: newIndex,
        typedChars: newTypedChars,
      }
    })
  }, [])

  // 切换文本时重置
  useEffect(() => {
    if (initialText) {
      reset(initialText)
    }
  }, [initialText, reset])

  // 自动滚动到当前字符
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
  }
}
