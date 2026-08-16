import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// 
// الدور المطلوب: technical_office
// ==========================================


// الرد: data.items[] + data.pagination
export const getComplaintReports = async () => {
  const response = await api.get("/technical-office/complaint-reports");
  return response.data;
};

// جلب بلاغ واحد
export const getComplaintReport = async (id) => {
  const response = await api.get(`/technical-office/complaint-reports/${id}`);
  return response.data;
};

// الشكاوى المشابهة للبلاغ (كشف تلقائي)
export const getSimilarComplaints = async (id) => {
  const response = await api.get(
    `/technical-office/complaint-reports/${id}/similar`
  );
  return response.data;
};

// توحيد البلاغ كشكوى جديدة
export const createUnifiedComplaint = async (id) => {
  const response = await api.post(
    `/technical-office/complaint-reports/${id}/create-unified`
  );
  return response.data;
};

// دمج البلاغ مع شكوى موحّدة موجودة
export const mergeComplaintReport = async (id, complaintId) => {
  const response = await api.post(
    `/technical-office/complaint-reports/${id}/merge`,
    { complaint_id: complaintId }
  );
  return response.data;
};

export const rejectComplaintReport = async (id) => {
  const response = await api.patch(
    `/technical-office/complaint-reports/${id}/reject`
  );
  return response.data;
};





// filters: { status, category_id, work_unit_id, date_from, date_to, search, per_page }
export const getUnifiedComplaints = async (filters = {}) => {
  const response = await api.get("/unified-complaints", { params: filters });
  return response.data;
};

// تعيين وحدات عمل للشكوى
export const assignWorkUnits = async (complaintId, workUnitIds, note) => {
  const response = await api.post(
    `/technical-office/complaints/${complaintId}/assign-work-units`,
    {
      work_unit_ids: workUnitIds,
      ...(note ? { note: note } : {}),
    }
  );

  return response.data;
};

// رفض الشكوى الموحّدة (متاح فقط عندما تكون الحالة under_review)
export const rejectUnifiedComplaint = async (complaintId) => {
  const response = await api.patch(
    `/technical-office/complaints/${complaintId}/reject`
  );
  return response.data;
};

export const getWorkUnits = async () => {
  const response = await api.get("/technical-office/work-units");
  return response.data;
};

export const getComplaintCategories = async () => {
  const response = await api.get("/ComplaintCategories");
  return response.data;
};

// ==========================================
//
// الدور المطلوب: department_manager
// القسم يحدده الـ Backend تلقائياً من المستخدم الحالي
// ==========================================

// جلب شكاوى وحدة العمل التابعة للمدير
export const getDepartmentComplaints = async () => {
  const response = await api.get("/department-manager/complaints");
  return response.data;
};

// جلب شكوى قسم واحدة
export const getDepartmentComplaint = async (id) => {
  const response = await api.get(`/department-manager/complaints/${id}`);
  return response.data;
};

// بدء تنفيذ الشكوى (ملاحظة اختيارية)
export const startDepartmentComplaint = async (id, note) => {
  const response = await api.patch(
    `/department-manager/complaints/${id}/start`,
    note ? { note: note } : {}
  );

  return response.data;
};

export const resolveDepartmentComplaint = async (id, note) => {
  const response = await api.patch(
    `/department-manager/complaints/${id}/resolve`,
    note ? { note: note } : {}
  );

  return response.data;
};

export const rejectDepartmentComplaint = async (id) => {
  const response = await api.patch(
    `/department-manager/complaints/${id}/reject`
  );
  return response.data;
};
