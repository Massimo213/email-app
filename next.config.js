/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Optional: Keeps React in strict mode for development
  typescript: {
    // Ignores TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignores ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
