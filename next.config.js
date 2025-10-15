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
    ],
  },
};

export default config;
