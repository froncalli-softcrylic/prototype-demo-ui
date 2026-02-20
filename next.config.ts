import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./Heartland_Synthetic_Media_Data_ALL.md'],
  },
};

export default nextConfig;
