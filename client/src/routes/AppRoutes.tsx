import { Redirect, Switch, Route } from "wouter";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import MultipleRole from "@/pages/auth/MultipleRole";
import Tenant from "@/pages/tenant/Tenant";
import Roles from "@/pages/permission/Roles";
import UserRoleAccess from "@/pages/permission/UserRoleAccess";
import RoleAccess from "@/pages/permission/RoleAccess";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {!user ? (
          <Login />
        ) : user.user.role.length > 1 ? (
          <Redirect to="/multiple-role" />
        ) : (
          <Redirect to="/dashboard" />
        )}
      </Route>
      <Route path="/dashboard">
        <AdminLayout>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/multiple-role">
        <ProtectedRoute>
          <MultipleRole />
        </ProtectedRoute>
      </Route>

      <Route path="/register">
        <Register />
      </Route>

      <Route path="/tenant">
        <AdminLayout>
          <ProtectedRoute>
            <Tenant />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/roles">
        <AdminLayout>
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/user-access">
        <AdminLayout>
          <ProtectedRoute>
            <UserRoleAccess />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/role-access">
        <AdminLayout>
          <ProtectedRoute>
            <RoleAccess />
          </ProtectedRoute>
        </AdminLayout>
      </Route>

      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  );
}