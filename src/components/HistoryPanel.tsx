import React from 'react'
import { PracticeRecord, clearHistory } from '../utils/history'
import { getRating } from '../utils/stats'

interface HistoryPanelProps {
  records: PracticeRecord[]
  onRefresh: () => void
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ records, onRefresh }) => {
  const handleClear = () => {
    if (window.confirm('确定要清除所有历史记录吗？')) {
      clearHistory()
      onRefresh()
    }
  }

  if (records.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-text-secondary text-lg mb-2">暂无练习记录</div>
        <div className="text-text-secondary/60 text-sm">完成一次练习后，结果将自动保存到这里</div>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary font-medium">练习记录</h3>
        <button
          className="text-xs text-text-secondary hover:text-error transition-colors"
          onClick={handleClear}
        >
          清除全部
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {records.map((record) => {
          const rating = getRating(record.wpm, record.accuracy)
          return (
            <div
              key={record.id}
              className="bg-bg-tertiary/50 rounded-lg px-4 py-3 flex items-center gap-4 hover:bg-bg-tertiary transition-colors"
            >
              {/* 评级标签 */}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded min-w-[48px] text-center"
                style={{
                  backgroundColor: rating.color + '22',
                  color: rating.color,
                }}
              >
                {rating.label}
              </span>

              {/* 数据 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-text-primary truncate">{record.textTitle}</div>
                <div className="text-xs text-text-secondary mt-0.5">{record.date}</div>
              </div>

              {/* 指标 */}
              <div className="flex gap-4 text-xs text-text-secondary shrink-0">
                <span>
                  <span className="text-accent font-mono font-medium">{record.wpm}</span> WPM
                </span>
                <span>
                  <span
                    className="font-mono font-medium"
                    style={{
                      color: record.accuracy >= 95 ? '#2ecc71' : record.accuracy >= 85 ? '#f1c40f' : '#e74c3c',
                    }}
                  >
                    {record.accuracy}%
                  </span>
                </span>
                <span>
                  <span className="text-text-primary font-mono">{record.duration}s</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-xs text-text-secondary/50 text-center mt-3">
        共 {records.length} 条记录
      </div>
    </div>
  )
}

export default HistoryPanel
