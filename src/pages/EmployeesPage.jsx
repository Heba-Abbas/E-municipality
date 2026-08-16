import { useEffect, useMemo, useState } from "react";

import EmployeesHeader from "../components/Employees/EmployeesHeader";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import EmployeePagination from "../components/Employees/EmployeePagination";
import AddEmployeeForm from "../components/Employees/AddEmployeeForm";

function EmployeesPage() {
  // removed filtering: show raw employee list
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [hireDateFilter, setHireDateFilter] = useState("");

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // show raw employee list (no filtering)
  const filteredEmployees = employeeList;

  const handleAddEmployee = (newEmployee) => {
    setEmployeeList((prev) => [newEmployee, ...prev]);
  };

  // fetch employees from API
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/employees", {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const body = await res.json();

        if (!cancelled && body && Array.isArray(body.data)) {
          setEmployeeList(body.data);
        }
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);


  // =========================
  // Derived counts & Pagination
  // =========================

  const totalRows = employeeList.length;
  const activeCount = employeeList.filter((e) => e.employee_profile?.status === "active").length;
  const pendingCount = employeeList.filter((e) => e.employee_profile?.status && e.employee_profile?.status !== "active").length;

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
  // Reset page when filters change
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // =========================
  // Keep current page valid
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

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    if (left > 2) {
      pages.push("ellipsis-left");
    }

    for (let page = left; page <= right; page += 1) {
      pages.push(page);
    }

    if (right < totalPages - 1) {
      pages.push("ellipsis-right");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden lg:space-y-5">

      {/* Header */}

      <EmployeesHeader
        totalRows={totalRows}
        activeCount={activeCount}
        pendingCount={pendingCount}
        onAddEmployee={() => setShowAddEmployee(true)}
      />

      {/* Filters */}

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

      {/* Table */}

      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">

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

      </section>
      {showAddEmployee && (
        <AddEmployeeForm
          onClose={() => setShowAddEmployee(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
}

export default EmployeesPage;