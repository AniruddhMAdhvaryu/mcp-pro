import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  Play,
  ShieldCheck,
  Cpu,
  GitCompare,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Database,
  KeyRound,
  BrainCircuit,
  Layers,
} from 'lucide-react';
import { AgentTopologyCanvas } from '../components/AgentTopologyCanvas';
import { TickerMarquee } from '../components/TickerMarquee';
import { LAB_SCENARIOS, type PageId, type WorkbenchTab } from '../data/mcpproData';

interface HomePageProps {
  onNavigate: (page: PageId, tab?: WorkbenchTab) => void;
  onOpenDemo: () => void;
  onOpenKeys: () => void;
}

const TICKER_ITEMS = [
  '514 FRONTIER & OPEN MODELS ACROSS 6 PROVIDERS',
  'CONTEXT INTENT ROUTER (<140MS)',
  'HYBRID DENSE + BM25 RECIPROCAL RANK FUSION (K=60)',
  'CLIENT-SIDE PYODIDE WASM SANDBOX (0% HOST RCE)',
  'VISUAL HITL PLAYWRIGHT SAFETY GATE',
  'SEMANTIC CROSS-DOCUMENT DIFF ENGINE',
  'FASTMCP SERVER FOR CLAUDE DESKTOP & CURSOR',
  'CLIENT-SIDE BYOK API KEY VAULT',
];

const SUPPORTED_PROVIDERS = [
  'Anthropic Claude 3.7',
  'OpenAI GPT-4o & o3',
  'Google Gemini 2.0',
  'Groq LPU (Llama 3.3)',
  'xAI Grok Vision',
  'OpenRouter (486 Models)',
];

const PLATFORM_FEATURES = [
  {
    title: 'Multi-Model Intelligence',
    desc: 'Switch freely between Anthropic, OpenAI, Gemini, xAI Grok, Groq LPU, and 486 OpenRouter models.',
    icon: BrainCircuit,
    tone: 'var(--noir-navy)',
    fg: 'var(--ochre)',
  },
  {
    title: 'Model Context Protocol',
    desc: 'Standardized tool calling, dynamic JSON schemas, Streamable HTTP/SSE & whitelisted Stdio servers.',
    icon: Terminal,
    tone: 'var(--space-teal)',
    fg: 'var(--on-dark)',
  },
  {
    title: 'Semantic Vector RAG',
    desc: 'Hybrid Qdrant HNSW + BM25 retrieval with Reciprocal Rank Fusion and local CPU FastEmbed ONNX.',
    icon: Database,
    tone: 'var(--radar-olive)',
    fg: 'var(--mint)',
  },
  {
    title: 'Client-Side Key Vault',
    desc: 'Manage provider API keys securely in browser localStorage with zero server-side secret exposure.',
    icon: KeyRound,
    tone: 'var(--crimson)',
    fg: 'var(--on-dark)',
  },
  {
    title: 'Real-Time Streaming',
    desc: 'Token-by-token streaming with live intent chips, DAG traces, and 1-click Markdown session export.',
    icon: Zap,
    tone: 'var(--tangerine)',
    fg: 'var(--ink)',
  },
  {
    title: 'Document Ingestion',
    desc: 'Automated magic-byte checked chunking & embedding for PDFs, DOCX, PPTX, XLSX, Markdown, and code.',
    icon: Layers,
    tone: 'var(--ochre)',
    fg: 'var(--ink)',
  },
];

function splitChars(text: string) {
  return text.split(' ').map((word, wIdx, arr) => (
    <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {word.split('').map((ch, cIdx) => (
        <span key={`${wIdx}-${cIdx}`} className="kinetic-char">
          {ch}
        </span>
      ))}
      {wIdx < arr.length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

export function HomePage({ onNavigate, onOpenDemo, onOpenKeys }: HomePageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [highlightNode, setHighlightNode] = useState<string>('master');

  const scenario = LAB_SCENARIOS[activeScenarioIdx];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 900px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions ?? {};
          if (reduceMotion) return;

          // Hero entrance
          const heroTl = gsap.timeline({
            defaults: { duration: 0.6, ease: 'power3.out' },
          });

          heroTl
            .addLabel('headline', 0)
            .from('.kinetic-char', {
              y: 34,
              autoAlpha: 0,
              rotation: -4,
              stagger: { amount: 0.34, from: 'start' },
              duration: 0.5,
              ease: 'back.out(1.6)',
            }, 'headline')
            .from('.hero-torn-card', {
              y: 24,
              autoAlpha: 0,
              stagger: 0.1,
            }, 'headline+=0.16')
            .from('.hero-cta-anim', {
              y: 16,
              autoAlpha: 0,
              stagger: 0.08,
            }, '-=0.35')
            .from('.hero-sticker-pop', {
              scale: 0.72,
              autoAlpha: 0,
              rotation: () => gsap.utils.random(-6, 6),
              stagger: 0.07,
              ease: 'back.out(1.7)',
            }, '-=0.4')
            .from('.hero-right-stage', {
              x: isDesktop ? 36 : 0,
              y: isDesktop ? 0 : 24,
              autoAlpha: 0,
              duration: 0.75,
            }, 'headline+=0.18');

          // Ambient sticker motion
          gsap.utils.toArray<HTMLElement>('.floating-sticker').forEach((el, idx) => {
            gsap.to(el, {
              y: idx % 2 === 0 ? -6 : 6,
              rotation: idx % 2 === 0 ? '+=2' : '-=2',
              duration: gsap.utils.random(2.5, 3.8),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: idx * 0.22,
            });
          });

          // Rotating seals
          gsap.to('.spin-seal', {
            rotation: 360,
            duration: 24,
            repeat: -1,
            ease: 'none',
          });

          // Bento batch reveal
          gsap.set('.bento-reveal', { y: 36, autoAlpha: 0 });
          ScrollTrigger.batch('.bento-reveal', {
            start: 'top 86%',
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                overwrite: true,
              });
            },
          });

          // Panel reveals
          gsap.utils.toArray<HTMLElement>('.scroll-reveal-panel').forEach((panel) => {
            gsap.from(panel, {
              y: 32,
              autoAlpha: 0,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 85%',
                once: true,
              },
            });
          });

          // Metric counters
          gsap.utils.toArray<HTMLElement>('.kpi-counter').forEach((el) => {
            const targetVal = parseFloat(el.dataset.target || '0');
            const suffix = el.dataset.suffix || '';
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            const obj = { val: 0 };

            gsap.to(obj, {
              val: targetVal,
              duration: 1.35,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.noir-kpi-grid',
                start: 'top 82%',
                once: true,
              },
              onUpdate: () => {
                el.textContent = `${obj.val.toFixed(decimals)}${suffix}`;
              },
            });
          });

          // Latency bar fills
          gsap.from('.latency-bar-fill', {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.telemetry-blueprint-card',
              start: 'top 82%',
              once: true,
            },
          });

          // Pointer parallax on desktop
          if (isDesktop && heroRightRef.current) {
            const stageEl = heroRightRef.current;
            const xTo = gsap.quickTo(stageEl, 'x', { duration: 0.5, ease: 'power3.out' });
            const yTo = gsap.quickTo(stageEl, 'y', { duration: 0.5, ease: 'power3.out' });
            const mapX = gsap.utils.mapRange(0, window.innerWidth, -10, 10);
            const mapY = gsap.utils.mapRange(0, window.innerHeight, -8, 8);

            const onMove = (e: MouseEvent) => {
              xTo(mapX(e.clientX));
              yTo(mapY(e.clientY));
            };
            window.addEventListener('mousemove', onMove);
            return () => window.removeEventListener('mousemove', onMove);
          }
        }
      );

      return () => mm.revert();
    },
    { scope: pageRef }
  );

  useGSAP(
    () => {
      gsap.from('.lab-bench-swap', {
        y: 12,
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      });
    },
    { scope: pageRef, dependencies: [activeScenarioIdx] }
  );

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section className="hero-stage">
        <div className="hero-bg-zones" aria-hidden="true">
          <div className="hero-zone-tangerine grid-tangerine" />
          <div className="hero-zone-crimson" />
          <div className="hero-zone-noir grid-noir crt-scanlines" />
        </div>

        <div className="container hero-content">
          
          <div>
            <div style={{ marginBottom: '12px' }}>
              <span
                className="tilted-badge hero-torn-card"
                style={{ backgroundColor: 'var(--noir-navy)', color: 'var(--ochre)', transform: 'rotate(-1deg)' }}
              >
                SESSION 01 // MODEL CONTEXT PROTOCOL &amp; MULTI-AGENT AI
              </span>
            </div>

            <div className="hero-headline-stack">
              <div
                className="torn-block torn-parchment hero-torn-card"
                style={{ transform: 'rotate(-0.8deg)' }}
              >
                <span className="hero-word-condensed">{splitChars('AUTONOMOUS AI')}</span>
              </div>

              <div
                className="torn-block torn-ochre hero-torn-card"
                style={{ transform: 'rotate(1deg)' }}
              >
                <span className="hero-word-syne">{splitChars('AGENTS & MCP')}</span>
              </div>

              <div
                className="torn-block torn-parchment hero-torn-card"
                style={{ transform: 'rotate(-0.4deg)' }}
              >
                <span className="hero-word-serif" style={{ borderBottom: '4px solid var(--crimson)' }}>
                  with Frontier Models &amp; RAG
                </span>
              </div>
            </div>

            <div className="hero-copy-card hero-torn-card">
              Orchestrate autonomous agents across <strong>514 frontier &amp; open models</strong> with real-time{' '}
              <strong>MCP tool execution</strong>, hybrid Qdrant RRF retrieval, client-side{' '}
              <strong>Pyodide WASM</strong> sandboxing, and a local browser API Key Vault.
            </div>

            <div className="hero-cta-row">
              <button
                type="button"
                className="brutal-btn brutal-btn--noir hero-cta-anim"
                onClick={() => onNavigate('studio')}
              >
                Launch Chat Studio <ArrowUpRight size={16} />
              </button>
              <button
                type="button"
                className="brutal-btn brutal-btn--ochre hero-cta-anim"
                onClick={() => onNavigate('workbench', 'flight-deck')}
              >
                4-Mode Workbench <ArrowUpRight size={16} />
              </button>
              <button
                type="button"
                className="brutal-btn brutal-btn--parchment hero-cta-anim"
                onClick={onOpenDemo}
              >
                <Play size={14} fill="currentColor" /> Session Reel
              </button>
            </div>

            
            <div className="hero-sticker-row">
              <span
                className="tilted-badge hero-sticker-pop floating-sticker"
                style={{ backgroundColor: 'var(--ochre)', transform: 'rotate(-1.8deg)' }}
              >
                ★ 514 Models • 6 Providers
              </span>
              <span
                className="tilted-badge hero-sticker-pop floating-sticker"
                style={{ backgroundColor: 'var(--radar-olive)', color: 'var(--mint)', transform: 'rotate(1.6deg)' }}
              >
                0% Host RCE (WASM)
              </span>
              <span
                className="tilted-badge hero-sticker-pop floating-sticker"
                style={{ backgroundColor: 'var(--space-teal)', color: 'var(--on-dark)', transform: 'rotate(-1deg)' }}
              >
                +32.07% Retrieval Gain
              </span>
            </div>
          </div>

          
          <div ref={heroRightRef} className="hero-right-stage" style={{ position: 'relative' }}>
            <div
              className="tape-strip"
              style={{ top: '-9px', left: '28px', transform: 'rotate(-6deg)' }}
              aria-hidden="true"
            />
            <div
              className="tape-strip"
              style={{ top: '-9px', right: '32px', transform: 'rotate(5deg)' }}
              aria-hidden="true"
            />

            <AgentTopologyCanvas compact highlightNodeId={highlightNode} />

            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--bg-parchment)',
                  border: 'var(--border-ink)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                }}
              >
                <span className="handwritten" style={{ color: 'var(--crimson)' }}>
                  ↑ Drag to rotate mesh or hover any node!
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenKeys}
                className="tilted-badge floating-sticker"
                style={{ backgroundColor: 'var(--ochre)', transform: 'rotate(2deg)', cursor: 'pointer' }}
              >
                <KeyRound size={12} /> BYOK LOCAL VAULT
              </button>
            </div>
          </div>
        </div>

        
        <div className="hero-bottom-strip">
          <div className="container" style={{ paddingInline: 0 }}>
            <div className="hero-strip-grid">
              {[
                { icon: Sparkles, title: 'Chat Studio (514 Models)', sub: 'Claude, GPT-4o, Gemini, Groq', page: 'studio' as PageId },
                { icon: Database, title: 'Hybrid RRF RAG', sub: 'Qdrant HNSW + BM25 (k=60)', page: 'workbench' as PageId, tab: 'flight-deck' as WorkbenchTab },
                { icon: Cpu, title: 'Pyodide WASM Canvas', sub: 'In-browser Python & SVG', page: 'workbench' as PageId, tab: 'wasm-canvas' as WorkbenchTab },
                { icon: ShieldCheck, title: 'Visual HITL Gate', sub: 'Screenshot consent on clicks', page: 'workbench' as PageId, tab: 'hitl-gate' as WorkbenchTab },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className="hero-strip-item"
                    onClick={() => onNavigate(item.page, item.tab)}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: 'var(--border-ink)',
                        backgroundColor: 'var(--bg-sand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{item.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-soft)' }}>
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* Ticker */}
      <TickerMarquee items={TICKER_ITEMS} variant="charcoal" speed={30} />
      {/* Features */}
      <section className="section-band grid-parchment">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span
                className="tilted-badge"
                style={{ backgroundColor: 'var(--noir-navy)', color: 'var(--ochre)', marginBottom: '12px' }}
              >
                SESSION 02 // PLATFORM FEATURES
              </span>
              <h2 className="section-heading">
                Built for High-Performance{' '}
                <span className="section-heading-serif" style={{ color: 'var(--crimson)' }}>
                  AI Workflows
                </span>
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUPPORTED_PROVIDERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onNavigate('studio')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '5px 10px',
                    borderRadius: '999px',
                    border: '1.5px solid var(--ink)',
                    backgroundColor: 'var(--bg-white)',
                    boxShadow: '2px 2px 0 var(--ink)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bento-6-grid">
            {PLATFORM_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <article
                  key={feat.title}
                  className="brutal-card brutal-card--interactive bento-reveal"
                  style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      border: 'var(--border-ink)',
                      backgroundColor: feat.tone,
                      color: feat.fg,
                      boxShadow: '3px 3px 0 var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={21} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: 800 }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                    {feat.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {/* Lab bench */}
      <section className="section-band section-band--sand">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span
              className="tilted-badge"
              style={{ backgroundColor: 'var(--ochre)', transform: 'rotate(-1.2deg)', marginBottom: '12px' }}
            >
              SESSION 03 // INTERACTIVE EXECUTION BENCH
            </span>
            <h2 className="section-heading">
              Inspect Live Multi-Agent{' '}
              <span className="section-heading-serif" style={{ color: 'var(--space-teal)' }}>
                Execution Traces
              </span>
            </h2>
            <p style={{ maxWidth: '640px', margin: '10px auto 0', color: 'var(--ink-soft)', fontSize: '15px' }}>
              Switch between four real workflows to see how the Context Intent Router dispatches FastMCP tool
              payloads, runs specialist subagents, and verifies every citation.
            </p>
          </div>

          <div className="scenario-tabs">
            {LAB_SCENARIOS.map((sc, idx) => {
              const active = idx === activeScenarioIdx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setActiveScenarioIdx(idx);
                    setHighlightNode(idx === 0 ? 'rag' : idx === 1 ? 'wasm' : idx === 2 ? 'hitl' : 'verifier');
                  }}
                  className={`scenario-tab ${active ? 'scenario-tab--active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, opacity: 0.85 }}>
                      CASE {sc.code}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: active ? 'var(--ochre)' : 'var(--bg-sand)',
                        color: 'var(--ink)',
                        border: '1.5px solid var(--ink)',
                      }}
                    >
                      {sc.tag}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '15px', marginTop: '4px' }}>{sc.shortTitle}</div>
                </button>
              );
            })}
          </div>

          <div className="brutal-card scroll-reveal-panel" style={{ padding: '26px', backgroundColor: 'var(--bg-white)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              
              <div
                className="lab-bench-swap grid-noir crt-scanlines"
                style={{
                  border: 'var(--border-ink)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  color: 'var(--on-dark)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--ochre)',
                        color: 'var(--ink)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        border: '1.5px solid var(--ink)',
                      }}
                    >
                      ROUTE: {scenario.route} ({scenario.confidence}% CONF)
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--teal-bright)' }}>
                      {scenario.latencyMs}ms dispatch
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {scenario.dagSteps.map((st, sIdx) => (
                      <div
                        key={st.id}
                        style={{
                          backgroundColor: 'rgba(15, 17, 22, 0.78)',
                          border: '1.5px solid rgba(41, 168, 179, 0.45)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ochre)', fontWeight: 700 }}>
                            0{sIdx + 1}. {st.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--on-dark-muted)' }}>{st.detail}</div>
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--mint)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {st.ms}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <pre
                  style={{
                    backgroundColor: 'var(--bg-obsidian)',
                    color: '#4AD991',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--ink)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    overflowX: 'auto',
                    lineHeight: 1.5,
                  }}
                >
                  {scenario.mcpPayload}
                </pre>
              </div>

              
              <div
                className="lab-bench-swap"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
              >
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {scenario.toolsCalled.map((tool) => (
                      <span
                        key={tool}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 9px',
                          backgroundColor: 'var(--bg-parchment)',
                          border: '1.5px solid var(--ink)',
                          borderRadius: '6px',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--ink-soft)',
                      backgroundColor: 'var(--bg-parchment)',
                      border: '1.5px dashed var(--ink)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginBottom: '14px',
                    }}
                  >
                    <strong>Prompt:</strong> &ldquo;{scenario.prompt}&rdquo;
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '30px', lineHeight: 1.15, marginBottom: '8px' }}>
                    Verified Agent Council Synthesis
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                    {scenario.synthesis}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {scenario.citations.map((cit) => (
                      <span key={cit} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--space-teal)', fontWeight: 700 }}>
                        [{cit}]
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: 'var(--ochre)', border: 'var(--border-ink)', boxShadow: 'var(--shadow-sm)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700 }}>{scenario.metricOneLabel}</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{scenario.metricOneValue}</div>
                    </div>

                    <div style={{ backgroundColor: 'var(--crimson)', color: 'var(--on-dark)', border: 'var(--border-ink)', boxShadow: 'var(--shadow-sm)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700 }}>{scenario.metricTwoLabel}</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>{scenario.metricTwoValue}</div>
                    </div>

                    <div style={{ backgroundColor: 'var(--space-teal)', color: 'var(--on-dark)', border: 'var(--border-ink)', boxShadow: 'var(--shadow-sm)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700 }}>{scenario.metricThreeLabel}</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{scenario.metricThreeValue}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                      type="button"
                      className="brutal-btn brutal-btn--noir"
                      style={{ flex: 1 }}
                      onClick={() =>
                        onNavigate(
                          'workbench',
                          activeScenarioIdx === 0
                            ? 'flight-deck'
                            : activeScenarioIdx === 1
                            ? 'wasm-canvas'
                            : activeScenarioIdx === 2
                            ? 'hitl-gate'
                            : 'doc-diff'
                        )
                      }
                    >
                      Run Interactive Mode in Workbench <ArrowUpRight size={16} />
                    </button>

                    <div
                      className="seal-badge spin-seal"
                      style={{
                        backgroundColor: 'var(--noir-navy)',
                        color: 'var(--ochre)',
                        width: '74px',
                        height: '74px',
                        fontSize: '11px',
                        flexShrink: 0,
                      }}
                    >
                      <span>{scenario.consensusScore.toFixed(2)}</span>
                      <span style={{ fontSize: '8px', color: 'var(--on-dark)' }}>COUNCIL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Workbench modes */}
      <section className="section-band grid-parchment">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
            <div>
              <span className="tilted-badge" style={{ backgroundColor: 'var(--tangerine)', marginBottom: '12px' }}>
                SESSION 04 // FOUR AUTONOMOUS ENGINES
              </span>
              <h2 className="section-heading">
                Four AI Superpowers.{' '}
                <span className="section-heading-serif">One Hardened Workspace.</span>
              </h2>
            </div>
            <span className="handwritten" style={{ color: 'var(--crimson)' }}>
              Click any module to launch live! ↓
            </span>
          </div>

          <div className="bento-4-grid">
            
            <article className="mode-card mode-card--noir bento-reveal">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)' }}>
                    MODE 01
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--teal-bright)' }}>
                    &lt; 140ms Routing • +32.07% RAG
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '10px' }}>
                  Agent Flight Deck &amp; Live DAG Orchestrator
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--on-dark-muted)' }}>
                  Watch the Context Intent Router classify your prompt into DIRECT, Hybrid RRF RAG, or ONLINE web
                  search—streaming real-time node transitions and Verifier Council scores.
                </p>
              </div>
              <button
                type="button"
                className="brutal-btn brutal-btn--ochre"
                style={{ width: '100%' }}
                onClick={() => onNavigate('workbench', 'flight-deck')}
              >
                <Zap size={16} /> Open Agent Flight Deck <ArrowUpRight size={16} />
              </button>
            </article>

            
            <article className="mode-card mode-card--crimson bento-reveal">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="tilted-badge" style={{ backgroundColor: 'var(--bg-parchment)', color: 'var(--ink)' }}>
                    MODE 02
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                    Pyodide v0.25 • 0% Host RCE
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '10px' }}>
                  Interactive Pyodide WASM Artifacts Canvas
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, opacity: 0.94 }}>
                  Execute Python data scripts, RRF formulas, and JavaScript calculators directly inside the browser
                  via WebAssembly with live console output and SVG charts—zero server execution risk.
                </p>
              </div>
              <button
                type="button"
                className="brutal-btn brutal-btn--parchment"
                style={{ width: '100%' }}
                onClick={() => onNavigate('workbench', 'wasm-canvas')}
              >
                <Cpu size={16} /> Launch WASM Sandbox <ArrowUpRight size={16} />
              </button>
            </article>

            
            <article className="mode-card mode-card--ochre bento-reveal">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="tilted-badge" style={{ backgroundColor: 'var(--ink)', color: 'var(--ochre)' }}>
                    MODE 03
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                    Playwright + Stagehand • HITL
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '10px' }}>
                  Visual Human-in-the-Loop Web Safety Gate
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>
                  Autonomous cloud browser automation pauses before sensitive clicks, form submissions, or
                  downloads—displaying an inline page snapshot and waiting for explicit human approval.
                </p>
              </div>
              <button
                type="button"
                className="brutal-btn brutal-btn--noir"
                style={{ width: '100%' }}
                onClick={() => onNavigate('workbench', 'hitl-gate')}
              >
                <Globe size={16} /> Test HITL Safety Gate <ArrowUpRight size={16} />
              </button>
            </article>

            
            <article className="mode-card mode-card--teal bento-reveal">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)' }}>
                    MODE 04
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                    POST /documents/diff • Risk Graded
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '10px' }}>
                  Semantic Cross-Document Diff Engine
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, opacity: 0.94 }}>
                  Align two contract or policy versions by vector chunks to detect added clauses, altered legal
                  notice periods, and omitted liability waivers with automated High/Moderate/Low risk scoring.
                </p>
              </div>
              <button
                type="button"
                className="brutal-btn brutal-btn--tangerine"
                style={{ width: '100%' }}
                onClick={() => onNavigate('workbench', 'doc-diff')}
              >
                <GitCompare size={16} /> Compare Document Revisions <ArrowUpRight size={16} />
              </button>
            </article>
          </div>
        </div>
      </section>
      {/* Benchmarks */}
      <section className="section-band section-band--noir grid-noir crt-scanlines">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '36px',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                className="tilted-badge"
                style={{ backgroundColor: 'var(--tangerine)', color: 'var(--ink)', marginBottom: '14px' }}
              >
                EMPIRICAL EVALUATION • 115 QUERIES / 30 DOCS
              </span>
              <h2 className="section-heading" style={{ color: 'var(--on-dark)', marginBottom: '14px' }}>
                Verified to the millisecond. Hardened against RCE.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--on-dark-muted)', lineHeight: 1.65, marginBottom: '26px' }}>
                Benchmarked across 7 heterogeneous document formats (PDF, DOCX, PPTX, XLSX, TXT, MD, PNG) scaling up
                to 100,000 vector embeddings with zero host code execution.
              </p>

              <div
                className="noir-kpi-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}
              >
                {[
                  { target: 32.07, decimals: 2, suffix: '%', label: 'Higher Retrieval Accuracy (RRF)' },
                  { target: 21.65, decimals: 2, suffix: '%', label: 'Lower End-to-End Latency' },
                  { target: 42.6, decimals: 1, suffix: '%', label: 'API Token Cost Reduction' },
                  { target: 61, decimals: 0, suffix: '/61', label: 'Automated Tests Passing' },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    style={{
                      border: '2px solid var(--ochre)',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'rgba(15, 17, 22, 0.55)',
                    }}
                  >
                    <div
                      className="kpi-counter"
                      data-target={kpi.target}
                      data-decimals={kpi.decimals}
                      data-suffix={kpi.suffix}
                      style={{
                        fontFamily: 'var(--font-condensed)',
                        fontSize: '42px',
                        letterSpacing: '0.03em',
                        color: 'var(--ochre)',
                        lineHeight: 1,
                      }}
                    >
                      {kpi.target.toFixed(kpi.decimals)}
                      {kpi.suffix}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--on-dark-muted)', marginTop: '6px' }}>
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  className="brutal-btn brutal-btn--ochre brutal-btn--pill"
                  onClick={() => onNavigate('benchmarks')}
                >
                  Explore Full Benchmarks <ArrowUpRight size={15} />
                </button>
                <button
                  type="button"
                  className="brutal-btn brutal-btn--parchment brutal-btn--pill"
                  onClick={() => onNavigate('mcp')}
                >
                  Open MCP Hub <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            
            <div
              className="telemetry-blueprint-card"
              style={{
                backgroundColor: 'var(--bg-parchment)',
                color: 'var(--ink)',
                border: '3px solid var(--ink)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '8px 8px 0 var(--ink)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  backgroundColor: 'var(--bg-obsidian)',
                  color: 'var(--on-dark)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                }}
              >
                <span>VECTOR TELEMETRY • 100K VECTORS</span>
                <span
                  style={{
                    backgroundColor: 'var(--tangerine)',
                    color: 'var(--ink)',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  9.7x FASTER QDRANT
                </span>
              </div>

              <div style={{ padding: '22px' }}>
                <div
                  className="grid-radar"
                  style={{
                    border: 'var(--border-ink)',
                    borderRadius: '12px',
                    padding: '18px',
                    color: 'var(--on-dark)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ochre)', marginBottom: '14px' }}>
                    MEAN QUERY LATENCY (LOWER IS BETTER)
                  </div>

                  {[
                    { label: 'Qdrant HNSW (100 vec)', ms: '3.64 ms', pct: 6, color: '#4AD991' },
                    { label: 'Qdrant HNSW (1k vec)', ms: '27.82 ms', pct: 14, color: '#29A8B3' },
                    { label: 'Qdrant HNSW (100k vec)', ms: '198.75 ms', pct: 28, color: '#E6B422' },
                    { label: 'In-Memory Brute (100k vec)', ms: '1927.57 ms', pct: 100, color: '#C92A2A' },
                  ].map((bar) => (
                    <div key={bar.label} style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          marginBottom: '5px',
                        }}
                      >
                        <span>{bar.label}</span>
                        <strong style={{ color: bar.color }}>{bar.ms}</strong>
                      </div>
                      <div
                        style={{
                          height: '14px',
                          backgroundColor: 'rgba(15,17,22,0.45)',
                          borderRadius: '4px',
                          border: '1px solid rgba(243,234,211,0.28)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="latency-bar-fill"
                          style={{
                            width: `${bar.pct}%`,
                            height: '100%',
                            backgroundColor: bar.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  <div style={{ padding: '10px', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--ink)', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--ink-soft)' }}>LOCAL EMBEDDING</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>FastEmbed BGE-384d ($0)</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--ink)', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--ink-soft)' }}>INFRA COST</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '2px', color: 'var(--radar-olive)' }}>
                      $14.50 vs $385 SaaS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Comparison */}
      <section className="section-band grid-parchment">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="tilted-badge" style={{ backgroundColor: 'var(--crimson)', color: 'var(--on-dark)', marginBottom: '12px' }}>
              SECURITY &amp; ARCHITECTURE HARDENING AUDIT
            </span>
            <h2 className="section-heading">
              Why We Rebuilt{' '}
              <span className="section-heading-serif" style={{ color: 'var(--space-teal)' }}>
                the Legacy Baseline
              </span>
            </h2>
          </div>

          <div
            className="scroll-reveal-panel"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}
          >
            <div className="brutal-card" style={{ padding: '28px', backgroundColor: 'var(--bg-white)' }}>
              <span className="tilted-badge" style={{ backgroundColor: 'var(--ink)', color: 'var(--ochre)', marginBottom: '16px' }}>
                LEGACY BASELINE • OMNI-AGENT
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '16px' }}>
                Critical Security &amp; Concurrency Debt
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                {[
                  'Vector DB wiped on every single request via delete_all_documents().',
                  'Global process.env.SELECTED_MODEL mutation caused race conditions across concurrent users.',
                  'Arbitrary stdio command injection allowed unprivileged bash execution on host.',
                  'Plaintext API secrets cached to .system_settings_cache.json on disk.',
                  'Zero output verification or human consent gate on automated web actions.',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--ink-soft)' }}>
                    <AlertTriangle size={17} style={{ color: 'var(--crimson)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="brutal-card grid-teal"
              style={{ padding: '28px', color: 'var(--on-dark)', position: 'relative' }}
            >
              <div
                className="seal-badge spin-seal"
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '76px',
                  height: '76px',
                  backgroundColor: 'var(--ochre)',
                  color: 'var(--ink)',
                  fontSize: '10px',
                }}
              >
                <span>0 HOST</span>
                <span>RCE</span>
              </div>

              <span className="tilted-badge" style={{ backgroundColor: 'var(--crimson)', color: 'var(--on-dark)', marginBottom: '16px' }}>
                THE MCPPRO BREAKTHROUGH
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', fontWeight: 800, marginBottom: '16px', paddingRight: '86px' }}>
                Hardened Multi-Agent &amp; Zero-Trust MCP
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                {[
                  'Supabase RLS tenant isolation + scoped Qdrant document_id metadata filtering.',
                  'Immutable per-request context via AsyncLocalStorage + Next.js Edge middleware.',
                  'Admin-only command whitelist [npx, node, python, uvx] + SSRF 169.254.169.254 guard.',
                  'Binary magic-byte file verification + Client-Side Browser BYOK Key Vault.',
                  'Pyodide browser WASM sandbox + Visual HITL Gate + Consensus Verifier Council.',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={17} style={{ color: 'var(--ochre)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Call to action */}
      <section className="section-band section-band--ochre" style={{ textAlign: 'center' }}>
        <div className="container">
          <span
            className="tilted-badge"
            style={{ backgroundColor: 'var(--crimson)', color: 'var(--on-dark)', transform: 'rotate(-2deg)', marginBottom: '16px' }}
          >
            OPEN PROTOCOL • READY FOR DEPLOYMENT
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-condensed)',
              fontSize: 'clamp(46px, 6.8vw, 86px)',
              lineHeight: 0.94,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              maxWidth: '920px',
              margin: '0 auto 16px',
            }}
          >
            LAUNCH YOUR AUTONOMOUS AGENT STUDIO
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 26px', fontSize: '16px', fontWeight: 600, color: 'var(--ink-soft)' }}>
            Chat across 514 frontier &amp; open models, upload documents into the Qdrant RAG engine, run Python in
            browser WebAssembly, and connect custom MCP servers.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <button
              type="button"
              className="brutal-btn brutal-btn--noir brutal-btn--pill"
              onClick={() => onNavigate('studio')}
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              <Sparkles size={16} /> Launch Chat Studio <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              className="brutal-btn brutal-btn--parchment brutal-btn--pill"
              onClick={() => onNavigate('mcp')}
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              <Terminal size={16} /> Connect Custom MCP Server <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
