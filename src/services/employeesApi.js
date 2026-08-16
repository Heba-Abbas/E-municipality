import api from "./api";

// =====================================================
// جلب الموظفين
// =====================================================

export const getEmployees = async () => {
  const response = await api.get("/admin/employees");
  return response.data;
};

// =====================================================
// إضافة موظف
// =====================================================

export const registerEmployee = async (employeeData) => {
  const response = await api.post(
    "/auth/register-employee",
    employeeData
  );

  return response.data;
};

export default api;