import './index.scss'

function About() {
  return (
    <div className="about">
      <h1 className="about-title">关于 ui2</h1>
      <p className="about-desc">
        这是一个使用现代前端技术栈构建的 React 19 Web 应用脚手架。
      </p>
      <ul className="about-list">
        <li>React 19 — 最新稳定版框架</li>
        <li>Vite — 极速开发服务器和构建工具</li>
        <li>TypeScript — 类型安全</li>
        <li>SCSS — 强大灵活的样式解决方案</li>
        <li>React Router v7 — 客户端路由</li>
        <li>Jotai — 原子化状态管理</li>
      </ul>
    </div>
  )
}

export default About
