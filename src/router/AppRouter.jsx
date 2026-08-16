import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

import LoginPage from "../components/Auth/LoginPage";
import ResetPasswordPage from "../components/Auth/ResetPasswordPage";
import VerifyEmailPage from "../components/Auth/VerifyEmailPage";
import AddPasswordPage from "../components/Auth/AddPasswordPage";

import DashboardPage from "../pages/DashboardPage";
import CitizensPage from "../pages/CitizensPage";
import EmployeesPage from "../pages/EmployeesPage";
import ComingSoonPage from "../pages/ComingSoonPage";
import RolesPermissionsPage from "../pages/RolesPermissionsPage";
import MunicipalitiesPage from "../pages/MunicipalitiesPage";

import ServiceTypesPage from "../pages/ServiceTypesPage";
import TechnicalOfficeRequestsPage from "../pages/TechnicalOfficeRequestsPage";
import EngineeringOfficeRequestsPage from "../pages/EngineeringOfficeRequestsPage";
import MayorRequestsPage from "../pages/MayorRequestsPage";
import FieldInspectorPage from "../pages/FieldInspectorPage";

import ChangeTemporaryPasswordPage from "../pages/ChangeTemporaryPasswordPage";

// =====================================================
// الشكاوى
// =====================================================

import ComplaintReportsPage from "../pages/ComplaintReportsPage";
import ComplaintReportDetailsPage from "../pages/ComplaintReportDetailsPage";
import UnifiedComplaintsPage from "../pages/UnifiedComplaintsPage";
import UnifiedComplaintDetailsPage from "../pages/UnifiedComplaintDetailsPage";
import DepartmentComplaintsPage from "../pages/DepartmentComplaintsPage";
import DepartmentComplaintDetailsPage from "../pages/DepartmentComplaintDetailsPage";

// =====================================================
// الملف الشخصي
// =====================================================

import ProfilePage from "../pages/ProfilePage";

function AppRouter() {
  return (
    <Routes>

      {/* =====================================================
          صفحات المصادقة
      ===================================================== */}

      <Route element={<MainLayout />}>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/add-password"
          element={<AddPasswordPage />}
        />

      </Route>

      {/* =====================================================
          صفحات لوحة التحكم
      ===================================================== */}

      <Route element={<DashboardLayout />}>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/dashboard/employees"
          element={<EmployeesPage />}
        />

        <Route
          path="/dashboard/news"
          element={
            <ComingSoonPage title="الأخبار" />
          }
        />

        <Route
          path="/dashboard/events"
          element={
            <ComingSoonPage title="الفعاليات" />
          }
        />

        <Route
          path="/dashboard/users"
          element={<CitizensPage />}
        />

        <Route
          path="/dashboard/services"
          element={<ServiceTypesPage />}
        />

        <Route
          path="/dashboard/departments"
          element={
            <ComingSoonPage title="الأقسام" />
          }
        />

        <Route
          path="/dashboard/municipalities"
          element={<MunicipalitiesPage />}
        />

        <Route
          path="/dashboard/roles-permissions"
          element={<RolesPermissionsPage />}
        />

        {/* =====================================================
            المكتب الفني
        ===================================================== */}

        <Route
          path="/dashboard/technical-office/service-requests"
          element={<TechnicalOfficeRequestsPage />}
        />

        {/* =====================================================
            المكتب الهندسي
        ===================================================== */}

        <Route
          path="/dashboard/engineering-office/service-requests"
          element={<EngineeringOfficeRequestsPage />}
        />

        {/* =====================================================
            رئيس البلدية
        ===================================================== */}

        <Route
          path="/dashboard/mayor/service-requests"
          element={<MayorRequestsPage />}
        />

        {/* =====================================================
            المفتش الميداني
        ===================================================== */}

        <Route
          path="/dashboard/field-inspector/service-requests"
          element={<FieldInspectorPage />}
        />

        {/* =====================================================
            إدارة أنواع المعاملات
        ===================================================== */}

        <Route
          path="/dashboard/admin/service-requests"
          element={<ServiceTypesPage />}
        />

        {/* =====================================================
            تغيير كلمة المرور المؤقتة
        ===================================================== */}

        <Route
          path="/change-temporary-password"
          element={<ChangeTemporaryPasswordPage />}
        />

        {/* =====================================================
            الشكاوى — المكتب الفني
        ===================================================== */}

        <Route
          path="/dashboard/complaints/reports"
          element={<ComplaintReportsPage />}
        />

        <Route
          path="/dashboard/complaints/reports/:id"
          element={<ComplaintReportDetailsPage />}
        />

        <Route
          path="/dashboard/complaints/unified"
          element={<UnifiedComplaintsPage />}
        />

        <Route
          path="/dashboard/complaints/unified/:id"
          element={<UnifiedComplaintDetailsPage />}
        />

        {/* =====================================================
            الشكاوى — مدير القسم
        ===================================================== */}

        <Route
          path="/dashboard/complaints/department"
          element={<DepartmentComplaintsPage />}
        />

        <Route
          path="/dashboard/complaints/department/:id"
          element={<DepartmentComplaintDetailsPage />}
        />

        {/* =====================================================
            الملف الشخصي والإعدادات
        ===================================================== */}

        <Route
          path="/dashboard/profile"
          element={<ProfilePage />}
        />

      </Route>
    </Routes>
  );
}

export default AppRouter;