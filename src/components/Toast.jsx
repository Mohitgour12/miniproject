import React from "react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";
  const isSuccess = toast.type === "success" || !toast.type;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] pointer-events-auto animate-fade-in">
      <div className={`p-3 rounded-xl shadow-lg border flex items-center justify-between gap-2.5 ${
        isError 
          ? "bg-red-50 text-red-900 border-red-200" 
          : "bg-primary text-white border-primary-container"
      }`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            {isError ? "error" : "check_circle"}
          </span>
          <span className="text-body-sm font-semibold">{toast.message}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-full text-xs font-bold"
          aria-label="Dismiss toast"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
