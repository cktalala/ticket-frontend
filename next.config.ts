import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [/antd.*compatible.*React/];
    return config;
  },
};

export default nextConfig;
