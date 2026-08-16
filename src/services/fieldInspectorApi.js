import api from "./api";

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