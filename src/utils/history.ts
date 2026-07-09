import { TypingStats } from './stats'

const HISTORY_KEY = 'typing-practice-history'

export interface PracticeRecord extends TypingStats {
  id: string
  date: string
  textTitle: string
  textId: string
}

export function getHistory(): PracticeRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PracticeRecord[]
  } catch {
    return []
  }
}

export function saveRecord(record: Omit<PracticeRecord, 'id' | 'date'>): PracticeRecord {
  const newRecord: PracticeRecord = {
    ...record,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }

  const history = getHistory()
  history.unshift(newRecord)
  // 只保留最近 100 条记录
  const trimmed = history.slice(0, 100)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  return newRecord
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
