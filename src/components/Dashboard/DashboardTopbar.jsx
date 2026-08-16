import {
  Bell,
  Settings,
  LockKeyhole,
  AlertCircle,
} from "lucide-react";

import ThemeToggle from "./../ThemeToggle";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function DashboardTopbar() {
  const [mustChange, setMustChange] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // قراءة حالة المستخدم من localStorage
  // =====================================================

  const checkPasswordStatus = () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) {
        setMustChange(false);
        return;
      }

      const parsedUser = JSON.parse(rawUser);

      /*
       * الـ API يرجع:
       *
       * data: {
       *   token: "...",
       *   requires_password_change: true,
       *   user: {
       *      ...
       *   }
       * }
       *
       * لذلك يجب قراءة requires_password_change
       * من data وليس من data.user.
       */

      const requiresPasswordChange =
        parsedUser?.data?.requires_password_change ??
        parsedUser?.requires_password_change ??
        parsedUser?.user?.requires_password_change ??
        false;

      const must =
        requiresPasswordChange === true ||
        requiresPasswordChange === 1 ||
        requiresPasswordChange === "1";

      setMustChange(must);

      console.log(
        "requires_password_change:",
        requiresPasswordChange
      );
    } catch (error) {
      console.error(
        "Failed to read user password status:",
        error
      );

      setMustChange(false);
    }
  };

  // =====================================================
  // Initial check
  // =====================================================

  useEffect(() => {
    checkPasswordStatus();
  }, []);

  // =====================================================
  // If user visits /dashboard and requires password change,
  // persist a flag so the reset button is shown thereafter
  // =====================================================

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) return;

      const parsedUser = JSON.parse(rawUser);

      const requiresPasswordChange =
        parsedUser?.data?.requires_password_change ??
        parsedUser?.requires_password_change ??
        parsedUser?.user?.requires_password_change ??
        false;

      const must = requiresPasswordChange === true || requiresPasswordChange === 1 || requiresPasswordChange === "1";

      // when entering /dashboard for the first time, persist the flag
      if (location && location.pathname === "/dashboard" && must) {
        try {
          localStorage.setItem("show_reset_button", "1");
        } catch (e) {
          /* ignore */
        }
      }

      // if the flag exists, ensure the UI shows the button
      const forced = localStorage.getItem("show_reset_button") === "1";

      if (forced) setMustChange(true);
    } catch (err) {
      /* ignore parsing errors */
    }
  }, [location]);

  // =====================================================
  // مراقبة تغييرات localStorage
  // =====================================================

  useEffect(() => {
    const handleStorageChange = () => {
      checkPasswordStatus();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =====================================================
  // الانتقال إلى صفحة تغيير كلمة المرور
  // =====================================================

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  return (
    <header
      className="
        sticky
        top-4
        z-20
        mb-3
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-md
        transition-colors
        duration-300
        dark:border-white/5
        dark:bg-[#101922]
        dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]
      "
    >
      <div className="flex items-center justify-between">

        {/* =====================================================
            الجهة اليمين
        ===================================================== */}

        <div className="flex items-center gap-3">
          {/* عنوان الصفحة يمكن وضعه هنا لاحقاً */}
        </div>

        {/* =====================================================
            الجهة اليسار
        ===================================================== */}

        <div className="flex items-center gap-3 sm:gap-4">

          {/* =====================================================
              زر تغيير كلمة المرور
              يظهر فقط إذا كان المستخدم مجبراً على تغييرها
          ===================================================== */}

          {mustChange && (
            <>
              <button
                type="button"
                onClick={handleChangePassword}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-600
                  transition-all
                  duration-200
                  hover:border-red-300
                  hover:bg-red-100
                  hover:text-red-700
                  dark:border-red-500/20
                  dark:bg-red-500/10
                  dark:text-red-400
                  dark:hover:border-red-500/30
                  dark:hover:bg-red-500/20
                  dark:hover:text-red-300
                "
                title="يجب تغيير كلمة المرور قبل استخدام النظام"
              >
                <LockKeyhole
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-200
                    group-hover:scale-110
                  "
                  strokeWidth={1.8}
                />

                <span>
                  تغيير كلمة المرور
                </span>

                <AlertCircle
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>

              <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
            </>
          )}

          {/* =====================================================
              Theme Toggle
          ===================================================== */}

          <div className="flex items-center">
            <ThemeToggle />
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* =====================================================
              الإشعارات
          ===================================================== */}

          <button
            type="button"
            className="
              text-slate-600
              transition
              hover:text-slate-900
              dark:text-slate-300
              dark:hover:text-white
            "
            title="الإشعارات"
          >
            <Bell
              size={18}
              strokeWidth={1.8}
            />
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* =====================================================
              الإعدادات
          ===================================================== */}

          <button
            type="button"
            className="
              text-slate-600
              transition
              hover:text-slate-900
              dark:text-slate-300
              dark:hover:text-white
            "
            title="الإعدادات"
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* =====================================================
              معلومات المستخدم
          ===================================================== */}

          <div className="flex items-center gap-2.5">

            <div className="text-right leading-4">

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-800
                  dark:text-slate-100
                "
              >
                وسام أحمد
              </p>

              <p
                className="
                  text-[11px]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                (مدير النظام)
              </p>

            </div>

            <img
              src="/assets/hero.png"
              alt="user"
              className="
                h-8
                w-8
                rounded-full
                border
                border-slate-200
                object-cover
                dark:border-white/10
              "
            />

          </div>

        </div>
      </div>

      {/* =====================================================
          رسالة التنبيه
      ===================================================== */}

      {mustChange && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-2.5
            text-right
            dark:border-red-500/20
            dark:bg-red-500/10
          "
        >
          <div className="flex items-center gap-2">

            <AlertCircle
              className="
                h-4
                w-4
                shrink-0
                text-red-600
                dark:text-red-400
              "
              strokeWidth={2}
            />

            <p
              className="
                text-xs
                font-medium
                text-red-700
                dark:text-red-300
              "
            >
              يجب تغيير كلمة المرور التي تم إعطاؤك إياها
              من قبل الإدارة قبل أن تتمكن من استخدام النظام.
            </p>

          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            className="
              shrink-0
              text-xs
              font-semibold
              text-red-700
              underline
              underline-offset-2
              transition
              hover:text-red-900
              dark:text-red-300
              dark:hover:text-red-200
            "
          >
            تغيير الآن
          </button>

        </div>
      )}
    </header>
  );
}

export default DashboardTopbar;