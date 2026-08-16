import { useCallback, useEffect, useMemo, useState } from "react";

import EmployeesHeader from "../components/Employees/EmployeesHeader";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import EmployeePagination from "../components/Employees/EmployeePagination";
import AddEmployeeForm from "../components/Employees/AddEmployeeForm";

function EmployeesPage() {
  // =========================
  // Filters
  // =========================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [hireDateFilter, setHireDateFilter] = useState("");

  // =========================
  // Employee State
  // =========================

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Loading / Error
  // =========================

  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState("");

  // =========================
  // Fetch Employees
  // =========================
  // مهم:
  // جعلنا جلب الموظفين ضمن function مستقلة حتى نقدر
  // نعيد استدعاءها مباشرة بعد إضافة موظف جديد.

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true);
      setEmployeesError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/employees",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body?.message || "Failed to load employees"
        );
      }

      if (body?.success && Array.isArray(body?.data)) {
        setEmployeeList(body.data);
      } else if (Array.isArray(body?.data)) {
        setEmployeeList(body.data);
      } else {
        setEmployeeList([]);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);

      setEmployeesError(
        err?.message || "حدث خطأ أثناء جلب الموظفين"
      );
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // =========================
  // Add Employee
  // =========================
  // تم تعديل هذه الجزئية:
  // سابقاً كنا نضيف object محلي باستخدام Date.now().
  //
  // الآن AddEmployeeForm ينفذ API:
  // /api/auth/register-employee
  //
  // وبعد نجاح الإضافة نعيد جلب الموظفين من API
  // حتى يظهر الموظف الجديد بالبيانات الحقيقية القادمة من Backend.

  const handleAddEmployee = async () => {
    await loadEmployees();

    // نرجع المستخدم للصفحة الأولى حتى يشوف الموظف الجديد
    setCurrentPage(1);
  };

  // =========================
  // Filtered Employees
  // =========================
  // حالياً نحافظ على نفس السلوك السابق:
  // عرض القائمة الخام بدون تطبيق الفلاتر من هنا.

  const filteredEmployees = employeeList;

  // =========================
  // Derived Counts
  // =========================

  const totalRows = employeeList.length;

  const activeCount = employeeList.filter(
    (employee) =>
      employee?.employee_profile?.status === "active"
  ).length;

  const pendingCount = employeeList.filter(
    (employee) =>
      employee?.employee_profile?.status &&
      employee?.employee_profile?.status !== "active"
  ).length;

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize)
  );

  const startIndex = (currentPage - 1) * pageSize;

  const visibleEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + pageSize
  );

  // =========================
  // Reset Page When Page Size Changes
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // =========================
  // Keep Current Page Valid
  // =========================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================
  // Reset Filters
  // =========================

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("الكل");
    setRoleFilter("الكل");
    setHireDateFilter("");
    setPageSize(10);
  };

  // =========================
  // Pagination Numbers
  // =========================

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = [1];

    const left = Math.max(
      2,
      currentPage - 1
    );

    const right = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    if (left > 2) {
      pages.push("ellipsis-left");
    }

    for (
      let page = left;
      page <= right;
      page += 1
    ) {
      pages.push(page);
    }

    if (right < totalPages - 1) {
      pages.push("ellipsis-right");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  // =========================
  // Render
  // =========================

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden lg:space-y-5">

      {/* =========================
          Header
      ========================= */}

      <EmployeesHeader
        totalRows={totalRows}
        activeCount={activeCount}
        pendingCount={pendingCount}
        onAddEmployee={() => setShowAddEmployee(true)}
      />

      {/* =========================
          Filters
      ========================= */}

      <EmployeeFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        hireDateFilter={hireDateFilter}
        setHireDateFilter={setHireDateFilter}
        onResetFilters={handleResetFilters}
      />

      {/* =========================
          Error Message
      ========================= */}

      {employeesError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {employeesError}
        </div>
      )}

      {/* =========================
          Employees Table
      ========================= */}

      <section
        className="
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-md
          transition-colors
          duration-300
          dark:border-white/5
          dark:bg-[#0f1821]
          dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)]
          lg:p-5
        "
      >

        {isLoadingEmployees ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-200
                  border-t-emerald-500
                  dark:border-white/10
                  dark:border-t-emerald-400
                "
              />

              جاري تحميل الموظفين...
            </div>
          </div>
        ) : (
          <>
            <EmployeesTable
              visibleEmployees={visibleEmployees}
              totalFilteredCount={filteredEmployees.length}
            />

            <EmployeePagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
            />
          </>
        )}

      </section>

      {/* =========================
          Add Employee Modal
      ========================= */}

      {showAddEmployee && (
        <AddEmployeeForm
          onClose={() => setShowAddEmployee(false)}

          /*
           * بعد نجاح register-employee:
           * AddEmployeeForm يستدعي هذه الدالة
           * → نعيد جلب /api/employees
           * → الموظف الجديد يظهر مباشرة بالجدول.
           */
          onAddEmployee={handleAddEmployee}
        />
      )}

    </div>
  );
}

export default EmployeesPage;