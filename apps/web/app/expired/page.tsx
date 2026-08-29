import Link from "next/link";
import { Clock, Home } from "lucide-react";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Clock className="w-16 h-16 mx-auto text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Link Expired</h1>
        <p className="text-slate-600 mb-8">This short link has expired and is no longer available. The link owner may have set an expiration date.</p>
        
        <div className="flex gap-4">
          <Link href="/">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Create New Link
            </button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">
            Want to create your own short links? <br />
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              Get started here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
