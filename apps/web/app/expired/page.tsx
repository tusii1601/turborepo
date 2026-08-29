// Expired link page
export default function ExpiredLinkPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Link Expired</h1>
        <p className="text-lg text-slate-600 mb-8">
          This short link has expired and is no longer available.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create a New Short Link
        </a>
      </div>
    </div>
  );
}
