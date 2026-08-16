
// البيانات الحقيقية تأتي الآن من الـ API عبر src/services/complaintsApi.js
// هذا الملف يحتوي فقط على الثوابت الثابتة (ألوان الحالات وخيارات الفلاتر).
// ==========================================




export const complaintStatuses = {
  draft: { label: "مسودة", color: "slate" },
  submitted: { label: "تم الإرسال", color: "sky" },
  under_review: { label: "قيد المراجعة", color: "amber" },
  forwarded_to_department: { label: "تم التحويل إلى القسم المختص", color: "amber" },
  in_progress: { label: "قيد التنفيذ", color: "slate" },
  resolved: { label: "تم الحل", color: "emerald" },
  rejected: { label: "مرفوضة", color: "red" },
};



export const complaintStatusOptions = [
  { value: "", label: "كل الحالات" },
  { value: "under_review", label: "قيد المراجعة" },
  { value: "forwarded_to_department", label: "تم التحويل للقسم" },
  { value: "in_progress", label: "قيد التنفيذ" },
  { value: "resolved", label: "تم الحل" },
  { value: "rejected", label: "مرفوضة" },
];
