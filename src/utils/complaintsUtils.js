// دوال مساعدة بسيطة لشاشات الشكاوى
// الـ Backend يرسل التواريخ بصيغة ISO مثل: 2026-08-10T09:14:00.000000Z

// التاريخ فقط: 2026-08-10
export const formatDate = (isoDate) => {
  if (!isoDate) return "-";

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// التاريخ والوقت: 2026-08-10 09:14
export const formatDateTime = (isoDate) => {
  if (!isoDate) return "-";

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return "-";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${formatDate(isoDate)} ${hours}:${minutes}`;
};

// وقت تقريبي بالعربية: منذ ساعتين / أمس / منذ 4 أيام
export const formatRelativeTime = (isoDate) => {
  if (!isoDate) return "-";

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return "-";

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours === 1) return "منذ ساعة";
  if (diffHours === 2) return "منذ ساعتين";
  if (diffHours < 24) return `منذ ${diffHours} ساعات`;

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) return "أمس";
  if (diffDays < 30) return `منذ ${diffDays} أيام`;

  return formatDate(isoDate);
};


export const getErrorMessage = (error, fallback) => {
  
  
  if (!error?.response) {
    return "تعذر الاتصال بالخادم،     ";
  }

  if (error.response.status === 401) {
    return "انتهت الجلسة، الرجاء تسجيل الدخول من جديد";
  }

  if (error.response.status === 403) {
    return "لا تملك صلاحية الوصول لهذه البيانات";
  }

  return error.response.data?.message || fallback;
};


export const formatCategory = (category, allCategories = []) => {
  if (!category) return "-";

  const parent = allCategories.find((item) => item.id === category.parent_id);

  return parent ? `${parent.name} › ${category.name}` : category.name;
};
