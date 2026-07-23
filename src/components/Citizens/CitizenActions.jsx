import React from "react";

function CitizenActions({ children, className, title }) {
  return (
    <button
      type="button"
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${className}`}
    >
      {children}
    </button>
  );
}

export default CitizenActions;