import React from 'react'

interface TextDisplayProps {
  text: string
  currentIndex: number
  typedChars: string[]
  composingText: string
}

const TextDisplay = React.forwardRef<HTMLDivElement, TextDisplayProps>(
  ({ text, currentIndex, typedChars, composingText }, ref) => {
    return (
      <div
        ref={ref}
        className="card p-6 mb-6 max-h-64 overflow-y-auto font-mono text-lg leading-relaxed tracking-wide select-none"
        tabIndex={-1}
      >
        <div className="flex flex-wrap gap-0 relative">
          {text.split('').map((char, index) => {
            let className = 'char-item inline-block transition-colors duration-75 '

            if (index === currentIndex && typedChars[index] === undefined) {
              // 当前待打字 - 显示拼音（如果有）
              className += composingText ? 'text-accent border-b-2 border-caret' : 'char-current'
            } else if (typedChars[index] !== undefined) {
              if (typedChars[index] === char) {
                className += 'char-correct'
              } else {
                className += 'char-error'
              }
            } else if (index < currentIndex) {
              className += 'char-error'
            } else {
              className += 'char-pending'
            }

            const displayChar = char === ' ' ? '\u00A0' : char

            return (
              <span key={index} className={className}>
                {displayChar}
              </span>
            )
          })}
        </div>

        {/* 拼音提示条 */}
        {composingText && (
          <div className="mt-3 pt-3 border-t border-bg-tertiary text-accent font-mono text-base animate-fade-in">
            <span className="text-text-secondary text-xs mr-2">IME:</span>
            {composingText}
            <span className="inline-block w-0.5 h-5 bg-caret ml-0.5 animate-pulse-caret align-middle" />
          </div>
        )}
      </div>
    )
  }
)

TextDisplay.displayName = 'TextDisplay'

export default TextDisplay
