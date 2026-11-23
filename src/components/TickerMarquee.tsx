import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface TickerMarqueeProps {
  items: string[];
  variant?: 'charcoal' | 'noir';
  speed?: number;
}

export function TickerMarquee({
  items,
  variant = 'charcoal',
  speed = 28,
}: TickerMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        tweenRef.current = gsap.to('.ticker-track', {
          xPercent: -50,
          duration: speed,
          ease: 'none',
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.25, duration: 0.4, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.4, ease: 'power2.out' });
    }
  };

  const bgStyle =
    variant === 'noir'
      ? { backgroundColor: 'var(--noir-navy)', color: 'var(--ochre)' }
      : { backgroundColor: 'var(--bg-charcoal)', color: 'var(--ochre)' };

  const renderChunk = (keyPrefix: string) => (
    <div className="ticker-chunk" key={keyPrefix}>
      {items.map((text, idx) => (
        <span key={`${keyPrefix}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '24px' }}>
          <span>{text}</span>
          <span className="ticker-star" aria-hidden="true">
            ★
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={wrapRef}
      className="ticker-bar"
      style={bgStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Key System Capabilities"
    >
      <div className="ticker-track">
        {renderChunk('a')}
        {renderChunk('b')}
      </div>
    </div>
  );
}
