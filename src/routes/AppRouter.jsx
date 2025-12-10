import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Applications from '../pages/Applications'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../components/AppLayout'

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/applications" replace />} />
      <Route path="applications" element={<Applications />} />
    </Route>
    <Route path="*" element={<Navigate to="/applications" replace />} />
  </Routes>
)

export default AppRouter

