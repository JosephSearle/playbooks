<div align="center">

# Playbooks

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-16-blue)](https://fumadocs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/node-22.22.1-green?logo=node.js&logoColor=white)](.nvmrc)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

</div>

A personal documentation site for AI engineering runbooks — RAG, agents, MCP, observability,
data sync, and vector management — built with [Fumadocs](https://fumadocs.dev) on Next.js 16. <I changed this>

## Contents

The playbook is organized into six sections under [content](content):

- **[Workflows and Agents](content/workflows-and-agents)** — patterns, tool/function-calling
  design, human-in-the-loop approval workflows, memory
- **[MCP](content/mcp)** — architecture, building servers and clients, connecting to servers,
  authorization and security, debugging and testing
- **[Observability](content/observability)** — tracing, experiments, evals, monitoring,
  prompts, AI gateway
- **[RAG](content/rag)** — adoption strategy, basic RAG, retrieve-and-rerank, corrective RAG
  (CRAG), self-RAG, query decomposition, adaptive RAG
- **[Data Synchronization](content/data-synchronization)** — choosing a sync strategy, change
  data capture, batch orchestration, incremental sync and dedup, managed ETL/ELT
- **[Vector Management](content/vector-management)** — databases, collections, schemas,
  ingestion, indexes, search tuning, model inference, storage optimization, snapshots

## Requirements

- Node.js 22.22.1 (see [.nvmrc](.nvmrc))

## Installation

```bash
nvm use
npm install
```

## Usage

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/docs`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run eslint
```

### AI/LLM-friendly exports

Every doc page is also available as raw Markdown by appending `.md` to its URL (content-negotiated
via the `Accept` header, so browsers get HTML and agents get Markdown from the same link). Two
site-wide exports are also generated:

- `/llms.txt` — an index of every page
- `/llms-full.txt` — the full processed Markdown of every page, concatenated

## Adding content

New pages go under [content](content) as `.mdx` files. Each section directory has a
`meta.json` controlling the sidebar title and page order — add new filenames to its `pages` array.
See [fumadocs-playbook-plan.md](fumadocs-playbook-plan.md) for the original build plan and content
authoring conventions (Callouts, Steps, Tabs, Cards, Mermaid diagrams).

## Deployment

Deployed on [Vercel](https://vercel.com) — every push to `main` triggers a production deploy;
pull requests get preview URLs.

## License

Private, unlicensed personal project. All rights reserved.
