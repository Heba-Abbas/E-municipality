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

// جلب البلديات
export const getMunicipalities = async () => {
  const response = await api.get("/admin/municipalities");

  // مهم: نرجع data نفسها
  return response.data;
};

// إنشاء نوع معاملة
export const createServiceType = async (payload) => {
  const response = await api.post(
    "/system-admin/service-types",
    payload
  );

  return response.data;
};

// إنشاء نسخة من نوع المعاملة
export const createServiceVersion = async (serviceTypeId, fields) => {
  const formData = new FormData();

  fields.forEach((field, index) => {
    formData.append(
      `fields[${index}][field_key]`,
      field.field_key
    );

    formData.append(
      `fields[${index}][label]`,
      field.label
    );

    formData.append(
      `fields[${index}][field_type]`,
      field.field_type
    );

    formData.append(
      `fields[${index}][is_required]`,
      field.is_required ? "1" : "0"
    );

    field.options_json.forEach((option, optionIndex) => {
      formData.append(
        `fields[${index}][options_json][${optionIndex}]`,
        option
      );
    });

    field.validation_json.forEach((rule, ruleIndex) => {
      formData.append(
        `fields[${index}][validation_json][${ruleIndex}]`,
        rule
      );
    });

    if (field.condition_json) {
      formData.append(
        `fields[${index}][condition_json]`,
        field.condition_json
      );
    }

    formData.append(
      `fields[${index}][sort_order]`,
      field.sort_order
    );
  });

  const response = await api.post(
    `/system-admin/service-types/${serviceTypeId}/versions`,
    formData
  );

  return response.data;
};

export default api;