import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Eye, EyeOff, KeyRound, X, Check, Trash2 } from 'lucide-react';
import { MODEL_PROVIDERS } from '../data/mcpproData';

const STORAGE_KEY = 'mcppro_client_api_keys_v1';

export function loadStoredApiKeys(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysChanged?: (count: number) => void;
}

export function ApiKeysModal({ isOpen, onClose, onKeysChanged }: ApiKeysModalProps) {
  const [keys, setKeys] = useState<Record<string, string>>(() => loadStoredApiKeys());
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [savedNotice, setSavedNotice] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setKeys(loadStoredApiKeys());
    }
  }, [isOpen]);

  useGSAP(
    () => {
      if (!isOpen) return;
      gsap.from('.modal-panel', {
        y: 24,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'back.out(1.4)',
      });
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const cleaned: Record<string, string> = {};
    Object.entries(keys).forEach(([k, v]) => {
      if (v.trim()) cleaned[k] = v.trim();
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    onKeysChanged?.(Object.keys(cleaned).length);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleClear = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setKeys({});
    onKeysChanged?.(0);
  };

  return (
    <div
      ref={modalRef}
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="API Key Settings"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel" style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'var(--noir-navy)',
            color: 'var(--on-dark)',
            borderBottom: 'var(--border-ink)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--ochre)',
                color: 'var(--ink)',
                border: '2px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px' }}>
                API Key Settings
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--on-dark-muted)' }}>
                Keys are stored locally in your browser and used for AI requests.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close API Key Settings"
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

        {/* Scrollable Provider Inputs */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {MODEL_PROVIDERS.map((provider) => {
            const isShown = Boolean(visible[provider.id]);
            return (
              <div key={provider.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                    gap: '8px',
                  }}
                >
                  <label
                    htmlFor={`key-${provider.id}`}
                    style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}
                  >
                    {provider.name}
                  </label>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: 'var(--space-teal)',
                    }}
                  >
                    {provider.envVar}
                  </span>
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id={`key-${provider.id}`}
                    type={isShown ? 'text' : 'password'}
                    value={keys[provider.id] || ''}
                    onChange={(e) => setKeys((prev) => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder={provider.placeholder}
                    autoComplete="off"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: 'var(--border-ink)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                    aria-label={isShown ? 'Hide API key' : 'Show API key'}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      color: 'var(--ink-soft)',
                      display: 'inline-flex',
                    }}
                  >
                    {isShown ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                  {provider.keyNote}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: 'var(--border-ink)',
            backgroundColor: 'var(--bg-sand)',
          }}
        >
          <button
            type="button"
            className="brutal-btn brutal-btn--parchment"
            onClick={handleClear}
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <Trash2 size={14} /> Clear Local Vault
          </button>

          <button
            type="button"
            className="brutal-btn brutal-btn--radar"
            onClick={handleSave}
            style={{ padding: '9px 18px', fontSize: '13px' }}
          >
            {savedNotice ? <Check size={15} /> : <KeyRound size={15} />}
            {savedNotice ? 'Saved in Browser!' : 'Save Keys Locally'}
          </button>
        </div>
      </div>
    </div>
  );
}
