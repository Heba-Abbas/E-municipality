
function DetailField({ label, value, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      {children ? (
        <div className="mt-1.5">{children}</div>
      ) : (
        <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {value || "-"}
        </p>
      )}
    </div>
  );
}

export default DetailField;
