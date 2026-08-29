/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/database", "@repo/types"],
};

export default nextConfig;
