import api from "./api";

/* =========================================================
   Generic helpers
========================================================= */

const openAttachment = async (url) => {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data], {
      type: response.headers["content-type"] || "application/pdf",
    })
  );

  window.open(blobUrl, "_blank");

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 60000);

  return response;
};

const handleResponse = (response) => {
  return response.data;
};

/* =========================================================
   TECHNICAL OFFICE
========================================================= */

export const getTechnicalRequests = async () => {
  const response = await api.get(
    "/technical-office/service-requests"
  );

  return handleResponse(response);
};

export const getTechnicalRequestById = async (requestId) => {
  const response = await api.get(
    `/technical-office/service-requests/${requestId}`
  );

  return handleResponse(response);
};

export const startTechnicalReview = async (requestId) => {
  const response = await api.patch(
    `/technical-office/service-requests/${requestId}/start-review`
  );

  return handleResponse(response);
};

export const forwardTechnicalRequestToEngineering = async (
  requestId
) => {
  const response = await api.patch(
    `/technical-office/service-requests/${requestId}/forward-to-engineering`
  );

  return handleResponse(response);
};

/*
  ملاحظة:
  الـ API الذي أرسلته للـ reject بالمكتب الفني
  كان مكتوباً بالخطأ نفس endpoint الخاص بالـ forward.

  استخدمنا endpoint /reject المتوقع حسب باقي الـ APIs.
*/
export const rejectTechnicalRequest = async (requestId) => {
  const response = await api.patch(
    `/technical-office/service-requests/${requestId}/reject`
  );

  return handleResponse(response);
};

export const getTechnicalAttachment = async (
  requestId,
  attachmentId
) => {
  return openAttachment(
    `/technical-office/service-requests/${requestId}/attachments/${attachmentId}`
  );
};

/* =========================================================
   ENGINEERING OFFICE
========================================================= */

export const getEngineeringRequests = async () => {
  const response = await api.get(
    "/engineering-office/service-requests"
  );

  return handleResponse(response);
};

export const getEngineeringRequestById = async (requestId) => {
  const response = await api.get(
    `/engineering-office/service-requests/${requestId}`
  );

  return handleResponse(response);
};

export const forwardEngineeringRequestToMayor = async (
  requestId
) => {
  const response = await api.patch(
    `/engineering-office/service-requests/${requestId}/forward-to-mayor`
  );

  return handleResponse(response);
};

export const rejectEngineeringRequest = async (requestId) => {
  const response = await api.patch(
    `/engineering-office/service-requests/${requestId}/reject`
  );

  return handleResponse(response);
};

export const getEngineeringAttachment = async (
  requestId,
  attachmentId
) => {
  return openAttachment(
    `/engineering-office/service-requests/${requestId}/attachments/${attachmentId}`
  );
};

/* =========================================================
   MAYOR
========================================================= */

export const getMayorRequests = async () => {
  const response = await api.get(
    "/mayor/service-requests"
  );

  return handleResponse(response);
};

export const getMayorRequestById = async (requestId) => {
  const response = await api.get(
    `/mayor/service-requests/${requestId}`
  );

  return handleResponse(response);
};

export const approveAndIssueMayorRequest = async (
  requestId,
  expiresAt
) => {
  const response = await api.post(
    `/mayor/service-requests/${requestId}/approve-and-issue`,
    {
      expires_at: expiresAt,
    }
  );

  return handleResponse(response);
};


export const rejectMayorRequest = async (requestId) => {
  const response = await api.patch(
    `/mayor/service-requests/${requestId}/reject`
  );

  return handleResponse(response);
};

export const getMayorAttachment = async (
  requestId,
  attachmentId
) => {
  return openAttachment(
    `/mayor/service-requests/${requestId}/attachments/${attachmentId}`
  );
};

export default api;