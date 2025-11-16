/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["api.dicebear.com", "lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
