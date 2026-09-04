import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("returns a non-empty markdown index", async () => {
    const response = await GET();

    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    const text = await response.text();
    expect(text.length).toBeGreaterThan(0);
  });
});
