import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/Home/index')).default,
        }),
      },
      {
        path: 'about',
        lazy: async () => ({
          Component: (await import('./pages/About/index')).default,
        }),
      },
    ],
  },
])

export { router }
