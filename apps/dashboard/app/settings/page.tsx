"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from "@repo/ui";
import { LogOut, Mail, Calendar } from "lucide-react";

interface UserProfile {
  name: string | null;
  email: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/dashboard/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({ name: data.name || "" });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!formData.name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">{profile.email}</span>
            </div>
          </div>

          {/* Account Created Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Account Created
            </label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            variant="primary"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-800">
            Sign out from all devices and return to the login page.
          </p>
          <Button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            variant="danger"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
