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

const StatItem: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="card px-5 py-4 text-center flex-1 min-w-[100px]">
    <div className="stat-value" style={color ? { color } : undefined}>
      {value}
    </div>
    <div className="stat-label mt-1">{label}</div>
  </div>
)

const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  totalLength,
  isActive,
  currentIndex,
  correctCount,
  startTime,
}) => {
  const [now, setNow] = useState(Date.now())

  // 实时更新计时
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(interval)
  }, [isActive])

  const progress = totalLength > 0 ? Math.round((currentIndex / totalLength) * 100) : 0

  // 练习结束后显示最终统计
  if (stats) {
    return (
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatItem label="速度 (WPM)" value={`${stats.wpm}`} color="#5dade2" />
        <StatItem
          label="准确率"
          value={`${stats.accuracy}%`}
          color={stats.accuracy >= 95 ? '#2ecc71' : stats.accuracy >= 85 ? '#f1c40f' : '#e74c3c'}
        />
        <StatItem label="用时" value={`${stats.duration}s`} />
        <StatItem label="进度" value="100%" color="#2ecc71" />
      </div>
    )
  }

  // 练习中 - 实时统计
  if (isActive && startTime) {
    const elapsedMs = now - startTime
    const minutes = elapsedMs / 60000
    const liveWpm = minutes > 0 ? Math.round((correctCount / 5) / minutes) : 0
    const liveAccuracy = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 100
    const elapsedSec = Math.floor(elapsedMs / 1000)
    const timeStr = `${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, '0')}`

    return (
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatItem label="速度 (WPM)" value={`${liveWpm}`} color="#5dade2" />
        <StatItem
          label="准确率"
          value={`${liveAccuracy}%`}
          color={liveAccuracy >= 95 ? '#2ecc71' : liveAccuracy >= 85 ? '#f1c40f' : '#e74c3c'}
        />
        <StatItem label="用时" value={timeStr} />
        <StatItem
          label="进度"
          value={`${progress}%`}
          color={progress > 80 ? '#2ecc71' : '#8892a4'}
        />
      </div>
    )
  }

  // 未开始
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <StatItem label="速度 (WPM)" value="--" />
      <StatItem label="准确率" value="--" />
      <StatItem label="用时" value="--" />
      <StatItem label="进度" value="0%" />
    </div>
  )
}

export default StatsPanel
