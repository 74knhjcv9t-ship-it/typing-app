import React from 'react'

interface TextDisplayProps {
  text: string
  currentIndex: number
  typedChars: string[]
}

const TextDisplay = React.forwardRef<HTMLDivElement, TextDisplayProps>(
  ({ text, currentIndex, typedChars }, ref) => {
    return (
      <div
        ref={ref}
        className="sketch-card mb-4 max-h-64 overflow-y-auto font-mono text-lg leading-relaxed tracking-wide select-none animate-sketch-in"
        tabIndex={-1}
      >
        {/* 顶部装饰线 */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dashed border-warm-border">
          <span className="text-xs text-ink-lighter font-handwriting tracking-wider">type here</span>
          <span className="flex-1" />
          <span className="inline-block w-4 h-4 rounded-full border-2 border-ink-lighter" />
        </div>

        <div className="flex flex-wrap gap-0">
          {text.split('').map((char, index) => {
            let className = 'char-item inline-block transition-colors duration-100 leading-relaxed '

            if (index === currentIndex && typedChars[index] === undefined) {
              className += 'char-current'
            } else if (typedChars[index] !== undefined) {
              if (typedChars[index] === char) {
                className += 'char-correct'
              } else {
                className += 'char-error'
              }
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
      </div>
    )
  }
)

TextDisplay.displayName = 'TextDisplay'

export default TextDisplay
