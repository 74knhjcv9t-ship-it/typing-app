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
        className="card p-6 mb-6 max-h-64 overflow-y-auto font-mono text-lg leading-relaxed tracking-wide select-none"
        tabIndex={-1}
      >
        <div className="flex flex-wrap gap-0">
          {text.split('').map((char, index) => {
            let className = 'char-item inline-block transition-colors duration-75 '

            if (index === currentIndex && !typedChars[index]) {
              className += 'char-current'
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
      </div>
    )
  }
)

TextDisplay.displayName = 'TextDisplay'

export default TextDisplay
