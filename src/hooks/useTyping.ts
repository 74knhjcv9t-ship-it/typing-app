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

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false
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

  // 只处理 onInput，用 inputType 判断
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent
    const inputType = nativeEvent.inputType

    // IME 正在组合中（拼音输入中）→ 跳过
    if (inputType === 'insertCompositionText' || isComposingRef.current) {
      return
    }

    // 非文本插入类操作 → 跳过（如 deleteContentBackward）
    if (inputType !== 'insertText' && inputType !== 'insertFromComposition' && inputType !== 'insertFromPaste') {
      return
    }

    const input = e.target as HTMLInputElement
    const data = nativeEvent.data

    if (!data) {
      input.value = ''
      return
    }

    // 清空输入框
    input.value = ''

    // 逐个字符推进
    for (const ch of data) {
      advanceChar(ch)
    }
  }, [advanceChar])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // IME 组合中跳过
    if (isComposingRef.current) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      return
    }

    // 其他键不拦截，让 input 事件处理
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
