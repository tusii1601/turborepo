import React from "react";
import { ChevronDown, Menu, X } from "lucide-react";

interface SidebarProps {
  logo?: string;
  items: { label: string; href: string; icon?: React.ReactNode }[];
  className?: string;
}

export function Sidebar({ logo = "ShortLinks", items, className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-slate-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white p-6
          transition-transform duration-300 z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:relative md:h-auto md:translate-x-0 md:p-4
          ${className}
        `}
      >
        <h1 className="text-2xl font-bold mb-8">{logo}</h1>
        <nav className="space-y-2">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {item.icon && <span className="w-5 h-5">{item.icon}</span>}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
