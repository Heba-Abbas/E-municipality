export const dashboardStats = [
  {
    label: 'إجمالي السكان',
    value: '4443',
    icon: 'users',
  },
  {
    label: 'إجمالي الشكاوى',
    value: '223',
    extra: '60%',
    icon: 'complaints',
  },
  {
    label: 'الشكاوى المنجزة',
    value: '134',
    extra: '60%',
    icon: 'completed',
  },
  {
    label: 'الفعاليات',
    value: '12',
    icon: 'Events',
  },
]

export const complaintDistribution = [
  {
    label: 'مكتمل',
    value: 146,
    percent: 65,
    color: '#10b981',
  },
  {
    label: 'قيد المعالجة',
    value: 61,
    percent: 27,
    color: '#a3e635',
  },
  {
    label: 'غير مدفوع',
    value: 16,
    percent: 8,
    color: '#a7f3d0',
  },
]

export const weeklyComplaintCounts = [
  { label: 'السبت', value: 24 },
  { label: 'الأحد', value: 36 },
  { label: 'الاثنين', value: 42 },
  { label: 'الثلاثاء', value: 49 },
  { label: 'الأربعاء', value: 58 },
  { label: 'الخميس', value: 67 },
  { label: 'الجمعة', value: 75 },
]

export const recentComplaints = [
  {
    id: '443',
    subject: 'تجمع مياه في شارع الرئيس',
    area: 'المنطقة 4',
    status: 'مكتمل',
    date: '2024-05-21',
    createdAt: '2024-05-21',
  },
  {
    id: '442',
    subject: 'انقطاع الكهرباء في محلة',
    area: 'المنطقة 3',
    status: 'قيد المتابعة',
    date: '2024-05-20',
    createdAt: '2024-05-20',
  },
  {
    id: '441',
    subject: 'طلب ربط شبكة الصرف الصحي',
    area: 'المنطقة 2',
    status: 'مفتوح',
    date: '2024-05-18',
    createdAt: '2024-05-18',
  },
  {
    id: '440',
    subject: 'إصلاح إنارة الشوارع',
    area: 'المنطقة 1',
    status: 'مكتمل',
    date: '2024-05-13',
    createdAt: '2024-05-13',
  },
  {
    id: '439',
    subject: 'إزالة مكرهة صحية',
    area: 'المنطقة 5',
    status: 'قيد المعالجة',
    date: '2024-05-10',
    createdAt: '2024-05-10',
  },
]

/*
|--------------------------------------------------------------------------
| Sidebar
|--------------------------------------------------------------------------
*/

export const sidebarItems = [
  {
    label: 'لوحة التحكم',
    path: '/dashboard',
    icon: 'dashboard',

    allowedRoles: [
      'mayor',
      'technical_office',
      'municipality_admin',
    ],
  },

  {
    label: 'الموظفين',
    path: '/dashboard/employees',
    icon: 'users',

    allowedRoles: [
      'system_admin',
      'municipality_admin',
    ],
  },

  {
    label: 'الخدمات',
    path: '/dashboard/services',
    icon: 'services',

    children: [
      {
        label: 'طلبات المكتب الهندسي',
        path: '/dashboard/engineering-office/service-requests',
        allowedRoles: ['engineering_office'],
      },

      {
        label: 'طلبات المكتب التقني',
        path: '/dashboard/technical-office/service-requests',
        allowedRoles: ['technical_office'],
      },

      {
        label: 'طلبات رئيس البلدية',
        path: '/dashboard/mayor/service-requests',
        allowedRoles: ['mayor'],
      },

      {
        label: 'طلبات المفتش الميداني',
        path: '/dashboard/field-inspector/service-requests',
        allowedRoles: ['field_inspector'],
      },

      {
        label: 'طلبات مدير النظام',
        path: '/dashboard/admin/service-requests',
        allowedRoles: ['system_admin'],
      },
    ],
  },

  {
    label: 'البلديات',
    path: '/dashboard/municipalities',
    icon: 'municipalities',

    allowedRoles: ['system_admin'],
  },

  {
    label: 'الصلاحيات',
    path: '/dashboard/roles-permissions',
    icon: 'roles',

    allowedRoles: ['system_admin'],
  },

  {
    label: 'الشكاوى',
    path: '/dashboard/complaints/reports',
    icon: 'complaints',

    allowedRoles: ['technical_office'],
  },

  {
    label: 'شكاوى قسمي',
    path: '/dashboard/complaints/department',
    icon: 'departmentComplaints',

    allowedRoles: ['department_manager'],
  },
]

/*
|--------------------------------------------------------------------------
| الحصول على Role المستخدم
|--------------------------------------------------------------------------
|
| Login response:
|
| data.user.roles = ["system_admin"]
|
*/

export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))

    return user || null
  } catch (error) {
    console.error('Failed to parse user:', error)
    return null
  }
}

export const getCurrentRole = () => {
  const user = getCurrentUser()

  if (!user) {
    return null
  }

  /*
   * الـ API يرجع:
   *
   * roles: ["system_admin"]
   */

  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0]
  }

  return null
}

/*
|--------------------------------------------------------------------------
| Filter Sidebar By Role
|--------------------------------------------------------------------------
*/

export const getSidebarItemsByRole = (role) => {
  if (!role) {
    return []
  }

  return sidebarItems
    .map((item) => {
      /*
       * الخدمات
       */
      if (Array.isArray(item.children)) {
        const visibleChildren = item.children.filter((child) =>
          child.allowedRoles?.includes(role)
        )

        /*
         * إذا ما عنده أي خدمة
         * لا تظهر الخدمات أبداً
         */
        if (visibleChildren.length === 0) {
          return null
        }

        return {
          ...item,
          children: visibleChildren,
        }
      }

      /*
       * الأقسام العادية
       */
      if (item.allowedRoles?.includes(role)) {
        return item
      }

      return null
    })
    .filter(Boolean)
}

/*
|--------------------------------------------------------------------------
| أول صفحة مسموحة لكل Role
|--------------------------------------------------------------------------
*/

export const firstRouteByRole = {
  system_admin: '/dashboard/employees',

  mayor: '/dashboard',

  technical_office: '/dashboard',

  engineering_office:
    '/dashboard/engineering-office/service-requests',

  department_manager:
    '/dashboard/complaints/department',

  field_inspector:
    '/dashboard/field-inspector/service-requests',

  municipality_admin:
    '/dashboard',
}

/*
|--------------------------------------------------------------------------
| Get First Allowed Route
|--------------------------------------------------------------------------
*/

export const getFirstAllowedRoute = (role) => {
  if (!role) {
    return '/login'
  }

  return firstRouteByRole[role] || '/login'
}

/*
|--------------------------------------------------------------------------
| Check Route Permission
|--------------------------------------------------------------------------
*/

export const canAccessRoute = (role, path) => {
  if (!role || !path) {
    return false
  }

  const items = getSidebarItemsByRole(role)

  for (const item of items) {
    /*
     * القسم الرئيسي
     */
    if (item.path === path) {
      return true
    }

    /*
     * الأبناء
     */
    if (Array.isArray(item.children)) {
      const childExists = item.children.some(
        (child) => child.path === path
      )

      if (childExists) {
        return true
      }
    }
  }

  return false
}