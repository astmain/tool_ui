import { Outlet, Link } from 'react-router-dom'
import './index.scss'

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/" className="nav-logo">ui2</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/about" className="nav-link">关于</Link>
          </div>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>&copy; {new Date().getFullYear()} ui2. Built with React 19.</p>
      </footer>
    </div>
  )
}

export default Layout
