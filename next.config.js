/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.penguinrandomhouse.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "www.penguinlibros.com",
      },
      {
        protocol: "https",
        hostname: "bvkijydewrgsbczyikej.supabase.co",
      },
      {
        protocol: "https",
        hostname: "juqlgyiacdgyqumdcbjm.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Increase server timeout for development
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),
};

export default config;
