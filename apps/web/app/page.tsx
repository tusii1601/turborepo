"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Alert, CopyButton, Badge } from "@repo/ui";
import { EXPIRATION_OPTIONS, expirationLabels } from "@repo/database";
import { Clock } from "lucide-react";

interface ShortenedLink {
  slug: string;
  originalUrl: string;
  expiresAt: string | null;
}

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expirationMinutes, setExpirationMinutes] = useState<number | null>(
    EXPIRATION_OPTIONS.SEVEN_DAYS
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedLink, setShortenedLink] = useState<ShortenedLink | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setShortenedLink(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl,
          customSlug: customSlug || undefined,
          expirationMinutes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create short link");
        return;
      }

      const data = await response.json();
      setShortenedLink({
        slug: data.slug,
        originalUrl,
        expiresAt: data.expiresAt,
      });

      // Clear form
      setOriginalUrl("");
      setCustomSlug("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const shortUrl = shortenedLink
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${shortenedLink.slug}`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">ShortLinks</h1>
          <a
            href="/login"
            className="text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Short links. Powerful analytics.
          </h2>
          <p className="text-xl text-slate-600">
            Create short links instantly, track clicks, and grow your audience.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="p-8">
            <CardContent>
              {error && (
                <Alert type="error" message={error} className="mb-6" />
              )}

              {shortenedLink ? (
                // Success State
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      ✓ Short link created successfully!
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white p-2 rounded border border-green-300 text-sm font-mono">
                        {shortUrl}
                      </code>
                      <CopyButton text={shortUrl} />
                    </div>
                  </div>

                  {shortenedLink.expiresAt && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        Expires: {new Date(shortenedLink.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      setShortenedLink(null);
                      setOriginalUrl("");
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Create Another Link
                  </Button>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="URL to Shorten"
                    type="url"
                    placeholder="https://example.com/very/long/url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                  />

                  <Input
                    label="Custom Slug (Optional)"
                    type="text"
                    placeholder="my-link"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    helperText="3-20 characters, lowercase letters and hyphens only"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Expiration
                    </label>
                    <select
                      value={expirationMinutes || "never"}
                      onChange={(e) =>
                        setExpirationMinutes(
                          e.target.value === "never"
                            ? null
                            : Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(EXPIRATION_OPTIONS).map(([key, value]) => (
                        <option
                          key={key}
                          value={value === null ? "never" : value}
                        >
                          {expirationLabels[value]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Creating..." : "Create Short Link"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Instant</h3>
            <p className="text-slate-600">
              Create short links in seconds with just a few clicks.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Track</h3>
            <p className="text-slate-600">
              Monitor clicks, referrers, and devices accessing your links.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Control</h3>
            <p className="text-slate-600">
              Set expiration dates and disable links anytime.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
