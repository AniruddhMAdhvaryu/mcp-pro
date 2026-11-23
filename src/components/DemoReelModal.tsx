import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowRight, ArrowLeft, Play } from 'lucide-react';
import type { PageId } from '../data/mcpproData';

interface DemoReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWorkbench: (page: PageId) => void;
}

const REEL_FRAMES = [
  {
    step: 'SESSION 01 / 05',
    badge: '514 FRONTIER & OPEN MODELS',
    title: 'Multi-Provider Chat Studio & Local Key Vault',
    color: 'var(--noir-navy)',
    body: 'Switch seamlessly between Anthropic Claude 3.7, OpenAI GPT-4o & o3, Google Gemini 2.0, xAI Grok, Groq LPU, and 486 OpenRouter models—with API keys persisted strictly in your local browser storage.',
    metric: '6 Providers • 514 Models • Zero Server Key Exposure',
  },
  {
    step: 'SESSION 02 / 05',
    badge: 'HYBRID DENSE + SPARSE RETRIEVAL',
    title: 'Qdrant HNSW + BM25 Reciprocal Rank Fusion',
    color: 'var(--space-teal)',
    body: 'Uploaded PDFs, DOCX, PPTX, Markdown, and spreadsheets pass magic-byte verification before local FastEmbed ONNX embedding. Dense cosine similarity fuses with BM25 via RRF (k=60).',
    metric: '198.7 ms @ 100k Vectors • +32.07% Retrieval Gain',
  },
  {
    step: 'SESSION 03 / 05',
    badge: 'ZERO HOST SERVER RCE',
    title: 'Client-Side Pyodide WebAssembly Sandbox',
    color: 'var(--crimson)',
    body: 'Instead of running untrusted Python on a backend server, MCPPRO executes analytical scripts and renders SVG data trends directly inside your browser via Pyodide WebAssembly.',
    metric: '0% Host Compute Risk • 142 ms Browser Exec',
  },
  {
    step: 'SESSION 04 / 05',
    badge: 'GOVERNED BROWSER AUTOMATION',
    title: 'Visual Human-in-the-Loop (HITL) Safety Gate',
    color: 'var(--tangerine)',
    body: 'Before Playwright executes state-mutating clicks or form submissions, execution pauses and streams an inline page snapshot for explicit Approve/Reject human consent.',
    metric: '100% Signed Audit Trail • /api/hitl/decision',
  },
  {
    step: 'SESSION 05 / 05',
    badge: 'MODEL CONTEXT PROTOCOL HUB',
    title: 'FastMCP Server & Consensus Verifier Council',
    color: 'var(--radar-olive)',
    body: 'Connect external HTTP/SSE or whitelisted Stdio MCP servers (arXiv, GitHub, Snowflake, Jira) and export 1-click configurations for Claude Desktop & Cursor IDE.',
    metric: '16 Live Tools Ready • Verifier Consensus S_c ≥ 0.85',
  },
];

export function DemoReelModal({ isOpen, onClose, onLaunchWorkbench }: DemoReelModalProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isOpen) return;
      gsap.from('.modal-panel', {
        y: 28,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.35,
        ease: 'back.out(1.4)',
      });
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  useGSAP(
    () => {
      if (!isOpen) return;
      gsap.from('.reel-frame-content', {
        x: 18,
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.out',
      });
    },
    { scope: modalRef, dependencies: [frameIdx, isOpen] }
  );

  if (!isOpen) return null;
  const frame = REEL_FRAMES[frameIdx];

  return (
    <div
      ref={modalRef}
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="How MCPPRO Works Walkthrough"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel" style={{ maxWidth: '740px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            backgroundColor: 'var(--bg-obsidian)',
            color: 'var(--ochre)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Play size={14} fill="currentColor" />
            SESSION REEL // HOW MCPPRO ORCHESTRATES AGENTS
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Walkthrough"
            style={{
              background: 'var(--bg-parchment)',
              color: 'var(--ink)',
              border: '2px solid var(--ink)',
              borderRadius: '6px',
              padding: '3px 6px',
              display: 'inline-flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="reel-frame-content" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span
              className="tilted-badge"
              style={{
                backgroundColor: frame.color,
                color: frame.color === 'var(--tangerine)' ? 'var(--ink)' : 'var(--on-dark)',
              }}
            >
              {frame.badge}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
              {frame.step}
            </span>
          </div>

          <h3 className="section-heading" style={{ fontSize: '28px', marginBottom: '12px' }}>
            {frame.title}
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
            {frame.body}
          </p>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--ochre)',
              border: 'var(--border-ink)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            VERIFIED TELEMETRY: {frame.metric}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 26px',
            borderTop: 'var(--border-ink)',
            backgroundColor: 'var(--bg-sand)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="brutal-btn brutal-btn--parchment"
              disabled={frameIdx === 0}
              onClick={() => setFrameIdx((i) => Math.max(0, i - 1))}
              style={{ opacity: frameIdx === 0 ? 0.5 : 1, padding: '8px 14px' }}
            >
              <ArrowLeft size={14} /> Prev
            </button>
            <button
              type="button"
              className="brutal-btn brutal-btn--ochre"
              disabled={frameIdx === REEL_FRAMES.length - 1}
              onClick={() => setFrameIdx((i) => Math.min(REEL_FRAMES.length - 1, i + 1))}
              style={{ opacity: frameIdx === REEL_FRAMES.length - 1 ? 0.5 : 1, padding: '8px 14px' }}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>

          <button
            type="button"
            className="brutal-btn brutal-btn--crimson"
            onClick={() => {
              onClose();
              onLaunchWorkbench('studio');
            }}
            style={{ padding: '9px 18px' }}
          >
            Open Chat Studio ↗
          </button>
        </div>
      </div>
    </div>
  );
}
