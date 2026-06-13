import { StrictMode } from 'react'
import './App.css'
import { QueryProvider } from './providers/query-provider'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from './components/ui/toaster'
import { useAppEvents } from './hooks/useAppEvents';
import logger from './utils/logger'
import { queryClient } from './providers/query-provider';


function App() {

  useAppEvents((event) => {
    switch (event.type) {
      case "LOGIN":
        logger.info("login sync across tabs", event.userId);
        window.location.href = "/dashboard";
        break;

      case "LOGOUT":
        logger.info("logout all tabs");

        queryClient.clear();
        window.location.href = "/login";
        break;

      case "COMPANY_CHANGED":
        logger.info("company changed:", event.companyId);

        queryClient.refetchQueries({ type: "active" });
        break;

      case "ROLE_SELECTED":
        logger.info("role selected:", event.roleId);
        queryClient.clear();
        window.location.href = "/dashboard";
        break;
    }
  });

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
