/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["api.dicebear.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
