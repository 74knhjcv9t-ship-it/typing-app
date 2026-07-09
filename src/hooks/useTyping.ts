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
  const isComposingRef = useRef(false)
  const pendingCharsRef = useRef<string[]>([])

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

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
    }))
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // IME 开始组合
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  // IME 组合结束
  const handleCompositionEnd = useCallback((e: React.CompositionEvent) => {
    isComposingRef.current = false
    const composed = e.data
    if (composed && composed.length > 0) {
      pendingCharsRef.current = composed.split('')
    }
  }, [])

  // 核心：推进一个字符
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

  // 处理键盘输入（英文/符号）
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isComposingRef.current) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    if (e.key.length !== 1) return

    // 如果输入法有组合字符待提交，忽略 keydown
    if (pendingCharsRef.current.length > 0) return

    e.preventDefault()
    advanceChar(e.key)
  }, [advanceChar])

  // 处理 IME 最终输入
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement

    // 从 compositionEnd 获取的字符优先
    if (pendingCharsRef.current.length > 0) {
      const chars = pendingCharsRef.current
      pendingCharsRef.current = []
      input.value = ''
      for (const ch of chars) {
        advanceChar(ch)
      }
      return
    }

    // 直接输入（非IME）
    const value = input.value
    if (value) {
      input.value = ''
      for (const ch of value.split('')) {
        advanceChar(ch)
      }
    }
  }, [advanceChar])

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
    handleInput,
  }
}
