const MANUAL_MAP = {
  // common explicit mappings (add more as needed)
  'users.view': 'عرض المستخدمين',
  'users.create': 'إضافة مستخدم',
  'users.update': 'تعديل مستخدم',
  'users.delete': 'حذف مستخدم',
  'citizens.view': 'عرض المواطنين',
  'citizens.create': 'إضافة مواطن',
  'citizens.update': 'تعديل مواطن',
  'citizens.delete': 'حذف مواطن',
  'employees.view': 'عرض الموظفين',
  'employees.create': 'إضافة موظف',
  'employees.update': 'تعديل موظف',
  'employees.delete': 'حذف موظف',
  'roles.view': 'عرض الأدوار',
  'roles.create': 'إنشاء دور',
  'roles.update': 'تعديل دور',
  'roles.delete': 'حذف دور',
  'permissions.view': 'عرض الأذونات',
  'permissions.assign': 'تعيين إذن',
  'permissions.revoke': 'إلغاء إذن',
  // service-request specific
  'technical-office.service-requests.view': 'عرض طلبات المكتب الفني',
  'engineering-office.service-requests.view': 'عرض طلبات المكتب الهندسي',
  'mayor.service-requests.view': 'عرض طلبات رئيس البلدية',
  'system-admin.service-types.manage': 'إدارة أنواع المعاملات',
  
};

const TOKEN_MAP = {
  view: 'عرض',
  create: 'إضافة',
  store: 'إضافة',
  update: 'تعديل',
  edit: 'تعديل',
  delete: 'حذف',
  remove: 'حذف',
  manage: 'إدارة',
  assign: 'تعيين',
  revoke: 'إلغاء',
  permission: 'أذن',
  permissions: 'الأذونات',
  role: 'دور',
  roles: 'الأدوار',
  user: 'مستخدم',
  users: 'المستخدمين',
  citizen: 'مواطن',
  citizens: 'المواطنين',
  employee: 'موظف',
  employees: 'الموظفين',
  service: 'خدمة',
  services: 'الخدمات',
  department: 'قسم',
  departments: 'الأقسام',
  activate:'تفعيل',
  municipalities:'المحافظات',
  complaints:'الشكاوى',
  complaint:'شكوى',
  to:"الى",
  approve:'الموافقة على',
  requests:'الطلبات',
  engineering:"هندسة",
  execute:"تنفيذ",
  force:"إجبار",
  review:"مراجعة",
  technical:"فني",
  office:"مكتب",
  attachment: 'مرفق',
  attachments: 'المرفقات',
  download: 'تنزيل',
  forward: 'تحويل',
  start: 'بدء',
  reject: 'رفض',
  approve_and_issue: 'الموافقة والإصدار',
  issue: 'إصدار',
  publish: 'نشر',
  open: 'فتح',
  close: 'إغلاق',
  draft: 'مسودة',
  index: 'قائمة',
  list: 'قائمة',
  show: 'عرض',
  read: 'قراءة',
  write: 'كتابة',
  restore: 'استعادة',
  admin: 'المسؤول',
  system: 'النظام',
  governorate: 'محافظة',
  governorates: 'المحافظات',
  municipality: 'بلدية',
  municipalities: 'البلديات',
  mayor: 'رئيس البلدية',
  technical_office: 'المكتب الفني',
  engineering_office: 'المكتب الهندسي',
  system_admin: 'مدير النظام',
  service_request: 'طلب خدمة',
  service_requests: 'طلبات الخدمة',
  

};

export function translatePermissionName(name) {
  if (!name) return '';

  // exact manual mapping
  if (MANUAL_MAP[name]) return MANUAL_MAP[name];

  // try snake_case or dot notation
  const tokens = name
    .replace(/[^a-zA-Z0-9._]/g, ' ')
    .split(/[._\s]+/)
    .filter(Boolean)
    .map((t) => t.toLowerCase());

  // if single token and mapped
  if (tokens.length === 1 && TOKEN_MAP[tokens[0]]) {
    return TOKEN_MAP[tokens[0]];
  }

  // translate tokens where possible
  const translatedTokens = tokens.map((t) => TOKEN_MAP[t] || null);

  // If entire phrase is known (no nulls), try to produce a natural Arabic phrase
  const hasUnknown = translatedTokens.some((t) => t === null);

  // Helper: join object tokens into a natural phrase
  const joinObject = (objTokens) => {
    // common compound patterns
    const t = objTokens.map((tok) => TOKEN_MAP[tok] || tok);

    // handle service requests -> 'طلبات الخدمة'
    if (objTokens.includes('service') && objTokens.includes('requests')) {
      return 'طلبات الخدمة';
    }

    // handle service types
    if (objTokens.includes('service') && objTokens.includes('types')) {
      return 'أنواع المعاملات';
    }

    // handle technical/engineering office
    if (objTokens.includes('technical') && objTokens.includes('office')) {
      return 'طلبات المكتب الفني';
    }

    if (objTokens.includes('engineering') && objTokens.includes('office')) {
      return 'طلبات المكتب الهندسي';
    }

    // default: join translated tokens
    return t.join(' ');
  };

  // Determine if last token is an action (view/create/update/etc.)
  const actionCandidates = new Set([
    'view',
    'create',
    'store',
    'update',
    'edit',
    'delete',
    'remove',
    'manage',
    'assign',
    'revoke',
    'approve',
    'reject',
    'forward',
    'start',
    'execute',
    'download',
    'open',
    'approve_and_issue',
    'issue',
    'publish',
  ]);

  const lastToken = tokens[tokens.length - 1];

  if (tokens.length >= 2 && actionCandidates.has(lastToken)) {
    const action = TOKEN_MAP[lastToken] || lastToken;
    const objectTokens = tokens.slice(0, -1);

    const objectPhrase = joinObject(objectTokens);

    // If any object token was unknown, try fallback to manual map for full name
    const manualKey = objectTokens.join('.') + '.' + lastToken;
    if (MANUAL_MAP[manualKey]) return MANUAL_MAP[manualKey];

    // Return 'action object' with Arabic action first
    return `${action} ${objectPhrase}`;
  }

  // If no clear action at end, but all tokens translated, join them
  if (!hasUnknown) {
    return translatedTokens.join(' ');
  }

  // As a last resort, try to translate each token where possible and join
  const fallback = tokens.map((t) => TOKEN_MAP[t] || t).join(' ');

  return fallback;
}

export default translatePermissionName;
