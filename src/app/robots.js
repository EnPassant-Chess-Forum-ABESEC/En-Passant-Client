export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/", "/tasks/", "/leaderboard"],
    },
    sitemap: "https://enpassant.co.in/sitemap.xml",
  };
}
