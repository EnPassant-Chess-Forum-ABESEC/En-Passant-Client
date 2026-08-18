export default function sitemap() {
  const baseUrl = "https://enpassant.co.in";

  const routes = [
    "",
    "/contact",
    "/event-gallery",
    "/recruitment",
    "/apply",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
