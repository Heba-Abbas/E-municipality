import axios from "axios";
import { getUnifiedComplaints } from "./complaintsApi";

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
// إحصائيات الشكاوى للوحة التحكم
// ------------------------------------------
// GET /api/complaints/statistics?date_from=&date_to=
//
// الصلاحية المطلوبة: view complaint statistics
// (يملكها: municipality_admin و technical_office و mayor — وليس system_admin)
//
// ==========================================

export const getComplaintStatistics = async (dateFrom, dateTo) => {
  const params = {};

  if (dateFrom && dateTo) {
    params.date_from = dateFrom;
    params.date_to = dateTo;
  }

  const response = await api.get("/complaints/statistics", { params: params });

  return response.data;
};

// ==========================================

// ==========================================

const arabicWeekDays = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const toApiDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



export const getResolvedPerDay = async (endDate) => {
  const end = endDate ? new Date(endDate) : new Date();

 
  
  const days = [];

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(end);
    day.setDate(end.getDate() - i);
    days.push(day);
  }

  const requests = days.map((day) => {
    const apiDate = toApiDate(day);

    return api
      .get("/complaints/statistics", {
        params: { date_from: apiDate, date_to: apiDate },
      })
      .then((response) => response.data?.data?.resolved_in_period || 0);
  });

  const values = await Promise.all(requests);

  return days.map((day, index) => ({
    label: arabicWeekDays[day.getDay()],
    date: toApiDate(day),
    value: values[index],
  }));
};

// ==========================================

// ==========================================

const distributionStatuses = [
  { key: "under_review", label: "قيد المراجعة", color: "#d97706" },
  { key: "forwarded_to_department", label: "محوّلة للقسم", color: "#0ea5e9" },
  { key: "in_progress", label: "قيد التنفيذ", color: "#64748b" },
  { key: "resolved", label: "تم الحل", color: "#1e5e41" },
  { key: "rejected", label: "مرفوضة", color: "#ef4444" },
];

export const getStatusDistribution = async (dateFrom, dateTo) => {
  const requests = distributionStatuses.map((status) => {
    const filters = { status: status.key, per_page: 1 };

    if (dateFrom && dateTo) {
      filters.date_from = dateFrom;
      filters.date_to = dateTo;
    }

    return getUnifiedComplaints(filters).then(
      (response) => response?.data?.pagination?.total || 0
    );
  });

  const totals = await Promise.all(requests);

  return distributionStatuses.map((status, index) => ({
    ...status,
    value: totals[index],
  }));
};
