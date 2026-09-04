import { describe, expect, it } from "vitest";
import { buildLlmsFullText, formatPageSection } from "./format";

describe("formatPageSection", () => {
  it("formats a title, source url, and content into a markdown section", () => {
    const section = formatPageSection(
      "Batch Orchestration",
      "/docs/data-synchronization/batch-orchestration",
      "Some content.",
    );

    expect(section).toBe(
      "# Batch Orchestration\nSource: /docs/data-synchronization/batch-orchestration\n\nSome content.",
    );
  });

  it("preserves multi-line content unchanged", () => {
    const section = formatPageSection("Title", "/docs/title", "line one\nline two");

    expect(section).toContain("line one\nline two");
  });
});

describe("buildLlmsFullText", () => {
  it("joins sections with a markdown horizontal rule separator", () => {
    const text = buildLlmsFullText(["# A\n\ncontent a", "# B\n\ncontent b"]);

    expect(text).toBe("# A\n\ncontent a\n\n---\n\n# B\n\ncontent b");
  });

  it("returns an empty string for no sections", () => {
    expect(buildLlmsFullText([])).toBe("");
  });

  it("returns a single section unchanged", () => {
    expect(buildLlmsFullText(["only section"])).toBe("only section");
  });
});
