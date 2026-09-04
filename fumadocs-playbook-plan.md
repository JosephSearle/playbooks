# Personal Playbook Docs Site — Fumadocs Implementation Plan

**Goal:** Build a personal documentation/playbook site using Fumadocs (Next.js + TypeScript + MDX), hosted on Vercel. Migrate the existing runbook library (`rag-00`–`rag-07`, `agents-00`–`agents-10`) into it, and set it up to support animated SVG diagrams, AI-friendly content, and optional private sections.

Research source: official Fumadocs docs at fumadocs.dev, current as of Sept 2026.

---

## 1. Tech decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Native Vercel fit, matches existing TS/React background |
| Content source | Fumadocs MDX (`fumadocs-mdx`) | Official, first-class MDX support, type-safe frontmatter |
| Styling | Tailwind CSS 4 | Required by Fumadocs UI |
| Package manager | pnpm (or npm — either works) | — |
| Install method | **Manual installation**, not `create-fumadocs-app` | Since content is being migrated from an existing structure rather than starting blank, manual gives full control over `lib/source.ts`, layout, and routing from the start |
| Hosting | Vercel | Zero-config Next.js deploys, preview URLs per PR |

## 2. Prerequisites

- Node.js 22+ (required — older versions hit `require(esm)` errors)
- Next.js 16 + Tailwind CSS 4 already configured before adding Fumadocs

## 3. Scaffolding steps (manual installation)

```bash
npm i fumadocs-mdx fumadocs-core fumadocs-ui @types/mdx
```

**`next.config.mjs`** (must be `.mjs` — Fumadocs MDX is ESM-only):
```js
import { createMDX } from 'fumadocs-mdx/next';

const config = { reactStrictMode: true };
const withMDX = createMDX();
export default withMDX(config);
```

**`lib/source.ts`** — the content-source loader:
```ts
import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';

const docs = defineDocs({ dir: 'content/docs' });

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
```

**`app/layout.tsx`** — wrap app in `RootProvider`:
```tsx
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

**`global.css`**:
```css
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
```

Then create the standard route files: `lib/layout.shared.tsx` (shared nav options), `components/mdx.tsx` (MDX component registry), `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts` (search is powered by Fumadocs' built-in engine, no external service needed).

## 4. Content structure & migration plan

Fumadocs uses file-system routing under `content/docs/`, with `meta.json` per folder controlling sidebar order/labels.

Proposed structure, mapping the existing runbook library directly:

```
content/docs/
  index.mdx
  rag/
    meta.json          # { "title": "RAG Patterns", "pages": ["00-...", "01-...", ...] }
    00-foundations.mdx  (from rag-00)
    01-....mdx          (rag-01)
    ...through rag-07
  agents/
    meta.json          # { "title": "Agent & Workflow Patterns" }
    00-....mdx          (agents-00)
    ...through agents-10
```

- Each file needs frontmatter: `title`, `description`, optional `icon`.
- Slugs are derived from file path automatically (`./rag/00-foundations.mdx` → `/docs/rag/00-foundations`).
- Use `meta.json`'s `pages` array to force the numeric ordering (rag-00 → rag-07) rather than relying on alphabetical default — this matters since alphabetical sort would work here but is fragile if any file gets renamed later.
- If existing MDX imports any framework-specific components, swap them for Fumadocs' MDX component set (`Callout`, `Tabs`/`Tab`, `Cards`, `Steps`) — most are drop-in equivalents.

## 5. Content authoring conventions to adopt

- **Callouts** for tips/warnings: `<Callout type="info|warn|error|success|idea">`
- **Steps**: mark headings with `[step]` to auto-render as a numbered walkthrough — good fit for runbook procedures
- **Tabs**: for showing alternative approaches (e.g. different vector store configs)
- **Cards**: for "further reading" links between related runbook pages
- **Codeblocks**: syntax highlighting is automatic; supports line highlighting (`// [!code highlight]`), diffs (`// [!code ++/--]`), and named tabs per snippet

## 6. Diagrams — two paths, use both

Your existing preference is animated SVG/CSS components — these drop straight into Fumadocs MDX as ordinary React imports, no adapter needed (this is the main advantage of Fumadocs' headless approach vs. a more locked-down theme).

For diagrams that don't need custom animation, Mermaid is **not built in** — it requires manual setup:
```bash
npm install mermaid next-themes
```
Then build a small client component (`components/mdx/mermaid.tsx`) that lazy-loads `mermaid` and renders SVG, theme-aware via `next-themes`. Register it in `components/mdx.tsx`. Full reference component is in the Fumadocs Mermaid docs — worth pulling into the Cowork session directly since it's a complete drop-in component (~40 lines).

Decision point: use animated SVG components for the flagship/most-referenced diagrams, Mermaid for quick textual diagrams you don't want to hand-build.

## 7. Navigation & organization

- `meta.json` supports separators, external links, "extract" (pull pages from a subfolder), and "except" (exclude specific items) — enough to build a curated sidebar without hand-rolling nav config.
- If the site grows into distinct sections (e.g. "RAG", "Agents", "Personal Notes"), mark folders as **root folders** (`"root": true` in `meta.json`) to render them as top-level tabs instead of one long sidebar.
- Versioning isn't a near-term need for this project, but noting for later: Fumadocs supports partial versioning (folder-based) or full versioning (separate Git branch + subdomain) if the playbook ever needs a "v1 vs v2" split.

## 8. AI/LLM integration (worth doing, given your day job)

Fumadocs has first-class support for making docs AI-agent-readable — directly useful since this playbook will likely get referenced by your own agents/tools:

- **`llms.txt`** — an index of all pages, generated from the page tree via one route handler.
- **`llms-full.txt`** — full processed Markdown of every page concatenated, for feeding into an LLM context window. Requires enabling `includeProcessedMarkdown` in `source.config.ts`.
- **`*.md` per page** — append `.md` to any doc URL to get raw Markdown instead of rendered HTML; can be content-negotiated via the `Accept` header so browsers get HTML and agents get Markdown automatically from the same URL.
- **"Ask AI" search** — Fumadocs CLI can scaffold an AI chat panel (`npx @fumadocs/cli add ai/openrouter`) wired to OpenRouter + Vercel AI SDK by default; you'd swap in whichever model you prefer via the `/api/chat` route. This could plausibly plug into your existing agent stack rather than OpenRouter.

## 9. Access control (if any content should stay private)

Given some of this content may reference IBM/work-adjacent patterns you don't want fully public: Fumadocs supports filtering content **at the source level** via the Loader API — e.g. only pages with `permission: public` in frontmatter get included in the page tree, search index, and routing at all (not just hidden in the UI). This is the cleaner approach vs. app-level route protection if you want a clean public/private split within one repo.

## 10. Optional exports (lower priority, nice-to-haves)

- **RSS feed** — trivial to add via the `feed` npm package + one route handler, if the playbook gets a changelog/blog component.
- **PDF export** — via a Puppeteer script that screenshots rendered pages; needs a small CSS override to hide the sidebar when printing.
- **EPUB export** — via `fumadocs-epub`, for reading the whole playbook offline on an e-reader; needs `includeProcessedMarkdown` enabled (same flag as `llms-full.txt`) and a protected export route in production.

## 11. Deployment

- Push to GitHub, import into Vercel — auto-detected as Next.js, zero config.
- Every push to `main` → production deploy; PRs get preview URLs (useful for reviewing content edits before merging).

## 12. Open decisions to make in the Cowork session

- [ ] Automatic vs manual install — plan above assumes manual for control during migration; confirm this still makes sense once you're actually moving files
- [ ] Final folder taxonomy beyond `rag/` and `agents/` — does personal/non-runbook content get its own section?
- [ ] Whether any content needs the access-control split (public vs private) from day one, or can be added later
- [ ] Which diagrams get rebuilt as animated SVG vs left as Mermaid
- [ ] Whether to wire "Ask AI" search to an existing model/provider you already use rather than OpenRouter
