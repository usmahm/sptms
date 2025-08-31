import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        // options: { icon: true, dimensions: false, template: require("./svgr-template.js") },
        as: "*.js"
      }
    }
  }
};

export default nextConfig;
