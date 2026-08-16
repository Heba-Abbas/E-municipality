import {
  Bell,
  Settings,
  LockKeyhole,
  AlertCircle,
} from "lucide-react";

import ThemeToggle from "./../ThemeToggle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardTopbar() {
  const [mustChange, setMustChange] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // قراءة حالة كلمة المرور
  // =====================================================

  const checkPasswordStatus = () => {
    try {
      const status = localStorage.getItem(
        "requires_password_change"
      );

      const must =
        status === "1" ||
        status === "true";

      setMustChange(must);

      console.log(
        "Password Change Required:",
        must
      );
    } catch (error) {
      console.error(
        "Failed to read password status:",
        error
      );

      setMustChange(false);
    }
  };

  // =====================================================
  // Initial
  // =====================================================

  useEffect(() => {
    checkPasswordStatus();
  }, []);

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
  // مراقبة الحدث داخل نفس التبويب
  // =====================================================

  useEffect(() => {
    const handlePasswordChanged = () => {
      checkPasswordStatus();
    };

    window.addEventListener(
      "passwordChanged",
      handlePasswordChanged
    );

    return () => {
      window.removeEventListener(
        "passwordChanged",
        handlePasswordChanged
      );
    };
  }, []);

  // =====================================================
  // Change Password
  // =====================================================

  const handleChangePassword = () => {
    navigate("/change-temporary-password");
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
                w-2
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
              يجب تغيير كلمة المرور التي تم إعطاؤك
              إياها من قبل الإدارة قبل أن تتمكن من
              استخدام النظام.
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
        </div>

        {/* =====================================================
            الجهة اليسار
        ===================================================== */}

        <div className="flex items-center gap-3 sm:gap-4">

          {/* =================================================
              تغيير كلمة المرور
          ================================================= */}

          {/* {mustChange && (
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
          )} */}

          {/* =================================================
              Theme
          ================================================= */}

          <div className="flex items-center">
            <ThemeToggle />
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          


          

          {/* =================================================
              User
          ================================================= */}

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

      

      
    </header>
  );
}

export default DashboardTopbar;