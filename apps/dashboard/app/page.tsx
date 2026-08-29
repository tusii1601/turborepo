"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, StatCard, LoadingSpinner, EmptyState } from "@repo/ui";
import { Eye, Link as LinkIcon, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  async function fetchStats() {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {session.user?.name}!</h1>
        <p className="text-slate-600 mt-2">Here's an overview of your short links</p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            label="Total Links"
            value={stats.totalLinks}
            icon={<LinkIcon className="w-8 h-8" />}
          />
          <StatCard
            label="Active Links"
            value={stats.activeLinks}
            change={{ value: 12, isPositive: true }}
            icon={<Eye className="w-8 h-8" />}
          />
          <StatCard
            label="Total Clicks"
            value={stats.totalClicks}
            change={{ value: 24, isPositive: true }}
            icon={<TrendingUp className="w-8 h-8" />}
          />
        </div>
      ) : null}

      {/* Recent Links */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.totalLinks === 0 ? (
            <EmptyState
              title="No links yet"
              description="Create your first short link to get started"
              action={
                <a
                  href="/"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Link
                </a>
              }
            />
          ) : (
            <p className="text-slate-600">Loading links...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
