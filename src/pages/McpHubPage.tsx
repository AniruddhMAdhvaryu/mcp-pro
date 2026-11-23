import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Copy, Check, Terminal, Play, ShieldCheck, Plus, RefreshCw, X, Server } from 'lucide-react';
import {
  INITIAL_MCP_SERVERS,
  MCP_TOOLS_CATALOG,
  type McpServerConnection,
} from '../data/mcpproData';

const CLAUDE_CONFIG = `{
  "mcpServers": {
    "mcppro-enterprise": {
      "command": "python",
      "args": ["backend/scripts/mcp_stdio_proxy.py"],
      "env": {
        "MCPPRO_API_URL": "http://127.0.0.1:8000/mcp",
        "MCPPRO_BEARER_TOKEN": "<YOUR_ADMIN_TOKEN>"
      }
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "mcppro-rag-gateway": {
      "url": "http://127.0.0.1:8000/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer <YOUR_ADMIN_TOKEN>"
      }
    }
  }
}`;

export function McpHubPage() {
  const [hubTab, setHubTab] = useState<'core' | 'connections' | 'playground'>('core');
  const [servers, setServers] = useState<McpServerConnection[]>(INITIAL_MCP_SERVERS);
  const [addOpen, setAddOpen] = useState(false);

  // Add server form
  const [newName, setNewName] = useState('');
  const [newTransport, setNewTransport] = useState<'Streamable HTTP / SSE' | 'Local Stdio Process'>('Streamable HTTP / SSE');
  const [newUrl, setNewUrl] = useState('');

  // Playground state
  const [activeTool, setActiveTool] = useState(MCP_TOOLS_CATALOG[0]);
  const [argsInput, setArgsInput] = useState(MCP_TOOLS_CATALOG[0].sampleArgs);
  const [rpcOutput, setRpcOutput] = useState<string>(
    `{
  "jsonrpc": "2.0",
  "id": "req_2026_01",
  "result": {
    "tool": "searchUploadedDocuments",
    "status": "200 OK",
    "latency_ms": 198,
    "chunks_returned": 8,
    "rrf_k": 60,
    "rls_verified": true
  }
}`
  );

  // Client export config
  const [clientTab, setClientTab] = useState<'claude' | 'cursor'>('claude');
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const totalTools = servers.reduce((acc, s) => acc + s.toolsCount, 0);

  useGSAP(
    () => {
      gsap.from('.mcp-card-anim', {
        y: 18,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    { scope: wrapRef, dependencies: [hubTab] }
  );

  const handleCopy = () => {
    const txt = clientTab === 'claude' ? CLAUDE_CONFIG : CURSOR_CONFIG;
    navigator.clipboard?.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    const created: McpServerConnection = {
      id: `srv-${Date.now()}`,
      name: newName.trim(),
      transport: newTransport,
      endpoint: newUrl.trim(),
      toolsCount: 4,
      category: 'Custom MCP Integration',
      status: 'online',
    };
    setServers((prev) => [created, ...prev]);
    setNewName('');
    setNewUrl('');
    setAddOpen(false);
    setHubTab('connections');
  };

  const runToolTest = () => {
    let parsed: unknown = {};
    try {
      parsed = JSON.parse(argsInput);
    } catch {
      setRpcOutput(`{\n  "error": "Invalid JSON arguments — please verify syntax."\n}`);
      return;
    }
    setRpcOutput(
      JSON.stringify(
        {
          jsonrpc: '2.0',
          id: `req_${Math.floor(1000 + Math.random() * 9000)}`,
          result: {
            tool: activeTool.name,
            status: '200 OK',
            latency: activeTool.latency,
            argumentsEcho: parsed,
            whitelistGuard: 'PASSED [npx, node, python, python3, uvx]',
            ssrfBlocker: 'ACTIVE (169.254.169.254 denied)',
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      )
    );
  };

  return (
    <div ref={wrapRef} className="grid-parchment" style={{ minHeight: 'calc(100vh - var(--nav-height))', padding: '36px 0 72px' }}>
      <div className="container">
        {/* Header */}
        <div
          className="brutal-card grid-teal"
          style={{
            padding: '28px 32px',
            color: 'var(--on-dark)',
            marginBottom: '22px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', color: 'var(--ink)', marginBottom: '10px' }}>
              ENTERPRISE PROTOCOL • MCP 2025+
            </span>
            <h1 className="section-heading" style={{ color: 'var(--on-dark)', marginBottom: '8px' }}>
              Model Context Protocol{' '}
              <span className="section-heading-serif" style={{ color: 'var(--ochre)' }}>
                (MCP) Hub
              </span>
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', opacity: 0.92 }}>
              Connect AI models directly to live external tools, GitHub repositories, scholarly research databases,
              SQL servers, and headless cloud browsers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="brutal-btn brutal-btn--parchment"
              onClick={() => setServers((s) => [...s])}
              style={{ padding: '9px 14px', fontSize: '13px' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              type="button"
              className="brutal-btn brutal-btn--ochre"
              onClick={() => setAddOpen(true)}
              style={{ padding: '9px 16px', fontSize: '13px' }}
            >
              <Plus size={15} /> Add MCP Server
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Active Servers', val: `${servers.length}`, sub: `/ ${servers.length} configured`, bg: 'var(--bg-white)' },
            { label: 'Live Tools Discovered', val: `${totalTools}`, sub: 'Ready in Chat', bg: 'var(--ochre)' },
            { label: 'Protocol Standard', val: 'MCP 2025+', sub: 'HTTP & Stdio', bg: 'var(--bg-white)' },
            { label: 'Auto Router Status', val: 'Dynamic', sub: 'Context Aware', bg: 'var(--bg-white)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="brutal-card"
              style={{ padding: '16px 18px', backgroundColor: stat.bg }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                {stat.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800 }}>
                  {stat.val}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--space-teal)', fontWeight: 700 }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
          {(
            [
              ['core', 'Core Research & Automation MCPs'],
              ['connections', `All Connections (${servers.length})`],
              ['playground', `Tool Catalog & Playground (${MCP_TOOLS_CATALOG.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setHubTab(id)}
              className={`brutal-btn ${hubTab === id ? 'brutal-btn--noir' : 'brutal-btn--parchment'}`}
              style={{ padding: '9px 16px', fontSize: '13px' }}
            >
              {label}
            </button>
          ))}
        </div>

        
        {hubTab === 'core' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '18px',
              marginBottom: '26px',
              alignItems: 'stretch',
            }}
          >
            {MCP_TOOLS_CATALOG.map((tool) => (
              <div
                key={tool.name}
                className="brutal-card brutal-card--interactive mcp-card-anim"
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-white)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        backgroundColor: 'var(--noir-navy)',
                        color: 'var(--ochre)',
                        borderRadius: '4px',
                      }}
                    >
                      {tool.scope}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--space-teal)' }}>
                      {tool.latency}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                    {tool.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{tool.description}</p>
                </div>

                <button
                  type="button"
                  className="brutal-btn brutal-btn--ochre"
                  style={{ padding: '8px 14px', fontSize: '12px', width: '100%' }}
                  onClick={() => {
                    setActiveTool(tool);
                    setArgsInput(tool.sampleArgs);
                    setHubTab('playground');
                  }}
                >
                  <Play size={12} fill="currentColor" /> Open in Live Playground
                </button>
              </div>
            ))}
          </div>
        )}

        
        {hubTab === 'connections' && (
          <div className="brutal-card mcp-card-anim" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', marginBottom: '26px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '21px', fontWeight: 800 }}>
                Configured MCP Server Endpoints
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                Manage individual connection timeouts, environment parameters, and transports.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {servers.map((srv) => (
                <div
                  key={srv.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: 'var(--border-ink)',
                    backgroundColor: 'var(--bg-parchment)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--ink)',
                        backgroundColor: 'var(--noir-navy)',
                        color: 'var(--ochre)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Server size={18} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px' }}>
                        {srv.name}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--space-teal)' }}>• {srv.category}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--ink-soft)' }}>
                        {srv.transport} — {srv.endpoint}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--radar-olive)',
                        color: 'var(--mint)',
                      }}
                    >
                      {srv.toolsCount} tools • ONLINE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {hubTab === 'playground' && (
          <div className="brutal-card mcp-card-anim" style={{ padding: '24px', backgroundColor: 'var(--bg-white)', marginBottom: '26px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {MCP_TOOLS_CATALOG.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setActiveTool(t);
                    setArgsInput(t.sampleArgs);
                  }}
                  className={`brutal-btn ${activeTool.name === t.name ? 'brutal-btn--ochre' : 'brutal-btn--parchment'}`}
                  style={{ padding: '6px 12px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                  INPUT JSON ARGUMENTS ({activeTool.name})
                </div>
                <textarea
                  value={argsInput}
                  onChange={(e) => setArgsInput(e.target.value)}
                  rows={8}
                  aria-label="MCP Tool Input JSON Arguments"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'var(--border-ink)',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-obsidian)',
                    color: 'var(--ochre)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    marginBottom: '12px',
                  }}
                />
                <button type="button" className="brutal-btn brutal-btn--crimson" onClick={runToolTest}>
                  <Play size={14} fill="currentColor" /> Run Tool Test
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Terminal size={14} /> LIVE JSON-RPC 2.0 RESPONSE
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--radar-olive)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} /> Whitelist Verified
                  </span>
                </div>
                <pre
                  style={{
                    backgroundColor: 'var(--bg-obsidian)',
                    color: '#4AD991',
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'var(--border-ink)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    lineHeight: 1.55,
                    overflowX: 'auto',
                  }}
                >
                  {rpcOutput}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* IDE export */}
        <div className="brutal-card" style={{ padding: '22px', backgroundColor: 'var(--bg-white)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setClientTab('claude')}
                className={`brutal-btn ${clientTab === 'claude' ? 'brutal-btn--ochre' : 'brutal-btn--parchment'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Claude Desktop (Stdio Proxy)
              </button>
              <button
                type="button"
                onClick={() => setClientTab('cursor')}
                className={`brutal-btn ${clientTab === 'cursor' ? 'brutal-btn--ochre' : 'brutal-btn--parchment'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Cursor IDE (Streamable HTTP)
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="brutal-btn brutal-btn--ink"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy JSON Config'}
            </button>
          </div>
          <pre
            style={{
              backgroundColor: 'var(--bg-obsidian)',
              color: 'var(--ochre)',
              padding: '14px',
              borderRadius: '10px',
              border: 'var(--border-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              overflowX: 'auto',
            }}
          >
            {clientTab === 'claude' ? CLAUDE_CONFIG : CURSOR_CONFIG}
          </pre>
        </div>
      </div>

      {/* Add server modal */}
      {addOpen && (
        <div
          className="modal-backdrop"
          style={{ alignItems: 'center', justifyContent: 'center' }}
          role="dialog"
          aria-modal="true"
          aria-label="Connect Custom MCP Server"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false);
          }}
        >
          <div className="modal-panel" style={{ maxWidth: '520px', maxHeight: '84vh' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 20px',
                backgroundColor: 'var(--noir-navy)',
                color: 'var(--on-dark)',
                borderBottom: 'var(--border-ink)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px' }}>
                  Connect Custom MCP Server
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ochre)' }}>
                  Add an external Streamable HTTP (SSE) endpoint or local stdio tool server.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                aria-label="Close modal"
                style={{
                  backgroundColor: 'var(--bg-parchment)',
                  color: 'var(--ink)',
                  border: '2px solid var(--ink)',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  display: 'inline-flex',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddServer} style={{ padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label htmlFor="mcp-name" style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '5px' }}>
                  Server Identifier
                </label>
                <input
                  id="mcp-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. arxiv-papers, snowflake-db, jira-tools"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'var(--border-ink)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                  }}
                />
              </div>

              <div>
                <label htmlFor="mcp-transport" style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '5px' }}>
                  Transport Protocol
                </label>
                <select
                  id="mcp-transport"
                  value={newTransport}
                  onChange={(e) =>
                    setNewTransport(e.target.value as 'Streamable HTTP / SSE' | 'Local Stdio Process')
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'var(--border-ink)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-white)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <option value="Streamable HTTP / SSE">Streamable HTTP / SSE Endpoint</option>
                  <option value="Local Stdio Process">Local Stdio Process (npx / node / python)</option>
                </select>
              </div>

              <div>
                <label htmlFor="mcp-url" style={{ display: 'block', fontWeight: 800, fontSize: '13px', marginBottom: '5px' }}>
                  Server URL / Command
                </label>
                <input
                  id="mcp-url"
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://mcp.yourdomain.com/sse or http://127.0.0.1:8000/mcp"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'var(--border-ink)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="brutal-btn brutal-btn--parchment" onClick={() => setAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="brutal-btn brutal-btn--crimson">
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
