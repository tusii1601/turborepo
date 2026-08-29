import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

export default function DisabledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Link Disabled</h1>
        <p className="text-slate-600 mb-8">This short link has been disabled by the owner and is no longer available.</p>
        
        <div className="flex gap-4">
          <Link href="/">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            If you think this is a mistake, please contact the link owner.
          </p>
        </div>
      </div>
    </div>
  );
}
