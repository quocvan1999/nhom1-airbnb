/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://nhom1-airbnb.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/admin"],
  changefreq: "daily",
  priority: 0.7,
};
