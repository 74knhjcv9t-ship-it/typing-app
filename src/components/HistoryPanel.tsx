import React from 'react'
import { PracticeRecord, clearHistory } from '../utils/history'
import { getRating } from '../utils/stats'

interface HistoryPanelProps {
  records: PracticeRecord[]
  onRefresh: () => void
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ records, onRefresh }) => {
  const handleClear = () => {
    if (window.confirm('确定要清空所有练习记录吗？')) {
      clearHistory()
      onRefresh()
    }
  }

  if (records.length === 0) {
    return (
      <div className="sketch-card text-center py-8 opacity-70">
        <div className="text-ink-lighter text-lg mb-1 font-handwriting">还没有练习记录</div>
        <div className="text-ink-lighter/60 text-sm">完成一次练习后，结果会保存在这里</div>
      </div>
    )
  }

  return (
    <div className="sketch-card">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-warm-border">
        <h3 className="text-ink font-handwriting text-lg tracking-wide">练习记录</h3>
        <button
          className="text-xs text-ink-lighter hover:text-error transition-colors font-handwriting"
          onClick={handleClear}
        >
          清空
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {records.map((record) => {
          const rating = getRating(record.wpm, record.accuracy)
          return (
            <div
              key={record.id}
              className="border border-warm-border rounded-[8px_60px_8px_80px/60px_8px_80px_8px] px-4 py-3 flex items-center gap-3 hover:bg-paper-dark/30 transition-colors"
            >
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-sm min-w-[44px] text-center font-handwriting tracking-wider"
                style={{
                  backgroundColor: rating.color + '18',
                  color: rating.color,
                  border: `1.5px solid ${rating.color}40`,
                }}
              >
                {rating.label}
              </span>

              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink truncate">{record.textTitle}</div>
                <div className="text-xs text-ink-lighter mt-0.5">{record.date}</div>
              </div>

              <div className="flex gap-3 text-xs text-ink-lighter shrink-0">
                <span>
                  <span className="text-accent font-mono font-medium">{record.wpm}</span> WPM
                </span>
                <span>
                  <span
                    className="font-mono font-medium"
                    style={{ color: record.accuracy >= 95 ? '#4a9c6f' : record.accuracy >= 85 ? '#d4a830' : '#c0392b' }}
                  >
                    {record.accuracy}%
                  </span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-xs text-ink-lighter/50 text-center mt-3 font-handwriting tracking-wider">
        共 {records.length} 条记录
      </div>
    </div>
  )
}

export default HistoryPanel
