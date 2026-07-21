import {
  Users,
  BriefcaseBusiness,
  CircleCheckBig,
  CalendarDays,
  FileText,
} from "lucide-react";

function StatCard({ label, value, extra, icon }) {
  return (
    <article className="rounded-2xl border border-white/5 bg-[#101922] px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="text-right">
          <p className="text-xs text-slate-400">{label}</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-100">{value}</span>
            {extra ? <span className="pb-1 text-[11px] text-emerald-400">{extra}</span> : null}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-400">
          {icon === 'users' && (
            <Users size={22} />
          )}
          {icon === 'complaints' && (
            <BriefcaseBusiness size={22} />
          )}
          {icon === 'completed' && (
            <CircleCheckBig size={22} />
          )}
          {icon === 'Events' && (
            <CalendarDays size={22} />
          )}
          {icon === 'reports' && (
            <FileText size={22} />
          )}
        </div>
      </div>
    </article>
  )
}

export default StatCard