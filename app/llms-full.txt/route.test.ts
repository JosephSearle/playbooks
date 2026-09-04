import { describe, expect, it } from "vitest";
import { source } from "@/lib/source";
import { GET } from "./route";

describe("GET /llms-full.txt", () => {
  it("includes every docs page, separated by markdown rules", async () => {
    const response = await GET();

    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    const text = await response.text();
    const pages = source.getPages();

    expect(text.split("\n\n---\n\n")).toHaveLength(pages.length);
    for (const page of pages) {
      expect(text).toContain(`# ${page.data.title}`);
      expect(text).toContain(`Source: ${page.url}`);
    }
  });
});
