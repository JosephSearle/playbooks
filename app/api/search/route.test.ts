import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/search", () => {
  it("responds successfully to a search query", async () => {
    const response = await GET(new Request("http://localhost/api/search?query=orchestration"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("responds successfully with no query", async () => {
    const response = await GET(new Request("http://localhost/api/search"));

    expect(response.status).toBe(200);
  });
});
