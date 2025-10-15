/** @type {import('next').NextConfig} */
const nextConfig = {
  // The 'output: "export"' line has been removed to enable server-side API routes.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;

