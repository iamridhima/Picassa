import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(), // Explicitly set root directory
  },
};

export default nextConfig;