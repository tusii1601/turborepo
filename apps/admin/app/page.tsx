"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, StatCard, LoadingSpinner } from "@repo/ui";
import { Users, Link as LinkIcon, TrendingUp, AlertCircle } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  inactiveLinks: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      // Check if user is admin
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchStats();
    }
  }, [status, session, router]);

  async function fetchStats() {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">System overview and management</p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-8 h-8" />}
          />
          <StatCard
            label="Total Links"
            value={stats.totalLinks}
            icon={<LinkIcon className="w-8 h-8" />}
          />
          <StatCard
            label="Total Clicks"
            value={stats.totalClicks}
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <StatCard
            label="Inactive Links"
            value={stats.inactiveLinks}
            change={{ value: 5, isPositive: false }}
            icon={<AlertCircle className="w-8 h-8" />}
          />
        </div>
      ) : null}

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">View, edit, and manage user accounts</p>
            <a
              href="/admin/users"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Users
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">View all links and manage quality</p>
            <a
              href="/admin/links"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Links
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">System-wide analytics and reports</p>
            <a
              href="/admin/analytics"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Analytics
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
