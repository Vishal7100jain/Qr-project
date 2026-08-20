import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.cache = false;
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === "development" ? "http" : "https",
        hostname:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : new URL(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL!).hostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chart-pilot-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
