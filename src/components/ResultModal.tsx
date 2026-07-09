import React from 'react'
import { TypingStats, getRating } from '../utils/stats'

interface ResultModalProps {
  stats: TypingStats
  textTitle: string
  onRestart: () => void
  onClose: () => void
}

const encouragements = [
  { min: 98, message: '完美！你简直是打字天才', sub: '每一个字都恰到好处', icon: '✦' },
  { min: 95, message: '太棒了！近乎完美的表现', sub: '你的手指比风还快', icon: '★' },
  { min: 90, message: '非常出色！继续保持', sub: '离打字大师只差一步之遥', icon: '✧' },
  { min: 80, message: '不错哦！渐入佳境', sub: '再练几次就能更上一层楼', icon: '◇' },
  { min: 0, message: '加油！每一次练习都在进步', sub: '坚持就是胜利，明天会更好', icon: '○' },
]

function getEncouragement(accuracy: number) {
  return encouragements.find((e) => accuracy >= e.min) || encouragements[encouragements.length - 1]
}

const ResultModal: React.FC<ResultModalProps> = ({ stats, textTitle, onRestart, onClose }) => {
  const rating = getRating(stats.wpm, stats.accuracy)
  const encouragement = getEncouragement(stats.accuracy)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="sketch-card max-w-md w-full mx-4 p-8 animate-sketch-in bg-white">
        {/* 装饰 */}
        <div className="text-center mb-2">
          <div className="text-5xl animate-float" style={{ color: rating.color }}>
            {encouragement.icon}
          </div>
        </div>

        {/* 评级 */}
        <div className="text-center mb-1">
          <div
            className="text-5xl font-handwriting mb-1"
            style={{ color: rating.color }}
          >
            {rating.label}
          </div>
          <div className="text-ink-lighter text-sm font-handwriting tracking-wider">
            {encouragement.message}
          </div>
          <div className="text-ink-lighter text-xs mt-1 font-body">
            {encouragement.sub}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="my-5 border-t border-dashed border-warm-border" />

        {/* 详细数据 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#5b7db5' }}>{stats.wpm}</div>
            <div className="stat-label">速度 (WPM)</div>
          </div>
          <div className="stat-card">
            <div
              className="stat-value"
              style={{
                color: stats.accuracy >= 95 ? '#4a9c6f' : stats.accuracy >= 85 ? '#d4a830' : '#c0392b',
              }}
            >
              {stats.accuracy}%
            </div>
            <div className="stat-label">准确率</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#2c2c2c' }}>{stats.duration}s</div>
            <div className="stat-label">用时</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats.errors > 0 ? '#c0392b' : '#4a9c6f' }}>
              {stats.errors}
            </div>
            <div className="stat-label">错误</div>
          </div>
        </div>

        {/* 文本信息 */}
        <div className="text-center text-xs text-ink-lighter mb-5 font-body">
          《{textTitle}》 · 正确 {stats.correctChars}/{stats.totalChars} 字
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button className="btn-pencil btn-pencil-primary flex-1" onClick={onRestart}>
            再来一次
          </button>
          <button className="btn-pencil flex-1" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultModal
