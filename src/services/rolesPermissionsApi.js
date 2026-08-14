import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// Roles
// ===============================

export const getRoles = async () => {
  const response = await api.get("/admin/roles");

  return response.data;
};

// ===============================
// Add Role
// POST /api/admin/roles
// ===============================

export const createRole = async ({
  name,
  permissions = [],
}) => {
  const response = await api.post("/admin/roles", {
    name,
    permissions,
  });

  return response.data;
};

// ===============================
// Update Role
// PUT /api/admin/roles/{id}
// ===============================

export const updateRole = async (
  roleId,
  { name, permissions = [] }
) => {
  if (!roleId) {
    throw new Error("Role ID is required");
  }

  const response = await api.put(
    `/admin/roles/${roleId}`,
    {
      name,
      permissions,
    }
  );

  return response.data;
};

// ===============================
// Delete Role
// DELETE /api/admin/roles/{id}
// ===============================

export const deleteRole = async (roleId) => {
  if (!roleId) {
    throw new Error("Role ID is required");
  }

  const response = await api.delete(
    `/admin/roles/${roleId}`
  );

  // إذا كان Backend يرجع 204
  if (response.status === 204 || !response.data) {
    return {
      success: true,
      message: "The role has been successfully deleted.",
      data: null,
    };
  }

  return response.data;
};

// ===============================
// Permissions
// ===============================

export const getPermissions = async () => {
  const response = await api.get("/admin/permissions");

  return response.data;
};

// ===============================
// Add Permission To Role
// POST /api/admin/roles/{id}/permissions
// ===============================

export const addPermissionToRole = async (
  roleId,
  permissionName,
  currentPermissions = []
) => {
  if (!roleId) {
    throw new Error("Role ID is required");
  }

  if (!permissionName) {
    throw new Error("Permission name is required");
  }

  // الاحتفاظ بالأذونات الموجودة وإضافة الإذن الجديد
  const permissions = [
    ...new Set([
      ...currentPermissions,
      permissionName,
    ]),
  ];

  const response = await api.post(
    `/admin/roles/${roleId}/permissions`,
    {
      permissions,
    }
  );

  return response.data;
};

export default api;