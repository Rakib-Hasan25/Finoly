import path from "path";
const __dirname = new URL(".", import.meta.url).pathname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      include: path.resolve(__dirname, "supabase/functions"),
      use: "ignore-loader", // skip these files
    });

    return config;
  },
};

export default nextConfig;
