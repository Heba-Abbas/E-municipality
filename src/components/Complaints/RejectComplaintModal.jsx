import { XCircle, X } from "lucide-react";


function RejectComplaintModal({ isOpen, isSubmitting, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <XCircle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                رفض الشكوى
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="space-y-4 p-6">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            هل أنت متأكد من رفض هذه الشكوى؟
          </p>

          {/* الأزرار */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-xl bg-red-400 px-6 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جاري الرفض..." : "تأكيد الرفض"}
            </button>

            <button
              type="button"
              onClick={onClose}
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

export default RejectComplaintModal;
