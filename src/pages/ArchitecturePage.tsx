import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShieldCheck } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/mcpproData';

const TONE_MAP = {
  noir: { bg: 'var(--noir-navy)', color: 'var(--on-dark)' },
  tangerine: { bg: 'var(--tangerine)', color: 'var(--ink)' },
  ochre: { bg: 'var(--ochre)', color: 'var(--ink)' },
  crimson: { bg: 'var(--crimson)', color: 'var(--on-dark)' },
  teal: { bg: 'var(--space-teal)', color: 'var(--on-dark)' },
};

const ORCHESTRATION_FLOW = [
  { num: '01', title: 'Connect Models & Keys', desc: 'Select from 514 frontier & open models or connect your own API keys securely in browser storage.' },
  { num: '02', title: 'Ingest Knowledge Base', desc: 'Upload PDFs, Markdown, Office files, or code for automated magic-byte checked chunking & Qdrant indexing.' },
  { num: '03', title: 'Execute MCP Tools', desc: 'Autonomous agents invoke external HTTP/SSE or whitelisted Stdio tools and live web search in real time.' },
  { num: '04', title: 'Verify & Stream Results', desc: 'Consensus Verifier checks assertions while tokens, tool chips, and WASM artifacts stream live.' },
];

export function ArchitecturePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const stage = PIPELINE_STAGES[activeIdx];

  useGSAP(
    () => {
      gsap.from('.stage-detail-anim', {
        y: 16,
        autoAlpha: 0,
        duration: 0.34,
        stagger: 0.06,
        ease: 'power2.out',
      });
    },
    { scope: pageRef, dependencies: [activeIdx] }
  );

  return (
    <div ref={pageRef} className="grid-parchment" style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '36px 0 72px' }}>
      <div className="container">
        <div
          className="brutal-card grid-noir crt-scanlines"
          style={{
            padding: '32px',
            color: 'var(--on-dark)',
            marginBottom: '26px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '820px' }}>
            <span
              className="tilted-badge"
              style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)', transform: 'rotate(-1deg)', marginBottom: '14px' }}
            >
              ARCHITECTURE &amp; FLOW • 5-LAYER AGENTIC SYSTEM
            </span>
            <h1 className="section-heading" style={{ color: 'var(--on-dark)', marginBottom: '10px' }}>
              How MCPPRO{' '}
              <span className="section-heading-serif" style={{ color: 'var(--ochre)', textDecoration: 'underline' }}>
                Orchestrates Agents
              </span>
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--on-dark-muted)', lineHeight: 1.6 }}>
              A cohesive architecture connecting 514 frontier &amp; open models with private vector knowledge,
              Model Context Protocol tool servers, client-side Pyodide WASM, and consensus verification.
            </p>
          </div>

          <div
            className="seal-badge"
            style={{
              backgroundColor: 'var(--ochre)',
              color: 'var(--ink)',
              width: '92px',
              height: '92px',
              fontSize: '11px',
              flexShrink: 0,
            }}
          >
            <span>MCPPRO</span>
            <span style={{ fontSize: '9px' }}>v2.0 CORE</span>
          </div>
        </div>

        {/* Orchestration flow */}
        <div className="scenario-tabs" style={{ marginBottom: '28px' }}>
          {ORCHESTRATION_FLOW.map((step) => (
            <div
              key={step.num}
              className="brutal-card"
              style={{ padding: '16px', backgroundColor: 'var(--bg-white)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '28px',
                  color: 'var(--crimson)',
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', margin: '4px 0 6px' }}>
                {step.title}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Stage inspector */}
        <div style={{ marginBottom: '14px' }}>
          <span
            className="tilted-badge"
            style={{ backgroundColor: 'var(--crimson)', color: 'var(--on-dark)', transform: 'rotate(-1deg)', marginBottom: '10px' }}
          >
            INTERACTIVE DATAFLOW BLUEPRINT
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800 }}>
            Click Any Pipeline Stage to Inspect Data &amp; Protocol Contracts
          </h2>
          <span className="handwritten" style={{ color: 'var(--space-teal)' }}>
            Exact runtime contracts from FastAPI + Next.js Edge!
          </span>
        </div>

        <div className="scenario-tabs" style={{ marginBottom: '22px' }}>
          {PIPELINE_STAGES.map((st, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`scenario-tab ${active ? 'scenario-tab--active' : ''}`}
                style={{ padding: '15px' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, opacity: 0.85 }}>
                  {st.stageNum}
                </span>
                <div style={{ fontWeight: 800, fontSize: '14px', margin: '4px 0 8px' }}>{st.title}</div>
                <div
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: active ? 'rgba(0,0,0,0.3)' : 'var(--bg-sand)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    color: active ? 'var(--ochre)' : 'var(--ink-soft)',
                  }}
                >
                  {st.shortSpec}
                </div>
              </button>
            );
          })}
        </div>

        <div className="brutal-card" style={{ padding: '28px', backgroundColor: 'var(--bg-white)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
            <div className="stage-detail-anim">
              <span className="tilted-badge" style={{ backgroundColor: 'var(--space-teal)', color: 'var(--on-dark)', marginBottom: '12px' }}>
                ACTIVE STAGE INSPECTION • {stage.stageNum}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '12px' }}>
                {stage.title}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '18px' }}>
                {stage.description}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-obsidian)',
                  color: 'var(--ochre)',
                  border: 'var(--border-ink)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--on-dark-muted)', marginBottom: '4px' }}>
                  {stage.formulaTitle.toUpperCase()}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{stage.formulaBody}</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  backgroundColor: '#DCFCE7',
                  border: '1.5px solid var(--ink)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              >
                <ShieldCheck size={18} style={{ color: 'var(--radar-olive)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Hardening Guarantee:</strong> {stage.securityNote}
                </span>
              </div>
            </div>

            <div className="stage-detail-anim">
              <div
                className="grid-parchment"
                style={{ border: 'var(--border-ink)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '14px' }}>
                  IN: {stage.inputShape}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  {stage.blocks.map((blk, i) => {
                    const tone = TONE_MAP[blk.tone];
                    return (
                      <div
                        key={blk.label}
                        style={{
                          backgroundColor: tone.bg,
                          color: tone.color,
                          border: 'var(--border-ink)',
                          boxShadow: 'var(--shadow-sm)',
                          borderRadius: '10px',
                          padding: '16px',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.85, marginBottom: '4px' }}>
                          MODULE 0{i + 1}
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px' }}>
                          {blk.label}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>
                          {blk.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '10px 12px',
                    backgroundColor: 'var(--noir-navy)',
                    color: 'var(--ochre)',
                    borderRadius: '8px',
                  }}
                >
                  OUT: {stage.outputShape}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
