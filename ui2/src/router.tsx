import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home'),
      },
      {
        path: 'about',
        lazy: () => import('./pages/About'),
      },
    ],
  },
])

export { router }
