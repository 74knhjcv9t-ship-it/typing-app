import React, { useState, useEffect } from 'react'
import { TypingStats } from '../utils/stats'

interface StatsPanelProps {
  stats: TypingStats | null
  totalLength: number
  typedCount: number
  isActive: boolean
  currentIndex: number
  correctCount: number
  startTime: number | null
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  stats, totalLength, isActive, currentIndex, correctCount, startTime,
}) => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(interval)
  }, [isActive])

  const progress = totalLength > 0 ? Math.round((currentIndex / totalLength) * 100) : 0

  // 最终统计
  if (stats) {
    return (
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="stat-card animate-sketch-in">
          <div className="stat-value" style={{ color: '#5b7db5' }}>{stats.wpm}</div>
          <div className="stat-label">速度</div>
        </div>
        <div className="stat-card animate-sketch-in" style={{ animationDelay: '0.05s' }}>
          <div className="stat-value" style={{ color: stats.accuracy >= 95 ? '#4a9c6f' : stats.accuracy >= 85 ? '#d4a830' : '#c0392b' }}>{stats.accuracy}%</div>
          <div className="stat-label">准确率</div>
        </div>
        <div className="stat-card animate-sketch-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-value" style={{ color: '#2c2c2c' }}>{stats.duration}s</div>
          <div className="stat-label">用时</div>
        </div>
        <div className="stat-card animate-sketch-in" style={{ animationDelay: '0.15s' }}>
          <div className="stat-value" style={{ color: progress >= 100 ? '#4a9c6f' : '#5b7db5' }}>100%</div>
          <div className="stat-label">完成</div>
        </div>
      </div>
    )
  }

  // 实时
  if (isActive && startTime) {
    const elapsedMs = now - startTime
    const minutes = elapsedMs / 60000
    const liveWpm = minutes > 0 ? Math.round((correctCount / 5) / minutes) : 0
    const liveAccuracy = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 100
    const elapsedSec = Math.floor(elapsedMs / 1000)
    const timeStr = `${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, '0')}`

    return (
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#5b7db5' }}>{liveWpm}</div>
          <div className="stat-label">速度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: liveAccuracy >= 95 ? '#4a9c6f' : liveAccuracy >= 85 ? '#d4a830' : '#c0392b' }}>{liveAccuracy}%</div>
          <div className="stat-label">准确率</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#2c2c2c' }}>{timeStr}</div>
          <div className="stat-label">用时</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#5b7db5' }}>{progress}%</div>
          <div className="stat-label">进度</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {['速度', '准确率', '用时', '进度'].map((label, i) => (
        <div key={i} className="stat-card opacity-60">
          <div className="stat-value text-ink-lighter">--</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsPanel
