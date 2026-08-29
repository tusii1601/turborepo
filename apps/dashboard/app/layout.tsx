import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Navbar, Sidebar } from "@repo/ui";
import { Link as LinkIcon, Settings, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | URL Shortener",
  description: "Manage and analyze your short links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { label: "Dashboard", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Links", href: "/dashboard/links", icon: <LinkIcon className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="flex min-h-screen bg-slate-50">
            <Sidebar logo="ShortLinks" items={sidebarItems} className="hidden md:block" />
            <div className="flex-1">
              <div className="md:hidden">
                <Navbar logo="ShortLinks" />
              </div>
              <main className="p-4 md:p-8">{children}</main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
