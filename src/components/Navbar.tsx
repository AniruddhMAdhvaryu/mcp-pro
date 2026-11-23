import { ArrowUpRight, KeyRound, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { PageId } from '../data/mcpproData';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenKeys: () => void;
  configuredKeyCount: number;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'studio', label: 'Chat Studio' },
  { id: 'workbench', label: 'Workbench' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'mcp', label: 'MCP Hub' },
  { id: 'benchmarks', label: 'Benchmarks' },
];

export function Navbar({ activePage, onNavigate, onOpenKeys, configuredKeyCount }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="top-navbar">
      <div className="container top-navbar__inner">
        <button
          type="button"
          className="brand-lockup"
          onClick={() => handleNav('home')}
          aria-label="MCPPro Home"
        >
          {/* Hexagonal MCPPro Logo Mark */}
          <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
            <rect x="2" y="2" width="36" height="36" rx="9" fill="#1A233A" stroke="#131315" strokeWidth="2.5" />
            <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" fill="none" stroke="#E6B422" strokeWidth="1.8" />
            <line x1="20" y1="8" x2="20" y2="32" stroke="#29A8B3" strokeWidth="1.3" opacity="0.7" />
            <line x1="10" y1="14" x2="30" y2="26" stroke="#29A8B3" strokeWidth="1.3" opacity="0.7" />
            <line x1="30" y1="14" x2="10" y2="26" stroke="#29A8B3" strokeWidth="1.3" opacity="0.7" />
            <circle cx="20" cy="20" r="4.2" fill="#E87A24" stroke="#131315" strokeWidth="1.5" />
            <circle cx="20" cy="8" r="2.5" fill="#29A8B3" />
            <circle cx="30" cy="14" r="2.5" fill="#C92A2A" />
            <circle cx="30" cy="26" r="2.5" fill="#E6B422" />
            <circle cx="20" cy="32" r="2.5" fill="#29A8B3" />
            <circle cx="10" cy="26" r="2.5" fill="#C92A2A" />
            <circle cx="10" cy="14" r="2.5" fill="#E6B422" />
          </svg>
          <span className="brand-wordmark">MCPPRO</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-sub">
            Agentic RAG &amp;
            <br />
            MCP Platform
          </span>
        </button>

        <nav className="nav-links" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`nav-link-btn ${activePage === item.id ? 'nav-link-btn--active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            RAG Engine Online
          </span>
          <button
            type="button"
            className="brutal-btn brutal-btn--parchment brutal-btn--pill"
            onClick={onOpenKeys}
            title="Client-Side API Key Vault"
            style={{ padding: '8px 13px', fontSize: '12px' }}
          >
            <KeyRound size={14} />
            <span>{configuredKeyCount > 0 ? `${configuredKeyCount} Keys` : 'API Keys'}</span>
          </button>
          <button
            type="button"
            className="brutal-btn brutal-btn--crimson brutal-btn--pill"
            onClick={() => handleNav('studio')}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <span>Chat Studio</span>
            <ArrowUpRight size={15} />
          </button>
          <button
            type="button"
            className="brutal-btn brutal-btn--parchment"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            style={{ padding: '8px', display: 'none' }}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-parchment)',
            borderBottom: 'var(--border-ink)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 70,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`nav-link-btn ${activePage === item.id ? 'nav-link-btn--active' : ''}`}
              style={{ textAlign: 'left' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
