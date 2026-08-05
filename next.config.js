/** @type {import('next').NextConfig} */
// force restart 2
const nextConfig = {
  serverExternalPackages: ["firebase-admin"],
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

module.exports = nextConfig;// trigger restart
