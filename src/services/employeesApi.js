import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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