import type { NextConfig } from "next";
import { version } from "./package.json"

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",

  images: { unoptimized: true },

  allowedDevOrigins: ['192.168.1.9'],

  env: {
    NEXT_PUBLIC_APP_VERSION: version
  },

  // basePath: "/image2image"

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
