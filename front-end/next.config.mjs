import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pvyqszflhydcdxrbznlm.supabase.co",
        pathname: "/",
        port: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
