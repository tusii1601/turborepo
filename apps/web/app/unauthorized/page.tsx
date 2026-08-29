import Link from "next/link";
import { Lock, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Lock className="w-16 h-16 mx-auto text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-8">You don't have permission to access this page. Please sign in to continue.</p>
        
        <div className="flex gap-4">
          <Link href="/login">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In
            </button>
          </Link>
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
