import { ArrowUpRight } from 'lucide-react';
import type { PageId, WorkbenchTab } from '../data/mcpproData';

interface FooterProps {
  onNavigate: (page: PageId, tab?: WorkbenchTab) => void;
  onOpenKeys: () => void;
}

export function Footer({ onNavigate, onOpenKeys }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '34px',
                  letterSpacing: '0.06em',
                  color: 'var(--ochre)',
                }}
              >
                MCPPRO
              </span>
              <span
                style={{
                  backgroundColor: 'var(--crimson)',
                  color: 'var(--on-dark)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                MCP 2025+
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--on-dark-muted)', lineHeight: 1.65, maxWidth: '340px' }}>
              Model Context Protocol &amp; frontier AI orchestration platform combining semantic vector RAG, browser
              WebAssembly execution, and governed web automation.
            </p>
            <button
              type="button"
              className="brutal-btn brutal-btn--ochre brutal-btn--pill"
              onClick={() => onNavigate('studio')}
              style={{ marginTop: '18px', padding: '9px 18px', fontSize: '13px' }}
            >
              Launch Chat Studio <ArrowUpRight size={15} />
            </button>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            {(
              [
                ['studio', 'Chat Studio'],
                ['workbench', '4-Mode Workbench'],
                ['mcp', 'MCP Hub & Playground'],
                ['benchmarks', 'Vector Benchmarks'],
              ] as [PageId, string][]
            ).map(([id, label]) => (
              <button key={id} type="button" className="footer-link" onClick={() => onNavigate(id)}>
                {label}
              </button>
            ))}
          </div>

          <div>
            <div className="footer-col-title">Frontier Models</div>
            {['Anthropic Claude 3.7', 'OpenAI GPT-4o & o3', 'Google Gemini 2.0', 'Groq LPU & DeepSeek R1'].map(
              (label) => (
                <button key={label} type="button" className="footer-link" onClick={() => onNavigate('studio')}>
                  {label}
                </button>
              )
            )}
          </div>

          <div>
            <div className="footer-col-title">Architecture</div>
            <button type="button" className="footer-link" onClick={() => onNavigate('mcp')}>
              Model Context Protocol
            </button>
            <button type="button" className="footer-link" onClick={() => onNavigate('architecture')}>
              Semantic Vector RAG
            </button>
            <button type="button" className="footer-link" onClick={() => onNavigate('workbench', 'wasm-canvas')}>
              Pyodide WASM Sandbox
            </button>
            <button type="button" className="footer-link" onClick={onOpenKeys}>
              Client-Side BYOK Vault
            </button>
          </div>
        </div>

        <div
          style={{
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--on-dark-muted)',
          }}
        >
          <span>© 2026 MCPPRO. All rights reserved.</span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '16px',
              color: 'var(--ochre)',
              letterSpacing: '0.03em',
            }}
          >
            SEE YOU IN THE LATENT SPACE...
          </span>
        </div>
      </div>
    </footer>
  );
}
