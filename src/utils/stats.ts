export interface TypingStats {
  wpm: number;
  accuracy: number;
  duration: number; // seconds
  totalChars: number;
  correctChars: number;
  errors: number;
}

/**
 * 计算打字统计
 * @param totalChars 总输入字符数
 * @param correctChars 正确字符数
 * @param durationMs 用时（毫秒）
 * @param textLength 原文总长度
 */
export function calculateStats(
  totalChars: number,
  correctChars: number,
  durationMs: number,
  textLength: number
): TypingStats {
  const duration = durationMs / 1000 // 转换为秒
  const minutes = duration / 60
  const errors = totalChars - correctChars

  // WPM: 平均每分钟打多少个单词（1 word = 5 个字符）
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0

  // 准确率
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

  return {
    wpm: Math.max(0, wpm),
    accuracy: Math.min(100, accuracy),
    duration: Math.round(duration),
    totalChars,
    correctChars,
    errors,
  }
}

/**
 * 根据 WPM 返回评级
 */
export function getRating(wpm: number, accuracy: number): { label: string; color: string } {
  if (accuracy < 85) return { label: '需练习', color: '#e74c3c' }
  if (wpm < 20) return { label: '初学者', color: '#f39c12' }
  if (wpm < 40) return { label: '进阶中', color: '#f1c40f' }
  if (wpm < 60) return { label: '熟练', color: '#2ecc71' }
  if (wpm < 80) return { label: '高手', color: '#5dade2' }
  return { label: '大师级', color: '#9b59b6' }
}
