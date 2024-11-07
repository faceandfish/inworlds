/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.inworlds.xyz",
//         port: "9000",
//         pathname: "/book-bucket/**"
//       },
//       {
//         protocol: "https",
//         hostname: "api.inworlds.xyz",
//         port: "9000",
//         pathname: "/avatar-bucket/**"
//       },

//       {
//         protocol: "https",
//         hostname: "randomuser.me",
//         port: "",
//         pathname: "/**"
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//         port: "",
//         pathname: "/**"
//       }
//     ]
//   }
// };
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.inworlds.xyz",
        port: "9000",
        pathname: "/book-bucket/**"
      },
      {
        protocol: "https",
        hostname: "api.inworlds.xyz",
        port: "9000",
        pathname: "/avatar-bucket/**"
      },
      // 这些外部服务的配置保持不变
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
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.103:8088/inworlds/api/:path*"
      }
    ];
  }
};

export default nextConfig;
