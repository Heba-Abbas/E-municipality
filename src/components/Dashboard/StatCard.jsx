import {
  Users,
  BriefcaseBusiness,
  CircleCheckBig,
  CalendarDays,
  FileText,
} from "lucide-react";

function StatCard({ label, value, extra, icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="text-right">
          {/* عنوان الكرت */}
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          
          {/* القيمة والنسبة/الإضافة */}
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
            {extra ? (
              <span className="pb-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {extra}
              </span>
            ) : null}
          </div>
        </div>

        {/* أيقونة الكرت */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400">
          {icon === 'users' && <Users size={22} />}
          {icon === 'complaints' && <BriefcaseBusiness size={22} />}
          {icon === 'completed' && <CircleCheckBig size={22} />}
          {icon === 'Events' && <CalendarDays size={22} />}
          {icon === 'reports' && <FileText size={22} />}
        </div>
      </div>
    </article>
  );
}

export default StatCard;