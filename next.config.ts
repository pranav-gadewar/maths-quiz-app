/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⚡ ignore ESLint during production build
  },
};

module.exports = nextConfig;
