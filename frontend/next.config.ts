import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "");
const normalizedBackendUrl = backendUrl.replace(/\/$/, "");

const backendHostname = (() => {
  if (!normalizedBackendUrl) return undefined;
  try {
    return new URL(normalizedBackendUrl).hostname;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  images: {
    domains: backendHostname ? [backendHostname] : ["localhost"],
    remotePatterns: backendHostname
      ? [
          {
            protocol: "https",
            hostname: backendHostname,
            pathname: "/media/**",
          },
          {
            protocol: "http",
            hostname: backendHostname,
            pathname: "/media/**",
          },
        ]
      : [
          {
            protocol: "http",
            hostname: "localhost",
            port: "8000",
            pathname: "/media/**",
          },
        ],
  },
  async rewrites() {
    if (!normalizedBackendUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${normalizedBackendUrl}/api/:path*/`,
      },
      {
        source: "/auth/:path*",
        destination: `${normalizedBackendUrl}/auth/:path*/`,
      },
      {
        source: "/media/:path*",
        destination: `${normalizedBackendUrl}/media/:path*/`,
      },
    ];
  },
};

export default nextConfig;
