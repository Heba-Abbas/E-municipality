import React from "react";

function MunicipalityActions({
  children,
  title,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl transition ${className}`}
    >
      {children}
    </button>
  );
}

export default MunicipalityActions;