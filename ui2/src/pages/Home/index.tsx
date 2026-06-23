import './index.scss'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">欢迎使用 ui2</h1>
        <p className="hero-desc">
          基于 React 19 + Vite + TypeScript + SCSS + React Router + Jotai 构建的现代 Web 应用。
        </p>
        <div className="hero-tags">
          <span className="tag">React 19</span>
          <span className="tag">Vite</span>
          <span className="tag">TypeScript</span>
          <span className="tag">SCSS</span>
          <span className="tag">React Router</span>
          <span className="tag">Jotai</span>
        </div>
      </section>
    </div>
  )
}

export default Home
