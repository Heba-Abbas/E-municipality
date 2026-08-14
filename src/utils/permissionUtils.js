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

  // build a phrase by translating tokens
  const translated = tokens.map((t) => TOKEN_MAP[t] || t);

  // prefer "action object" structure if possible
  if (tokens.length >= 2) {
    return `${translated[0]} ${translated.slice(1).join(' ')}`;
  }

  return translated.join(' ');
}

export default translatePermissionName;
