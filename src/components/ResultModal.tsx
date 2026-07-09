import React from 'react'
import { TypingStats } from '../utils/stats'
import { getRating } from '../utils/stats'

interface ResultModalProps {
  stats: TypingStats
  textTitle: string
  onRestart: () => void
  onClose: () => void
}

const ResultModal: React.FC<ResultModalProps> = ({ stats, textTitle, onRestart, onClose }) => {
  const rating = getRating(stats.wpm, stats.accuracy)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card p-8 max-w-md w-full mx-4 animate-slide-up">
        {/* 评级 */}
        <div className="text-center mb-6">
          <div
            className="text-6xl font-bold font-mono mb-2"
            style={{ color: rating.color }}
          >
            {rating.label}
          </div>
          <div className="text-text-secondary text-sm">{textTitle}</div>
        </div>

        {/* 详细数据 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-bg-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold font-mono text-accent">{stats.wpm}</div>
            <div className="text-text-secondary text-xs mt-1">速度 (WPM)</div>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-4 text-center">
            <div
              className="text-3xl font-bold font-mono"
              style={{
                color: stats.accuracy >= 95 ? '#2ecc71' : stats.accuracy >= 85 ? '#f1c40f' : '#e74c3c',
              }}
            >
              {stats.accuracy}%
            </div>
            <div className="text-text-secondary text-xs mt-1">准确率</div>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold font-mono text-text-primary">{stats.duration}s</div>
            <div className="text-text-secondary text-xs mt-1">用时</div>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold font-mono text-text-primary">{stats.errors}</div>
            <div className="text-text-secondary text-xs mt-1">错误数</div>
          </div>
        </div>

        {/* 详细指标 */}
        <div className="text-xs text-text-secondary mb-6 text-center">
          正确 {stats.correctChars} / 总 {stats.totalChars} 字符
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={onRestart}>
            再来一次
          </button>
          <button className="btn-secondary flex-1" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultModal
