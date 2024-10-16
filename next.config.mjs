/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "13.208.244.92",
        port: "9000",
        pathname: "/book-bucket/**"
      },
      {
        protocol: "https",
        hostname: "13.208.244.92",
        port: "9000",
        pathname: "/avatar-bucket/**"
      },

      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
