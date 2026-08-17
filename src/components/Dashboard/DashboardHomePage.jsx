import { useEffect, useState } from 'react'

import { dashboardStats } from '../../data/dashboardData'

import {
  getCurrentRole,
  canAccessDashboard,
  canViewDashboardCards,
  canViewDashboardPerDay,
  canViewDashboardDistribution,
  canViewRecentComplaints,
  canViewDashboardFilters,
} from '../../utils/permissions'

import ComplaintsCharts from './ComplaintsCharts'
import DashboardComplaintsFilter from './DashboardComplaintsFilter'
import RecentComplaintsTable from './RecentComplaintsTable'
import StatCard from './StatCard'

import {
  getComplaintStatistics,
  getResolvedPerDay,
  getStatusDistribution,
} from '../../services/dashboardApi'

import { getUnifiedComplaints } from '../../services/complaintsApi'

import {
  formatDate,
  getErrorMessage,
} from '../../utils/complaintsUtils'


function DashboardHomePage() {

  /*
  |--------------------------------------------------------------------------
  | Current role
  |--------------------------------------------------------------------------
  */

  const currentRole = getCurrentRole()


  /*
  |--------------------------------------------------------------------------
  | Access
  |--------------------------------------------------------------------------
  */

  const hasDashboardAccess = canAccessDashboard()

  const showCards = canViewDashboardCards()
  const showPerDay = canViewDashboardPerDay()
  const showDistribution = canViewDashboardDistribution()
  const showRecentComplaints = canViewRecentComplaints()
  const showFilters = canViewDashboardFilters()


  /*
  |--------------------------------------------------------------------------
  | Date filter
  |--------------------------------------------------------------------------
  */

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const [stats, setStats] = useState(null)

  const [isStatsLoading, setIsStatsLoading] = useState(true)

  const [statsError, setStatsError] = useState('')


  /*
  |--------------------------------------------------------------------------
  | Recent complaints
  |--------------------------------------------------------------------------
  */

  const [recentComplaints, setRecentComplaints] = useState([])

  const [isListLoading, setIsListLoading] = useState(true)

  const [listError, setListError] = useState('')


  /*
  |--------------------------------------------------------------------------
  | Per day
  |--------------------------------------------------------------------------
  */

  const [perDay, setPerDay] = useState([])

  const [isPerDayLoading, setIsPerDayLoading] = useState(true)

  const [perDayError, setPerDayError] = useState('')


  /*
  |--------------------------------------------------------------------------
  | Distribution
  |--------------------------------------------------------------------------
  */

  const [distribution, setDistribution] = useState([])

  const [isDistributionLoading, setIsDistributionLoading] = useState(true)

  const [distributionError, setDistributionError] = useState('')


  /*
  |--------------------------------------------------------------------------
  | Dashboard data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    // إذا المستخدم ما عنده dashboard
    if (!hasDashboardAccess) {
      return
    }


    const isIncomplete =
      (dateFrom && !dateTo) ||
      (!dateFrom && dateTo)


    if (isIncomplete) {
      return
    }


    const timer = setTimeout(async () => {

      /*
      ==========================================================
      STATISTICS
      ==========================================================
      */

      if (showCards) {

        try {

          setIsStatsLoading(true)
          setStatsError('')


          const response =
            await getComplaintStatistics(
              dateFrom,
              dateTo
            )


          if (!response.success) {
            throw new Error(
              response.message ||
              'Failed to load statistics'
            )
          }


          setStats(response.data)

        } catch (err) {

          console.error(
            'Get Complaint Statistics Error:',
            err
          )

          setStats(null)

          setStatsError(
            getErrorMessage(
              err,
              'حدث خطأ أثناء جلب الإحصائيات'
            )
          )

        } finally {

          setIsStatsLoading(false)

        }

      } else {

        setIsStatsLoading(false)

      }


      /*
      ==========================================================
      RECENT COMPLAINTS
      ==========================================================
      */

      if (showRecentComplaints) {

        try {

          setIsListLoading(true)
          setListError('')


          const filters = {
            per_page: 5,
          }


          if (dateFrom && dateTo) {

            filters.date_from = dateFrom
            filters.date_to = dateTo

          }


          const response =
            await getUnifiedComplaints(filters)


          if (!response.success) {

            throw new Error(
              response.message ||
              'Failed to load complaints'
            )

          }


          setRecentComplaints(
            response.data?.items || []
          )

        } catch (err) {

          console.error(
            'Get Recent Complaints Error:',
            err
          )

          setRecentComplaints([])

          setListError(
            getErrorMessage(
              err,
              'حدث خطأ أثناء جلب آخر الشكاوى'
            )
          )

        } finally {

          setIsListLoading(false)

        }

      } else {

        setRecentComplaints([])
        setIsListLoading(false)

      }


      /*
      ==========================================================
      RESOLVED PER DAY
      ==========================================================
      */

      if (showPerDay) {

        try {

          setIsPerDayLoading(true)
          setPerDayError('')


          const result =
            await getResolvedPerDay(dateTo)


          setPerDay(result || [])

        } catch (err) {

          console.error(
            'Get Resolved Per Day Error:',
            err
          )

          setPerDay([])

          setPerDayError(
            getErrorMessage(
              err,
              'حدث خطأ أثناء جلب بيانات المخطط'
            )
          )

        } finally {

          setIsPerDayLoading(false)

        }

      } else {

        setPerDay([])
        setIsPerDayLoading(false)

      }


      /*
      ==========================================================
      STATUS DISTRIBUTION
      ==========================================================
      */

      if (showDistribution) {

        try {

          setIsDistributionLoading(true)
          setDistributionError('')


          const result =
            await getStatusDistribution(
              dateFrom,
              dateTo
            )


          setDistribution(result || [])

        } catch (err) {

          console.error(
            'Get Status Distribution Error:',
            err
          )

          setDistribution([])

          setDistributionError(
            getErrorMessage(
              err,
              'حدث خطأ أثناء جلب توزيع الحالات'
            )
          )

        } finally {

          setIsDistributionLoading(false)

        }

      } else {

        setDistribution([])
        setIsDistributionLoading(false)

      }

    }, 300)


    return () => clearTimeout(timer)

  }, [
    dateFrom,
    dateTo,
    hasDashboardAccess,
    showCards,
    showPerDay,
    showDistribution,
    showRecentComplaints,
  ])


  /*
  |--------------------------------------------------------------------------
  | Card value
  |--------------------------------------------------------------------------
  */

  const cardValue = (number) => {

    if (isStatsLoading) {
      return '...'
    }


    if (statsError || !stats) {
      return '—'
    }


    return Number(
      number || 0
    ).toLocaleString('en-US')

  }


  const hasPeriod =
    Boolean(dateFrom && dateTo)


  /*
  |--------------------------------------------------------------------------
  | Stat cards
  |--------------------------------------------------------------------------
  */

  const statCards = dashboardStats.map((item) => {

    if (item.icon === 'complaints') {

      return {
        ...item,

        value: cardValue(
          hasPeriod
            ? stats?.submitted_in_period
            : stats?.total_submitted_all_time
        ),

        extra: undefined,
      }

    }


    if (item.icon === 'completed') {

      return {
        ...item,

        value: cardValue(
          stats?.resolved_in_period
        ),

        extra: undefined,
      }

    }


    return item

  })


  /*
  |--------------------------------------------------------------------------
  | Period label
  |--------------------------------------------------------------------------
  */

  const periodLabel = stats?.period
    ? `الإحصائيات للفترة: ${formatDate(
        stats.period.date_from
      )} ← ${formatDate(
        stats.period.date_to
      )}`
    : ''


  /*
  |--------------------------------------------------------------------------
  | Unauthorized dashboard
  |--------------------------------------------------------------------------
  */

  if (!hasDashboardAccess) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-8
            py-10
            text-center
            shadow-sm

            dark:border-white/5
            dark:bg-[#101922]
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              text-slate-800
              dark:text-slate-100
            "
          >
            لا تملك صلاحية الدخول إلى لوحة التحكم
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            الدور الحالي: {currentRole || 'غير معروف'}
          </p>

        </div>

      </div>
    )

  }


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
        space-y-3
        lg:space-y-4
      "
    >

      <h2
        className="
          pr-2
          text-lg
          font-semibold
          text-slate-800

          dark:text-slate-100
        "
      >
        التقارير والاحصائيات
      </h2>


      {/* =====================================================
          CARDS
      ===================================================== */}

      {showCards && (

        <section
          className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {statCards.map((item) => (

            <StatCard
              key={item.label}
              {...item}
            />

          ))}

        </section>

      )}


      {/* =====================================================
          STATS ERROR
      ===================================================== */}

      {showCards && statsError && (

        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-xs
            text-red-700

            dark:border-red-500/20
            dark:bg-red-500/10
            dark:text-red-300
          "
        >
          {statsError}
        </div>

      )}


      {/* =====================================================
          FILTER
      ===================================================== */}

      {showFilters && (

        <DashboardComplaintsFilter
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          periodLabel={periodLabel}
        />

      )}


      {/* =====================================================
          CHARTS
      ===================================================== */}

      {(showPerDay || showDistribution) && (

        <ComplaintsCharts
          perDay={perDay}
          isPerDayLoading={isPerDayLoading}
          perDayError={perDayError}

          distribution={distribution}
          isDistributionLoading={
            isDistributionLoading
          }
          distributionError={distributionError}

          showPerDay={showPerDay}
          showDistribution={showDistribution}
        />

      )}


      {/* =====================================================
          RECENT COMPLAINTS
      ===================================================== */}

      {showRecentComplaints && (

        <RecentComplaintsTable
          complaints={recentComplaints}
          isLoading={isListLoading}
          error={listError}
        />

      )}

    </div>

  )
}


export default DashboardHomePage