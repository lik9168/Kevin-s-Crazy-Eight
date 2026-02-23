# KEVIN'S CRAZY EIGHTS

一个基于 React + Vite 开发的经典“变色龙”（Crazy Eights）纸牌游戏。

## 游戏特色

- **经典规则**：支持 8 点万能牌、花色/点数匹配。
- **智能 AI**：具有挑战性的 AI 对手。
- **最佳出牌提示**：自动计算并用红色边框提示当前手牌中的最佳选择。
- **响应式设计**：完美适配手机、平板和桌面端。
- **精美动画**：基于 `motion` 实现流畅的卡牌交互。

## 本地开发

1. 克隆仓库：
   ```bash
   git clone <your-repo-url>
   cd crazy-eights
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库。
2. 在 [Vercel 控制台](https://vercel.com) 中导入该仓库。
3. **重要**：在 Vercel 项目设置中添加环境变量 `GEMINI_API_KEY`（虽然本项目目前主要运行在客户端，但 Vite 配置中引用了该变量）。
4. 点击部署。

## 技术栈

- React 19
- Vite
- Tailwind CSS 4
- Framer Motion (motion)
- Lucide React (图标)
