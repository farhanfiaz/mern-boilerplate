import { StrictMode } from 'react'
import './App.css'
import { QueryProvider } from './providers/query-provider'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from './components/ui/toaster'

function App() {

  return (
    <StrictMode>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </StrictMode>
  )
}

export default App
