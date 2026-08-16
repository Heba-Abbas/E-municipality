import { complaintStatuses } from "../../data/complaintsData";


const statusColors = {
  sky: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  slate:
    "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  emerald:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const dotColors = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  slate: "bg-slate-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
};

// status: API (current_status.key)
// name:  API (current_status.name) — اختياري
function ComplaintStatusBadge({ status, name }) {
  const statusInfo = complaintStatuses[status];

  
  const label = name || statusInfo?.label || status || "-";
  const color = statusInfo?.color || "slate";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${statusColors[color]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[color]}`} />

      {label}
    </span>
  );
}

export default ComplaintStatusBadge;
