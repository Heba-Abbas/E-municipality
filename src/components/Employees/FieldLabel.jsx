function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
      {children}
    </label>
  );
}

export default FieldLabel;