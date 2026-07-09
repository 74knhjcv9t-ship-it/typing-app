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
  const lastProcessedLenRef = useRef(0)

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
    lastProcessedLenRef.current = 0
  }, [state.text])

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
    }))
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current!.value = ''
      lastProcessedLenRef.current = 0
    }, 50)
  }, [])

  // IME 开始组合
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  // IME 组合结束
  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false
  }, [])

  // 推进一个字符
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

  // 处理输入（IME组合结束 或 直接英文输入）
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const currentVal = input.value

    // IME 组合中，不处理
    if (isComposingRef.current) return

    // 计算新输入的字符
    const prevLen = lastProcessedLenRef.current
    if (currentVal.length <= prevLen) {
      // 没有新字符（比如用户按了退格）
      lastProcessedLenRef.current = currentVal.length
      return
    }

    // 新输入的文本
    const newText = currentVal.slice(prevLen)
    lastProcessedLenRef.current = currentVal.length

    // 清空输入框
    input.value = ''

    // 逐个字符推进
    for (const ch of newText) {
      advanceChar(ch)
    }

    // 重置位置，因为输入框已被清空
    lastProcessedLenRef.current = 0
  }, [advanceChar])

  // 处理键盘事件 - 只处理特殊键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // IME 组合中，忽略
    if (isComposingRef.current) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      // 可以添加退格删除功能
      return
    }

    // 普通字符让 input 事件处理，这里不拦截
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
    handleInput,
  }
}
