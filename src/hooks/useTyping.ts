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

  const inputRef = useRef<HTMLTextAreaElement>(null)
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
    composingRef.current = false
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

  // 对比输入框内容与原文
  const processValue = useCallback((inputVal: string) => {
    setState((prev) => {
      if (prev.isFinished) return prev

      if (!prev.isActive) {
        // 首次输入，自动开始
        const now = Date.now()
        const chars = inputVal.split('')
        const correctChars = chars.filter((c, i) => i < prev.text.length && c === prev.text[i]).length
        const isFinished = chars.length >= prev.text.length

        if (isFinished) {
          return {
            ...prev,
            currentIndex: chars.length,
            typedChars: chars,
            isActive: false,
            isFinished: true,
            startTime: now,
            endTime: now,
            stats: calculateStats(chars.length, correctChars, 0, prev.text.length),
          }
        }

        return {
          ...prev,
          currentIndex: chars.length,
          typedChars: chars,
          isActive: true,
          startTime: now,
        }
      }

      // 正常输入
      const chars = inputVal.split('')
      const isFinished = chars.length >= prev.text.length

      if (isFinished) {
        const now = Date.now()
        const duration = now - (prev.startTime ?? now)
        const correctChars = chars.filter((c, i) => i < prev.text.length && c === prev.text[i]).length
        return {
          ...prev,
          currentIndex: chars.length,
          typedChars: chars,
          isFinished: true,
          isActive: false,
          endTime: now,
          stats: calculateStats(chars.length, correctChars, duration, prev.text.length),
        }
      }

      return {
        ...prev,
        currentIndex: chars.length,
        typedChars: chars,
      }
    })
  }, [])

  // IME 组合中 → 跳过 input 事件
  const handleCompositionStart = useCallback(() => {
    composingRef.current = true
  }, [])

  // IME 组合结束 → 处理输入框中的最终文本
  const handleCompositionEnd = useCallback(() => {
    composingRef.current = false
    if (inputRef.current) {
      processValue(inputRef.current.value)
    }
  }, [processValue])

  // input 事件：IME组合中跳过，英文直接处理
  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    if (composingRef.current) return
    const input = e.target as HTMLTextAreaElement
    processValue(input.value)
  }, [processValue])

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
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
  }
}
