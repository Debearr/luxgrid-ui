import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import EnhancedMarketDashboard from './components/EnhancedMarketDashboard'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <EnhancedMarketDashboard />
  </React.StrictMode>
)

