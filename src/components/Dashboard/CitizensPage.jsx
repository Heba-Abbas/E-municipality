import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  Users2,
} from "lucide-react";
import {
  citizenFilters,
  citizenStats,
  citizens,
} from "../../data/citizensData";

// شارات الحالة الاجتماعية
const statusStyles = {
  مفعّل: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  مجمد: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
};

const pageSizeOptions = [10, 25, 50];

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
      {children}
    </label>
  );
}

function CitizensPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [municipalityFilter, setMunicipalityFilter] = useState("الكل");
  const [cityFilter, setCityFilter] = useState("الكل");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCitizens = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return citizens.filter((citizen) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          citizen.fullName,
          citizen.nationalId,
          citizen.phone,
          citizen.email,
          citizen.city,
          citizen.municipality,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "الكل" || citizen.status === statusFilter;
      const matchesMunicipality =
        municipalityFilter === "الكل" ||
        citizen.municipality === municipalityFilter;
      const matchesCity = cityFilter === "الكل" || citizen.city === cityFilter;

      return (
        matchesSearch && matchesStatus && matchesMunicipality && matchesCity
      );
    });
  }, [cityFilter, municipalityFilter, search, statusFilter]);

  const totalRows = citizenStats.total;
  const totalPages = Math.max(1, Math.ceil(filteredCitizens.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const visibleCitizens = filteredCitizens.slice(
    startIndex,
    startIndex + pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, municipalityFilter, cityFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("الكل");
    setMunicipalityFilter("الكل");
    setCityFilter("الكل");
    setPageSize(10);
  };

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) pages.push("ellipsis-left");
    for (let page = left; page <= right; page += 1) pages.push(page);
    if (right < totalPages - 1) pages.push("ellipsis-right");
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* 1. قسم الهيدر وكروت الإحصائيات السريعة */}
      <section className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:px-6 lg:py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3 text-right">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">المواطنين</h1>
            </div>

            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400">
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              <span>إضافة مواطن جديد</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/80 px-4 py-3 text-right dark:border-emerald-500/15 dark:bg-emerald-500/5">
              <p className="text-xs text-emerald-800 dark:text-emerald-200/80">إجمالي المواطنين</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {totalRows.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-white/5 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">المفعّلون</p>
              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {citizenStats.active.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-white/5 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">المجمدون</p>
              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {citizenStats.pending.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. قسم شريط الفلترة والبحث */}
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-lg">
        <div className="flex flex-wrap items-end gap-3">

          {/* البحث */}
          <div className="min-w-[320px] flex-1">
            <FieldLabel>بحث</FieldLabel>
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                strokeWidth={1.8}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم الوطني أو الهاتف..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* الحالة الاجتماعية */}
          <div className="w-[160px]">
            <FieldLabel>الحالة الاجتماعية</FieldLabel>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
              >
                {citizenFilters.statusOptions.map((option) => (
                  <option key={option} className="dark:bg-[#121b24]">{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          {/* البلدية */}
          <div className="w-[160px]">
            <FieldLabel>البلدية</FieldLabel>
            <div className="relative">
              <select
                value={municipalityFilter}
                onChange={(e) => setMunicipalityFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
              >
                {citizenFilters.municipalityOptions.map((option) => (
                  <option key={option} className="dark:bg-[#121b24]">{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          {/* الموقع الحالي */}
          <div className="w-[170px]">
            <FieldLabel>الموقع الحالي</FieldLabel>
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-3 pr-3 pl-8 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
              >
                {citizenFilters.cityOptions.map((option) => (
                  <option key={option} className="dark:bg-[#121b24]">{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          {/* التاريخ */}
          <div className="w-[170px]">
            <FieldLabel>تاريخ</FieldLabel>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="date"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-white"
              />
            </div>
          </div>

          {/* زر التصفية */}
          <button
            type="button"
            className="flex h-[46px] items-center gap-2 rounded-lg bg-emerald-600 px-6 text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            <Filter size={18} />
            تصفية
          </button>

          {/* زر مسح الفلاتر */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex h-[46px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-6 text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
          >
            <RotateCcw size={18} />
            مسح الفلاتر
          </button>

        </div>
      </section>

      {/* 3. قسم الجدول والتنقل بين الصفحات */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 text-right">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              قائمة المواطنين
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-300">
            <Users2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            <span>{filteredCitizens.length.toLocaleString("en-US")} سجل</span>
          </div>
        </div>

        {/* الجدول */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0d151d]">
          <table className="w-full text-right text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-[13px] font-semibold text-slate-700 dark:bg-[#111c26] dark:text-slate-300">
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="w-14 px-4 py-4 text-center">#</th>
                <th className="px-4 py-4">الرقم الوطني</th>
                <th className="px-4 py-4">الاسم الكامل</th>
                <th className="px-4 py-4">الهاتف</th>
                <th className="px-4 py-4">الحالة الاجتماعية</th>
                <th className="px-4 py-4">البلدية</th>
                <th className="px-4 py-4">الموقع الحالي</th>
                <th className="px-4 py-4">تاريخ الميلاد</th>
                <th className="w-36 px-4 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {visibleCitizens.map((citizen) => (
                <tr
                  key={citizen.id}
                  className="border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:bg-[#0d151d] dark:hover:bg-[#14202b]"
                >
                  <td className="px-4 py-4 text-center text-slate-700 dark:text-slate-200">
                    {citizen.id}
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {citizen.nationalId}
                  </td>

                  <td className="px-4 py-4 text-slate-800 dark:text-slate-200">
                    {citizen.fullName}
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    {citizen.phone}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                        statusStyles[citizen.maritalStatus]
                      }`}
                    >
                      {citizen.maritalStatus}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    {citizen.municipality}
                  </td>

                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                    {citizen.city}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {citizen.birthDate}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <ActionButton
                        title="عرض"
                        className="h-9 w-9 border border-sky-500/30 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.8} />
                      </ActionButton>

                      <ActionButton
                        title="تعديل"
                        className="h-9 w-9 border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                      >
                        <Edit3 className="h-4 w-4" strokeWidth={1.8} />
                      </ActionButton>

                      <ActionButton
                        title="حذف"
                        className="h-9 w-9 border border-red-500/30 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* أدوات التنقل (Pagination) */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-right text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-200 dark:focus:border-emerald-500/40"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option} className="dark:bg-[#111c26]">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                strokeWidth={2}
              />
            </div>
            <span>عدد الصفوف في الصفحة</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
            >
              ‹
            </PaginationButton>

            {pageNumbers.map((page) =>
              typeof page === "number" ? (
                <PaginationButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationButton>
              ) : (
                <span key={page} className="px-2 text-slate-400 dark:text-slate-500">
                  ...
                </span>
              ),
            )}

            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((value) => Math.min(totalPages, value + 1))
              }
            >
              ›
            </PaginationButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value, tone }) {
  const tones = {
    emerald: "border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    sky: "border-sky-500/30 bg-sky-50 text-sky-800 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
    amber: "border-amber-500/30 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    slate: "border-slate-200 bg-slate-50 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
  };

  return (
    <div className={`rounded-2xl border px-3 py-3 text-right ${tones[tone]}`}>
      <p className="text-[11px] opacity-80">{label}</p>
      <p className="mt-1 text-lg font-semibold">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function ActionButton({ children, className, title }) {
  return (
    <button
      type="button"
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${className}`}
    >
      {children}
    </button>
  );
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 transition",
        active
          ? "border-emerald-500/40 bg-emerald-50 text-emerald-700 font-semibold dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#111c26] dark:text-slate-300 dark:hover:bg-white/5",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default CitizensPage;