import { StrictMode } from 'react'
import './App.css'
import { QueryProvider } from './providers/query-provider'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <StrictMode>
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />

            {/* ✅ GLOBAL TOAST CONTAINER */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
            />
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </StrictMode>
  )
}

export default App
