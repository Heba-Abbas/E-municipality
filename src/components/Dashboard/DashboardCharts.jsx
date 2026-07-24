import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { complaintDistribution, weeklyComplaintCounts } from '../../data/dashboardData'
import { useTheme } from './../../context/ThemeContext' 

const PIE_COLORS = ['#1e5e41', '#7cb972', '#b3df94']

function DashboardCharts() {
  const { darkMode } = useTheme();

  return (
    <section className="grid gap-3 lg:grid-cols-[1.95fr_1.05fr]" dir="rtl">
      
      {/* 1. مخطط الشكاوى المنجزة حسب اليوم */}
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors duration-300">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">الشكاوى المنجزة حسب اليوم</h2>
        </div>

        <div className="h-64 w-full text-[11px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyComplaintCounts}
              margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
              
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b"
                dy={10}
              />
              
              <YAxis 
                domain={[0, 60]} 
                tickCount={7} 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b"
                dx={-10}
              />
              
              {/* Tooltip ديناميكي يتأثر بـ darkMode مباشرة */}
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#16222f' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#d1d5db',
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#111827',
                }}
                itemStyle={{ color: '#10b981' }}
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
      </article>

      {/* 2. مخطط توزيع الشكاوى حسب الحالة */}
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors duration-300">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">توزيع الشكاوى حسب الحالة</h2>
        </div>

        <div className="flex h-64 items-center justify-between">
          <div className="w-[60%] h-full gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={75}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {complaintDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#16222f' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#d1d5db',
                    borderRadius: '8px',
                    color: darkMode ? '#ffffff' : '#111827',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-[58%] space-y-4 pr-6 text-right">
            {complaintDistribution.map((item, index) => (
              <div key={item.label} className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span 
                    className="h-2.5 w-2.5 rounded-full" 
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="pr-4 text-[11px] text-slate-500 dark:text-slate-400">
                  {item.value} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>

    </section>
  )
}

export default DashboardCharts