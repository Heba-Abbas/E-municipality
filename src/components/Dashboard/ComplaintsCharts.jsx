import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// مخططات
function ComplaintsCharts({
  perDay,
  isPerDayLoading,
  perDayError,
  distribution,
  isDistributionLoading,
  distributionError,
}) {
  const { darkMode } = useTheme();

  
  const distributionTotal = distribution.reduce(
    (sum, item) => sum + item.value,
    0
  );

 
  const visibleDistribution = distribution.filter((item) => item.value > 0);

  const tooltipStyle = {
    backgroundColor: darkMode ? "#16222f" : "#ffffff",
    borderColor: darkMode ? "#334155" : "#d1d5db",
    borderRadius: "8px",
    color: darkMode ? "#ffffff" : "#111827",
  };

  return (
    <section className="grid gap-3 lg:grid-cols-[1.95fr_1.05fr]" dir="rtl">
      {/* 1. الشكاوى المنجزة حسب اليوم */}
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            الشكاوى المنجزة حسب اليوم
          </h2>

          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            آخر 7 أيام
          </p>
        </div>

        {perDayError ? (
          <p className="flex h-64 items-center justify-center px-4 text-center text-xs text-red-600 dark:text-red-400">
            {perDayError}
          </p>
        ) : isPerDayLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="h-64 w-full text-[11px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={perDay}
                margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={darkMode ? "#334155" : "#e2e8f0"}
                />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  dy={10}
                />

                {/* المحور يتوسع تلقائياً مع البيانات ) */}
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  dx={-10}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "#10b981" }}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.date
                      ? `${label} — ${payload[0].payload.date}`
                      : label
                  }
                  formatter={(value) => [value, "منجزة"]}
                />

                <Bar
                  dataKey="value"
                  fill="#1b835a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>

      {/* 2. توزيع الشكاوى حسب الحالة */}
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            توزيع الشكاوى حسب الحالة
          </h2>

          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            الإجمالي: {distributionTotal.toLocaleString("en-US")}
          </p>
        </div>

        {distributionError ? (
          <p className="flex h-64 items-center justify-center px-4 text-center text-xs text-red-600 dark:text-red-400">
            {distributionError}
          </p>
        ) : isDistributionLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
          </div>
        ) : distributionTotal === 0 ? (
          <p className="flex h-64 items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            لا توجد شكاوى ضمن هذه الفترة
          </p>
        ) : (
          <div className="flex h-64 items-center justify-between">
            <div className="h-full w-[55%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visibleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="value"
                  >
                    {visibleDistribution.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/*   — النسب فعلية*/}
            <div className="w-[45%] space-y-3 pr-4 text-right">
              {visibleDistribution.map((item) => {
                const percent = Math.round(
                  (item.value / distributionTotal) * 100
                );

                return (
                  <div
                    key={item.key}
                    className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />

                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                    </div>

                    <span className="pr-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.value} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

export default ComplaintsCharts;
