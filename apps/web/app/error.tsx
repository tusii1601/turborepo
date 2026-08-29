"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 mx-auto text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Something went wrong!</h1>
        <p className="text-slate-600 mb-4">An unexpected error occurred while processing your request.</p>
        
        {error.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <Link href="/">
            <button className="flex-1 bg-slate-200 text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors font-medium flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
