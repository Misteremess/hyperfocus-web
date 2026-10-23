import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "../../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: "Reflexiones · Hyperfocus",
    description: "Ideas prácticas sobre IA, automatización, software a medida y licitaciones públicas para pymes.",
    site: context.site ?? "https://hyperfocus.es",
    customData: "<language>es-ES</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/reflexiones/${post.id}/`,
      categories: [post.data.category],
    })),
  });
}
