"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Table, LoadingSpinner } from "@repo/ui";
import { Trash2 } from "lucide-react";

interface LinkItem {
  id: string;
  slug: string;
  originalUrl: string;
  clickCount: number;
  isActive: boolean;
  user: { email: string };
  createdAt: string;
}

export default function AdminLinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
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
      fetchLinks();
    }
  }, [status, session, router]);

  async function fetchLinks() {
    try {
      const response = await fetch("/api/admin/links");
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteLink(linkId: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/admin/links/${linkId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setLinks(links.filter(l => l.id !== linkId));
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  const columns = [
    { key: "slug", label: "Slug" },
    { key: "url", label: "URL" },
    { key: "user", label: "Owner" },
    { key: "clicks", label: "Clicks" },
    { key: "status", label: "Status" },
    { key: "created", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = links.map(link => ({
    slug: <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{link.slug}</code>,
    url: (
      <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs">
        {link.originalUrl}
      </a>
    ),
    user: link.user.email,
    clicks: link.clickCount,
    status: link.isActive ? "Active" : "Disabled",
    created: new Date(link.createdAt).toLocaleDateString(),
    actions: (
      <button
        onClick={() => deleteLink(link.id)}
        className="p-1 hover:bg-red-100 rounded"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    ),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Link Management</h1>
        <p className="text-slate-600 mt-2">Manage all short links in the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Links ({links.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {links.length > 0 ? (
            <Table columns={columns} data={tableData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">No links found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
