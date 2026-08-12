import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../components/Dashboard/DashboardLayout'
import LoginPage from '../components/Auth/LoginPage'
import ResetPasswordPage from '../components/Auth/ResetPasswordPage'
import VerifyEmailPage from '../components/Auth/VerifyEmailPage'
import AddPasswordPage from '../components/Auth/AddPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import CitizensPage from '../pages/CitizensPage'
import ComingSoonPage from '../pages/ComingSoonPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/add-password" element={<AddPasswordPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/employees" element={<ComingSoonPage title="الموظفين" />} />
        <Route path="/dashboard/news" element={<ComingSoonPage title="الأخبار" />} />
        <Route path="/dashboard/events" element={<ComingSoonPage title="الفعاليات" />} />
        <Route path="/dashboard/users" element={<CitizensPage />} />
        <Route path="/dashboard/operationslog" element={<ComingSoonPage title="سجل العمليات" />} />
        <Route path="/dashboard/services" element={<ComingSoonPage title="الخدمات" />} />
        <Route path="/dashboard/departments" element={<ComingSoonPage title="الأقسام" />} />

      </Route>
    </Routes>
  )
}

export default AppRouter