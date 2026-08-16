import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

// نافذة تحديث الشكوى كمحلولة
// الملاحظة اختيارية، لكن إن تمت كتابتها يجب أن لا تقل عن 5 أحرف
function ResolveComplaintModal({ isOpen, isSubmitting, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setNote("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    const trimmedNote = note.trim();

    if (trimmedNote.length > 0 && trimmedNote.length < 5) {
      setError("الملاحظة اختيارية، لكن إن أدخلتِها يجب أن لا تقل عن 5 أحرف");
      return;
    }

    // الصفحة هي التي تغلق النافذة بعد نجاح الطلب
    onConfirm(trimmedNote);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                تحديث كمحلولة
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                ملاحظة اختيارية — من 5 إلى 2000 حرف إن أدخلتِها
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
              ملاحظة (اختياري)
            </label>

            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError("");
              }}
              maxLength={2000}
              rows={4}
              className={`w-full resize-none rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:bg-[#121b24] dark:text-white ${
                error
                  ? "border-red-400 dark:border-red-500/40"
                  : "border-slate-200 dark:border-white/10"
              }`}
            />
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          {/* الأزرار */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جاري الحفظ..." : "تأكيد الحل"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:hover:bg-[#17212b]"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResolveComplaintModal;
