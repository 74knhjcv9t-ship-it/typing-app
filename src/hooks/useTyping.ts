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
    setComposingText('')
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

  // 批量推进字符
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

  // keydown: 只防退格，不处理字符（字符全部交给 input 事件）
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }
    // 不 preventDefault，让 input 事件自然触发
  }, [])

  // IME 组合开始
  const handleCompositionStart = useCallback(() => {
    composingRef.current = true
  }, [])

  // IME 拼音更新 → 显示在界面
  const handleCompositionUpdate = useCallback((e: React.CompositionEvent) => {
    setComposingText(e.data)
  }, [])

  // IME 组合结束
  const handleCompositionEnd = useCallback(() => {
    composingRef.current = false
  }, [])

  // 核心: input 事件处理所有输入
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const nativeEvent = e.nativeEvent as InputEvent
    const inputType = nativeEvent.inputType
    const data = nativeEvent.data

    // IME 组合中 → 跳过，等组合结束
    if (composingRef.current) {
      return
    }

    // 组合结束后的提交
    if (inputType === 'insertFromComposition') {
      if (data && data.length > 0) {
        input.value = ''
        advanceChars(data.split(''))
      }
      return
    }

    // 直接输入（英文/数字/符号/空格）
    if (inputType === 'insertText' && data) {
      input.value = ''
      advanceChars(data.split(''))
      return
    }

    // 粘贴
    if (inputType === 'insertFromPaste' && data) {
      input.value = ''
      advanceChars(data.split(''))
      return
    }
  }, [advanceChars])

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
    handleInput,
  }
}
