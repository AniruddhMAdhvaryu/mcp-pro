import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Zap,
  Cpu,
  ShieldAlert,
  GitCompare,
  Play,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Terminal,
  PlusCircle,
  AlertTriangle,
  MinusCircle,
  RefreshCw,
} from 'lucide-react';
import {
  LAB_SCENARIOS,
  WASM_PRESETS,
  DIFF_PRESETS,
  type WorkbenchTab,
} from '../data/mcpproData';

interface WorkbenchPageProps {
  initialTab: WorkbenchTab;
}

export function WorkbenchPage({ initialTab }: WorkbenchPageProps) {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>(initialTab);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [selectedScenario, setSelectedScenario] = useState(0);
  const [customQuery, setCustomQuery] = useState(LAB_SCENARIOS[0].prompt);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(4);
  const [isRunningDag, setIsRunningDag] = useState(false);

  const [wasmIdx, setWasmIdx] = useState(0);
  const [codeValue, setCodeValue] = useState(WASM_PRESETS[0].code);
  const [wasmOutput, setWasmOutput] = useState(WASM_PRESETS[0].mockStdout);
  const [wasmRunKey, setWasmRunKey] = useState(0);

  const [hitlState, setHitlState] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [hitlAuditLog, setHitlAuditLog] = useState<string[]>([
    '[00:00.12] Playwright navigated to https://portal.vendor-compliance.io/renewals/2026',
    '[00:00.68] Extracted Certificate #ISO-27001-884 (Valid through Dec 2026)',
    '[00:00.72] INTERCEPTED sensitive action: submit → button[data-action="confirm-submit"]',
    '[00:00.74] Execution paused. Awaiting cryptographic user decision...',
  ]);

  const [diffIdx, setDiffIdx] = useState(0);
  const [copiedDiff, setCopiedDiff] = useState(false);

  const scenario = LAB_SCENARIOS[selectedScenario];
  const wasmPreset = WASM_PRESETS[wasmIdx];
  const diffPreset = DIFF_PRESETS[diffIdx];

  useGSAP(
    () => {
      gsap.from('.wb-panel-anim', {
        y: 16,
        autoAlpha: 0,
        duration: 0.34,
        ease: 'power2.out',
      });
    },
    { scope: wrapRef, dependencies: [activeTab] }
  );

  useGSAP(
    () => {
      if (activeTab !== 'wasm-canvas') return;
      gsap.from('.wasm-bar-fill', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
    { scope: wrapRef, dependencies: [wasmRunKey, activeTab] }
  );

  const runFlightDeck = () => {
    setIsRunningDag(true);
    setActiveStepIdx(0);
    scenario.dagSteps.forEach((_, idx) => {
      window.setTimeout(() => {
        setActiveStepIdx(idx + 1);
        if (idx === scenario.dagSteps.length - 1) setIsRunningDag(false);
      }, (idx + 1) * 400);
    });
  };

  const runWasmSandbox = () => {
    if (wasmPreset.language === 'javascript') {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
          warn: (...args: unknown[]) => logs.push('[WARN] ' + args.map(String).join(' ')),
          error: (...args: unknown[]) => logs.push('[ERROR] ' + args.map(String).join(' ')),
        };
        const t0 = performance.now();
        const fn = new Function('console', codeValue);
        fn(customConsole);
        const dt = Math.max(1, Math.round(performance.now() - t0));
        setWasmOutput(
          `[Live Browser Sandbox Executed in ${dt}ms — 0 Server Calls]\n` +
            (logs.join('\n') || 'Executed cleanly with no console output.')
        );
      } catch (err: unknown) {
        setWasmOutput(`[Sandbox Error]\n${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setWasmOutput(wasmPreset.mockStdout);
    }
    setWasmRunKey((k) => k + 1);
  };

  const handleHitlDecision = (decision: 'approved' | 'rejected') => {
    setHitlState(decision);
    const ts = new Date().toLocaleTimeString();
    if (decision === 'approved') {
      setHitlAuditLog((prev) => [
        ...prev,
        `[${ts}] POST /api/hitl/decision -> APPROVED by authenticated user`,
        `[${ts}] Security ticket verified. Browser resumed and completed renewal confirmation.`,
      ]);
    } else {
      setHitlAuditLog((prev) => [
        ...prev,
        `[${ts}] POST /api/hitl/decision -> REJECTED by user`,
        `[${ts}] Destructive submission aborted. Agent switched to read-only PDF export fallback.`,
      ]);
    }
  };

  const resetHitl = () => {
    setHitlState('pending');
    setHitlAuditLog([
      '[00:00.12] Playwright navigated to https://portal.vendor-compliance.io/renewals/2026',
      '[00:00.68] Extracted Certificate #ISO-27001-884 (Valid through Dec 2026)',
      '[00:00.72] INTERCEPTED sensitive action: submit → button[data-action="confirm-submit"]',
      '[00:00.74] Execution paused. Awaiting cryptographic user decision...',
    ]);
  };

  const handleCopyDiff = () => {
    const report = `MCPPRO SEMANTIC DIFF REPORT (${diffPreset.riskLevel.toUpperCase()} RISK)\n${diffPreset.docA} vs ${diffPreset.docB}\n\n${diffPreset.analysis}`;
    navigator.clipboard?.writeText(report).catch(() => {});
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 1800);
  };

  return (
    <div ref={wrapRef} className="grid-parchment" style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '36px 0 72px' }}>
      <div className="container">
        <div
          className="brutal-card grid-noir crt-scanlines"
          style={{ padding: '26px 30px', color: 'var(--on-dark)', marginBottom: '26px' }}
        >
          <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)', marginBottom: '10px' }}>
            MCPPRO WORKBENCH • 4 INTERACTIVE ENGINES
          </span>
          <h1 className="section-heading" style={{ color: 'var(--on-dark)', marginBottom: '6px' }}>
            Autonomous Multi-Agent{' '}
            <span className="section-heading-serif" style={{ color: 'var(--ochre)' }}>
              Live Workbench
            </span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--on-dark-muted)' }}>
            Test live intent routing, Pyodide browser WebAssembly execution, Playwright HITL safety gates, and
            cross-document semantic diffing right in your browser.
          </p>
        </div>

        <div className="scenario-tabs">
          {(
            [
              ['flight-deck', '01', 'Agent Flight Deck', 'DAG + VERIFIER', Zap],
              ['wasm-canvas', '02', 'Pyodide WASM Canvas', '0% HOST RCE', Cpu],
              ['hitl-gate', '03', 'HITL Web Safety Gate', 'PLAYWRIGHT', ShieldAlert],
              ['doc-diff', '04', 'Semantic Doc Diff', 'CLAUSE AUDIT', GitCompare],
            ] as const
          ).map(([id, num, title, badge, Icon]) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`scenario-tab ${active ? 'scenario-tab--active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Icon size={13} /> MODE {num}
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
                    {badge}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '15px', marginTop: '4px' }}>{title}</div>
              </button>
            );
          })}
        </div>

        {/* MODE 01: FLIGHT DECK */}
        {activeTab === 'flight-deck' && (
          <div className="brutal-card wb-panel-anim" style={{ padding: '26px', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {LAB_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenario(idx);
                    setCustomQuery(sc.prompt);
                    setActiveStepIdx(4);
                  }}
                  className={`brutal-btn ${selectedScenario === idx ? 'brutal-btn--ochre' : 'brutal-btn--parchment'}`}
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                >
                  {sc.code}. {sc.shortTitle}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                aria-label="Agent Prompt Input"
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '12px 16px',
                  border: 'var(--border-ink)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg-parchment)',
                }}
              />
              <button type="button" className="brutal-btn brutal-btn--crimson" onClick={runFlightDeck} disabled={isRunningDag}>
                <Play size={15} fill="currentColor" />
                {isRunningDag ? 'Executing DAG...' : 'Run Autonomous Pipeline'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scenario.dagSteps.map((step, idx) => {
                  const done = activeStepIdx > idx;
                  const running = isRunningDag && activeStepIdx === idx;
                  return (
                    <div
                      key={step.id}
                      style={{
                        border: 'var(--border-ink)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        backgroundColor: done ? 'var(--bg-parchment)' : running ? 'var(--ochre)' : 'var(--bg-sand)',
                        boxShadow: done || running ? 'var(--shadow-sm)' : 'none',
                        opacity: done || running ? 1 : 0.55,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--space-teal)' }}>
                          NODE 0{idx + 1} • {step.role.toUpperCase()} — {step.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: done ? 'var(--radar-olive)' : 'var(--ink)',
                            color: 'var(--ochre)',
                          }}
                        >
                          {done ? `${step.ms}ms ✓` : running ? 'RUNNING...' : 'QUEUED'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{step.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  border: 'var(--border-ink)',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-sand)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="tilted-badge" style={{ backgroundColor: 'var(--radar-olive)', color: 'var(--mint)' }}>
                      <CheckCircle2 size={13} /> VERIFIED BY AGENT COUNCIL
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                      S_c = {scenario.consensusScore.toFixed(2)}
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '14px' }}>
                    {activeStepIdx >= 4
                      ? scenario.synthesis
                      : 'Streaming intermediate agent annotations and awaiting Consensus Verifier cross-examination...'}
                  </p>

                  <pre
                    style={{
                      backgroundColor: 'var(--bg-obsidian)',
                      color: 'var(--ochre)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      overflowX: 'auto',
                    }}
                  >
                    {scenario.mcpPayload}
                  </pre>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {scenario.citations.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'var(--bg-white)',
                        border: '1.5px solid var(--ink)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      Source: {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 02: PYODIDE WASM SANDBOX */}
        {activeTab === 'wasm-canvas' && (
          <div className="brutal-card wb-panel-anim" style={{ padding: '26px', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WASM_PRESETS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setWasmIdx(idx);
                      setCodeValue(p.code);
                      setWasmOutput(p.mockStdout);
                      setWasmRunKey((k) => k + 1);
                    }}
                    className={`brutal-btn ${wasmIdx === idx ? 'brutal-btn--crimson' : 'brutal-btn--parchment'}`}
                    style={{ padding: '7px 14px', fontSize: '12px' }}
                  >
                    {p.title} ({p.language.toUpperCase()})
                  </button>
                ))}
              </div>
              <button type="button" className="brutal-btn brutal-btn--radar" onClick={runWasmSandbox}>
                <Play size={14} fill="currentColor" /> Run in Browser WASM
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div>
                <div
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'var(--noir-navy)',
                    color: 'var(--ochre)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    border: 'var(--border-ink)',
                  }}
                >
                  EDITOR • {wasmPreset.language.toUpperCase()} (ISOLATED CLIENT SANDBOX)
                </div>
                <textarea
                  value={codeValue}
                  onChange={(e) => setCodeValue(e.target.value)}
                  rows={12}
                  aria-label="WASM Code Editor"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'var(--bg-obsidian)',
                    color: '#E5E7EB',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.55,
                    border: 'var(--border-ink)',
                    borderTop: 'none',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    border: 'var(--border-ink)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-obsidian)',
                    color: '#4AD991',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'var(--radar-olive)',
                      color: 'var(--ochre)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Terminal size={13} /> STDOUT / STDERR CONSOLE (0 HOST CALLS)
                  </div>
                  <pre style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', lineHeight: 1.55, whiteSpace: 'pre-wrap', minHeight: '130px' }}>
                    {wasmOutput}
                  </pre>
                </div>

                <div style={{ border: 'var(--border-ink)', borderRadius: '10px', padding: '16px', backgroundColor: 'var(--bg-parchment)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                    CANVAS VISUALIZATION • {wasmPreset.chartTitle}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {wasmPreset.chartBars.map((bar) => (
                      <div key={bar.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700 }}>{bar.label}</span>
                          <span style={{ fontWeight: 700 }}>{bar.display}</span>
                        </div>
                        <div style={{ height: '16px', backgroundColor: 'var(--bg-white)', border: '1.5px solid var(--ink)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div className="wasm-bar-fill" style={{ width: `${bar.value}%`, height: '100%', backgroundColor: bar.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 03: HITL SAFETY GATE */}
        {activeTab === 'hitl-gate' && (
          <div className="brutal-card wb-panel-anim" style={{ padding: '26px', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              <div
                style={{
                  border: '2.5px solid var(--ink)',
                  borderRadius: '14px',
                  backgroundColor: hitlState === 'approved' ? '#DCFCE7' : hitlState === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                  padding: '20px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    className="tilted-badge"
                    style={{
                      backgroundColor: hitlState === 'approved' ? 'var(--radar-olive)' : 'var(--crimson)',
                      color: 'var(--on-dark)',
                    }}
                  >
                    <ShieldAlert size={13} />
                    {hitlState === 'pending'
                      ? 'SAFETY GATE • APPROVAL REQUIRED'
                      : hitlState === 'approved'
                      ? 'ACTION APPROVED'
                      : 'ACTION REJECTED'}
                  </span>
                  <button
                    type="button"
                    onClick={resetHitl}
                    style={{
                      background: 'var(--bg-white)',
                      border: '1.5px solid var(--ink)',
                      borderRadius: '6px',
                      padding: '4px 9px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RefreshCw size={11} /> Reset Gate
                  </button>
                </div>

                <div
                  className="grid-noir crt-scanlines"
                  style={{
                    border: 'var(--border-ink)',
                    borderRadius: '10px',
                    padding: '16px',
                    color: 'var(--on-dark)',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--ochre)' }}>
                    <span>URL: https://portal.vendor-compliance.io/renewals/2026</span>
                    <span>1280×720</span>
                  </div>
                  <div
                    style={{
                      backgroundColor: 'var(--bg-parchment)',
                      color: 'var(--ink)',
                      border: '2px solid var(--ink)',
                      borderRadius: '8px',
                      padding: '14px',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>Vendor Certificate ISO-27001-884 Renewal</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginBottom: '12px' }}>
                      Submitting commits annual compliance attestation and triggers billing invoice ($4,200).
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 14px',
                        backgroundColor: 'var(--crimson)',
                        color: 'var(--on-dark)',
                        fontWeight: 700,
                        border: '2px dashed var(--ochre)',
                        borderRadius: '6px',
                      }}
                    >
                      [TARGET SELECTOR] Confirm &amp; Submit Renewal
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="brutal-btn brutal-btn--radar"
                    style={{ flex: 1 }}
                    disabled={hitlState !== 'pending'}
                    onClick={() => handleHitlDecision('approved')}
                  >
                    <CheckCircle2 size={15} /> Approve Action
                  </button>
                  <button
                    type="button"
                    className="brutal-btn brutal-btn--crimson"
                    style={{ flex: 1 }}
                    disabled={hitlState !== 'pending'}
                    onClick={() => handleHitlDecision('rejected')}
                  >
                    <XCircle size={15} /> Reject &amp; Reroute
                  </button>
                </div>
              </div>

              <div
                style={{
                  border: 'var(--border-ink)',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-obsidian)',
                  color: 'var(--on-dark)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ochre)', marginBottom: '12px' }}>
                    HITL GOVERNANCE AUDIT LOG • /api/hitl/decision
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.5 }}>
                    {hitlAuditLog.map((line, i) => (
                      <div key={i} style={{ color: line.includes('APPROVED') ? '#4AD991' : line.includes('REJECTED') ? '#F87171' : '#E5E7EB' }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '16px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--on-dark-muted)',
                  }}
                >
                  Safety Policy: Playwright actions of type <strong>submit</strong>, <strong>delete</strong>, or{' '}
                  <strong>download</strong> cannot execute without a signed human approval event.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 04: SEMANTIC DOC DIFF */}
        {activeTab === 'doc-diff' && (
          <div className="brutal-card wb-panel-anim" style={{ padding: '26px', backgroundColor: 'var(--bg-white)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {DIFF_PRESETS.map((dp, idx) => (
                  <button
                    key={dp.id}
                    type="button"
                    onClick={() => setDiffIdx(idx)}
                    className={`brutal-btn ${diffIdx === idx ? 'brutal-btn--noir' : 'brutal-btn--parchment'}`}
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    {dp.docA.split(' ')[0]} vs {dp.docB.split(' ')[0]}
                  </button>
                ))}
              </div>
              <button type="button" className="brutal-btn brutal-btn--ochre" onClick={handleCopyDiff} style={{ padding: '8px 16px', fontSize: '12px' }}>
                {copiedDiff ? <Check size={14} /> : <Copy size={14} />}
                {copiedDiff ? 'Report Copied!' : 'Copy Diff Report'}
              </button>
            </div>

            <div
              style={{
                padding: '16px 20px',
                border: 'var(--border-ink)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-parchment)',
                marginBottom: '18px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                  BASE: {diffPreset.docA} &nbsp;→&nbsp; TARGET: {diffPreset.docB}
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '6px' }}>{diffPreset.analysis}</p>
              </div>
              <span
                className="tilted-badge"
                style={{
                  backgroundColor: diffPreset.riskLevel === 'high' ? 'var(--crimson)' : 'var(--ochre)',
                  color: diffPreset.riskLevel === 'high' ? 'var(--on-dark)' : 'var(--ink)',
                }}
              >
                RISK GRADE: {diffPreset.riskLevel.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ border: 'var(--border-ink)', borderRadius: '12px', padding: '16px', backgroundColor: '#DCFCE7' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--radar-olive)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <PlusCircle size={15} /> ADDED CLAUSES ({diffPreset.additions.length})
                </div>
                {diffPreset.additions.map((a) => (
                  <div key={a.clause} style={{ marginBottom: '10px', fontSize: '13px' }}>
                    <strong>{a.clause}</strong>
                    <div style={{ color: 'var(--ink-soft)', marginTop: '2px' }}>{a.detail}</div>
                  </div>
                ))}
              </div>

              <div style={{ border: 'var(--border-ink)', borderRadius: '12px', padding: '16px', backgroundColor: '#FEF3C7' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <AlertTriangle size={15} /> MODIFIED CLAUSES ({diffPreset.modifications.length})
                </div>
                {diffPreset.modifications.map((m) => (
                  <div key={m.clause} style={{ marginBottom: '10px', fontSize: '13px' }}>
                    <strong>{m.clause}</strong>
                    <div style={{ color: 'var(--ink-soft)', marginTop: '2px' }}>{m.detail}</div>
                  </div>
                ))}
              </div>

              <div style={{ border: 'var(--border-ink)', borderRadius: '12px', padding: '16px', backgroundColor: '#FEE2E2' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <MinusCircle size={15} /> DELETED CLAUSES ({diffPreset.deletions.length})
                </div>
                {diffPreset.deletions.map((d) => (
                  <div key={d.clause} style={{ marginBottom: '10px', fontSize: '13px' }}>
                    <strong>{d.clause}</strong>
                    <div style={{ color: 'var(--ink-soft)', marginTop: '2px' }}>{d.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
