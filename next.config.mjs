/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["airbnbnew.cybersoft.edu.vn"],
  },
};

export default withNextIntl(nextConfig);
