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

const statusStyles = {
  مفعّل: "bg-emerald-500/20 text-emerald-300",
  مجمد: "bg-sky-500/20 text-sky-300",
};

const pageSizeOptions = [10, 25, 50];

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-medium text-slate-400">
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
      <section className="rounded-3xl border border-white/5 bg-[#0f1821] px-4 py-4 shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:px-6 lg:py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3 text-right">
            <div>
              <h1 className="text-3xl font-bold text-white">المواطنين</h1>
            </div>

            <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              <span>إضافة مواطن جديد</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-right">
              <p className="text-xs text-emerald-200/80">إجمالي المواطنين</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {totalRows.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right">
              <p className="text-xs text-slate-400">المفعّلون</p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {citizenStats.active.toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-right">
              <p className="text-xs text-slate-400">المجمدون</p>
              <p className="mt-2 text-2xl font-bold text-slate-100">
                {citizenStats.pending.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full rounded-2xl border border-white/5 bg-[#0f1821] p-5 shadow-lg">
  <div className="flex flex-wrap items-end gap-3">

    {/* Search */}
    <div className="min-w-[320px] flex-1">
      <FieldLabel>بحث</FieldLabel>

      <div className="relative">
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
          strokeWidth={1.8}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الرقم الوطني أو الهاتف..."
          className="w-full rounded-lg border border-white/10 bg-[#121b24] py-3 pr-10 pl-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none"
        />
      </div>
    </div>

    {/* Social Status */}
    <div className="w-[160px]">
      <FieldLabel>الحالة الاجتماعية</FieldLabel>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-[#121b24] py-3 pr-3 pl-8 text-sm text-white"
        >
          {citizenFilters.statusOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
      </div>
    </div>

    {/* Municipality */}
    <div className="w-[160px]">
      <FieldLabel>البلدية</FieldLabel>

      <div className="relative">
        <select
          value={municipalityFilter}
          onChange={(e) => setMunicipalityFilter(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-[#121b24] py-3 pr-3 pl-8 text-sm text-white"
        >
          {citizenFilters.municipalityOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
      </div>
    </div>

    {/* Current Location */}
    <div className="w-[170px]">
      <FieldLabel>الموقع الحالي</FieldLabel>

      <div className="relative">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-[#121b24] py-3 pr-3 pl-8 text-sm text-white"
        >
          {citizenFilters.cityOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
      </div>
    </div>

    
    <div className="w-[170px]">
      <FieldLabel> تاريخ</FieldLabel>

      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />

        <input
          type="date"
          className="w-full rounded-lg border border-white/10 bg-[#121b24] py-3 pr-10 pl-3 text-sm text-white"
        />
      </div>
    </div>

    

    {/* Filter */}
    <button
      className="flex h-[46px] items-center gap-2 rounded-lg bg-emerald-500 px-6 text-white hover:bg-emerald-600"
    >
      <Filter size={18} />
      تصفية
    </button>

    {/* Reset */}
    <button
      onClick={handleResetFilters}
      className="flex h-[46px] items-center gap-2 rounded-lg border border-white/10 bg-[#121b24] px-6 text-white hover:bg-[#17212b]"
    >
      <RotateCcw size={18} />
      مسح الفلاتر
    </button>

  </div>
</section>
      <section className="rounded-3xl border border-white/5 bg-[#0f1821] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 text-right">
          <div>
            <h2 className="text-lg font-semibold text-white">
              قائمة المواطنين
            </h2>
            
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-[#111c26] px-4 py-3 text-sm text-slate-300">
            <Users2 className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            <span>{filteredCitizens.length.toLocaleString("en-US")} سجل</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0d151d]">
  <table className="w-full text-right text-sm text-slate-300">
    <thead className="bg-[#111c26] text-[13px] font-semibold text-slate-300">
      <tr className="border-b border-white/10">
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
          className="border-b border-white/5 bg-[#0d151d] transition-colors hover:bg-[#14202b]"
        >
          <td className="px-4 py-4 text-center text-slate-200">
            {citizen.id}
          </td>

          <td className="px-4 py-4 font-medium text-slate-100">
            {citizen.nationalId}
          </td>

          <td className="px-4 py-4 text-slate-200">
            {citizen.fullName}
          </td>

          <td className="px-4 py-4 text-slate-300">
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

          <td className="px-4 py-4 text-slate-300">
            {citizen.municipality}
          </td>

          <td className="px-4 py-4 text-slate-300">
            {citizen.city}
          </td>

          <td className="px-4 py-4 whitespace-nowrap text-slate-300">
            {citizen.birthDate}
          </td>

          <td className="px-4 py-4">
            <div className="flex items-center justify-center gap-2">

              <ActionButton
                title="عرض"
                className="h-9 w-9 border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
              >
                <Eye className="h-4 w-4" strokeWidth={1.8} />
              </ActionButton>

              <ActionButton
                title="تعديل"
                className="h-9 w-9 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              >
                <Edit3 className="h-4 w-4" strokeWidth={1.8} />
              </ActionButton>

              <ActionButton
                title="حذف"
                className="h-9 w-9 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
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
        <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="appearance-none rounded-xl border border-white/5 bg-[#111c26] px-4 py-3 pr-10 text-right text-sm text-slate-200 outline-none transition focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
                <span key={page} className="px-2 text-slate-500">
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
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    sky: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    slate: "border-white/10 bg-white/5 text-slate-200",
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
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-[#111c26] text-slate-300 hover:bg-white/5",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default CitizensPage;
