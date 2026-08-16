export const dashboardStats = [
  {
    label: 'إجمالي السكان',
    value: '4443',
    icon: 'users'
  },
  {
    label: 'إجمالي الشكاوى',
    value: '223',
    extra: '60%',
    icon: 'complaints'
  },
  {
    label: 'الشكاوى المنجزة',
    value: '134',
    extra: '60%',
    icon: 'completed'
  },
  {
    label: 'الفعاليات',
    value: '12',
    icon: 'Events'
  }
]

export const complaintDistribution = [
  { label: 'مكتمل', value: 146, percent: 65, color: 'bg-emerald-500' },
  { label: 'قيد المعالجة', value: 61, percent: 27, color: 'bg-lime-400' },
  { label: 'غير مدفوع', value: 16, percent: 8, color: 'bg-emerald-200' }
]

export const weeklyComplaintCounts = [
  { label: 'السبت', value: 24 },
  { label: 'الأحد', value: 36 },
  { label: 'الاثنين', value: 42 },
  { label: 'الثلاثاء', value: 49 },
  { label: 'الأربعاء', value: 58 },
  { label: 'الخميس', value: 67 },
  { label: 'الجمعة', value: 75 }
]

export const recentComplaints = [
  {
    id: '443',
    subject: 'تجمع مياه في شارع الرئيس',
    area: 'المنطقة 4',
    status: 'مكتمل',
    date: '2024-05-21',
    createdAt: '2024-05-21'
  },
  {
    id: '442',
    subject: 'انقطاع الكهرباء في محلة',
    area: 'المنطقة 3',
    status: 'قيد المتابعة',
    date: '2024-05-20',
    createdAt: '2024-05-20'
  },
  {
    id: '441',
    subject: 'طلب ربط شبكة الصرف الصحي',
    area: 'المنطقة 2',
    status: 'مفتوح',
    date: '2024-05-18',
    createdAt: '2024-05-18'
  },
  {
    id: '440',
    subject: 'إصلاح إنارة الشوارع',
    area: 'المنطقة 1',
    status: 'مكتمل',
    date: '2024-05-13',
    createdAt: '2024-05-13'
  },
  {
    id: '439',
    subject: 'إزالة مكرهة صحية',
    area: 'المنطقة 5',
    status: 'قيد المعالجة',
    date: '2024-05-10',
    createdAt: '2024-05-10'
  }
]

export const sidebarItems = [
  { label: 'لوحة التحكم', path: '/dashboard', icon: 'dashboard' },
  { label: 'المواطنين', path: '/dashboard/users', icon: 'users' },
  { label: 'الموظفين', path: '/dashboard/employees', icon: 'users' },
  { label: 'الأقسام', path: '/dashboard/departments', icon: 'departments' },
  { label: 'الخدمات', path: '/dashboard/services', icon: 'services' },
  { label: 'البلديات', path: '/dashboard/municipalities', icon: 'municipalities' },
  { label: 'الأخبار', path: '/dashboard/news', icon: 'news' },
  { label: 'الفعاليات', path: '/dashboard/events', icon: 'events' },
  { label: 'الصلاحيات', path: '/dashboard/roles-permissions', icon: 'roles' },
  { label: 'الشكاوى', path: '/dashboard/complaints/reports', icon: 'complaints' },
  { label: 'شكاوى قسمي', path: '/dashboard/complaints/department', icon: 'departmentComplaints' },
  
  
  
]