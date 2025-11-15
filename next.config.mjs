/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "api.dicebear.com", // For avatar images
      "lh3.googleusercontent.com", // For Google profile images (if needed later)
    ],
  },
};

export default nextConfig;
