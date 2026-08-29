"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Table, LoadingSpinner } from "@repo/ui";
import { Trash2, Eye } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: { shortLinks: number };
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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
      fetchUsers();
    }
  }, [status, session, router]);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  const columns = [
    { key: "email", label: "Email" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "links", label: "Links" },
    { key: "joined", label: "Joined" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = users.map(user => ({
    email: <span className="font-mono text-sm">{user.email}</span>,
    name: user.name || <span className="text-slate-400">No name</span>,
    role: <span className="font-semibold">{user.role}</span>,
    links: user._count.shortLinks,
    joined: new Date(user.createdAt).toLocaleDateString(),
    actions: (
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-slate-200 rounded">
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteUser(user.id)}
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
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-600 mt-2">Manage system users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table columns={columns} data={tableData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
