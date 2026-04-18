import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Changed from ../Frontend/src/index.css
import App from './App' // Changed from ../src/App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)