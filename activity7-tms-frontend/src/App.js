import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AdminLayout from './components/layout/admin/AdminLayout';
import UserLayout from './components/layout/user/UserLayout';
import Dashboard from './pages/adminSide/Dashboard';
import Projects from './pages/adminSide/Projects';
import Settings from './pages/adminSide/Settings';
import Tasks from './pages/adminSide/Tasks';
import Users from './pages/adminSide/Users';
import UserDashboard from './pages/userSide/Dashboard';
import UserProjects from './pages/userSide/Projects';
import UserTasks from './pages/userSide/Tasks';
import UserSettings from './pages/userSide/Settings';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import ForgotPassword from './pages/auth/forgotpassword';

const resolveHomePath = (role) => {
  const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';

  if (normalizedRole === 'admin') {
    return '/adminSide/dashboard';
  }

  if (normalizedRole === 'user') {
    return '/userSide/dashboard';
  }

  return '/login';
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to={resolveHomePath(normalizedRole)} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  if (token) {
    return <Navigate to={resolveHomePath(role)} replace />;
  }

  return children;
};

const RoleRedirect = () => {
  const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  return <Navigate to={resolveHomePath(role)} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={(
            <GuestRoute>
              <Login />
            </GuestRoute>
          )}
        />
        <Route
          path="/signup"
          element={(
            <GuestRoute>
              <Signup />
            </GuestRoute>
          )}
        />
        <Route
          path="/forgot-password"
          element={(
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          )}
        />
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/adminSide"
          element={(
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to="/adminSide/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="/userSide"
          element={(
            <ProtectedRoute allowedRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to="/userSide/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="projects" element={<UserProjects />} />
          <Route path="tasks" element={<UserTasks />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        <Route path="/adminSide/*" element={<Navigate to="/adminSide/dashboard" replace />} />
        <Route path="/userSide/*" element={<Navigate to="/userSide/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
