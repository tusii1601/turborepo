"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from "@repo/ui";
import { BarChart3, TrendingUp, Users, Link as LinkIcon } from "lucide-react";

interface AnalyticsData {
  topLinks: Array<{ slug: string; clickCount: number }>;
  topUsers: Array<{ email: string; linkCount: number }>;
  clicksPerDay: Array<{ date: string; count: number }>;
  averageClicks: number;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchAnalytics();
    }
  }, [status, session, router]);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
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

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Analytics</h1>
        <p className="text-slate-600 mt-2">System-wide analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Average Clicks per Link</p>
                <p className="text-2xl font-bold">{data.averageClicks.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Links */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Links by Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topLinks.length > 0 ? (
            <div className="space-y-3">
              {data.topLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400">{i + 1}</span>
                    <code className="bg-white px-3 py-1 rounded text-sm font-mono">{link.slug}</code>
                  </div>
                  <span className="font-semibold">{link.clickCount} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Users by Link Count</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topUsers.length > 0 ? (
            <div className="space-y-3">
              {data.topUsers.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400">{i + 1}</span>
                    <span className="font-mono text-sm">{user.email}</span>
                  </div>
                  <span className="font-semibold">{user.linkCount} links</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
