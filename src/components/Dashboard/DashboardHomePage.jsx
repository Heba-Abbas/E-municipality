import { useEffect, useState } from 'react'
import { dashboardStats } from '../../data/dashboardData'
import ComplaintsCharts from './ComplaintsCharts'
import DashboardComplaintsFilter from './DashboardComplaintsFilter'
import RecentComplaintsTable from './RecentComplaintsTable'
import StatCard from './StatCard'
import {
  getComplaintStatistics,
  getResolvedPerDay,
  getStatusDistribution
} from '../../services/dashboardApi'
import { getUnifiedComplaints } from '../../services/complaintsApi'
import { formatDate, getErrorMessage } from '../../utils/complaintsUtils'

function DashboardHomePage() {
  // فلتر التاريخ ( على الإحصائيات و جدول آخر الشكاوى )
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // إحصائيات الشكاوى
  const [stats, setStats] = useState(null)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  // آخر الشكاوى
  const [recentComplaints, setRecentComplaints] = useState([])
  const [isListLoading, setIsListLoading] = useState(true)
  const [listError, setListError] = useState('')

 
  const [perDay, setPerDay] = useState([])
  const [isPerDayLoading, setIsPerDayLoading] = useState(true)
  const [perDayError, setPerDayError] = useState('')

  const [distribution, setDistribution] = useState([])
  const [isDistributionLoading, setIsDistributionLoading] = useState(true)
  const [distributionError, setDistributionError] = useState('')

  // ==========================================
  /
  // GET /api/complaints/statistics
  // GET /api/unified-complaints
  // ==========================================

  useEffect(() => {
    const isIncomplete = (dateFrom && !dateTo) || (!dateFrom && dateTo)
    if (isIncomplete) return

    const timer = setTimeout(async () => {
      // الإحصائيات
      try {
        setIsStatsLoading(true)
        setStatsError('')

        const response = await getComplaintStatistics(dateFrom, dateTo)

        if (!response.success) {
          throw new Error(response.message || 'Failed to load statistics')
        }

        setStats(response.data)
      } catch (err) {
        console.error('Get Complaint Statistics Error:', err)
        setStats(null)
        setStatsError(getErrorMessage(err, 'حدث خطأ أثناء جلب الإحصائيات'))
      } finally {
        setIsStatsLoading(false)
      }

      // آخر الشكاوى
      try {
        setIsListLoading(true)
        setListError('')

        const filters = { per_page: 5 }
        if (dateFrom && dateTo) {
          filters.date_from = dateFrom
          filters.date_to = dateTo
        }

        const response = await getUnifiedComplaints(filters)

        if (!response.success) {
          throw new Error(response.message || 'Failed to load complaints')
        }

        setRecentComplaints(response.data?.items || [])
      } catch (err) {
        console.error('Get Recent Complaints Error:', err)
        setRecentComplaints([])
        setListError(getErrorMessage(err, 'حدث خطأ أثناء جلب آخر الشكاوى'))
      } finally {
        setIsListLoading(false)
      }

      // مخطط الشكاوى المنجزة حسب اليوم
      try {
        setIsPerDayLoading(true)
        setPerDayError('')

        setPerDay(await getResolvedPerDay(dateTo))
      } catch (err) {
        console.error('Get Resolved Per Day Error:', err)
        setPerDay([])
        setPerDayError(getErrorMessage(err, 'حدث خطأ أثناء جلب بيانات المخطط'))
      } finally {
        setIsPerDayLoading(false)
      }

      // مخطط التوزيع حسب الحالة
      try {
        setIsDistributionLoading(true)
        setDistributionError('')

        setDistribution(await getStatusDistribution(dateFrom, dateTo))
      } catch (err) {
        console.error('Get Status Distribution Error:', err)
        setDistribution([])
        setDistributionError(
          getErrorMessage(err, 'حدث خطأ أثناء جلب توزيع الحالات')
        )
      } finally {
        setIsDistributionLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [dateFrom, dateTo])

  

  const cardValue = (number) => {
    if (isStatsLoading) return '...'
    if (statsError || !stats) return '—'
    return Number(number || 0).toLocaleString('en-US')
  }

  const hasPeriod = Boolean(dateFrom && dateTo)

  const statCards = dashboardStats.map((item) => {
    if (item.icon === 'complaints') {
      return {
        ...item,
        value: cardValue(
          hasPeriod ? stats?.submitted_in_period : stats?.total_submitted_all_time
        ),
        extra: undefined
      }
    }

    if (item.icon === 'completed') {
      return {
        ...item,
        value: cardValue(stats?.resolved_in_period),
        extra: undefined
      }
    }

    return item
  })

  const periodLabel = stats?.period
    ? `الإحصائيات للفترة: ${formatDate(stats.period.date_from)} ← ${formatDate(stats.period.date_to)}`
    : ''

  return (
    <div className="space-y-3 lg:space-y-4">
      <h2 className="pr-2 text-lg font-semibold text-slate-800 dark:text-slate-100">التقارير والاحصائيات </h2>

      {/* 1. كروت الإحصائيات */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {/* رسالة خطأ الإحصائيات */}
      {statsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {statsError}
        </div>
      )}

      {/* 2. شريط الفلاتر */}
      <DashboardComplaintsFilter
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        periodLabel={periodLabel}
      />

      {/* 3. المخططات والجدول */}
      <ComplaintsCharts
        perDay={perDay}
        isPerDayLoading={isPerDayLoading}
        perDayError={perDayError}
        distribution={distribution}
        isDistributionLoading={isDistributionLoading}
        distributionError={distributionError}
      />

      <RecentComplaintsTable
        complaints={recentComplaints}
        isLoading={isListLoading}
        error={listError}
      />
    </div>
  )
}

export default DashboardHomePage
