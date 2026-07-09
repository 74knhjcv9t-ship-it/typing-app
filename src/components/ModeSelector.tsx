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
    <div className="sketch-card mb-4">
      {/* 模式切换 */}
      <div className="flex gap-0 mb-4">
        <button
          className={`mode-btn ${mode === 'builtin' ? 'mode-btn-active' : ''}`}
          onClick={() => onModeChange('builtin')}
        >
          精选文本
        </button>
        <button
          className={`mode-btn ${mode === 'custom' ? 'mode-btn-active' : ''}`}
          onClick={() => onModeChange('custom')}
        >
          自定义
        </button>
      </div>

      {mode === 'builtin' ? (
        <div>
          <label className="text-ink-lighter text-xs block mb-2 font-handwriting tracking-wider">
            choose your text
          </label>
          <select
            value={selectedId}
            onChange={(e) => {
              const text = practiceTexts.find((t) => t.id === e.target.value)
              if (text) onSelect(text)
            }}
            className="sketch-select"
          >
            {practiceTexts.map((t) => (
              <option key={t.id} value={t.id}>
                {t.source ? `【${t.source}】` : ''}{t.title}
                {' · '}
                {t.lang === 'en' ? '英文' : t.lang === 'zh' ? '中文' : '中英'}
                {' · '}
                {t.difficulty === 'easy' ? '简单' : t.difficulty === 'medium' ? '中等' : '困难'}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="text-ink-lighter text-xs block mb-2 font-handwriting tracking-wider">
            paste your own text
          </label>
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="在此粘贴你想练习的文本……"
            rows={4}
            className="typing-textarea !rounded-[8px_60px_8px_80px/60px_8px_80px_8px]"
          />
        </div>
      )}
    </div>
  )
}

export default ModeSelector
