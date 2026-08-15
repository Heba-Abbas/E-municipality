import { useState } from "react";
import {
  Check,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { createServiceVersion } from "../../services/serviceTypesApi";

const createEmptyField = (sortOrder) => ({
  field_key: "",
  label: "",
  field_type: "text",
  is_required: true,
  options_json: [],
  validation_json: [],
  condition_json: "",
  sort_order: sortOrder,
});

function ServiceVersionForm({ serviceType, onSuccess }) {
  const [fields, setFields] = useState([
    createEmptyField(1),
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (index, key, value) => {
    setFields((prev) =>
      prev.map((field, fieldIndex) =>
        fieldIndex === index
          ? {
              ...field,
              [key]: value,
            }
          : field
      )
    );
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      createEmptyField(prev.length + 1),
    ]);
  };

  const removeField = (index) => {
    if (fields.length === 1) return;

    setFields((prev) =>
      prev
        .filter((_, fieldIndex) => fieldIndex !== index)
        .map((field, fieldIndex) => ({
          ...field,
          sort_order: fieldIndex + 1,
        }))
    );
  };

  const handleArrayChange = (
    index,
    key,
    value
  ) => {
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateField(index, key, arrayValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createServiceVersion(
        serviceType.id,
        fields
      );

      console.log(
        "Service Version Created Successfully:",
        response
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "فشل إنشاء نسخة المعاملة"
        );
      }

      onSuccess(response.data);

    } catch (err) {
      console.error(
        "Create Service Version Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء إنشاء نسخة المعاملة"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            إعداد نسخة المعاملة
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {serviceType.name}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          تم إنشاء المعاملة بنجاح. أضف الآن الحقول الخاصة بها.
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {fields.map((field, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#121b24]"
          >

            {/* Field Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                الحقل {index + 1}
              </h3>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Field Key */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  مفتاح الحقل
                </label>

                <input
                  type="text"
                  value={field.field_key}
                  onChange={(e) =>
                    updateField(
                      index,
                      "field_key",
                      e.target.value
                    )
                  }
                  required
                  placeholder="applicant_name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0f1821] dark:text-white"
                />
              </div>

              {/* Label */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  اسم الحقل
                </label>

                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(
                      index,
                      "label",
                      e.target.value
                    )
                  }
                  required
                  placeholder="Applicant Name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0f1821] dark:text-white"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  نوع الحقل
                </label>

                <select
                  value={field.field_type}
                  onChange={(e) =>
                    updateField(
                      index,
                      "field_type",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0f1821] dark:text-white"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="file">File</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>

              {/* Required */}
              <div className="flex items-end">
                <label className="flex h-[46px] w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-[#0f1821]">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) =>
                      updateField(
                        index,
                        "is_required",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-emerald-500"
                  />

                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    الحقل مطلوب
                  </span>
                </label>
              </div>

              {/* Options */}
              {field.field_type === "select" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    الخيارات
                  </label>

                  <input
                    type="text"
                    value={field.options_json.join(", ")}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "options_json",
                        e.target.value
                      )
                    }
                    placeholder="residential, commercial"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0f1821] dark:text-white"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    افصل بين الخيارات بفاصلة
                  </p>
                </div>
              )}

              {/* Validation */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  قواعد التحقق
                </label>

                <input
                  type="text"
                  value={field.validation_json.join(", ")}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      "validation_json",
                      e.target.value
                    )
                  }
                  placeholder="string, max:255"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#0f1821] dark:text-white"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  مثال: string, max:255
                </p>
              </div>

            </div>
          </div>
        ))}

        {/* Add Field */}
        <button
          type="button"
          onClick={addField}
          className="inline-flex h-[44px] items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          إضافة حقل
        </button>

        {/* Submit */}
        <div className="flex justify-start gap-3 border-t border-slate-200 pt-5 dark:border-white/10">

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}

            إنشاء وتفعيل النسخة
          </button>

        </div>

      </form>
    </section>
  );
}

export default ServiceVersionForm;