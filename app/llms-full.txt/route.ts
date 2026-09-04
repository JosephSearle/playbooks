import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();

  const sections = await Promise.all(
    pages.map(async (page) => {
      const content = await page.data.getText("processed");
      return `# ${page.data.title}\nSource: ${page.url}\n\n${content}`;
    }),
  );

  return new Response(sections.join("\n\n---\n\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
