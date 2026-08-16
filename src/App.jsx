import './App.css'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { applyFontSize, getSavedFontSize } from './utils/fontSize'

function App() {
  //حجم الخط
  useEffect(() => {
    applyFontSize(getSavedFontSize())
  }, [])

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
