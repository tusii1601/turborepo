"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Table, LoadingSpinner, CopyButton, Badge } from "@repo/ui";
import { ArrowLeft, Globe, Clock, BarChart3, Smartphone, Monitor, Tablet } from "lucide-react";
import Link from "next/link";

interface LinkDetail {
  id: string;
  slug: string;
  originalUrl: string;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
}

interface Click {
  id: string;
  userAgent: string;
  referer: string | null;
  ipAddress: string | null;
  deviceType: string;
  createdAt: string;
}

interface AnalyticsData {
  link: LinkDetail;
  clicks: Click[];
  deviceBreakdown: Record<string, number>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export default function LinkDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const linkId = params.id as string;

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, router]);

  async function fetchAnalytics() {
    try {
      const response = await fetch(`/api/dashboard/links/${linkId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else if (response.status === 403) {
        router.push("/dashboard/links");
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (!analytics) {
    return null;
  }

  const { link, clicks, deviceBreakdown, topReferrers } = analytics;

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const columns = [
    { key: "device", label: "Device" },
    { key: "referrer", label: "Referrer" },
    { key: "userAgent", label: "User Agent" },
    { key: "ip", label: "IP Address" },
    { key: "date", label: "Date" },
  ];

  const tableData = clicks.map(click => ({
    device: (
      <div className="flex items-center gap-2">
        {getDeviceIcon(click.deviceType)}
        <span className="text-sm capitalize">{click.deviceType}</span>
      </div>
    ),
    referrer: (
      <span className="text-sm truncate max-w-xs">
        {click.referer ? (
          <a href={click.referer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {new URL(click.referer).hostname}
          </a>
        ) : (
          <span className="text-slate-400">Direct</span>
        )}
      </span>
    ),
    userAgent: <span className="text-xs text-slate-500 truncate max-w-xs">{click.userAgent}</span>,
    ip: <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{click.ipAddress || "N/A"}</code>,
    date: new Date(click.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links">
          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Link Analytics</h1>
          <p className="text-slate-600 mt-1">Details and performance for your short link</p>
        </div>
      </div>

      {/* Link Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Link Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Short URL</p>
            <div className="flex items-center gap-2">
              <code className="bg-slate-100 px-4 py-2 rounded-lg font-mono flex-1">
                {typeof window !== "undefined" ? `${window.location.origin.replace("3001", "3000")}/s/${link.slug}` : `yoursite.com/s/${link.slug}`}
              </code>
              <CopyButton text={`${typeof window !== "undefined" ? window.location.origin.replace("3001", "3000") : ""}/s/${link.slug}`} />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">Original URL</p>
            <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {link.originalUrl}
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">Total Clicks</p>
              <p className="text-2xl font-bold mt-1">{link.clickCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Created</p>
              <p className="text-sm font-mono mt-1">{new Date(link.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <Badge variant={link.isActive ? "success" : "danger"} className="mt-1">
                {link.isActive ? "Active" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(deviceBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(deviceBreakdown).map(([device, count]) => (
                  <div key={device}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize font-medium">{device}</span>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / link.clickCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No device data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topReferrers.length > 0 ? (
              <div className="space-y-3">
                {topReferrers.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm truncate">
                      {ref.referrer ? (
                        <a href={`https://${ref.referrer}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {ref.referrer}
                        </a>
                      ) : (
                        <span className="text-slate-400">Direct</span>
                      )}
                    </span>
                    <span className="font-semibold text-sm">{ref.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No referrer data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Clicks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Clicks ({clicks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clicks.length > 0 ? (
            <Table columns={columns} data={tableData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">No clicks recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
