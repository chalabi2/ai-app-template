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
        destination: "https://chat.jchalabi.xyz/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          "http://igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub/:path*",
      },
    ];
  },
};

export default nextConfig;
