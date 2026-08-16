import api from "./api";



// =====================================================
// تغيير كلمة المرور المؤقتة
// =====================================================

export const changeTemporaryPassword = async (
  payload
) => {
  const response = await api.post(
    "/auth/change-temporary-password",
    payload
  );

  return response.data;
};

export default api;