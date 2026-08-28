import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API_URL ?? "http://localhost:8080/api/v1"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
