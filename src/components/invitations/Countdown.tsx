import { log } from 'console';
import React, { useState, useEffect } from 'react';

// ============================================================
// Countdown.tsx — Versión con múltiples diseños
//
// Ubicación: src/components/invitations/Countdown.tsx
// Reemplaza el Countdown.tsx original
//
// Props:
//   targetDate: string  → fecha del evento (de eventData.date)
//   design?: string     → ID del diseño (se guarda en features.countdownDesign)
//
// Uso en InvitationPreview:
//   <Countdown targetDate={eventData.date} design={features.countdownDesign} />
//
// Uso en CustomizationForm / MobileCustomizationLayout:
//   Se agrega un selector de diseño cuando countdown está activado
// ============================================================

// ─── Diseños disponibles ─────────────────────────────────────
export const COUNTDOWN_DESIGNS = [
  { id: 'glass', name: 'Cristal', icon: '💎' },
  { id: 'elegant', name: 'Elegante', icon: '✨' },
  { id: 'neon', name: 'Neón', icon: '🌙' },
  { id: 'minimal', name: 'Minimal', icon: '◻️' },
  { id: 'floral', name: 'Floral', icon: '🌸' },
  { id: 'luxury', name: 'Lujo', icon: '👑' },
  { id: 'retro', name: 'Retro', icon: '🕹️' },
  { id: 'gradient-cards', name: 'Tarjetas', icon: '🎴' },
];

// ─── Hook de countdown ───────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = new Date(targetDate).getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return timeLeft;
}

const pad = (n: number) => String(n).padStart(2, '0');

// ─── Tipo compartido ─────────────────────────────────────────
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ═════════════════════════════════════════════════════════════
// DISEÑOS
// ═════════════════════════════════════════════════════════════

/* ─── GLASS ─── */
function GlassCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #a855f7)',
      borderRadius: 20, padding: 'clamp(20px, 5vw, 40px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 180, height: 180,
        background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
        borderRadius: '50%',
      }} />
      <p style={{
        color: 'rgba(255,255,255,0.9)', fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(14px, 3vw, 18px)', textAlign: 'center', margin: '0 0 clamp(12px, 3vw, 20px)',
        letterSpacing: 3, textTransform: 'uppercase',
      }}>⏳ Cuenta Regresiva</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(6px, 2vw, 16px)', maxWidth: 480, margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 'clamp(10px, 2vw, 16px)',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: 'clamp(10px, 3vw, 24px) clamp(4px, 1.5vw, 12px)',
            textAlign: 'center' as const,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(24px, 7vw, 52px)', fontWeight: 700,
              color: '#fff', lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(9px, 2.2vw, 13px)', color: 'rgba(255,255,255,0.75)',
              textTransform: 'uppercase' as const, letterSpacing: 1.5, marginTop: 4,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ELEGANT ─── */
function ElegantCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Minutos' },
    { val: time.seconds, label: 'Segundos' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
      borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)',
      border: '1px solid rgba(212,175,55,0.3)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.08), transparent 60%)',
      }} />
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(13px, 2.8vw, 16px)', textAlign: 'center',
        color: '#d4af37', letterSpacing: 6, textTransform: 'uppercase',
        margin: '0 0 8px', position: 'relative',
      }}>✦ Faltan ✦</p>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 'clamp(4px, 2vw, 16px)', flexWrap: 'wrap' as const, position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 2vw, 16px)' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(28px, 8vw, 60px)', fontWeight: 700,
                color: '#d4af37', lineHeight: 1,
                textShadow: '0 0 30px rgba(212,175,55,0.3)',
              }}>{pad(u.val)}</div>
              <div style={{
                fontSize: 'clamp(8px, 2vw, 11px)', color: 'rgba(212,175,55,0.6)',
                textTransform: 'uppercase' as const, letterSpacing: 2, marginTop: 4,
                fontFamily: 'system-ui, sans-serif',
              }}>{u.label}</div>
            </div>
            {i < 3 && (
              <span style={{
                fontSize: 'clamp(20px, 5vw, 36px)', color: 'rgba(212,175,55,0.4)',
                fontWeight: 300, marginBottom: 16,
              }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NEON ─── */
function NeonCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'DÍAS' },
    { val: time.hours, label: 'HRS' },
    { val: time.minutes, label: 'MIN' },
    { val: time.seconds, label: 'SEG' },
  ];
  return (
    <div style={{
      background: '#0a0a0a', borderRadius: 20,
      padding: 'clamp(20px, 5vw, 40px)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '80%', height: '80%',
        background: 'radial-gradient(ellipse, rgba(236,72,153,0.12), transparent 70%)',
      }} />
      <p style={{
        fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(11px, 2.5vw, 14px)',
        textAlign: 'center', color: '#ec4899',
        textShadow: '0 0 10px rgba(236,72,153,0.8), 0 0 40px rgba(236,72,153,0.4)',
        letterSpacing: 6, textTransform: 'uppercase',
        margin: '0 0 clamp(12px, 3vw, 24px)', position: 'relative',
      }}>Cuenta Regresiva</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(6px, 2vw, 12px)', maxWidth: 500, margin: '0 auto', position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            border: '1px solid rgba(236,72,153,0.4)',
            borderRadius: 'clamp(8px, 2vw, 14px)',
            padding: 'clamp(10px, 3vw, 20px) clamp(4px, 1vw, 8px)',
            textAlign: 'center' as const, background: 'rgba(236,72,153,0.05)',
            boxShadow: '0 0 15px rgba(236,72,153,0.1), inset 0 0 15px rgba(236,72,153,0.05)',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 'clamp(26px, 7vw, 50px)', fontWeight: 700,
              color: '#ec4899', lineHeight: 1.1,
              textShadow: '0 0 10px rgba(236,72,153,0.8), 0 0 30px rgba(236,72,153,0.4), 0 0 60px rgba(236,72,153,0.2)',
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(8px, 2vw, 11px)', color: 'rgba(236,72,153,0.5)',
              letterSpacing: 2, marginTop: 6, fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MINIMAL ─── */
function MinimalCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'días' },
    { val: time.hours, label: 'hrs' },
    { val: time.minutes, label: 'min' },
    { val: time.seconds, label: 'seg' },
  ];
  return (
    <div style={{
      background: '#fafaf9', borderRadius: 16,
      padding: 'clamp(20px, 5vw, 40px)',
      border: '1px solid #e7e5e4',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'baseline',
        gap: 'clamp(12px, 4vw, 32px)', flexWrap: 'wrap' as const,
      }}>
        {units.map((u, i) => (
          <div key={i} style={{ textAlign: 'center' as const }}>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(32px, 9vw, 64px)', fontWeight: 400,
              color: '#292524', lineHeight: 1, letterSpacing: '-0.02em',
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(9px, 2.2vw, 12px)', color: '#a8a29e',
              letterSpacing: 1, marginTop: 6, fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FLORAL ─── */
function FloralCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)',
      borderRadius: 24, padding: 'clamp(20px, 5vw, 40px)',
      position: 'relative', overflow: 'hidden',
      border: '1px solid rgba(236,72,153,0.15)',
    }}>
      <div style={{
        position: 'absolute', top: -10, left: -10, fontSize: 'clamp(40px, 10vw, 80px)',
        opacity: 0.15, transform: 'rotate(-15deg)',
      }}>🌸</div>
      <div style={{
        position: 'absolute', bottom: -5, right: -5, fontSize: 'clamp(30px, 8vw, 60px)',
        opacity: 0.12, transform: 'rotate(20deg)',
      }}>🌺</div>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(14px, 3vw, 18px)', textAlign: 'center',
        color: '#be185d', margin: '0 0 clamp(12px, 3vw, 20px)',
        fontStyle: 'italic', position: 'relative',
      }}>🌷 Faltan 🌷</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(6px, 2vw, 14px)', maxWidth: 440, margin: '0 auto', position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%', aspectRatio: '1',
            display: 'flex', flexDirection: 'column' as const,
            justifyContent: 'center', alignItems: 'center',
            border: '2px solid rgba(190,24,93,0.15)',
            boxShadow: '0 4px 15px rgba(190,24,93,0.08)',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(20px, 6vw, 40px)', fontWeight: 700,
              color: '#be185d', lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(7px, 1.8vw, 10px)', color: '#9d174d',
              textTransform: 'uppercase' as const, letterSpacing: 1,
              fontFamily: 'system-ui, sans-serif', marginTop: 2,
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LUXURY ─── */
function LuxuryCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1c1917, #292524, #1c1917)',
      borderRadius: 4, padding: 'clamp(24px, 6vw, 48px)',
      position: 'relative', overflow: 'hidden',
      borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(45deg, #d4af37 0, #d4af37 1px, transparent 1px, transparent 20px)',
      }} />
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(11px, 2.5vw, 14px)', textAlign: 'center',
        color: '#d4af37', letterSpacing: 8, textTransform: 'uppercase',
        margin: '0 0 clamp(16px, 4vw, 28px)', position: 'relative',
      }}>— Cuenta Regresiva —</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(8px, 2.5vw, 20px)', maxWidth: 520, margin: '0 auto', position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            borderLeft: i > 0 ? '1px solid rgba(212,175,55,0.2)' : 'none',
            paddingLeft: i > 0 ? 'clamp(8px, 2.5vw, 20px)' : 0,
            textAlign: 'center' as const,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(28px, 8vw, 56px)', fontWeight: 400,
              color: '#fefce8', lineHeight: 1, letterSpacing: 2,
            }}>{pad(u.val)}</div>
            <div style={{
              width: 20, height: 1, background: '#d4af37',
              margin: 'clamp(6px, 1.5vw, 10px) auto',
            }} />
            <div style={{
              fontSize: 'clamp(8px, 2vw, 11px)', color: '#d4af37',
              textTransform: 'uppercase' as const, letterSpacing: 3,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── RETRO ─── */
function RetroCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'DÍAS' },
    { val: time.hours, label: 'HRS' },
    { val: time.minutes, label: 'MIN' },
    { val: time.seconds, label: 'SEG' },
  ];
  return (
    <div style={{
      background: '#fef3c7', borderRadius: 16,
      padding: 'clamp(20px, 5vw, 36px)',
      border: '3px solid #92400e',
      boxShadow: '6px 6px 0 #92400e',
    }}>
      <p style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 'clamp(12px, 3vw, 16px)', textAlign: 'center',
        color: '#92400e', letterSpacing: 4, textTransform: 'uppercase',
        margin: '0 0 clamp(12px, 3vw, 20px)', fontWeight: 700,
      }}>⏰ CUENTA REGRESIVA ⏰</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(6px, 2vw, 12px)', maxWidth: 460, margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: '#1c1917', borderRadius: 8,
            padding: 'clamp(10px, 3vw, 20px) clamp(4px, 1.5vw, 10px)',
            textAlign: 'center' as const, border: '2px solid #78350f',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 'clamp(24px, 7vw, 48px)', fontWeight: 700,
              color: '#fbbf24', lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(7px, 1.8vw, 10px)', color: '#d97706',
              letterSpacing: 2, marginTop: 4, fontFamily: "'Courier New', monospace",
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GRADIENT CARDS ─── */
function GradientCardsCountdown({ time }: { time: TimeLeft }) {
  const units = [
    { val: time.days, label: 'Días', gradient: 'linear-gradient(135deg, #f472b6, #e879f9)' },
    { val: time.hours, label: 'Horas', gradient: 'linear-gradient(135deg, #a78bfa, #818cf8)' },
    { val: time.minutes, label: 'Min', gradient: 'linear-gradient(135deg, #60a5fa, #38bdf8)' },
    { val: time.seconds, label: 'Seg', gradient: 'linear-gradient(135deg, #34d399, #2dd4bf)' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      borderRadius: 20, padding: 'clamp(20px, 5vw, 40px)',
    }}>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(12px, 2.5vw, 15px)', textAlign: 'center',
        color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textTransform: 'uppercase',
        margin: '0 0 clamp(12px, 3vw, 24px)',
      }}>🎉 No Faltes 🎉</p>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'clamp(6px, 2vw, 14px)', maxWidth: 480, margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: u.gradient,
            borderRadius: 'clamp(12px, 3vw, 20px)',
            padding: 'clamp(12px, 3.5vw, 28px) clamp(4px, 1.5vw, 12px)',
            textAlign: 'center' as const,
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(24px, 7vw, 48px)', fontWeight: 700,
              color: '#fff', lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: 'clamp(8px, 2vw, 11px)', color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase' as const, letterSpacing: 1, marginTop: 4,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mapa de componentes ─────────────────────────────────────
const COUNTDOWN_MAP: Record<string, React.FC<{ time: TimeLeft }>> = {
  glass: GlassCountdown,
  elegant: ElegantCountdown,
  neon: NeonCountdown,
  minimal: MinimalCountdown,
  floral: FloralCountdown,
  luxury: LuxuryCountdown,
  retro: RetroCountdown,
  'gradient-cards': GradientCardsCountdown,
};

// ═════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — el que usas en tu proyecto
// ═════════════════════════════════════════════════════════════

interface CountdownProps {
  targetDate: string;              // eventData.date → "2026-06-15"
  design?: string;                 // features.countdownDesign → "glass" | "elegant" | etc.
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  design = 'glass' ,
}) => {
  const time = useCountdown(targetDate);
  const CountdownComponent = COUNTDOWN_MAP[design] || GlassCountdown;

  return <CountdownComponent time={time} />;
};

// ═════════════════════════════════════════════════════════════
// SELECTOR DE DISEÑO — para usar en el formulario de personalización
// ═════════════════════════════════════════════════════════════

interface CountdownDesignSelectorProps {
  selected: string;
  onChange: (designId: string) => void;
}

export const CountdownDesignSelector: React.FC<CountdownDesignSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-neutral-600 mb-2">
        Estilo del contador:
      </p>
      <div className="grid grid-cols-4 gap-2">
        {COUNTDOWN_DESIGNS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center ${
              selected === d.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <span className="text-lg">{d.icon}</span>
            <span className="text-[10px] font-medium text-neutral-700 leading-tight">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Countdown;