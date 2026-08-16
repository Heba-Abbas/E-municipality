import React, { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FileText,
  Loader2,
  QrCode,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import { Html5Qrcode } from "html5-qrcode";

import {
  verifyFieldInspectorDocument,
  openFieldInspectorDocument,
} from "../services/fieldInspectorApi";

/*
=========================================================
Field Inspector Page
=========================================================

المهام:

1. مسح QR الخاص بوثيقة الخدمة.
2. استخراج verification_code من QR.
3. إرسال verification_code إلى API التحقق.
4. عرض نتيجة التحقق.
5. فتح وثيقة PDF إذا كانت موجودة.

Verify API:

GET
/api/field-inspector/documents/{verification_code}/verify

Document API:

GET
/api/field-inspector/documents/{verification_code}/file
=========================================================
*/

function FieldInspectorPage() {
  const scannerRef = useRef(null);
  const scannerContainerId = "field-inspector-qr-reader";

  const [isScannerOpen, setIsScannerOpen] =
    useState(false);

  const [isScannerRunning, setIsScannerRunning] =
    useState(false);

  const [verificationCode, setVerificationCode] =
    useState("");

  const [documentData, setDocumentData] =
    useState(null);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isOpeningDocument, setIsOpeningDocument] =
    useState(false);

  const [error, setError] = useState("");

  /*
  =========================================================
  فتح الماسح
  =========================================================
  */

  const handleOpenScanner = () => {
    setError("");
    setIsScannerOpen(true);
  };

  /*
  =========================================================
  إيقاف الماسح
  =========================================================
  */

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const scannerState =
          scannerRef.current.getState();

        /*
        2 = Html5QrcodeScannerState.SCANNING
        */

        if (scannerState === 2) {
          await scannerRef.current.stop();
        }

        try {
          await scannerRef.current.clear();
        } catch {
          // ignore clear error
        }

        scannerRef.current = null;
      }
    } catch (err) {
      console.error(
        "Stop QR Scanner Error:",
        err
      );
    } finally {
      setIsScannerRunning(false);
    }
  };

  /*
  =========================================================
  إغلاق الماسح
  =========================================================
  */

  const handleCloseScanner = async () => {
    await stopScanner();
    setIsScannerOpen(false);
  };

  /*
  =========================================================
  استخراج verification code من QR
  =========================================================

  يدعم:

  1. QR يحتوي فقط على verification_code

  مثال:

  dacefa3ae4f20a35266b0dd0f0527815043d372fe2a4fed00d7607390bf9aca8

  2. QR يحتوي على URL

  مثال:

  https://example.com/documents/dacefa.../verify

  3. QR يحتوي على URL وينتهي بالكود
  =========================================================
  */

  const extractVerificationCode = (decodedText) => {
    if (!decodedText) {
      return "";
    }

    const value = decodedText.trim();

    /*
    إذا كان QR يحتوي على URL
    */

    try {
      if (
        value.startsWith("http://") ||
        value.startsWith("https://")
      ) {
        const url = new URL(value);

        const parts = url.pathname
          .split("/")
          .filter(Boolean);

        if (parts.length > 0) {
          return parts[parts.length - 1];
        }
      }
    } catch {
      // ليس URL، نكمل كـ plain text
    }

    /*
    إذا كان QR يحتوي فقط على الكود
    */

    return value;
  };

  /*
  =========================================================
  بعد قراءة QR
  =========================================================
  */

  const handleQrSuccess = async (decodedText) => {
    const code =
      extractVerificationCode(decodedText);

    if (!code) {
      setError(
        "تعذر قراءة رمز التحقق من QR"
      );

      return;
    }

    /*
    منع استمرار قراءة نفس QR عدة مرات
    */

    await stopScanner();
    setIsScannerOpen(false);

    setVerificationCode(code);

    /*
    مباشرة نتحقق من الوثيقة
    */

    await handleVerifyDocument(code);
  };

  /*
  =========================================================
  خطأ قراءة QR
  =========================================================

  لا نعرض خطأ للمستخدم مع كل frame
  لأن الماسح يرسل أخطاء كثيرة أثناء البحث
  عن QR.
  =========================================================
  */

  const handleQrError = () => {
    // intentionally ignored
  };

  /*
  =========================================================
  تشغيل الكاميرا
  =========================================================
  */

  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    let mounted = true;

    const startScanner = async () => {
      try {
        /*
        ننتظر حتى يتم رسم عنصر الـ DOM
        */

        await new Promise((resolve) =>
          setTimeout(resolve, 150)
        );

        if (!mounted) return;

        const scanner =
          new Html5Qrcode(
            scannerContainerId
          );

        scannerRef.current = scanner;

        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
            aspectRatio: 1,
          },
          handleQrSuccess,
          handleQrError
        );

        if (mounted) {
          setIsScannerRunning(true);
        }
      } catch (err) {
        console.error(
          "Start QR Scanner Error:",
          err
        );

        if (mounted) {
          setError(
            "تعذر تشغيل الكاميرا. تأكد من السماح للموقع باستخدام الكاميرا."
          );

          setIsScannerRunning(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scannerRef.current?.clear();
            } catch {
              // ignore
            }

            scannerRef.current = null;
          });
      }
    };
  }, [isScannerOpen]);

  /*
  =========================================================
  التحقق من الوثيقة
  =========================================================
  */

  const handleVerifyDocument = async (
    code = verificationCode
  ) => {
    if (!code) {
      setError(
        "يرجى مسح QR الوثيقة أولاً"
      );

      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      setDocumentData(null);

      const response =
        await verifyFieldInspectorDocument(
          code
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "تعذر التحقق من الوثيقة"
        );
      }

      setDocumentData(
        response.data || null
      );
    } catch (err) {
      console.error(
        "Verify Document Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء التحقق من الوثيقة"
      );

      setDocumentData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  /*
  =========================================================
  فتح وثيقة PDF
  =========================================================
  */

  const handleOpenDocument = async () => {
    if (!verificationCode) {
      setError(
        "رمز الوثيقة غير موجود"
      );

      return;
    }

    try {
      setIsOpeningDocument(true);
      setError("");

      await openFieldInspectorDocument(
        verificationCode
      );
    } catch (err) {
      console.error(
        "Open Document Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "تعذر فتح وثيقة الخدمة"
      );
    } finally {
      setIsOpeningDocument(false);
    }
  };

  /*
  =========================================================
  إعادة التحقق
  =========================================================
  */

  const handleReset = () => {
    setVerificationCode("");
    setDocumentData(null);
    setError("");
  };

  /*
  =========================================================
  تنسيق التاريخ
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString("ar-SY", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return date;
    }
  };

  /*
  =========================================================
  نتيجة التحقق
  =========================================================
  */

  const isDocumentValid =
    documentData?.is_valid === true;

  /*
  =========================================================
  Status Item
  =========================================================
  */

  const VerificationItem = ({
    label,
    value,
  }) => {
    const valid = value === true;

    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-[#111c26]">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {label}
        </span>

        {valid ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            صحيح
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4" />
            غير صحيح
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full space-y-5"
      dir="rtl"
    >
      {/* =====================================================
          Header
      ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
              المفتش الميداني
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              التحقق من وثائق الخدمات باستخدام رمز QR
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />

            <span>
              نظام التحقق من الوثائق
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          Error
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            {error}
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium hover:underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* =====================================================
          Scanner / Main
      ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition-colors duration-300 dark:border-white/5 dark:bg-[#0f1821] dark:shadow-[0_14px_36px_rgba(0,0,0,0.28)] lg:p-6">
        {!documentData && !isVerifying ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <QrCode
                className="h-10 w-10"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-800 dark:text-white">
              مسح QR وثيقة الخدمة
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              وجّه كاميرا الجهاز نحو رمز QR الموجود
              على وثيقة الخدمة للتحقق من صلاحيتها
              وأصالتها.
            </p>

            <button
              type="button"
              onClick={handleOpenScanner}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600"
            >
              <QrCode className="h-5 w-5" />

              مسح QR الوثيقة
            </button>

            {/* إدخال يدوي كخيار احتياطي */}

            <div className="mt-8 w-full max-w-md">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />

                <span className="text-xs text-slate-400">
                  أو إدخال الرمز يدويًا
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(event) =>
                    setVerificationCode(
                      event.target.value
                    )
                  }
                  placeholder="أدخل رمز التحقق"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-[#121b24] dark:text-white dark:placeholder:text-slate-500"
                  dir="ltr"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleVerifyDocument()
                  }
                  disabled={
                    !verificationCode ||
                    isVerifying
                  }
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  <Search className="h-4 w-4" />

                  تحقق
                </button>
              </div>
            </div>
          </div>
        ) : isVerifying ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-800 dark:text-white">
              جاري التحقق من الوثيقة...
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              يتم التحقق من صحة التوقيع والهاش
              وصلاحية الوثيقة.
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                Verification Result
            ================================================= */}

            <div
              className={`rounded-2xl border p-5 ${
                isDocumentValid
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                  : "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    isDocumentValid
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                  }`}
                >
                  {isDocumentValid ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <XCircle className="h-7 w-7" />
                  )}
                </div>

                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      isDocumentValid
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {isDocumentValid
                      ? "الوثيقة صالحة"
                      : "الوثيقة غير صالحة"}
                  </h2>

                  <p
                    className={`mt-1 text-sm ${
                      isDocumentValid
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {isDocumentValid
                      ? "تم التحقق من صحة الوثيقة والتوقيع الإلكتروني."
                      : "تعذر اعتماد الوثيقة. يرجى التأكد من صلاحيتها."}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                Document Information
            ================================================= */}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoCard
                label="رقم الوثيقة"
                value={
                  documentData?.document_number
                }
                ltr
              />

              <InfoCard
                label="اسم المواطن"
                value={
                  documentData?.citizen_name
                }
              />

              <InfoCard
                label="نوع الخدمة"
                value={
                  documentData?.service_name
                }
              />

              <InfoCard
                label="البلدية"
                value={
                  documentData?.municipality
                }
              />

              <InfoCard
                label="تاريخ الإصدار"
                value={formatDate(
                  documentData?.issued_at
                )}
              />

              <InfoCard
                label="تاريخ الانتهاء"
                value={formatDate(
                  documentData?.expires_at
                )}
              />
            </div>

            {/* =================================================
                Verification Details
            ================================================= */}

            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  تفاصيل التحقق
                </h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <VerificationItem
                  label="الملف موجود"
                  value={
                    documentData?.file_exists
                  }
                />

                <VerificationItem
                  label="الوثيقة غير منتهية"
                  value={
                    documentData?.is_expired ===
                    false
                  }
                />

                <VerificationItem
                  label="الوثيقة موقعة"
                  value={
                    documentData?.is_signed
                  }
                />

                <VerificationItem
                  label="الهاش صحيح"
                  value={
                    documentData?.is_hash_valid
                  }
                />

                <VerificationItem
                  label="التوقيع صحيح"
                  value={
                    documentData?.is_signature_valid
                  }

                />

                <VerificationItem
                  label="الوثيقة صالحة"
                  value={
                    documentData?.is_valid
                  }
                />
              </div>
            </div>

            {/* =================================================
                Actions
            ================================================= */}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row dark:border-white/10">
              <button
                type="button"
                onClick={
                  handleOpenDocument
                }
                disabled={
                  isOpeningDocument ||
                  !documentData?.file_exists
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOpeningDocument ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    جاري فتح الوثيقة...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />

                    عرض وثيقة الخدمة
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={
                  handleOpenScanner
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-white/5"
              >
                <QrCode className="h-4 w-4" />

                مسح وثيقة أخرى
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-white/5"
              >
                إعادة التحقق
              </button>
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          QR Scanner Modal
      ===================================================== */}

      {isScannerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1821]">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  مسح QR الوثيقة
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  وجّه الكاميرا نحو رمز QR
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseScanner
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-400 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scanner */}

            <div className="p-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black dark:border-white/10">
                <div
                  id={scannerContainerId}
                  className="w-full"
                />
              </div>

              {!isScannerRunning && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Loader2 className="h-4 w-4 animate-spin" />

                  جاري تشغيل الكاميرا...
                </div>
              )}

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs leading-5 text-slate-500 dark:border-white/5 dark:bg-[#111c26] dark:text-slate-400">
                اسمح للمتصفح بالوصول إلى الكاميرا
                ثم وجّه الكاميرا نحو QR الموجود على
                الوثيقة.
              </div>

              <button
                type="button"
                onClick={
                  handleCloseScanner
                }
                className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#121b24] dark:text-slate-200 dark:hover:bg-white/5"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
=========================================================
Info Card
=========================================================
*/

function InfoCard({
  label,
  value,
  ltr = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#111c26]">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium text-slate-800 dark:text-slate-100 ${
          ltr ? "break-all text-left" : ""
        }`}
        dir={ltr ? "ltr" : "rtl"}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default FieldInspectorPage;