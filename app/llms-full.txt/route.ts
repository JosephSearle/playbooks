import { source } from "@/lib/source";
import { buildLlmsFullText, formatPageSection } from "./format";

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();

  const sections = await Promise.all(
    pages.map(async (page) => {
      const content = await page.data.getText("processed");
      return formatPageSection(page.data.title, page.url, content);
    }),
  );

  return new Response(buildLlmsFullText(sections), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
