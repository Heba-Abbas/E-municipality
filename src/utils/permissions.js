// Unified permissions helper

// This helper reads the current user from localStorage (where the app stores it),
// normalizes the permissions structure and provides `hasPermission` and
// `filterItemsByPermission` utilities.

// It does NOT assume a fixed structure; it attempts to detect common shapes:
// - user.permissions (array of strings)
// - user.roles[].permissions (array)
// - user.data.permissions
// - role objects with { name } or simple strings

function getRawUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    return null;
  }
}

function extractPermissionsFromUser(user) {
  if (!user) return [];

  // if already an array of strings at top-level
  if (Array.isArray(user.permissions)) {
    return user.permissions.map(normalizePermissionToken).filter(Boolean);
  }

  // check common nested shapes
  if (user.roles && Array.isArray(user.roles)) {
    const perms = user.roles.flatMap((role) => {
      if (!role) return [];
      if (Array.isArray(role.permissions)) return role.permissions;
      if (Array.isArray(role?.data?.permissions)) return role.data.permissions;
      return [];
    });

    return perms.map(normalizePermissionToken).filter(Boolean);
  }

  // direct nested data
  if (user.data) {
    if (Array.isArray(user.data.permissions)) {
      return user.data.permissions.map(normalizePermissionToken).filter(Boolean);
    }
    if (Array.isArray(user.data?.user?.permissions)) {
      return user.data.user.permissions.map(normalizePermissionToken).filter(Boolean);
    }
  }

  // sometimes backend returns user as { data: { permissions: [...] } }
  if (Array.isArray(user?.data?.permissions)) {
    return user.data.permissions.map(normalizePermissionToken).filter(Boolean);
  }

  // fallback: try to find any array-valued properties that look like permissions
  const candidates = Object.values(user).find((v) => Array.isArray(v) && v.length > 0 && typeof v[0] === 'string');
  if (Array.isArray(candidates)) return candidates.map(normalizePermissionToken).filter(Boolean);

  return [];
}

function normalizePermissionToken(token) {
  if (!token) return null;
  if (typeof token === 'string') return token.trim();
  if (typeof token === 'object' && token.name) return String(token.name).trim();
  return null;
}

// Cached permissions with simple invalidation when user changes
let _cached = null;
let _cachedRaw = null;

function getPermissions() {
  const rawUser = getRawUser();

  // simple cache invalidation: if raw JSON changed, recompute
  const rawJson = rawUser ? JSON.stringify(rawUser) : null;
  if (rawJson === _cachedRaw && _cached) return _cached;

  _cachedRaw = rawJson;
  const perms = extractPermissionsFromUser(rawUser);
  _cached = Array.from(new Set(perms));
  return _cached;
}

export function hasPermission(permission) {
  if (!permission) return false;
  const perms = getPermissions();
  return perms.includes(permission);
}

// Accepts a single permission or array of permissions (any-of)
export function can(permissionOrArray) {
  if (!permissionOrArray) return false;
  const perms = getPermissions();

  if (Array.isArray(permissionOrArray)) {
    return permissionOrArray.some((p) => perms.includes(p));
  }

  return perms.includes(permissionOrArray);
}

// filter items by permission metadata
// item can have `permission` string or `permissions` array or `permissionsAny` for any-of
export function filterItemsByPermission(items) {
  if (!Array.isArray(items)) return [];

  return items.filter((item) => {
    if (!item) return false;

    // if no permission metadata, keep it (backwards compatible)
    if (!item.permission && !item.permissions && !item.permissionsAny) return true;

    if (item.permission) {
      return can(item.permission);
    }

    if (Array.isArray(item.permissions)) {
      // require ALL
      return item.permissions.every((p) => can(p));
    }

    if (Array.isArray(item.permissionsAny)) {
      // require ANY
      return item.permissionsAny.some((p) => can(p));
    }

    return true;
  });
}

export default {
  getPermissions,
  hasPermission,
  can,
  filterItemsByPermission,
};
