export interface PracticeText {
  id: string;
  title: string;
  content: string;
  lang: 'en' | 'zh' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const practiceTexts: PracticeText[] = [
  {
    id: 'en-1',
    title: 'The Power of Consistency',
    lang: 'en',
    difficulty: 'easy',
    content:
      'Success is the product of daily habits, not once-in-a-lifetime transformations. The key to achieving anything meaningful is showing up every day, even when you do not feel like it. Small actions repeated consistently lead to remarkable results over time. Focus on the process, not just the outcome, and let your habits shape your future.',
  },
  {
    id: 'en-2',
    title: 'Technology and Innovation',
    lang: 'en',
    difficulty: 'medium',
    content:
      'Technology is evolving at an unprecedented pace, reshaping every aspect of our lives. From artificial intelligence to quantum computing, the boundaries of what is possible are expanding daily. However, with great power comes great responsibility. We must ensure that these innovations serve humanity as a whole, bridging gaps rather than creating new ones. The future belongs to those who can adapt, learn, and grow alongside these changes.',
  },
  {
    id: 'en-3',
    title: 'The Art of Programming',
    lang: 'en',
    difficulty: 'hard',
    content:
      'Programming is not merely about writing code; it is a discipline of logical thinking and creative problem solving. A well-designed program reads like a carefully crafted piece of literature, where every function has a clear purpose and every variable tells a story. The best developers understand that code is written for humans to read first, and for machines to execute second. Clean code, meaningful comments, and thoughtful architecture distinguish exceptional engineers from average ones. Mastering this craft requires patience, curiosity, and an unwavering commitment to continuous improvement.',
  },
  {
    id: 'zh-1',
    title: '坚持的力量',
    lang: 'zh',
    difficulty: 'easy',
    content:
      '成功是日常习惯的产物，而非一生一次的转变。实现任何有意义的事情的关键在于每天都坚持行动，即使在你不想做的时候也是如此。微小的行动如果持续重复，随着时间的推移就会带来显著的结果。专注于过程而不仅仅是结果，让你的习惯塑造你的未来。',
  },
  {
    id: 'zh-2',
    title: '学习与成长',
    lang: 'zh',
    difficulty: 'medium',
    content:
      '学习是一段永无止境的旅程。在这个信息爆炸的时代，保持好奇心比以往任何时候都更加重要。真正的成长来自于走出舒适区，勇敢面对未知的挑战。每一次失败都是一次学习的机会，每一次挫折都是通往成功的垫脚石。不要害怕犯错，因为错误本身就是最好的老师。持续学习、不断进步，这才是人生最宝贵的财富。',
  },
  {
    id: 'zh-3',
    title: '编程思维',
    lang: 'zh',
    difficulty: 'hard',
    content:
      '编程不仅仅是编写代码，它更是一种逻辑思维和创造性问题解决的艺术。一个设计良好的程序读起来就像一部精心撰写的文学作品，每个函数都有明确的用途，每个变量都在讲述一个故事。优秀的开发者深知，代码首先是写给人类阅读的，其次才是给机器执行的。整洁的代码、有意义的注释和深思熟虑的架构，这些都是区分优秀工程师与普通工程师的关键要素。掌握这门技艺需要耐心、好奇心和持续改进的坚定承诺。',
  },
  {
    id: 'mixed-1',
    title: '中英双语 - 科技名言',
    lang: 'mixed',
    difficulty: 'medium',
    content:
      'Steve Jobs once said: "Stay hungry, stay foolish." This simple phrase captures the essence of innovation and lifelong learning. 在科技行业，变化是唯一不变的真理。Those who embrace change and adapt quickly will thrive in this dynamic environment. The best way to predict the future is to create it. 正如 Alan Kay 所说，预测未来的最好方式就是创造未来。',
  },
  {
    id: 'mixed-2',
    title: '中英双语 - 编程箴言',
    lang: 'mixed',
    difficulty: 'hard',
    content:
      'In the world of software, the most beautiful code is the code that never has to be written. 优秀的程序员懂得简洁的力量。"Any fool can write code that a computer can understand," said Martin Fowler, "good programmers write code that humans can understand." 写代码是一种沟通，不仅是与计算机沟通，更是与未来的自己和其他开发者沟通。可读性永远比炫技更重要。',
  },
]

export function getTextsByLang(lang: 'en' | 'zh' | 'mixed' | 'all'): PracticeText[] {
  if (lang === 'all') return practiceTexts
  return practiceTexts.filter((t) => t.lang === lang)
}

export function getTextById(id: string): PracticeText | undefined {
  return practiceTexts.find((t) => t.id === id)
}
