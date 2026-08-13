import { useEffect, useMemo, useState } from "react";

import { employeesStatus, employees } from "../data/EmployeesData";

import EmployeesHeader from "../components/Employees/EmployeesHeader";
import EmployeeFilters from "../components/Employees/EmployeeFilters";
import EmployeesTable from "../components/Employees/EmployeesTable";
import EmployeePagination from "../components/Employees/EmployeePagination";
import AddEmployeeForm from "../components/Employees/AddEmployeeForm";

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [roleFilter, setRoleFilter] = useState("الكل");
  const [hireDateFilter, setHireDateFilter] = useState("");

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState(employees);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Filtering
  // =========================

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return employeeList.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          employee.fullName,
          employee.jobTd,
          employee.nationalId,
          employee.phone,
          employee.email,
          employee.role,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "الكل" ||
        employee.status === statusFilter;

      const matchesRole =
        roleFilter === "الكل" ||
        employee.role === roleFilter;

      const matchesHireDate =
        !hireDateFilter ||
        employee.hireDate === hireDateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesHireDate
      );
    });
  }, [
    search,
    statusFilter,
    roleFilter,
    hireDateFilter,
  ]);

  const handleAddEmployee = (newEmployee) => {
    setEmployeeList((prev) => [newEmployee, ...prev]);
  };

  // =========================
  // Pagination
  // =========================

  const totalRows = employeesStatus.total;

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
  }, [
    search,
    statusFilter,
    roleFilter,
    hireDateFilter,
    pageSize,
  ]);

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
        activeCount={employeesStatus.active}
        pendingCount={employeesStatus.pending}
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