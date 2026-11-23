export type PageId = 'home' | 'studio' | 'workbench' | 'architecture' | 'mcp' | 'benchmarks';
export type WorkbenchTab = 'flight-deck' | 'wasm-canvas' | 'hitl-gate' | 'doc-diff';

export interface ProviderGroup {
  id: 'anthropic' | 'openai' | 'google' | 'xai' | 'groq' | 'openrouter';
  name: string;
  subtitle: string;
  envVar: string;
  placeholder: string;
  keyNote: string;
  modelCount: number;
  freeTier?: boolean;
  models: { id: string; label: string; badge?: string }[];
}

export const MODEL_PROVIDERS: ProviderGroup[] = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    subtitle: 'Claude 3.7 Sonnet, 3.5 Sonnet, Haiku, Opus',
    envVar: 'ANTHROPIC_API_KEY',
    placeholder: 'sk-ant-api03-...',
    keyNote: 'Required for Claude 3.7 / 3.5 Sonnet & Haiku models',
    modelCount: 6,
    models: [
      { id: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet (Anthropic)', badge: 'Reasoning' },
      { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet (Anthropic)' },
      { id: 'claude-3-5-haiku', label: 'Claude 3.5 Haiku (Anthropic)', badge: 'Fast' },
      { id: 'claude-3-opus', label: 'Claude 3 Opus (Anthropic)' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    subtitle: 'GPT-4o, GPT-4o mini, o3-mini, o1',
    envVar: 'OPENAI_API_KEY',
    placeholder: 'sk-proj-...',
    keyNote: 'Required for GPT-4o, o3-mini, and o1 models',
    modelCount: 7,
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (OpenAI)', badge: 'Vision' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (OpenAI)', badge: 'Fast' },
      { id: 'o3-mini', label: 'o3-mini (OpenAI)', badge: 'Reasoning' },
      { id: 'o1', label: 'o1 (OpenAI)', badge: 'Reasoning' },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    subtitle: 'Gemini 2.0 Flash, 1.5 Pro, Flash Thinking',
    envVar: 'GOOGLE_GENERATIVE_AI_API_KEY',
    placeholder: 'AIzaSy...',
    keyNote: 'Required for Gemini 2.0 Flash & 1.5 Pro models',
    modelCount: 6,
    freeTier: true,
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Google)', badge: 'Free Tier' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Google)', badge: '1M Context' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Google)' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    subtitle: 'Grok 2 & Grok Vision',
    envVar: 'XAI_API_KEY',
    placeholder: 'xai-...',
    keyNote: 'Required for Grok 3, Grok 2 & Grok Vision models',
    modelCount: 5,
    models: [
      { id: 'grok-3', label: 'Grok 3 (xAI)' },
      { id: 'grok-2-vision', label: 'Grok 2 Vision (xAI)', badge: 'Vision' },
      { id: 'grok-2', label: 'Grok 2 (xAI)' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    subtitle: 'LPU Ultra-fast Llama & Mixtral',
    envVar: 'GROQ_API_KEY',
    placeholder: 'gsk_...',
    keyNote: 'Required for ultra-fast LPU Llama & Mixtral inference',
    modelCount: 4,
    freeTier: true,
    models: [
      { id: 'llama-3.3-70b-groq', label: 'Llama 3.3 70B (Groq LPU)', badge: 'Free Tier' },
      { id: 'llama-3.1-8b-groq', label: 'Llama 3.1 8B Instant (Groq)', badge: 'Free Tier' },
      { id: 'deepseek-r1-distill-70b', label: 'DeepSeek R1 Distill 70B (Groq)', badge: 'Reasoning' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    subtitle: 'DeepSeek, Llama 3.3, Free & Open',
    envVar: 'OPENROUTER_API_KEY',
    placeholder: 'sk-or-v1-...',
    keyNote: 'Access 486 open & frontier models with a single key',
    modelCount: 486,
    freeTier: true,
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (OpenRouter)', badge: 'Free Tier' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (OpenRouter)', badge: 'Free Tier' },
      { id: 'deepseek/deepseek-v3', label: 'DeepSeek V3 (OpenRouter)', badge: 'Free Tier' },
      { id: 'qwen/qwen-2.5-72b', label: 'Qwen 2.5 72B (OpenRouter)', badge: 'Free Tier' },
    ],
  },
];

export interface QuickChatAction {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  route: 'RAG' | 'ONLINE' | 'DIRECT';
  tools: string[];
  response: string;
  codeBlock?: { lang: string; code: string };
}

export const STUDIO_QUICK_ACTIONS: QuickChatAction[] = [
  {
    id: 'summarize',
    title: 'Summarize Document',
    subtitle: 'Extract key insights and bullet points',
    prompt: 'Summarize Enterprise_MSA_2026.pdf focusing on SLA penalties, renewal lock-in, and data retention.',
    route: 'RAG',
    tools: ['searchUploadedDocuments (RRF k=60)', 'verifierAgent.check'],
    response:
      '### Executive Brief — Enterprise_MSA_2026.pdf\n- **Uptime Commitment (§4.2):** 99.95% monthly SLA. Service credits step from 10% (<99.95%) to 25% (<99.0%).\n- **Renewal Lock-In (§3.4):** Auto-renews for 12 months unless written opt-out is delivered 60 days prior.\n- **Data Retention (§7.3):** Indexed vector chunks are purged within 90 days post-termination.\n- **Council Verification:** `3/3` numeric claims cross-checked against Qdrant chunks (`S_c = 0.94`).',
  },
  {
    id: 'browse',
    title: 'Browse & Extract',
    subtitle: 'Navigate to a URL and fetch data',
    prompt: 'Navigate to https://modelcontextprotocol.io/specification and extract core JSON-RPC transport capabilities.',
    route: 'ONLINE',
    tools: ['playwrightCloudBrowser', 'tavilySearch'],
    response:
      '### Live Web Extraction — MCP 2025+ Specification\n- **Primary Transports:** Streamable HTTP (SSE) for remote cloud gateways and Local Stdio (`npx` / `node` / `python` / `uvx`) for IDE bridges.\n- **Primitives Discovered:** `tools/list`, `tools/call`, `resources/read`, and `prompts/get` over JSON-RPC 2.0.\n- **Safety Gate Status:** Read-only navigation completed without mutating actions; HITL guard standing by.',
  },
  {
    id: 'chart',
    title: 'Generate Chart',
    subtitle: 'Visualize data trends instantly',
    prompt: 'Generate a Python chart comparing Qdrant HNSW vs InMemory query latency at 100, 1k, and 100k vectors.',
    route: 'DIRECT',
    tools: ['generateChart', 'pyodideWasmCanvas'],
    response:
      'Generated a browser-executable **Pyodide WebAssembly** benchmark script comparing Qdrant HNSW (`3.64ms` → `198.75ms`) against InMemory brute-force (`21.88ms` → `1927.57ms`) — a **9.7× speedup** at 100k vectors. Click **Open in WASM Sandbox** to run locally with zero server overhead.',
    codeBlock: {
      lang: 'python',
      code: `scales = ["100 vec", "1k vec", "100k vec"]
qdrant_ms = [3.64, 27.82, 198.75]
memory_ms = [21.88, 187.07, 1927.57]
for s, q, m in zip(scales, qdrant_ms, memory_ms):
    print(f"{s:<9} | Qdrant: {q:>6.2f}ms vs Memory: {m:>7.2f}ms ({m/q:.1f}x faster)")`,
    },
  },
  {
    id: 'code',
    title: 'Analyze Code',
    subtitle: 'Review structure and find bugs',
    prompt: 'Audit our MCP stdio registration route for command injection and SSRF vulnerabilities.',
    route: 'RAG',
    tools: ['searchUploadedDocuments', 'securityAuditor'],
    response:
      '### Security & Architecture Review — `mcp/servers/route.ts`\n1. **Auth Guard:** Confirmed `requireAdmin()` enforces Supabase `app_metadata.role === "admin"`.\n2. **Command Whitelist:** Stdio executables restricted strictly to `["npx", "node", "python", "python3", "uvx"]` with metacharacter regex rejection (`;&|\`$><`).\n3. **SSRF Blocker:** Cloud metadata IPs (`169.254.169.254`) and private RFC1918 targets are rejected prior to fetch.',
  },
];

export interface InitialDocument {
  id: string;
  fileName: string;
  chunks: number;
  sizeLabel: string;
  status: 'ready' | 'indexing';
  updatedAt: string;
}

export const INITIAL_DOCUMENTS: InitialDocument[] = [
  { id: 'doc-1', fileName: 'Enterprise_MSA_2026_v2.pdf', chunks: 54, sizeLabel: '2.4 MB', status: 'ready', updatedAt: 'Today, 00:42' },
  { id: 'doc-2', fileName: 'Enterprise_MSA_2025_v1.pdf', chunks: 48, sizeLabel: '2.1 MB', status: 'ready', updatedAt: 'Yesterday' },
  { id: 'doc-3', fileName: 'Annual_Report_Q3_2026.pdf', chunks: 214, sizeLabel: '18.4 MB', status: 'ready', updatedAt: '2 days ago' },
  { id: 'doc-4', fileName: 'AI_Governance_Policy_Final.md', chunks: 29, sizeLabel: '142 KB', status: 'ready', updatedAt: '3 days ago' },
];

export interface LabScenario {
  id: string;
  code: string;
  shortTitle: string;
  tag: string;
  route: 'RAG' | 'ONLINE' | 'DIRECT';
  latencyMs: number;
  confidence: number;
  consensusScore: number;
  prompt: string;
  toolsCalled: string[];
  mcpPayload: string;
  synthesis: string;
  citations: string[];
  metricOneLabel: string;
  metricOneValue: string;
  metricTwoLabel: string;
  metricTwoValue: string;
  metricThreeLabel: string;
  metricThreeValue: string;
  dagSteps: {
    id: string;
    role: string;
    label: string;
    ms: number;
    detail: string;
  }[];
}

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: 'msa-audit',
    code: '01',
    shortTitle: 'MSA SLA Audit',
    tag: 'HYBRID RRF RAG',
    route: 'RAG',
    latencyMs: 118,
    confidence: 97,
    consensusScore: 0.94,
    prompt:
      'Extract Section 4.2 SLA uptime penalties from Enterprise_MSA_2026.pdf and verify liability cap exemptions.',
    toolsCalled: ['classifyQueryContext', 'searchUploadedDocuments (RRF k=60)', 'verifierAgent.crossExamine'],
    mcpPayload: `{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "searchUploadedDocuments",
    "arguments": {
      "query": "Section 4.2 SLA uptime penalty liability cap",
      "k": 8,
      "hybrid_rrf_k": 60,
      "filter": { "document_id": "msa_2026_v2" }
    }
  }
}`,
    synthesis:
      'Section 4.2 mandates 99.95% monthly uptime. Downtime between 99.0%–99.95% triggers a 10% service credit; below 99.0% triggers a 25% credit. Super-cap liability excludes gross negligence and IP indemnity (p. 14, Clause 8.4).',
    citations: ['Enterprise_MSA_2026.pdf · p. 7 §4.2', 'Enterprise_MSA_2026.pdf · p. 14 §8.4'],
    metricOneLabel: 'RETRIEVAL GAIN',
    metricOneValue: '+32.07%',
    metricTwoLabel: 'ROUTER LATENCY',
    metricTwoValue: '118 ms',
    metricThreeLabel: 'COUNCIL SCORE',
    metricThreeValue: '0.94 Verified',
    dagSteps: [
      { id: 'n1', role: 'Router', label: 'Context Intent Router', ms: 118, detail: 'Classified as RAG (97% conf) via document heuristic + Flash check' },
      { id: 'n2', role: 'Doc Agent', label: 'Hybrid Dense + BM25 RRF', ms: 194, detail: 'Retrieved 8 chunks from Qdrant HNSW + FastEmbed BGE-small' },
      { id: 'n3', role: 'Synthesizer', label: 'Llama-3.3-70B Synthesis', ms: 610, detail: 'Extracted SLA penalty brackets and cross-linked §8.4 caps' },
      { id: 'n4', role: 'Verifier', label: 'Consensus Verifier Agent', ms: 215, detail: '3/3 numeric assertions verified against raw chunks (0.94)' },
    ],
  },
  {
    id: 'stock-wasm',
    code: '02',
    shortTitle: 'Q3 + Pyodide Chart',
    tag: 'WEB + WASM CODE',
    route: 'ONLINE',
    latencyMs: 134,
    confidence: 95,
    consensusScore: 0.92,
    prompt:
      'Compare Q3 revenue growth in Annual_Report.pdf against live semiconductor benchmarks and plot projection in Python WASM.',
    toolsCalled: ['searchUploadedDocuments', 'tavilySearch', 'pyodideWasmCanvas.execute'],
    mcpPayload: `{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "tavilySearch",
    "arguments": {
      "query": "Q3 2026 semiconductor sector YoY growth benchmark",
      "search_depth": "advanced",
      "max_results": 5
    }
  }
}`,
    synthesis:
      'Uploaded Q3 revenue grew +28.4% YoY ($412.6M) outperforming the 2026 live sector median of +19.1% by +930 bps. Generated an isolated Pyodide WebAssembly script plotting 4-quarter compounding trajectories with zero server execution.',
    citations: ['Annual_Report_Q3.pdf · Table 2.1', 'Tavily Live Feed · Market Benchmark 2026'],
    metricOneLabel: 'HOST RCE RISK',
    metricOneValue: '0.00%',
    metricTwoLabel: 'WASM EXEC TIME',
    metricTwoValue: '142 ms',
    metricThreeLabel: 'COUNCIL SCORE',
    metricThreeValue: '0.92 Verified',
    dagSteps: [
      { id: 'n1', role: 'Router', label: 'Multi-Intent Planner', ms: 134, detail: 'Decomposed into parallel RAG + ONLINE + WASM Coder subtasks' },
      { id: 'n2', role: 'Parallel', label: 'Qdrant RAG ∥ Tavily Web', ms: 420, detail: 'Fetched Q3 PDF table + live 2026 sector median concurrently' },
      { id: 'n3', role: 'WASM', label: 'Pyodide Browser Sandbox', ms: 142, detail: 'Compiled projection SVG locally in client WebAssembly' },
      { id: 'n4', role: 'Verifier', label: 'Numeric Cross-Check', ms: 198, detail: 'Verified +930 bps delta math and revenue citation accuracy' },
    ],
  },
  {
    id: 'hitl-web',
    code: '03',
    shortTitle: 'Playwright HITL',
    tag: 'SAFETY GATE',
    route: 'ONLINE',
    latencyMs: 126,
    confidence: 98,
    consensusScore: 0.97,
    prompt:
      'Navigate to the vendor compliance portal, inspect active certificate status, and pause before submitting renewal form.',
    toolsCalled: ['playwrightCloudBrowser.navigate', 'hitlSafetyGate.intercept', 'auditLogger.record'],
    mcpPayload: `{
  "event": "hitl_request",
  "actionId": "act_9f82b1c",
  "actionType": "submit",
  "url": "https://portal.vendor-compliance.io/renewals/2026",
  "targetSelector": "button[data-action='confirm-submit']",
  "riskLevel": "HIGH — State-mutating submission"
}`,
    synthesis:
      'Browser agent navigated securely, extracted Certificate #ISO-27001-884 (Expires Dec 2026), and halted execution at the final Submit button. Emitted an inline DOM snapshot card waiting for explicit human approval.',
    citations: ['Playwright Snapshot #42', 'HITL Audit Trail · /api/hitl/decision'],
    metricOneLabel: 'SAFETY GATE',
    metricOneValue: 'ENFORCED',
    metricTwoLabel: 'INTERCEPT TIME',
    metricTwoValue: '38 ms',
    metricThreeLabel: 'AUDIT TRAIL',
    metricThreeValue: '100% Logged',
    dagSteps: [
      { id: 'n1', role: 'Router', label: 'Online Automation Route', ms: 126, detail: 'Dispatched to Stagehand / Playwright headless controller' },
      { id: 'n2', role: 'Browser', label: 'Headless DOM Extraction', ms: 680, detail: 'Parsed vendor certificate table and located renewal form' },
      { id: 'n3', role: 'HITL Gate', label: 'Sensitive Action Intercept', ms: 38, detail: 'Paused on submit selector; streamed live screenshot to user' },
      { id: 'n4', role: 'Verifier', label: 'Governance Audit Check', ms: 90, detail: 'Signed user authorization ticket logged with timestamp' },
    ],
  },
  {
    id: 'doc-diff',
    code: '04',
    shortTitle: 'Policy Diff Audit',
    tag: 'SEMANTIC DIFF',
    route: 'RAG',
    latencyMs: 112,
    confidence: 96,
    consensusScore: 0.95,
    prompt:
      'Run a semantic clause diff between Vendor_MSA_v1.pdf and Vendor_MSA_v2.pdf focusing on termination and data retention.',
    toolsCalled: ['POST /documents/diff', 'qdrant.scopedFetch(A, B)', 'clauseClassifier.scoreRisk'],
    mcpPayload: `{
  "endpoint": "POST /api/documents/diff",
  "payload": {
    "doc_a_id": "vendor_msa_v1_2025",
    "doc_b_id": "vendor_msa_v2_2026",
    "focus": "termination notice, liability, data retention"
  }
}`,
    synthesis:
      'Identified 2 high-impact additions (auto-renewal 60-day lock-in, AI training opt-out), 2 modifications (termination notice doubled from 30 to 60 days; data purge extended to 90 days), and 1 critical deletion (waiver of consequential damages).',
    citations: ['Vendor_MSA_v1.pdf §11.1', 'Vendor_MSA_v2.pdf §11.1–11.4'],
    metricOneLabel: 'RISK RATING',
    metricOneValue: 'HIGH',
    metricTwoLabel: 'DIFF CLAUSES',
    metricTwoValue: '5 Flagged',
    metricThreeLabel: 'COUNCIL SCORE',
    metricThreeValue: '0.95 Verified',
    dagSteps: [
      { id: 'n1', role: 'Router', label: 'Cross-Document Diff Intent', ms: 112, detail: 'Routed to Semantic Diff Engine with dual document filters' },
      { id: 'n2', role: 'Vector', label: 'Dual Scoped Chunk Fetch', ms: 210, detail: 'Loaded aligned clause vectors for Doc A and Doc B' },
      { id: 'n3', role: 'Analyzer', label: 'Clause Delta Classification', ms: 540, detail: 'Categorized Additions (+2), Modifications (~2), Deletions (-1)' },
      { id: 'n4', role: 'Verifier', label: 'Risk Severity Validation', ms: 165, detail: 'Confirmed clause citations against original PDF byte spans' },
    ],
  },
];

export interface PipelineStage {
  id: string;
  stageNum: string;
  title: string;
  shortSpec: string;
  description: string;
  inputShape: string;
  outputShape: string;
  formulaTitle: string;
  formulaBody: string;
  securityNote: string;
  blocks: { label: string; sub: string; tone: 'noir' | 'tangerine' | 'ochre' | 'crimson' | 'teal' }[];
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'stage-1',
    stageNum: 'STAGE 01',
    title: 'Magic-Byte Validation & Semantic Chunking',
    shortSpec: 'File bytes → Magic Check → [N_chunks, 512..1024 tok]',
    description:
      'Every uploaded document (PDF, DOCX, PPTX, XLSX, PNG, Markdown, Code) undergoes strict binary magic-byte header verification (%PDF-, \\x89PNG, PK\\x03\\x04) and null-byte scanning before layout-aware chunking with 10% sliding overlap.',
    inputShape: 'Raw Upload Stream (≤ 25 MB) + MIME + Magic Header',
    outputShape: 'ChunkTensor[N_chunks, 512–1024 tokens] + Page/Table Metadata',
    formulaTitle: 'Deterministic Document ID & Integrity Guard',
    formulaBody: 'doc_id = UUID5(NAMESPACE_URL, f"{filename}:{SHA256(bytes)[:16]}")',
    securityNote: 'Rejects disguised executables (.exe renamed to .pdf) at HTTP 400 before touching disk or parsers.',
    blocks: [
      { label: 'MAGIC-BYTE GUARD', sub: '%PDF- / PK0304 / PNG', tone: 'crimson' },
      { label: 'LAYOUT PARSER', sub: 'Tables + OCR + Code', tone: 'noir' },
      { label: 'SLIDING CHUNKER', sub: '512 tok • 10% overlap', tone: 'ochre' },
      { label: 'FASTEMBED ONNX', sub: 'BGE-Small → 384-dim', tone: 'teal' },
    ],
  },
  {
    id: 'stage-2',
    stageNum: 'STAGE 02',
    title: 'Context-Aware Intent Router (<140ms)',
    shortSpec: 'Query + History[-3:] → P(DIRECT | RAG | ONLINE)',
    description:
      'Instead of blindly invoking heavy multi-step agent loops on every message, our hybrid heuristic + Flash classifier inspects query semantics and recent turn history, saving 42.6% in token expenditure and cutting latency by 21.65%.',
    inputShape: 'UserPrompt (UTF-8) + RecentHistory[t-3 : t]',
    outputShape: 'RouterDecision { route, confidence ∈ [0,1], refinedQuery, latencyMs }',
    formulaTitle: 'Probabilistic Pipeline Dispatch',
    formulaBody: 'Route* = argmax_{c ∈ {DIRECT, RAG, ONLINE}} P(c | Q, H_{t-3:t})',
    securityNote: 'Uses AsyncLocalStorage per-request context — eliminating global process.env race conditions.',
    blocks: [
      { label: 'HEURISTIC FAST-PATH', sub: '< 2ms regex signals', tone: 'ochre' },
      { label: 'FLASH CLASSIFIER', sub: 'Gemini Flash / Llama 8B', tone: 'noir' },
      { label: 'QUERY REFINER', sub: 'Contextual expansion', tone: 'tangerine' },
      { label: 'STREAM ANNOTATOR', sub: 'Live Flight Deck emit', tone: 'teal' },
    ],
  },
  {
    id: 'stage-3',
    stageNum: 'STAGE 03',
    title: 'Hybrid RRF Vector Search & FastMCP Tool Bus',
    shortSpec: 'Dense(384d) ⊕ Sparse(BM25) → RRF(k=60) + JSON-RPC 2.0',
    description:
      'Combines Qdrant HNSW cosine similarity (198.7ms mean latency at 100k vectors) with BM25 exact lexical ranking via Reciprocal Rank Fusion. External tools and IDEs (Claude Desktop, Cursor) plug into the exact same FastMCP :8000/mcp endpoint.',
    inputShape: 'QueryVec[1, 384] + TenantFilter{ user_id, document_id }',
    outputShape: 'TopK_Context[8] + Structured MCP Tool Output JSON',
    formulaTitle: 'Reciprocal Rank Fusion (RRF)',
    formulaBody: 'RRF(d) = Σ_{m ∈ {Dense, BM25}} 1 / (60 + rank_m(d))',
    securityNote: 'Strict command whitelist [npx, node, python, python3, uvx] + SSRF 169.254.169.254 metadata blocker.',
    blocks: [
      { label: 'QDRANT HNSW', sub: '384d Cosine Search', tone: 'noir' },
      { label: 'BM25 LEXICAL', sub: 'Exact clause/ID match', tone: 'tangerine' },
      { label: 'RRF FUSION (k=60)', sub: '+32.07% Retrieval Gain', tone: 'ochre' },
      { label: 'FASTMCP BUS', sub: 'JSON-RPC 2.0 / Stdio', tone: 'teal' },
    ],
  },
  {
    id: 'stage-4',
    stageNum: 'STAGE 04',
    title: 'Multi-Agent Consensus Verifier & Pyodide WASM',
    shortSpec: 'Draft + RawChunks → Consensus S_c ≥ 0.85 → WASM Canvas',
    description:
      'Before any critical answer streams to completion, the Verifier Agent extracts atomic numerical and citation assertions and cross-examines them against raw chunks. Analytical Python code executes locally inside the client browser via Pyodide WebAssembly.',
    inputShape: 'DraftResponse + RetrievedChunks[8] + GeneratedCode',
    outputShape: 'VerifiedAnswer (S_c ≥ 0.85) + Browser WASM SVG/Stdout',
    formulaTitle: 'Multi-Agent Consensus Score',
    formulaBody: 'S_c = 0.4·FactCheck(A,C) + 0.3·MathCheck(A) + 0.3·QuoteMatch(A,C)',
    securityNote: 'Zero host code execution — 100% of analytical Python/JS runs isolated inside browser WASM memory.',
    blocks: [
      { label: 'ASSERTION PARSER', sub: 'Claims + Numbers', tone: 'noir' },
      { label: 'CITATION CRITIC', sub: 'Max 2 self-correct loops', tone: 'crimson' },
      { label: 'CONSENSUS SEAL', sub: 'Threshold S_c ≥ 0.85', tone: 'ochre' },
      { label: 'PYODIDE WASM', sub: 'Zero Server RCE', tone: 'teal' },
    ],
  },
];

export interface WasmPreset {
  id: string;
  title: string;
  language: 'python' | 'javascript';
  description: string;
  code: string;
  mockStdout: string;
  execMs: number;
  chartTitle: string;
  chartBars: { label: string; value: number; max: number; display: string; color: string }[];
}

export const WASM_PRESETS: WasmPreset[] = [
  {
    id: 'rrf-fusion',
    title: 'Reciprocal Rank Fusion (RRF) Scorer',
    language: 'python',
    description: 'Computes hybrid dense + BM25 RRF scores (k=60) across retrieved contract chunks.',
    execMs: 128,
    code: `# MCPPRO Pyodide WASM Sandbox — Hybrid RRF Calculator
k = 60
dense_rank = {"Clause_4.2_SLA": 1, "Clause_8.4_Cap": 3, "Appendix_B": 2, "Clause_11_Term": 5}
bm25_rank  = {"Clause_4.2_SLA": 2, "Clause_8.4_Cap": 1, "Appendix_B": 6, "Clause_11_Term": 3}

scores = {}
for doc in dense_rank:
    scores[doc] = round(1/(k + dense_rank[doc]) + 1/(k + bm25_rank[doc]), 5)

for doc, s in sorted(scores.items(), key=lambda x: x[1], reverse=True):
    print(f"{doc:<18} | RRF Score = {s:.5f}")`,
    mockStdout: `[Pyodide v0.25.0 WASM Runtime Initialized — 0 Server Calls]
Clause_4.2_SLA     | RRF Score = 0.03252  (Rank #1)
Clause_8.4_Cap     | RRF Score = 0.03227  (Rank #2)
Appendix_B         | RRF Score = 0.03128  (Rank #3)
Clause_11_Term     | RRF Score = 0.03125  (Rank #4)
---
Process completed in 128ms inside isolated browser WebAssembly.`,
    chartTitle: 'RRF Hybrid Relevance Distribution (k = 60)',
    chartBars: [
      { label: 'Clause 4.2 SLA', value: 96, max: 100, display: '0.03252', color: '#1A233A' },
      { label: 'Clause 8.4 Cap', value: 94, max: 100, display: '0.03227', color: '#0F6A73' },
      { label: 'Appendix B', value: 82, max: 100, display: '0.03128', color: '#C92A2A' },
      { label: 'Clause 11 Term', value: 80, max: 100, display: '0.03125', color: '#E87A24' },
    ],
  },
  {
    id: 'sla-penalty',
    title: 'SLA Penalty Liability Projection',
    language: 'python',
    description: 'Models monthly SaaS contract credit exposure under Section 4.2 uptime tiers.',
    execMs: 142,
    code: `# MCPPRO Pyodide WASM — Contract SLA Liability Simulator
monthly_fee = 85000  # USD
scenarios = [("99.98% (Compliant)", 0.00), ("99.50% (Tier 1)", 0.10), ("98.80% (Tier 2)", 0.25), ("97.50% (Breach)", 0.40)]

print(f"Base Monthly Contract Value: \${monthly_fee:,}")
for label, pct in scenarios:
    credit = monthly_fee * pct
    print(f"{label:<20} -> Credit Exposure: \${credit:>9,.2f}")`,
    mockStdout: `[Pyodide v0.25.0 WASM Runtime Initialized — 0 Server Calls]
Base Monthly Contract Value: $85,000
99.98% (Compliant)   -> Credit Exposure:     $0.00
99.50% (Tier 1)      -> Credit Exposure: $8,500.00
98.80% (Tier 2)      -> Credit Exposure: $21,250.00
97.50% (Breach)      -> Credit Exposure: $34,000.00
---
Process completed in 142ms inside isolated browser WebAssembly.`,
    chartTitle: 'Monthly SLA Credit Liability Exposure ($ USD)',
    chartBars: [
      { label: '99.98% SLA', value: 4, max: 100, display: '$0', color: '#254B37' },
      { label: '99.50% Tier 1', value: 25, max: 100, display: '$8,500', color: '#E6B422' },
      { label: '98.80% Tier 2', value: 62, max: 100, display: '$21,250', color: '#E87A24' },
      { label: '97.50% Breach', value: 100, max: 100, display: '$34,000', color: '#C92A2A' },
    ],
  },
  {
    id: 'token-savings',
    title: 'Intent Router Cost & Token Analyzer',
    language: 'javascript',
    description: 'Calculates API token savings from MCPPRO dynamic intent routing + local FastEmbed.',
    execMs: 14,
    code: `// Sandboxed Browser JS Evaluation
const omniTokens = 4210;
const mcpproTokens = 2415;
const savedPct = (((omniTokens - mcpproTokens) / omniTokens) * 100).toFixed(2);
const monthlyCommercial = 385.0;
const mcpproActual = 14.5;

console.log("Baseline Avg Tokens/Turn:", omniTokens);
console.log("MCPPRO Avg Tokens/Turn:", mcpproTokens);
console.log("Token Reduction:", savedPct + "%");
console.log("Monthly Infra Savings: $" + (monthlyCommercial - mcpproActual).toFixed(2));`,
    mockStdout: `[Sandboxed Browser Function Runtime — Isolated Scope]
Baseline Avg Tokens/Turn: 4210
MCPPRO Avg Tokens/Turn: 2415
Token Reduction: 42.64%
Monthly Infra Savings: $370.50 (96.2% reduction)
---
Executed cleanly in 14ms with zero server overhead.`,
    chartTitle: 'Tokens Consumed per Multi-Turn Query',
    chartBars: [
      { label: 'Legacy Agent Baseline', value: 100, max: 100, display: '4,210 tok', color: '#C92A2A' },
      { label: 'Vanilla RAG', value: 90, max: 100, display: '3,800 tok', color: '#E6B422' },
      { label: 'MCPPRO (Routed)', value: 57, max: 100, display: '2,415 tok', color: '#0F6A73' },
    ],
  },
];

export interface DiffPreset {
  id: string;
  docA: string;
  docB: string;
  focus: string;
  riskLevel: 'high' | 'moderate' | 'low';
  analysis: string;
  additions: { clause: string; detail: string }[];
  modifications: { clause: string; detail: string }[];
  deletions: { clause: string; detail: string }[];
}

export const DIFF_PRESETS: DiffPreset[] = [
  {
    id: 'msa-v1-v2',
    docA: 'Enterprise_MSA_2025_v1.pdf (48 chunks)',
    docB: 'Enterprise_MSA_2026_v2.pdf (54 chunks)',
    focus: 'Termination notice, liability caps, AI data rights',
    riskLevel: 'high',
    analysis:
      'Version 2 introduces material commercial obligations: extends termination notice window by 100%, adds an automatic annual renewal lock-in, and removes the mutual consequential damages waiver.',
    additions: [
      { clause: '§3.4 Auto-Renewal Lock-In', detail: 'Contract renews automatically for 12 months unless written notice is received 60 days prior.' },
      { clause: '§9.6 Model Training Opt-Out', detail: 'Explicitly prohibits provider from using customer RAG embeddings for foundation model training.' },
    ],
    modifications: [
      { clause: '§11.1 Termination for Convenience', detail: 'Notice period increased from 30 calendar days (v1) to 60 calendar days (v2).' },
      { clause: '§7.3 Data Purge SLA', detail: 'Post-termination vector deletion window expanded from 15 days to 90 days.' },
    ],
    deletions: [
      { clause: '§8.2 Mutual Consequential Waiver', detail: 'Deleted carve-out shielding client from indirect downtime claims during vendor migration.' },
    ],
  },
  {
    id: 'privacy-draft-final',
    docA: 'AI_Governance_Policy_Draft.md (22 chunks)',
    docB: 'AI_Governance_Policy_Final.pdf (29 chunks)',
    focus: 'RLS tenant isolation, HITL web gates, secret masking',
    riskLevel: 'moderate',
    analysis:
      'Finalized governance standard strengthens security posture with mandatory HITL authorization for automated browser submissions and removes plaintext local cache backups.',
    additions: [
      { clause: '§5.1 Visual HITL Safety Gate', detail: 'All state-mutating Playwright clicks and form submissions require screenshot review + signed user consent.' },
      { clause: '§6.3 Magic-Byte File Validation', detail: 'Binary header inspection enforced on all uploads up to 25 MB.' },
    ],
    modifications: [
      { clause: '§4.2 Admin API Key Storage', detail: 'Replaced local JSON disk cache with Supabase RLS encrypted store and masked response headers (sk-p••••).' },
    ],
    deletions: [
      { clause: '§2.4 Hardcoded Super-Admin Override', detail: 'Removed static developer email bypass from production admin middleware.' },
    ],
  },
];

export interface McpServerConnection {
  id: string;
  name: string;
  transport: 'Streamable HTTP / SSE' | 'Local Stdio Process';
  endpoint: string;
  toolsCount: number;
  category: string;
  status: 'online' | 'standby';
}

export const INITIAL_MCP_SERVERS: McpServerConnection[] = [
  { id: 'srv-1', name: 'mcppro-rag-core', transport: 'Streamable HTTP / SSE', endpoint: 'http://127.0.0.1:8000/mcp', toolsCount: 6, category: 'Document RAG & Diff', status: 'online' },
  { id: 'srv-2', name: 'playwright-cloud', transport: 'Local Stdio Process', endpoint: 'npx @playwright/mcp@latest', toolsCount: 4, category: 'Headless Browser + HITL', status: 'online' },
  { id: 'srv-3', name: 'arxiv-papers', transport: 'Streamable HTTP / SSE', endpoint: 'https://mcp.arxiv-research.io/sse', toolsCount: 3, category: 'Scholarly Research DB', status: 'online' },
  { id: 'srv-4', name: 'github-repo-tools', transport: 'Local Stdio Process', endpoint: 'npx @modelcontextprotocol/server-github', toolsCount: 3, category: 'GitHub & Code Analysis', status: 'online' },
];

export const MCP_TOOLS_CATALOG = [
  {
    name: 'searchUploadedDocuments',
    transport: 'FastMCP HTTP / Stdio',
    latency: '198 ms',
    scope: 'RAG Retrieval',
    description: 'Hybrid Qdrant HNSW + BM25 search with Reciprocal Rank Fusion (k=60) scoped strictly by Supabase RLS tenant ID.',
    sampleArgs: '{\n  "query": "Section 4.2 SLA uptime penalty",\n  "k": 8\n}',
  },
  {
    name: 'diffDocuments',
    transport: 'FastMCP HTTP',
    latency: '540 ms',
    scope: 'Document Intelligence',
    description: 'Cross-document clause comparator categorizing additions, modifications, and deletions with automated legal risk grading.',
    sampleArgs: '{\n  "doc_a_id": "msa_2025_v1",\n  "doc_b_id": "msa_2026_v2"\n}',
  },
  {
    name: 'playwrightCloudBrowser',
    transport: 'MCP Stdio (Whitelisted)',
    latency: '680 ms',
    scope: 'Web Automation + HITL',
    description: 'Headless Chromium navigation & DOM scraping protected by the Visual Human-in-the-Loop approval gate on sensitive clicks.',
    sampleArgs: '{\n  "url": "https://modelcontextprotocol.io",\n  "action": "extract"\n}',
  },
  {
    name: 'tavilySearch',
    transport: 'FastMCP HTTP',
    latency: '310 ms',
    scope: 'Live Web Search',
    description: 'Real-time semantic web exploration for breaking news, scholarly papers, and live market benchmarks.',
    sampleArgs: '{\n  "query": "quantum computing advances"\n}',
  },
  {
    name: 'pyodideWasmExecute',
    transport: 'Client Browser WASM',
    latency: '142 ms',
    scope: 'Code Sandbox',
    description: 'Executes Python & JavaScript analytical code inside an isolated browser WebAssembly sandbox with zero server risk.',
    sampleArgs: '{\n  "language": "python",\n  "code": "print(sum(range(100)))"\n}',
  },
  {
    name: 'verifyConsensusCouncil',
    transport: 'Internal Multi-Agent',
    latency: '205 ms',
    scope: 'Hallucination Guard',
    description: 'Cross-examines numerical assertions and direct quotes against retrieved source chunks before unlocking final response.',
    sampleArgs: '{\n  "draft": "99.95% monthly uptime",\n  "threshold": 0.85\n}',
  },
];

export const BENCHMARK_STORAGE_ROWS = [
  { metric: 'Insertion (vec/s)', mem100: '1036.48', mem1k: '1270.21', mem100k: '1308.35', q100: '65.72', q1k: '291.76', q100k: '413.06' },
  { metric: 'Mean Query Latency (ms)', mem100: '21.879', mem1k: '187.072', mem100k: '1927.565', q100: '3.638', q1k: '27.817', q100k: '198.746' },
];

export const GAP_AUDIT_ROWS = [
  {
    dimension: 'Vector Data Integrity',
    omni: 'delete_all_documents() wiped vector DB on every single request.',
    mcppro: 'Scoped Supabase RLS + Qdrant document_id metadata isolation.',
  },
  {
    dimension: 'Concurrency & Multi-Tenancy',
    omni: 'Mutated global process.env.SELECTED_MODEL per request (race conditions).',
    mcppro: 'Immutable request context via AsyncLocalStorage per turn.',
  },
  {
    dimension: 'Code Execution Safety',
    omni: 'Host execution with shell: true & exposed process.env secrets.',
    mcppro: 'Zero-server-risk Pyodide WebAssembly browser sandbox + isolated env.',
  },
  {
    dimension: 'MCP Server Registration',
    omni: 'Unauthenticated stdio allowed arbitrary bash/shell metacharacters.',
    mcppro: 'Strict requireAdmin() + command whitelist [npx,node,python,uvx] + SSRF guard.',
  },
  {
    dimension: 'File Upload Security',
    omni: 'Trusted file extensions blindly; vulnerable to disguised binaries.',
    mcppro: 'Binary magic-byte validation (%PDF-, PNG, PK0304) + 25MB cap.',
  },
  {
    dimension: 'Observability & Trust',
    omni: 'Opaque black-box output with zero verification or web consent.',
    mcppro: 'Live Agent Flight Deck DAG + Visual HITL Gate + Verifier Council.',
  },
];
