import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Short Links | URL Shortener",
  description: "Create short links instantly with powerful analytics",
  openGraph: {
    title: "Short Links | URL Shortener",
    description: "Create short links instantly with powerful analytics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
