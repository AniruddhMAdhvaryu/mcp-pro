import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Plus,
  PanelLeft,
  Download,
  Settings,
  UploadCloud,
  Send,
  ChevronsUpDown,
  Search,
  Sparkles,
  FileText,
  Trash2,
  X,
  Cpu,
  Globe,
  Database,
  Code2,
  CheckCircle2,
  GitCompare,
} from 'lucide-react';
import {
  MODEL_PROVIDERS,
  STUDIO_QUICK_ACTIONS,
  INITIAL_DOCUMENTS,
  type InitialDocument,
  type PageId,
  type WorkbenchTab,
} from '../data/mcpproData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  route?: 'RAG' | 'ONLINE' | 'DIRECT';
  model?: string;
  tools?: string[];
  codeBlock?: { lang: string; code: string };
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface ChatStudioPageProps {
  onOpenKeys: () => void;
  onNavigate: (page: PageId, tab?: WorkbenchTab) => void;
  configuredKeyCount: number;
}

export function ChatStudioPage({ onOpenKeys, onNavigate, configuredKeyCount }: ChatStudioPageProps) {
  const studioRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([
    { id: 't-1', title: 'New Chat', messages: [] },
  ]);
  const [activeThreadId, setActiveThreadId] = useState('t-1');
  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Model selector
  const [selectedModelLabel, setSelectedModelLabel] = useState('Llama 3.3 70B (OpenRouter)');
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [expandedProvider, setExpandedProvider] = useState<string | null>('openrouter');

  // Documents modal
  const [docsOpen, setDocsOpen] = useState(false);
  const [documents, setDocuments] = useState<InitialDocument[]>(INITIAL_DOCUMENTS);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModelPickerOpen(false);
        setDocsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const renderInlineMd = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              backgroundColor: 'var(--bg-parchment)',
              border: '1px solid rgba(19,19,21,0.2)',
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderRichContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} style={{ height: '6px' }} />;
      if (trimmed.startsWith('### ')) {
        return (
          <div key={i} style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15.5px', marginBottom: '6px' }}>
            {renderInlineMd(trimmed.slice(4))}
          </div>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <div key={i} style={{ paddingLeft: '14px', textIndent: '-10px', marginBottom: '4px' }}>
            • {renderInlineMd(trimmed.slice(2))}
          </div>
        );
      }
      return (
        <div key={i} style={{ marginBottom: '4px' }}>
          {renderInlineMd(trimmed)}
        </div>
      );
    });
  };

  useGSAP(
    () => {
      gsap.from('.studio-msg-bubble:last-child', {
        y: 14,
        autoAlpha: 0,
        duration: 0.32,
        ease: 'power2.out',
      });
    },
    { scope: studioRef, dependencies: [activeThread.messages.length] }
  );

  const createNewChat = () => {
    const id = `t-${Date.now()}`;
    setThreads((prev) => [{ id, title: 'New Chat', messages: [] }, ...prev]);
    setActiveThreadId(id);
    setInputVal('');
  };

  const sendPrompt = (
    promptText: string,
    preset?: (typeof STUDIO_QUICK_ACTIONS)[number]
  ) => {
    const trimmed = promptText.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const shortTitle = trimmed.length > 26 ? `${trimmed.slice(0, 26)}…` : trimmed;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              title: t.messages.length === 0 ? shortTitle : t.title,
              messages: [...t.messages, userMsg],
            }
          : t
      )
    );
    setInputVal('');
    setIsStreaming(true);

    // Route classification
    const lower = trimmed.toLowerCase();
    const inferredRoute: 'RAG' | 'ONLINE' | 'DIRECT' =
      preset?.route ||
      (lower.includes('pdf') || lower.includes('doc') || lower.includes('msa') || lower.includes('audit')
        ? 'RAG'
        : lower.includes('http') || lower.includes('url') || lower.includes('live') || lower.includes('web')
        ? 'ONLINE'
        : 'DIRECT');

    const replyContent =
      preset?.response ||
      `Routed via **${inferredRoute}** pipeline using **${selectedModelLabel}**${
        configuredKeyCount > 0 ? ' (Client BYOK Vault active)' : ''
      }.\n\n- **Context Analysis:** Evaluated ${documents.length} indexed knowledge documents and active FastMCP tool schemas.\n- **Autonomous Synthesis:** Generated verified structured response for *"${trimmed}"*.\n- **Consensus Verifier:** Assertions checked against ground-truth context (\`S_c = 0.93\`).`;

    window.setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        route: inferredRoute,
        model: selectedModelLabel,
        tools:
          preset?.tools ||
          (inferredRoute === 'RAG'
            ? ['searchUploadedDocuments (RRF k=60)', 'verifierAgent']
            : inferredRoute === 'ONLINE'
            ? ['tavilySearch', 'playwrightCloudBrowser']
            : ['directReasoning', 'verifierAgent']),
        codeBlock: preset?.codeBlock,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id ? { ...t, messages: [...t.messages, assistantMsg] } : t
        )
      );
      setIsStreaming(false);
    }, 520);
  };

  const handleExport = () => {
    const md =
      `# MCPPro Session Export (${selectedModelLabel})\n\n` +
      (activeThread.messages.length
        ? activeThread.messages
            .map((m) => `## ${m.role === 'user' ? 'User' : `Assistant (${m.model || selectedModelLabel})`}\n${m.content}\n`)
            .join('\n')
        : '_No messages in this thread yet._\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcppro-session-${activeThread.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    const sizeLabel = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    const newDoc: InitialDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      chunks: Math.max(8, Math.min(180, Math.round(kb / 12))),
      sizeLabel,
      status: 'ready',
      updatedAt: 'Just now',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    e.target.value = '';
  };

  const filteredProviders = MODEL_PROVIDERS.filter((p) => {
    if (!modelSearch.trim()) return true;
    const q = modelSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.models.some((m) => m.label.toLowerCase().includes(q))
    );
  });

  return (
    <div ref={studioRef} className={`studio-shell ${sidebarOpen ? '' : 'studio-shell--collapsed'}`}>
      {/* Sidebar */}
      <aside className="studio-sidebar" aria-label="Chat History & Documents">
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '24px',
                  letterSpacing: '0.05em',
                }}
              >
                MCPPRO STUDIO
              </span>
            </div>
            <button
              type="button"
              onClick={createNewChat}
              title="Start New Chat"
              className="brutal-btn brutal-btn--ochre"
              style={{ padding: '5px 8px' }}
            >
              <Plus size={15} />
            </button>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Today
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {threads.map((t) => {
              const active = t.id === activeThread.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: active ? 'var(--border-ink)' : '1.5px solid transparent',
                    backgroundColor: active ? 'var(--bg-white)' : 'transparent',
                    boxShadow: active ? '2px 2px 0 var(--ink)' : 'none',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.title}
                </button>
              );
            })}
          </div>
        </div>

        
        <div style={{ padding: '14px 16px', borderTop: 'var(--border-ink)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setDocsOpen(true)}
            className="brutal-btn brutal-btn--parchment"
            style={{ width: '100%', justifyContent: 'space-between', padding: '9px 12px', fontSize: '12.5px' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={15} /> My Documents
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--ochre)',
                border: '1px solid var(--ink)',
              }}
            >
              {documents.length}
            </span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-white)',
              border: '1.5px solid var(--ink)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--space-teal)',
                color: 'var(--on-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              M
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                workspace@mcppro.ai
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--space-teal)' }}>
                {configuredKeyCount > 0 ? `${configuredKeyCount} BYOK Key(s)` : 'Free Tier Active'}
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Workspace */}
      <div className="studio-main grid-parchment">
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: 'var(--border-ink)',
            backgroundColor: 'var(--bg-white)',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle Sidebar"
            className="brutal-btn brutal-btn--parchment"
            style={{ padding: '6px 9px' }}
          >
            <PanelLeft size={16} />
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 14px',
              borderRadius: '999px',
              border: 'var(--border-ink)',
              backgroundColor: 'var(--radar-olive)',
              color: 'var(--mint)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              fontWeight: 700,
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--mint)' }} />
            RAG Engine Online
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleExport}
              className="brutal-btn brutal-btn--parchment"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <Download size={14} /> Export
            </button>
            <button
              type="button"
              onClick={onOpenKeys}
              aria-label="API Key Settings"
              title="API Key Settings"
              className="brutal-btn brutal-btn--ochre"
              style={{ padding: '6px 9px' }}
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', maxWidth: '820px', marginInline: 'auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: activeThread.messages.length === 0 ? 'center' : 'flex-start', gap: '16px' }}>
            {activeThread.messages.length === 0 ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '26px' }}>
                  <span className="tilted-badge" style={{ backgroundColor: 'var(--ochre)', marginBottom: '10px' }}>
                    SESSION READY // 514 FRONTIER &amp; OPEN MODELS
                  </span>
                  <h1 className="section-heading" style={{ fontSize: '34px' }}>
                    What shall we{' '}
                    <span className="section-heading-serif" style={{ color: 'var(--crimson)' }}>
                      orchestrate
                    </span>{' '}
                    today?
                  </h1>
                </div>

                
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {STUDIO_QUICK_ACTIONS.map((qa, idx) => {
                    const icons = [FileText, Globe, Sparkles, Code2];
                    const Icon = icons[idx];
                    return (
                      <button
                        key={qa.id}
                        type="button"
                        onClick={() => sendPrompt(qa.prompt, qa)}
                        className="brutal-card brutal-card--interactive"
                        style={{
                          padding: '16px 18px',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          backgroundColor: 'var(--bg-white)',
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border: '1.5px solid var(--ink)',
                            backgroundColor: idx === 0 ? 'var(--ochre)' : idx === 1 ? 'var(--space-teal)' : idx === 2 ? 'var(--tangerine)' : 'var(--noir-navy)',
                            color: idx === 1 || idx === 3 ? 'var(--on-dark)' : 'var(--ink)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={17} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>{qa.title}</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                            {qa.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className="studio-msg-bubble"
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: msg.role === 'user' ? '78%' : '100%',
                    width: msg.role === 'assistant' ? '100%' : 'auto',
                  }}
                >
                  {msg.role === 'user' ? (
                    <div
                      style={{
                        backgroundColor: 'var(--noir-navy)',
                        color: 'var(--on-dark)',
                        border: 'var(--border-ink)',
                        boxShadow: 'var(--shadow-sm)',
                        borderRadius: '14px 14px 4px 14px',
                        padding: '12px 16px',
                        fontSize: '14px',
                      }}
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <div
                      className="brutal-card"
                      style={{ padding: '18px 20px', backgroundColor: 'var(--bg-white)' }}
                    >
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '4px',
                            border: '1.5px solid var(--ink)',
                            backgroundColor:
                              msg.route === 'RAG'
                                ? 'var(--ochre)'
                                : msg.route === 'ONLINE'
                                ? 'var(--space-teal)'
                                : 'var(--tangerine)',
                            color: msg.route === 'ONLINE' ? 'var(--on-dark)' : 'var(--ink)',
                          }}
                        >
                          ROUTE: {msg.route}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                          {msg.model}
                        </span>
                        {msg.tools?.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-parchment)',
                              border: '1px solid var(--ink)',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--ink)' }}>
                        {renderRichContent(msg.content)}
                      </div>

                      {msg.codeBlock && (
                        <div style={{ marginTop: '14px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '7px 12px',
                              backgroundColor: 'var(--noir-navy)',
                              color: 'var(--ochre)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 700,
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              border: 'var(--border-ink)',
                            }}
                          >
                            <span>{msg.codeBlock.lang.toUpperCase()} ARTIFACT</span>
                            <button
                              type="button"
                              onClick={() => onNavigate('workbench', 'wasm-canvas')}
                              style={{
                                backgroundColor: 'var(--ochre)',
                                color: 'var(--ink)',
                                border: '1.5px solid var(--ink)',
                                borderRadius: '4px',
                                padding: '2px 9px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Cpu size={11} /> Open in WASM Sandbox
                            </button>
                          </div>
                          <pre
                            style={{
                              backgroundColor: 'var(--bg-obsidian)',
                              color: '#4AD991',
                              padding: '12px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11.5px',
                              overflowX: 'auto',
                              border: 'var(--border-ink)',
                              borderTop: 'none',
                              borderBottomLeftRadius: '8px',
                              borderBottomRightRadius: '8px',
                            }}
                          >
                            {msg.codeBlock.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {isStreaming && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'var(--border-ink)',
                  backgroundColor: 'var(--ochre)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}
              >
                <Database size={14} /> Classifying intent &amp; executing MCP tools...
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: '14px 24px 22px', borderTop: 'var(--border-ink)', backgroundColor: 'var(--bg-sand)' }}>
          <div style={{ width: '100%', maxWidth: '820px', marginInline: 'auto', position: 'relative' }}>
            
            {modelPickerOpen && (
              <div
                className="brutal-card"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: 0,
                  width: '100%',
                  maxWidth: '460px',
                  maxHeight: '420px',
                  backgroundColor: 'var(--bg-white)',
                  zIndex: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '10px', borderBottom: 'var(--border-ink)', backgroundColor: 'var(--bg-parchment)' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--ink-soft)' }} />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search all frontier & open models..."
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 32px',
                        border: 'var(--border-ink)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-white)',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filteredProviders.map((prov) => {
                    const isExp = expandedProvider === prov.id || modelSearch.trim().length > 0;
                    return (
                      <div
                        key={prov.id}
                        style={{
                          flexShrink: 0,
                          border: '1.5px solid var(--ink)',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-parchment)',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedProvider(isExp ? null : prov.id)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            textAlign: 'left',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13.5px' }}>{prov.name}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)' }}>{prov.subtitle}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            {prov.freeTier && (
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 7px',
                                  borderRadius: '999px',
                                  backgroundColor: 'var(--radar-olive)',
                                  color: 'var(--mint)',
                                }}
                              >
                                Free Tier
                              </span>
                            )}
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-white)',
                                border: '1px solid var(--ink)',
                              }}
                            >
                              {prov.modelCount}
                            </span>
                          </div>
                        </button>

                        {isExp && (
                          <div style={{ padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {prov.models.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setSelectedModelLabel(m.label);
                                  setModelPickerOpen(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '7px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--ink)',
                                  backgroundColor:
                                    selectedModelLabel === m.label ? 'var(--ochre)' : 'var(--bg-white)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  textAlign: 'left',
                                }}
                              >
                                <span>{m.label}</span>
                                {m.badge && (
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--space-teal)' }}>
                                    {m.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendPrompt(inputVal);
              }}
              className="brutal-card"
              style={{ padding: '12px 14px', backgroundColor: 'var(--bg-white)' }}
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask MCPPRO anything or search knowledge base..."
                aria-label="Chat Prompt Input"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14.5px',
                  padding: '4px 2px 12px',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModelPickerOpen((o) => !o)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--ink)',
                    backgroundColor: 'var(--bg-parchment)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                  }}
                >
                  <span>{selectedModelLabel}</span>
                  <ChevronsUpDown size={13} />
                </button>

                <button
                  type="submit"
                  className="brutal-btn brutal-btn--crimson"
                  style={{ padding: '7px 14px', fontSize: '12.5px' }}
                  disabled={!inputVal.trim() || isStreaming}
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Documents modal */}
      {docsOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="My Documents Knowledge Base"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDocsOpen(false);
          }}
        >
          <div className="modal-panel" style={{ maxWidth: '620px' }}>
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
                  My Documents — Knowledge Base
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ochre)' }}>
                  Magic-byte validated • FastEmbed BGE-384d + Qdrant HNSW
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocsOpen(false)}
                aria-label="Close Document Manager"
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

            <div style={{ padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.pptx,.xlsx,.txt,.md,.json,.csv,.png"
                  onChange={handleUploadFile}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="brutal-btn brutal-btn--ochre"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  <UploadCloud size={14} /> Upload Document
                </button>
                <button
                  type="button"
                  className="brutal-btn brutal-btn--teal"
                  onClick={() => {
                    setDocsOpen(false);
                    onNavigate('workbench', 'doc-diff');
                  }}
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  <GitCompare size={14} /> Semantic Diff
                </button>
              </div>

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--ink)',
                    backgroundColor: 'var(--bg-white)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.fileName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-soft)' }}>
                      {doc.chunks} chunks • {doc.sizeLabel} • {doc.updatedAt}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--radar-olive)',
                        color: 'var(--mint)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={10} /> READY
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                      aria-label={`Delete ${doc.fileName}`}
                      style={{
                        background: 'transparent',
                        border: '1.5px solid var(--ink)',
                        borderRadius: '6px',
                        padding: '4px 6px',
                        color: 'var(--crimson)',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
