import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-900 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2 border rounded-lg
          text-slate-900 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${error ? "border-red-500" : "border-slate-300"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-600">{helperText}</p>
      )}
    </div>
  );
}
