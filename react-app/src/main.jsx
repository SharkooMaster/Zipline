import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/app-state.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AppProvider>
        <App />
    </AppProvider>
  </HashRouter>
)
