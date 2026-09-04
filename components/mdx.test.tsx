import { describe, expect, it } from "vitest";
import { Callout } from "fumadocs-ui/components/callout";
import { getMDXComponents } from "./mdx";

describe("getMDXComponents", () => {
  it("includes the custom Fumadocs UI components by default", () => {
    const components = getMDXComponents();

    expect(components.Callout).toBe(Callout);
    expect(components.Tab).toBeDefined();
    expect(components.Tabs).toBeDefined();
    expect(components.Card).toBeDefined();
    expect(components.Cards).toBeDefined();
    expect(components.Step).toBeDefined();
    expect(components.Steps).toBeDefined();
  });

  it("lets caller-supplied overrides win over defaults", () => {
    function CustomCallout() {
      return null;
    }

    const components = getMDXComponents({ Callout: CustomCallout });

    expect(components.Callout).toBe(CustomCallout);
  });

  it("does not drop unrelated default components when overriding one", () => {
    function CustomCallout() {
      return null;
    }

    const components = getMDXComponents({ Callout: CustomCallout });

    expect(components.Tabs).toBeDefined();
  });
});
