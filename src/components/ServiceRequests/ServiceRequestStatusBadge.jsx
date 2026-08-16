import React from "react";

const statusStyles = {
  submitted:
    "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",

  pending_engineering_approval:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",

  pending_mayor_approval:
    "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",

  approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",

  rejected:
    "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
};

function ServiceRequestStatusBadge({ status }) {
  if (!status) return null;

  const className =
    statusStyles[status.code] ||
    "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status.name_ar || status.name || status.code}
    </span>
  );
}

export default ServiceRequestStatusBadge;