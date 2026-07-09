import React from 'react'
import { PracticeText, practiceTexts } from '../data/texts'

interface ModeSelectorProps {
  selectedId: string
  onSelect: (text: PracticeText) => void
  customText: string
  onCustomTextChange: (text: string) => void
  mode: 'builtin' | 'custom'
  onModeChange: (mode: 'builtin' | 'custom') => void
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedId,
  onSelect,
  customText,
  onCustomTextChange,
  mode,
  onModeChange,
}) => {
  return (
    <div className="card p-5 mb-6">
      {/* 模式切换 */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'builtin'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onModeChange('builtin')}
        >
          内置文本
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'custom'
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onModeChange('custom')}
        >
          自定义文本
        </button>
      </div>

      {mode === 'builtin' ? (
        <div>
          <label className="text-text-secondary text-sm block mb-2">选择练习文本</label>
          <select
            value={selectedId}
            onChange={(e) => {
              const text = practiceTexts.find((t) => t.id === e.target.value)
              if (text) onSelect(text)
            }}
            className="w-full bg-bg-tertiary text-text-primary border border-bg-tertiary rounded-lg px-4 py-2.5
                       focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
          >
            {practiceTexts.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.lang === 'en' ? '英文' : t.lang === 'zh' ? '中文' : '中英'}] {t.title}
                {' - '}
                {t.difficulty === 'easy' ? '简单' : t.difficulty === 'medium' ? '中等' : '困难'}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="text-text-secondary text-sm block mb-2">
            粘贴或输入你想练习的文本
          </label>
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="在此粘贴你的文本..."
            rows={4}
            className="w-full bg-bg-tertiary text-text-primary border border-bg-tertiary rounded-lg px-4 py-2.5
                       focus:outline-none focus:border-accent transition-colors resize-none placeholder-text-secondary/50"
          />
        </div>
      )}
    </div>
  )
}

export default ModeSelector
