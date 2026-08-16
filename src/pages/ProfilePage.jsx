import { useState } from "react";
import { User } from "lucide-react";

import {
  applyFontSize,
  fontSizeOptions,
  getSavedFontSize,
} from "../utils/fontSize";


function ProfilePage() {
  const [fontSize, setFontSize] = useState(getSavedFontSize());
  const [savedMsg, setSavedMsg] = useState("");

  
  const profile = {
    fullName: "م. لي مينهو",
    role: "موظف",
    email: "user@baladiyatuna.gov",
  };

  const handleFontSizeChange = (sizeKey) => {
    setFontSize(sizeKey);
    applyFontSize(sizeKey);
  };

  const handleSave = () => {

    applyFontSize(fontSize);
    setSavedMsg("تم حفظ التغييرات");

    setTimeout(() => setSavedMsg(""), 2500);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200";

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* العنوان */}
      <h1 className="pr-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
        الملف الشخصي والإعدادات
      </h1>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] lg:p-8">
        {/* رأس البطاقة */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-white dark:bg-emerald-800">
            <User className="h-7 w-7" strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {profile.fullName}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {profile.role}
            </p>
          </div>
        </div>

        {/* الحقول */}
        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              الاسم الكامل
            </label>

            <input
              type="text"
              value={profile.fullName}
              readOnly
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              value={profile.email}
              readOnly
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              كلمة المرور الحالية
            </label>

            <input
              type="password"
              value="********"
              readOnly
              className={inputClass}
            />
          </div>

          {/* حجم الخط — إمكانية الوصول */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              حجم الخط في الموقع (إمكانية الوصول)
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              {fontSizeOptions.map((option) => {
                const isActive = fontSize === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleFontSizeChange(option.key)}
                    className={[
                      "h-12 rounded-full border text-sm font-medium transition",
                      isActive
                        ? "border-emerald-900 bg-emerald-900 text-white dark:border-emerald-700 dark:bg-emerald-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-[#17212b]",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              يُطبَّق فوراً على كامل الموقع لهذا المستخدم — مفيد لمن يفضّل قراءة
              نص أكبر.
            </p>
          </div>
        </div>

        {/* الحفظ */}
        <div className="mt-8 flex items-center justify-end gap-3">
          {savedMsg && (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {savedMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-900 px-6 text-sm font-medium text-white transition hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700"
          >
            حفظ التغييرات
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
