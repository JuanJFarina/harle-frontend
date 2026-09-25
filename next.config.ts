import type { NextConfig } from "next";

const backendUrl = process.env.HARLE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("HARLE_BACKEND_URL is required.");
}

const backendOrigin = new URL(backendUrl).origin;

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
