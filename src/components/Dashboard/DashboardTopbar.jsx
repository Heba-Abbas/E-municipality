import { Bell, Menu, Settings } from "lucide-react";
import ThemeToggle from "./../ThemeToggle";

function DashboardTopbar() {
  return (
    <header className="sticky top-4 z-20 mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#101922] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        
        {/* Right (العنوان وزر القائمة) */}
        <div className="flex items-center gap-3">
          <button className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Menu size={18} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">الرئيسية</h1>
        </div>

        {/* Left (الأدوات وحساب المستخدم) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* زر تبديل الثيم */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* خط فاصل */}
          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* زر الإشعارات */}
          <button className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Bell size={18} />
          </button>

          {/* خط فاصل */}
          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* زر الإعدادات */}
          <button className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <Settings size={18} />
          </button>

          {/* خط فاصل */}
          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* معلومات المستخدم والصورة الشخصية */}
          <div className="flex items-center gap-2.5">
            <div className="text-right leading-4">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">وسام أحمد</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">(مدير النظام)</p>
            </div>
            <img
              src="/images/user.png"
              alt="user"
              className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-white/10"
            />
          </div>

        </div>

      </div>
    </header>
  );
}

export default DashboardTopbar;