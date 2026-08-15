import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../components/Dashboard/DashboardLayout'
import LoginPage from '../components/Auth/LoginPage'
import ResetPasswordPage from '../components/Auth/ResetPasswordPage'
import VerifyEmailPage from '../components/Auth/VerifyEmailPage'
import AddPasswordPage from '../components/Auth/AddPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import CitizensPage from '../pages/CitizensPage'
import EmployeesPage from './../pages/EmployeesPage'
import ComingSoonPage from '../pages/ComingSoonPage'
import RolesPermissionsPage from "./../pages/RolesPermissionsPage";
import MunicipalitiesPage from './../pages/MunicipalitiesPage';
import ServiceTypesPage from "../pages/ServiceTypesPage";

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
        <Route path="/dashboard/employees" element={<EmployeesPage/>} />
        <Route path="/dashboard/news" element={<ComingSoonPage title="الأخبار" />} />
        <Route path="/dashboard/events" element={<ComingSoonPage title="الفعاليات" />} />
        <Route path="/dashboard/users" element={<CitizensPage />} />
       <Route path="/dashboard/services" element={<ServiceTypesPage />} />
        <Route path="/dashboard/departments" element={<ComingSoonPage title="الأقسام" />} />
        <Route path="/dashboard/municipalities" element={<MunicipalitiesPage />} />
        <Route path="/dashboard/roles-permissions" element={<RolesPermissionsPage />}
/>
      </Route>
    </Routes>
  )
}

export default AppRouter