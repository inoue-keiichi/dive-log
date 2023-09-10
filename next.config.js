/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
