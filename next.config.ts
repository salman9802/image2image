import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",

  images: { unoptimized: true },

  // distDir: "build"

  // webpack: (config) => {
  //   config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
  //   return config;
  // },

  // turbopack: {
  //   resolveAlias: {
  //     fs: false,
  //     path: false
  //   }
  // }
};

export default nextConfig;
