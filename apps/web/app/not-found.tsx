"use client";

import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Page not found</h2>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="flex gap-4">
          <Link href="/">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
