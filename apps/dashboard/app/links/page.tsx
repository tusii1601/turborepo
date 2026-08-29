"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Table, LoadingSpinner, CopyButton, Badge } from "@repo/ui";
import { Trash2, Eye, Edit } from "lucide-react";

interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

export default function LinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchLinks();
    }
  }, [status, router]);

  async function fetchLinks() {
    try {
      const response = await fetch("/api/dashboard/links");
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
      const response = await fetch(`/api/dashboard/links/${linkId}`, {
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
    { key: "originalUrl", label: "URL" },
    { key: "clickCount", label: "Clicks" },
    { key: "status", label: "Status" },
    { key: "created", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = links.map(link => ({
    slug: (
      <div className="flex items-center gap-2">
        <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
          {link.slug}
        </code>
      </div>
    ),
    originalUrl: (
      <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs">
        {link.originalUrl}
      </a>
    ),
    clickCount: <span className="font-semibold">{link.clickCount}</span>,
    status: (
      <Badge variant={link.isActive ? "success" : "danger"}>
        {link.isActive ? "Active" : "Disabled"}
      </Badge>
    ),
    created: new Date(link.createdAt).toLocaleDateString(),
    actions: (
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-slate-200 rounded">
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-slate-200 rounded">
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteLink(link.id)}
          className="p-1 hover:bg-red-100 rounded"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Links</h1>
        <p className="text-slate-600 mt-2">Manage and track your short links</p>
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
              <p className="text-slate-600 mb-4">No links yet</p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Link
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
