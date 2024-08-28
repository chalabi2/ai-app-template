/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "domain",
      },
      {
        protocol: "http",
        hostname: "backend-domain",
      },
    ],
    domains: ["localhost", "rmbg.jchalabi.xyz", "backend-domain"],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: "backend-domain/:path*",
      },
    ];
  },
};

export default nextConfig;
