export default function sitemap() {
  const baseUrl = "https://enpassant.co.in";
  
  // You can fetch dynamic routes here (e.g., specific events or profiles if they are public)
  // For now, we'll list the static public routes
  
  const routes = [
    "",
    "/contact",
    "/event-gallery",
    "/recruitment",
    "/apply",
    "/privacy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
