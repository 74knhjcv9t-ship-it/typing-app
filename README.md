# TypePrac - 打字练习 App

一个在电脑上使用的打字练习工具，支持中英双语，内置多种练习文本，实时统计速度和准确率。

## 功能

- **中英双语练习**：内置 8 篇不同难度和语言的练习文本
- **实时统计**：边打边看 WPM、准确率、用时、进度
- **自定义文本**：粘贴自己的文本进行针对性练习
- **历史记录**：自动保存练习结果，追踪进步曲线
- **评级系统**：根据速度和准确率给出等级评价

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 进入项目目录
cd typing-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 访问地址

启动后访问 http://localhost:5173

## 使用说明

1. 选择内置文本或切换到"自定义文本"粘贴内容
2. 点击"开始练习"或直接按任意键开始打字
3. 实时查看速度（WPM）和准确率
4. 打完所有文字后自动弹出结果
5. 历史记录自动保存，可在页面底部查看

## 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- localStorage 数据持久化

## 目录结构

```
src/
├── components/       # UI 组件
│   ├── TextDisplay   # 原文逐字显示
│   ├── StatsPanel    # 实时统计面板
│   ├── ModeSelector  # 文本选择器
│   ├── ResultModal   # 结果弹窗
│   └── HistoryPanel  # 历史记录
├── data/
│   └── texts.ts      # 内置练习文本
├── hooks/
│   └── useTyping.ts  # 打字逻辑 Hook
├── utils/
│   ├── stats.ts      # 统计计算
│   └── history.ts    # 本地存储
└── App.tsx           # 主应用
```
