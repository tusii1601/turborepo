import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Navbar, Sidebar } from "@repo/ui";
import { BarChart3, Users, Link as LinkIcon, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin | URL Shortener",
  description: "Admin panel for system management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { label: "Dashboard", href: "/admin", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Links", href: "/admin/links", icon: <LinkIcon className="w-5 h-5" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="flex min-h-screen bg-slate-50">
            <Sidebar logo="Admin" items={sidebarItems} className="hidden md:block" />
            <div className="flex-1">
              <div className="md:hidden">
                <Navbar logo="Admin" />
              </div>
              <main className="p-4 md:p-8">{children}</main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
