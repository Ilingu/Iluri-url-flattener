/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com", // Github
      "lh3.googleusercontent.com", // Google
    ],
  },
};

module.exports = nextConfig;
