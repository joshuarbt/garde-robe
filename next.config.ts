import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
    // Dev: skip the server-side optimizer (blocks hosts resolving to private IPs via DNS64).
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
