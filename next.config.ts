import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the data/ JSON files are included in the Vercel serverless bundle.
  // Without this, process.cwd()/data/*.json won't exist at runtime on Vercel.
  outputFileTracingIncludes: {
    "/**": ["./data/**"],
  },
};

export default nextConfig;
