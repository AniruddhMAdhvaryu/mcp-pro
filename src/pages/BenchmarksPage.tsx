import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BENCHMARK_STORAGE_ROWS, GAP_AUDIT_ROWS, MODEL_PROVIDERS } from '../data/mcpproData';

const SCALE_DATA = {
  '100': { memLat: 21.88, qLat: 3.64, speedup: '6.0x faster' },
  '1k': { memLat: 187.07, qLat: 27.82, speedup: '6.7x faster' },
  '100k': { memLat: 1927.57, qLat: 198.75, speedup: '9.7x faster' },
} as const;

export function BenchmarksPage() {
  const [scale, setScale] = useState<'100' | '1k' | '100k'>('100k');
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = SCALE_DATA[scale];

  useGSAP(
    () => {
      gsap.from('.bench-bar', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    },
    { scope: wrapRef, dependencies: [scale] }
  );

  return (
    <div ref={wrapRef} className="grid-parchment" style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '36px 0 72px' }}>
      <div className="container">
        <div
          className="brutal-card"
          style={{ padding: '28px 32px', backgroundColor: 'var(--ochre)', marginBottom: '26px' }}
        >
          <span className="tilted-badge" style={{ backgroundColor: 'var(--noir-navy)', color: 'var(--ochre)', marginBottom: '10px' }}>
            EMPIRICAL RESULTS • 115 QUERIES / 30 DOCUMENTS
          </span>
          <h1 className="section-heading" style={{ marginBottom: '8px' }}>
            Benchmarks, Security Audit &amp;{' '}
            <span className="section-heading-serif">Model Coverage</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
            Quantitative performance comparison across vector store scales, retrieval accuracy, token economics,
            and production security hardening.
          </p>
        </div>

        {/* Interactive Vector Scale Explorer */}
        <div className="brutal-card" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800 }}>
                Vector Latency Scaling: In-Memory vs. Qdrant HNSW
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                Toggle corpus size to compare mean query latency in milliseconds.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['100', '1k', '100k'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScale(s)}
                  className={`brutal-btn ${scale === s ? 'brutal-btn--noir' : 'brutal-btn--parchment'}`}
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                >
                  {s} Vectors
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span>InMemoryVectorStore ({scale} vectors)</span>
                <span style={{ color: 'var(--crimson)' }}>{current.memLat} ms</span>
              </div>
              <div style={{ height: '24px', backgroundColor: 'var(--bg-sand)', border: 'var(--border-ink)', borderRadius: '6px', overflow: 'hidden' }}>
                <div className="bench-bar" style={{ width: '100%', height: '100%', backgroundColor: 'var(--crimson)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Qdrant HNSW ({scale} vectors) — {current.speedup}</span>
                <span style={{ color: 'var(--space-teal)' }}>{current.qLat} ms</span>
              </div>
              <div style={{ height: '24px', backgroundColor: 'var(--bg-sand)', border: 'var(--border-ink)', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  className="bench-bar"
                  style={{
                    width: `${Math.max(8, (current.qLat / current.memLat) * 100)}%`,
                    height: '100%',
                    backgroundColor: 'var(--space-teal)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="brutal-table-wrap">
            <table className="brutal-table">
              <thead>
                <tr>
                  <th>Storage Metric</th>
                  <th>Other Mem (100)</th>
                  <th>Other Mem (1k)</th>
                  <th>Other Mem (100k)</th>
                  <th>Qdrant (100)</th>
                  <th>Qdrant (1k)</th>
                  <th>Qdrant (100k)</th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARK_STORAGE_ROWS.map((row) => (
                  <tr key={row.metric}>
                    <td><strong>{row.metric}</strong></td>
                    <td>{row.mem100}</td>
                    <td>{row.mem1k}</td>
                    <td>{row.mem100k}</td>
                    <td style={{ fontWeight: 700, color: 'var(--space-teal)' }}>{row.q100}</td>
                    <td style={{ fontWeight: 700, color: 'var(--space-teal)' }}>{row.q1k}</td>
                    <td style={{ fontWeight: 700, color: 'var(--space-teal)' }}>{row.q100k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Architecture Audit Table */}
        <div className="brutal-card" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>
            Legacy Baseline vs. MCPPRO Security &amp; Architecture Remediation
          </h2>
          <div className="brutal-table-wrap">
            <table className="brutal-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Legacy Baseline Flaw</th>
                  <th>MCPPRO Hardened Architecture</th>
                </tr>
              </thead>
              <tbody>
                {GAP_AUDIT_ROWS.map((row) => (
                  <tr key={row.dimension}>
                    <td><strong>{row.dimension}</strong></td>
                    <td style={{ color: 'var(--crimson)' }}>{row.omni}</td>
                    <td style={{ color: 'var(--radar-olive)', fontWeight: 600 }}>{row.mcppro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 2-Column: 514-Model Provider Catalog + Experimental Environment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="brutal-card" style={{ padding: '22px', backgroundColor: 'var(--bg-white)' }}>
            <span className="tilted-badge" style={{ backgroundColor: 'var(--space-teal)', color: 'var(--on-dark)', marginBottom: '12px' }}>
              514 MODELS • 6 PROVIDERS
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
              Supported Frontier &amp; Open Catalog
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MODEL_PROVIDERS.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-parchment)',
                    border: '1.5px solid var(--ink)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)' }}>{p.subtitle}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--crimson)' }}>{p.modelCount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="brutal-card grid-noir crt-scanlines" style={{ padding: '22px', color: 'var(--on-dark)' }}>
            <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)', marginBottom: '12px' }}>
              TEST ENVIRONMENT &amp; COST ECONOMICS
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--on-dark)', marginBottom: '12px' }}>
              Production Evaluation Specs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', lineHeight: 1.55, color: 'var(--on-dark-muted)' }}>
              <div>
                <strong style={{ color: 'var(--ochre)' }}>Golden Evaluation Suite:</strong> 30 heterogeneous documents
                (PDF, DOCX, PPTX, XLSX, TXT, MD, PNG) tested across 115 multi-turn queries.
              </div>
              <div>
                <strong style={{ color: 'var(--ochre)' }}>Automated Coverage:</strong> 61/61 passing tests — 31 backend,
                21 frontend integration, and 9 end-to-end flows.
              </div>
              <div>
                <strong style={{ color: 'var(--ochre)' }}>Zero-Cost Compute Offload:</strong> Local CPU FastEmbed ONNX
                (<code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ochre)' }}>bge-small-en-v1.5</code>) + client browser Pyodide WASM remove managed embedding &amp; sandbox server costs.
              </div>
              <div>
                <strong style={{ color: 'var(--ochre)' }}>Monthly Expenditure:</strong> Reduced from $385.00/mo commercial
                SaaS stack to $14.50/mo (96.2% infrastructure savings).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
