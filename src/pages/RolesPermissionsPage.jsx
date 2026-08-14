import React, { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import RolesHeader from "../components/RolesPermissions/RolesHeader";
import RolesList from "../components/RolesPermissions/RolesList";
import PermissionsPanel from "../components/RolesPermissions/PermissionsPanel";
import RoleModal from "../components/RolesPermissions/RoleModal";

import {
  getRoles,
  getPermissions,
  addPermissionToRole,
  createRole,
  updateRole,
  deleteRole,
} from "../services/rolesPermissionsApi";

function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionSearch, setPermissionSearch] = useState("");

  const [selectedRole, setSelectedRole] = useState(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState("add");
  const [roleToEdit, setRoleToEdit] = useState(null);

  const [roleActionLoading, setRoleActionLoading] = useState(false);
  const [addingPermissionId, setAddingPermissionId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Load Roles + Permissions
  // ==========================================

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [rolesResponse, permissionsResponse] =
        await Promise.all([
          getRoles(),
          getPermissions(),
        ]);

      if (!rolesResponse.success) {
        throw new Error(
          rolesResponse.message ||
            "فشل في جلب الأدوار"
        );
      }

      if (!permissionsResponse.success) {
        throw new Error(
          permissionsResponse.message ||
            "فشل في جلب الأذونات"
        );
      }

      const fetchedRoles = rolesResponse.data || [];
      const fetchedPermissions =
        permissionsResponse.data || [];

      setRoles(fetchedRoles);
      setPermissions(fetchedPermissions);

      // الحفاظ على الدور المحدد إن كان موجوداً
      setSelectedRole((currentRole) => {
        if (!fetchedRoles.length) {
          return null;
        }

        if (!currentRole) {
          return fetchedRoles[0];
        }

        return (
          fetchedRoles.find(
            (role) => role.id === currentRole.id
          ) || fetchedRoles[0]
        );
      });
    } catch (error) {
      console.error(
        "Roles & Permissions Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء تحميل الأدوار والأذونات"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // Add Role
  // ==========================================

  const handleOpenAddRole = () => {
    setRoleModalMode("add");
    setRoleToEdit(null);
    setRoleModalOpen(true);
  };

  const handleCreateRole = async (roleData) => {
    try {
      setRoleActionLoading(true);
      setError("");

      const response = await createRole(roleData);

      if (!response.success) {
        throw new Error(
          response.message ||
            "فشل في إضافة الدور"
        );
      }

      /*
       * الـ response الذي يرجعه Backend:
       *
       * {
       *   success: true,
       *   data: {
       *     id: 9,
       *     name: "test",
       *     permissions: [...]
       *   }
       * }
       */

      const newRole = response.data;

      // إضافة الدور مباشرة للواجهة
      setRoles((currentRoles) => [
        ...currentRoles,
        newRole,
      ]);

      // تحديد الدور الجديد
      setSelectedRole(newRole);

      // إغلاق المودال
      setRoleModalOpen(false);
      setRoleToEdit(null);
    } catch (error) {
      console.error(
        "Create Role Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء إضافة الدور"
      );
    } finally {
      setRoleActionLoading(false);
    }
  };

  // ==========================================
  // Edit Role
  // ==========================================

  const handleOpenEditRole = (role) => {
    setRoleModalMode("edit");
    setRoleToEdit(role);
    setRoleModalOpen(true);
  };

  const handleUpdateRole = async (roleData) => {
    if (!roleToEdit) {
      return;
    }

    try {
      setRoleActionLoading(true);
      setError("");

      const response = await updateRole(
        roleToEdit.id,
        roleData
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "فشل في تعديل الدور"
        );
      }

      const updatedRole = response.data;

      // تحديث القائمة
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === updatedRole.id
            ? updatedRole
            : role
        )
      );

      // تحديث الدور المحدد
      setSelectedRole((currentRole) =>
        currentRole?.id === updatedRole.id
          ? updatedRole
          : currentRole
      );

      // إغلاق المودال
      setRoleModalOpen(false);
      setRoleToEdit(null);
    } catch (error) {
      console.error(
        "Update Role Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء تعديل الدور"
      );
    } finally {
      setRoleActionLoading(false);
    }
  };

  // ==========================================
  // Delete Role
  // ==========================================

  const handleDeleteRole = async (role) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الدور "${role.name}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await deleteRole(role.id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "فشل في حذف الدور"
        );
      }

      /*
       * نحذف الدور من الواجهة
       */
      setRoles((currentRoles) => {
        const updatedRoles = currentRoles.filter(
          (currentRole) =>
            currentRole.id !== role.id
        );

        /*
         * إذا كان الدور المحذوف هو المحدد
         * نختار أول دور متبقي
         */
        setSelectedRole((currentSelectedRole) => {
          if (
            currentSelectedRole?.id !== role.id
          ) {
            return currentSelectedRole;
          }

          return updatedRoles[0] || null;
        });

        return updatedRoles;
      });
    } catch (error) {
      console.error(
        "Delete Role Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء حذف الدور"
      );
    }
  };

  // ==========================================
  // Add Permission To Role
  // ==========================================

  const handleAddPermission = async (
    permission
  ) => {
    if (!selectedRole) {
      return;
    }

    try {
      setAddingPermissionId(permission.id);
      setError("");

     const currentPermissions =
  (selectedRole.permissions || []).map((permission) =>
    typeof permission === "string"
      ? permission
      : permission.name
  );

const response =
  await addPermissionToRole(
    selectedRole.id,
    permission.name,
    currentPermissions
  );

      if (!response.success) {
        throw new Error(
          response.message ||
            "فشل في إضافة الإذن"
        );
      }

      /*
       * نعيد جلب الأدوار من Backend
       * حتى نحصل على permissions الجديدة.
       */
      const rolesResponse = await getRoles();

      if (!rolesResponse.success) {
        throw new Error(
          rolesResponse.message ||
            "فشل في تحديث الأدوار"
        );
      }

      const updatedRoles =
        rolesResponse.data || [];

      setRoles(updatedRoles);

      const updatedSelectedRole =
        updatedRoles.find(
          (role) =>
            role.id === selectedRole.id
        );

      if (updatedSelectedRole) {
        setSelectedRole(
          updatedSelectedRole
        );
      }
    } catch (error) {
      console.error(
        "Add Permission Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء إضافة الإذن"
      );
    } finally {
      setAddingPermissionId(null);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />

          جاري تحميل الأدوار والأذونات...
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-4 lg:space-y-5">
      <RolesHeader
        rolesCount={roles.length}
        permissionsCount={
          // show count based on currently filtered permissions
          permissionSearch
            ? permissions.filter((p) =>
                p.name.toLowerCase().includes(permissionSearch.trim().toLowerCase())
              ).length
            : permissions.length
        }
      />

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <RolesList
          roles={roles}
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          onAddRole={handleOpenAddRole}
          onEditRole={handleOpenEditRole}
          onDeleteRole={handleDeleteRole}
        />

        <PermissionsPanel
          role={selectedRole}
          permissions={permissions}
          search={permissionSearch}
          setSearch={setPermissionSearch}
          onAddPermission={handleAddPermission}
          addingPermissionId={addingPermissionId}
        />
      </div>

      <RoleModal
        isOpen={roleModalOpen}
        mode={roleModalMode}
        role={roleToEdit}
        permissions={permissions}
        isLoading={roleActionLoading}
        onClose={() => {
          if (!roleActionLoading) {
            setRoleModalOpen(false);
            setRoleToEdit(null);
          }
        }}
        onSubmit={
          roleModalMode === "edit"
            ? handleUpdateRole
            : handleCreateRole
        }
      />
    </div>
  );
}

export default RolesPermissionsPage;