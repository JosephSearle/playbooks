import { describe, expect, it } from "vitest";
import { GET } from "./route";

const VALID_SLUG = ["data-synchronization", "batch-orchestration"];
const INVALID_SLUG = ["definitely-does-not-exist"];

describe("GET /llms.mdx/[...slug]", () => {
  it("returns raw markdown with the correct content type for a valid slug", async () => {
    const response = await GET(
      new Request("http://localhost/llms.mdx/data-synchronization/batch-orchestration"),
      {
        params: Promise.resolve({ slug: VALID_SLUG }),
      },
    );

    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    const text = await response.text();
    expect(text.length).toBeGreaterThan(0);
  });

  it("404s for an unknown slug", async () => {
    await expect(
      GET(new Request("http://localhost/llms.mdx/nope"), {
        params: Promise.resolve({ slug: INVALID_SLUG }),
      }),
    ).rejects.toThrow();
  });
});
