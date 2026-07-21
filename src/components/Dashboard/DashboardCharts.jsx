import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { complaintDistribution, weeklyComplaintCounts } from '../../data/dashboardData'

// ألوان مخصصة للمخطط الدائري تتطابق مع درجات اللون الأخضر في الصورة
const PIE_COLORS = ['#1e5e41', '#7cb972', '#b3df94']

function DashboardCharts() {
  return (
    <section className="grid gap-3 lg:grid-cols-[1.95fr_1.05fr]" dir="rtl">
      
      {/* 1. مخطط الشكاوى المنجزة حسب اليوم (اليمين) */}
      <article className="rounded-2xl border border-white/5 bg-[#101922] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-100">الشكاوى المنجزة حسب اليوم</h2>
        </div>

        <div className="h-64 w-full text-[11px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyComplaintCounts}
              margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
            >
              {/* خطوط الشبكة الأفقية فقط لتطابق الصورة */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.4} />
              
              {/* محور السينات (الأيام) */}
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b"
                dy={10}
              />
              
              {/* محور الصادات (القيم من 0 إلى 60) */}
              <YAxis 
                domain={[0, 60]} 
                tickCount={7} 
                tickLine={false} 
                axisLine={false} 
                stroke="#64748b"
                dx={-10}
              />
              
              {/* نافذة تفاعلية عند تمرير الماوس */}
              <Tooltip 
                contentStyle={{ backgroundColor: '#16222f', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
              />
              
              {/* الأعمدة بلونها الزمردي وحوافها العلوية الدائرية */}
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

      {/* 2. مخطط توزيع الشكاوى حسب الحالة (اليسار) */}
      <article className="rounded-2xl border border-white/5 bg-[#101922] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="mb-4 text-right">
          <h2 className="text-sm font-semibold text-slate-100">توزيع الشكاوى حسب الحالة</h2>
        </div>

        <div className="flex h-64 items-center justify-between gap-2">
          {/* المخطط الدائري */}
          <div className="h-full w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={0} // دائرة كاملة مصمتة كما في الصورة تماماً
                  outerRadius={75}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {complaintDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* قائمة الشرح المحاذية لليسار (Legend) */}
          <div className="w-1/2 space-y-4 text-right pl-2">
            {complaintDistribution.map((item, index) => (
              <div key={item.label} className="flex flex-col gap-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span 
                    className="h-2.5 w-2.5 rounded-full" 
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="font-medium text-slate-200">{item.label}</span>
                </div>
                <span className="pr-4 text-[11px] text-slate-500">
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