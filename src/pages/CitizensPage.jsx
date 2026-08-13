import { useEffect, useMemo, useState } from "react";
import { citizenStats, citizens } from "../data/citizensData";
import CitizenHeader from "../components/Citizens/CitizenHeader";
import CitizenFilters from "../components/Citizens/CitizenFilters";
import CitizensTable from "../components/Citizens/CitizensTable";
import CitizenPagination from "../components/Citizens/CitizenPagination";
import AddCitizenForm from "../components/Citizens/AddCitizenForm";

function CitizensPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [municipalityFilter, setMunicipalityFilter] = useState("الكل");
  const [cityFilter, setCityFilter] = useState("الكل");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddCitizen, setShowAddCitizen] = useState(false);
  const [citizenList, setCitizenList] = useState(citizens);

  const filteredCitizens = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return citizenList.filter((citizen) => {
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

  const handleAddCitizen = (newCitizen) => {
    setCitizenList((prev) => [newCitizen, ...prev]);
  };

  const totalRows = citizenStats.total;
  const totalPages = Math.max(1, Math.ceil(filteredCitizens.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const visibleCitizens = filteredCitizens.slice(
    startIndex,
    startIndex + pageSize
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
      {/* 1. الهيدر والإحصائيات */}
      <CitizenHeader
        totalRows={totalRows}
        activeCount={citizenStats.active}
        pendingCount={citizenStats.pending}
        onAddCitizen={() => setShowAddCitizen(true)}
      />

      {/* 2. شريط البحث والفلترة */}
      <CitizenFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        municipalityFilter={municipalityFilter}
        setMunicipalityFilter={setMunicipalityFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 3. الجدول والتنقل بين الصفحات */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-5">
        <CitizensTable
          visibleCitizens={visibleCitizens}
          totalFilteredCount={filteredCitizens.length}
        />

        <CitizenPagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
        />
      </section>
      {showAddCitizen && (
        <AddCitizenForm
          onClose={() => setShowAddCitizen(false)}
          onAddCitizen={handleAddCitizen}
        />
      )}
    </div>
  );
}

export default CitizensPage;