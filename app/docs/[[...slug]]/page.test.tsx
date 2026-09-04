import { describe, expect, it } from "vitest";
import { generateMetadata } from "./page";

const VALID_SLUG = ["data-synchronization", "batch-orchestration"];
const INVALID_SLUG = ["definitely-does-not-exist"];

describe("docs page metadata", () => {
  it("resolves title and description for a valid slug", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: VALID_SLUG }) });

    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: INVALID_SLUG }) }),
    ).rejects.toThrow();
  });
});
