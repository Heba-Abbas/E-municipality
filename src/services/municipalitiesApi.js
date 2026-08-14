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

// جلب جميع البلديات
export const getMunicipalities = async () => {
  const response = await api.get("/admin/municipalities");
  return response.data;
};

// جلب المحافظات
export const getGovernorates = async () => {
  const response = await api.get("/public/governorates");
  return response.data;
};

// جلب بلدية واحدة
export const getMunicipality = async (id) => {
  const response = await api.get(`/admin/municipalities/${id}`);
  return response.data;
};

// إضافة بلدية
export const createMunicipality = async (municipalityData) => {
  const payload = {
    name: municipalityData.name,
    address: municipalityData.address,
    phone: municipalityData.phone,
    email: municipalityData.email,
    status: false,
    governorate_id: municipalityData.governorate_id,
  };

  console.log("Municipality Payload:", payload);

  try {
    const response = await api.post(
      "/admin/municipalities",
      payload
    );

    console.log("Municipality Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Municipality API Error:",
      error.response?.data
    );

    console.error(
      "Municipality API Status:",
      error.response?.status
    );

    throw error;
  }
};

// تعديل بلدية
export const updateMunicipality = async (id, municipalityData) => {
  const response = await api.put(
    `/admin/municipalities/${id}`,
    {
      name: municipalityData.name,
      address: municipalityData.address,
      phone: municipalityData.phone,
      email: municipalityData.email,
      status: typeof municipalityData.status !== 'undefined' ? municipalityData.status : false,
      governorate_id: municipalityData.governorate_id,
    }
  );

  return response.data;
};

// تفعيل البلدية
export const activateMunicipality = async (id) => {
  const response = await api.patch(
    `/admin/municipalities/${id}/activate`
  );

  return response.data;
};

// إلغاء تفعيل البلدية
export const deactivateMunicipality = async (id) => {
  const response = await api.patch(
    `/admin/municipalities/${id}/deactivate`
  );

  return response.data;
};

export default api;