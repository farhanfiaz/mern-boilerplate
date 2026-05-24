import { Redirect, Switch, Route } from "wouter";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import { useAuth } from "@/context/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>

      <Route path="/dashboard">
        <AdminLayout>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  );
}