import { useEffect, useRef, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface Node3D {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  latencyMs: number;
}

const AGENT_NODES: Node3D[] = [
  { id: 'master', label: 'Orchestrator', sub: 'Async DAG Core', x: 0, y: 0, z: 0, radius: 20, color: '#E6B422', latencyMs: 42 },
  { id: 'router', label: 'Intent Router', sub: 'DIRECT / RAG / WEB', x: -145, y: -52, z: 45, radius: 15, color: '#C92A2A', latencyMs: 118 },
  { id: 'rag', label: 'Qdrant RRF', sub: '384d BGE + BM25', x: 148, y: -60, z: 36, radius: 16, color: '#29A8B3', latencyMs: 198 },
  { id: 'wasm', label: 'Pyodide WASM', sub: '0% Host RCE', x: 138, y: 74, z: -54, radius: 15, color: '#E87A24', latencyMs: 142 },
  { id: 'hitl', label: 'Playwright HITL', sub: 'Visual Safety Gate', x: -138, y: 72, z: -50, radius: 15, color: '#4AD991', latencyMs: 38 },
  { id: 'mcp', label: 'FastMCP :8000', sub: 'Claude & Cursor', x: 0, y: -112, z: -64, radius: 15, color: '#F3EAD3', latencyMs: 65 },
  { id: 'verifier', label: 'Verifier Council', sub: 'Consensus ≥ 0.85', x: 0, y: 100, z: 72, radius: 16, color: '#E6B422', latencyMs: 205 },
];

const AGENT_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 6],
  [4, 6],
];

interface AgentTopologyCanvasProps {
  compact?: boolean;
  highlightNodeId?: string;
}

export function AgentTopologyCanvas({
  compact = false,
  highlightNodeId,
}: AgentTopologyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);

  const rotRef = useRef({ rx: 0.26, ry: 0.45 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const projectedRef = useRef<{ node: Node3D; sx: number; sy: number; sr: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      // Canvas background
      ctx.fillStyle = '#1A233A';
      ctx.fillRect(0, 0, w, h);

      // Grid overlay
      ctx.strokeStyle = 'rgba(41, 168, 179, 0.14)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let gx = 0; gx < w; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Orbital reticle
      ctx.strokeStyle = 'rgba(230, 180, 34, 0.26)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.37 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Corner guides
      ctx.strokeStyle = 'rgba(232, 122, 36, 0.55)';
      ctx.lineWidth = 1.5;
      const m = 12;
      const len = 10;
      [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ].forEach(([ox, oy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(ox, oy + dy * len);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + dx * len, oy);
        ctx.stroke();
      });

      if (autoSpin && !dragRef.current.active && !prefersReduced) {
        rotRef.current.ry += 0.006;
        rotRef.current.rx = 0.24 + Math.sin(tick * 0.011) * 0.1;
      }
      tick += 1;

      const cosY = Math.cos(rotRef.current.ry);
      const sinY = Math.sin(rotRef.current.ry);
      const cosX = Math.cos(rotRef.current.rx);
      const sinX = Math.sin(rotRef.current.rx);
      const fov = 420;
      const baseScale = (Math.min(w, h) / 360) * zoom;

      const projected = AGENT_NODES.map((node) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        const persp = fov / (fov + z2 + 90);
        const sx = cx + x1 * persp * baseScale;
        const sy = cy + y2 * persp * baseScale;
        const sr = node.radius * persp * baseScale;
        return { node, sx, sy, sr, z: z2 };
      });

      projectedRef.current = projected.map(({ node, sx, sy, sr }) => ({ node, sx, sy, sr }));

      // Edges and signal pulses
      AGENT_EDGES.forEach(([i, j], edgeIdx) => {
        const a = projected[i];
        const b = projected[j];
        ctx.strokeStyle = 'rgba(243, 234, 211, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();

        if (!prefersReduced) {
          const t = (tick * 0.012 + edgeIdx * 0.23) % 1;
          const px = a.sx + (b.sx - a.sx) * t;
          const py = a.sy + (b.sy - a.sy) * t;
          ctx.fillStyle = edgeIdx % 2 === 0 ? '#E6B422' : '#29A8B3';
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const sorted = [...projected].sort((a, b) => b.z - a.z);

      sorted.forEach(({ node, sx, sy, sr }) => {
        const isHot = highlightNodeId === node.id || hoveredNode?.id === node.id;

        ctx.fillStyle = '#0F1116';
        ctx.beginPath();
        ctx.arc(sx + 3, sy + 3, sr, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = node.color;
        ctx.strokeStyle = isHot ? '#F3EAD3' : '#131315';
        ctx.lineWidth = isHot ? 3 : 2.2;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `700 ${compact ? 10 : 11}px "JetBrains Mono", monospace`;
        const tw = ctx.measureText(node.label).width;
        const pillW = tw + 12;
        const pillH = 19;
        const px = sx - pillW / 2;
        const py = sy + sr + 6;

        ctx.fillStyle = isHot ? '#E6B422' : '#131315';
        ctx.fillRect(px, py, pillW, pillH);
        ctx.strokeStyle = isHot ? '#131315' : '#E6B422';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, py, pillW, pillH);

        ctx.fillStyle = isHot ? '#131315' : '#F3EAD3';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, sx, py + pillH / 2 + 0.5);
      });

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [autoSpin, zoom, compact, highlightNodeId, hoveredNode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragRef.current.active) {
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      rotRef.current.ry += dx * 0.008;
      rotRef.current.rx = Math.max(-1.1, Math.min(1.1, rotRef.current.rx + dy * 0.008));
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    } else {
      const hit = projectedRef.current.find(
        (p) => Math.hypot(p.sx - mx, p.sy - my) <= p.sr + 8
      );
      setHoveredNode(hit ? hit.node : null);
    }
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const resetView = () => {
    rotRef.current = { rx: 0.26, ry: 0.45 };
    setZoom(1.0);
    setAutoSpin(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        border: 'var(--border-ink)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        backgroundColor: 'var(--noir-navy)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-obsidian)',
          color: 'var(--bg-parchment)',
          borderBottom: 'var(--border-ink)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--ochre)', letterSpacing: '0.04em' }}>
          MCPPRO TOPOLOGY • 7 NODES / 12 LINKS
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--radar-olive)',
            color: 'var(--mint)',
            fontSize: '10px',
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--mint)',
            }}
          />
          LIVE MESH
        </span>
      </div>

      
      <div style={{ position: 'relative', width: '100%', height: compact ? '315px' : '390px' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            dragRef.current.active = false;
            setHoveredNode(null);
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: dragRef.current.active ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
          aria-label="Interactive MCPPRO Multi-Agent Topology Canvas"
        />

        {hoveredNode && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'var(--bg-parchment)',
              color: 'var(--ink)',
              border: 'var(--border-ink)',
              boxShadow: 'var(--shadow-sm)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontWeight: 700 }}>{hoveredNode.label}</div>
            <div style={{ color: 'var(--ink-soft)' }}>{hoveredNode.sub}</div>
            <div style={{ color: 'var(--crimson)', fontWeight: 700, marginTop: '2px' }}>
              Response: {hoveredNode.latencyMs} ms
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-parchment)',
          borderTop: 'var(--border-ink)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.12).toFixed(2)))}
            aria-label="Zoom out"
            style={{
              padding: '3px 7px',
              border: '1.5px solid var(--ink)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-white)',
            }}
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.45, +(z + 0.12).toFixed(2)))}
            aria-label="Zoom in"
            style={{
              padding: '3px 7px',
              border: '1.5px solid var(--ink)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-white)',
            }}
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            onClick={resetView}
            style={{
              padding: '3px 8px',
              border: '1.5px solid var(--ink)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-white)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={11} />
            Reset
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAutoSpin((s) => !s)}
          style={{
            padding: '4px 10px',
            border: '1.5px solid var(--ink)',
            borderRadius: '4px',
            backgroundColor: autoSpin ? 'var(--ochre)' : 'var(--bg-white)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <RotateCw size={12} />
          {autoSpin ? 'Auto-Rotate: ON' : 'Auto-Rotate: OFF'}
        </button>
      </div>
    </div>
  );
}
