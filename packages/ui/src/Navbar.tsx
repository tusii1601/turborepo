import React from "react";
import Link from "next/link";

interface NavbarProps {
  logo?: string;
  items?: { label: string; href: string }[];
  rightItems?: React.ReactNode;
  className?: string;
}

export function Navbar({
  logo = "ShortLinks",
  items = [],
  rightItems,
  className = "",
}: NavbarProps) {
  return (
    <nav className={`bg-white border-b border-slate-200 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            {logo}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">{rightItems}</div>
        </div>
      </div>
    </nav>
  );
}
