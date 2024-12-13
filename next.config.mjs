/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "api.inworlds.xyz",
      //   port: "9000",
      //   pathname: "/book-bucket/**"
      // },
      // {
      //   protocol: "https",
      //   hostname: "api.inworlds.xyz",
      //   port: "9000",
      //   pathname: "/avatar-bucket/**"
      // },
      {
        protocol: "http",
        hostname: "192.168.3.130",
        port: "9000",
        pathname: "/book-bucket/**"
      },

      {
        protocol: "http",
        hostname: "192.168.3.130",
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
