// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Ant Design CSS support
  transpilePackages: ['antd'],

  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
      {
        protocol: "http", // Allow HTTP protocol for localhost
        hostname: "localhost",
        port: "5000", // Specify the port your local server is running on
      },
    ],
  },

  // Optional: Enable React Strict Mode
  reactStrictMode: true,

  // Optional: Configure webpack for Ant Design
  webpack: (config) => {
    return config;
  },

  // Optional: For styled-components compatibility
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;