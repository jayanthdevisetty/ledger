import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: { background: '#10b981', color: '#fff' },
              iconTheme: { primary: '#fff', secondary: '#10b981' },
            },
            error: {
              style: { background: '#ef4444', color: '#fff' },
              iconTheme: { primary: '#fff', secondary: '#ef4444' },
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
