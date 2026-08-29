import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border border-slate-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm ${
                change.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {change.isPositive ? "+" : ""}
                {change.value}% from last month
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </div>
  );
}
