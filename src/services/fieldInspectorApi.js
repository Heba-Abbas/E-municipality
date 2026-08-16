import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// =====================================================
// Authorization
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// جلب وثيقة المفتش الميداني عبر QR
//
// GET:
// /api/field-inspector/documents/{verificationCode}/file
//
// verificationCode هو الكود الموجود في QR
// =====================================================

export const openFieldInspectorDocument = async (
  verificationCode
) => {
  const response = await api.get(
    `/field-inspector/documents/${verificationCode}/file`,
    {
      responseType: "blob",
    }
  );

  const contentType =
    response.headers["content-type"] ||
    "application/pdf";

  const blob = new Blob([response.data], {
    type: contentType,
  });

  const fileUrl = window.URL.createObjectURL(blob);

  window.open(fileUrl, "_blank");

  // تنظيف الرابط بعد دقيقة
  setTimeout(() => {
    window.URL.revokeObjectURL(fileUrl);
  }, 60000);

  return response;
};

// =====================================================
// التحقق من الوثيقة
//
// GET:
// /api/field-inspector/documents/{verificationCode}/verify
// =====================================================

export const verifyFieldInspectorDocument = async (
  verificationCode
) => {
  const response = await api.get(
    `/field-inspector/documents/${verificationCode}/verify`
  );

  return response.data;
};

export default api;