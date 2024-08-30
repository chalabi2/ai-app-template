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
        hostname: "chat.jchalabi.xyz",
      },
      {
        protocol: "http",
        hostname: "igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub",
      },
    ],
    domains: [
      "localhost",
      "chat.jchalabi.xyz",
      "igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub/:path*",
      },
    ];
  },
};

export default nextConfig;
