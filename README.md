# MCPPro

Multi-agent AI workspace combining Agentic Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP) tool servers, browser WebAssembly code execution, and human-in-the-loop web automation.

## Overview

MCPPro is built around a dual-pipeline execution model. Straightforward queries route directly to fast inference or hybrid vector retrieval, while multi-step tasks spin up specialized worker flows for document analysis, live web extraction, sandboxed code execution, and assertion verification.

## Features

- **Chat Studio** — Multi-thread workspace supporting 514 frontier and open models across Anthropic Claude, OpenAI, Google Gemini, xAI Grok, Groq LPU, and OpenRouter, with Markdown session export and a local document manager.
- **Client-Side API Key Vault** — Bring-your-own-key storage persisted locally in browser `localStorage` so provider secrets never leave the client.
- **Interactive Agent Topology** — Draggable 3D node-link mesh visualizing orchestration between the Intent Router, Qdrant RRF store, FastMCP server, Pyodide WASM sandbox, Playwright HITL gate, and Verifier Council.
- **4-Mode Workbench**
  - *Agent Flight Deck*: Step-by-step DAG execution timeline with routing confidence and verifier scores.
  - *Pyodide WASM Canvas*: In-browser Python and JavaScript execution with console output and visual charts without server-side code execution.
  - *Visual HITL Safety Gate*: Pauses automated browser actions on state-mutating clicks and form submissions until explicit user approval.
  - *Semantic Cross-Document Diff*: Clause-level comparison highlighting additions, modifications, deletions, and risk grade.
- **MCP Hub** — Manage Streamable HTTP/SSE and whitelisted local Stdio MCP server connections, test JSON-RPC 2.0 tool calls live, and export configurations for Claude Desktop and Cursor.
- **Benchmarks** — Latency comparisons across 100, 1k, and 100k vector datasets (In-Memory vs. Qdrant HNSW) and security audit comparisons.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Animation:** GSAP 3 (`@gsap/react`, `ScrollTrigger`)
- **Icons:** Lucide React
- **Styling:** Custom CSS design tokens

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

Configured for zero-config deployment on Vercel via `vercel.json`.

```bash
npx vercel --prod
```
