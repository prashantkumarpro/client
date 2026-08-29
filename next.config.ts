import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", '[::1]'],
};

export default nextConfig;
