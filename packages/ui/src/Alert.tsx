import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface AlertProps {
  type?: "error" | "success" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}: AlertProps) {
  const styles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`border ${style.border} ${style.bg} rounded-lg p-4 flex items-start gap-3 ${className}`}
    >
      <div className="flex-shrink-0 pt-0.5">{style.icon}</div>
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${style.text}`}>{title}</h4>}
        <p className={style.text}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
