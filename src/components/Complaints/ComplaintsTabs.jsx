import { NavLink } from "react-router-dom";


function ComplaintsTabs({ reportsCount, unifiedCount }) {
  const tabClass = ({ isActive }) =>
    [
      "inline-flex h-[46px] items-center justify-center rounded-full px-6 text-sm font-medium transition",
      isActive
        ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)]"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-[#17212b]",
    ].join(" ");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <NavLink to="/dashboard/complaints/unified" className={tabClass}>
        شكاوى موحّدة{unifiedCount === undefined ? "" : ` (${unifiedCount})`}
      </NavLink>

      <NavLink to="/dashboard/complaints/reports" className={tabClass}>
        بلاغات جديدة{reportsCount === undefined ? "" : ` (${reportsCount})`}
      </NavLink>
    </div>
  );
}

export default ComplaintsTabs;
