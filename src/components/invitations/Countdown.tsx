import React, { useState, useEffect } from 'react';

// ============================================================
// Countdown.tsx — Versión con múltiples diseños Y TAMAÑOS
//
// Ubicación: src/components/invitations/Countdown.tsx
// Reemplaza el Countdown.tsx original
//
// Props:
//   targetDate: string  → fecha del evento (de eventData.date)
//   design?: string     → ID del diseño (se guarda en features.countdownDesign)
//   size?: string       → Tamaño: 'sm' | 'md' | 'lg' (se guarda en features.countdownSize)
//
// Uso en InvitationPreview:
//   <Countdown 
//     targetDate={eventData.date} 
//     design={features.countdownDesign}
//     size={features.countdownSize}
//   />
//
// Uso en CustomizationForm / MobileCustomizationLayout:
//   Se agrega selector de diseño Y selector de tamaño cuando countdown está activado
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

// ─── Tamaños disponibles ─────────────────────────────────────
export const COUNTDOWN_SIZES = [
  { id: 'sm', name: 'Pequeño', icon: '📱' },
  { id: 'md', name: 'Mediano', icon: '💻' },
  { id: 'lg', name: 'Grande', icon: '🖥️' },
];

// ─── Configuraciones de tamaño ───────────────────────────────
type SizeConfig = {
  container: {
    padding: string;
    borderRadius: number;
    maxWidth: number;
  };
  title: {
    fontSize: string;
    spacing: number;
    marginBottom: string;
  };
  number: {
    fontSize: string;
  };
  label: {
    fontSize: string;
    marginTop: number;
  };
  gap: string;
  cardPadding: string;
  iconSize: string;
};

const SIZE_CONFIGS: Record<string, SizeConfig> = {
  sm: {
    container: {
      padding: 'clamp(12px, 3vw, 20px)',
      borderRadius: 12,
      maxWidth: 320,
    },
    title: {
      fontSize: 'clamp(10px, 2vw, 12px)',
      spacing: 3,
      marginBottom: 'clamp(8px, 2vw, 12px)',
    },
    number: {
      fontSize: 'clamp(18px, 5vw, 32px)',
    },
    label: {
      fontSize: 'clamp(7px, 1.5vw, 9px)',
      marginTop: 3,
    },
    gap: 'clamp(4px, 1vw, 8px)',
    cardPadding: 'clamp(8px, 2vw, 14px) clamp(4px, 1vw, 8px)',
    iconSize: 'clamp(30px, 7vw, 50px)',
  },
  md: {
    container: {
      padding: 'clamp(20px, 5vw, 40px)',
      borderRadius: 20,
      maxWidth: 480,
    },
    title: {
      fontSize: 'clamp(14px, 3vw, 18px)',
      spacing: 3,
      marginBottom: 'clamp(12px, 3vw, 20px)',
    },
    number: {
      fontSize: 'clamp(24px, 7vw, 52px)',
    },
    label: {
      fontSize: 'clamp(9px, 2.2vw, 13px)',
      marginTop: 4,
    },
    gap: 'clamp(6px, 2vw, 16px)',
    cardPadding: 'clamp(10px, 3vw, 24px) clamp(4px, 1.5vw, 12px)',
    iconSize: 'clamp(40px, 10vw, 80px)',
  },
  lg: {
    container: {
      padding: 'clamp(28px, 7vw, 56px)',
      borderRadius: 28,
      maxWidth: 640,
    },
    title: {
      fontSize: 'clamp(18px, 4vw, 24px)',
      spacing: 6,
      marginBottom: 'clamp(16px, 4vw, 28px)',
    },
    number: {
      fontSize: 'clamp(32px, 9vw, 72px)',
    },
    label: {
      fontSize: 'clamp(11px, 2.5vw, 16px)',
      marginTop: 6,
    },
    gap: 'clamp(8px, 3vw, 24px)',
    cardPadding: 'clamp(14px, 4vw, 32px) clamp(8px, 2vw, 16px)',
    iconSize: 'clamp(60px, 14vw, 120px)',
  },
};

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

interface CountdownComponentProps {
  time: TimeLeft;
  size: SizeConfig;
}

// ═════════════════════════════════════════════════════════════
// DISEÑOS (ahora reciben configuración de tamaño)
// ═════════════════════════════════════════════════════════════

/* ─── GLASS ─── */
function GlassCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #a855f7)',
      borderRadius: size.container.borderRadius, 
      padding: size.container.padding,
      position: 'relative', 
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -60, right: -60, 
        width: size.iconSize, height: size.iconSize,
        background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent 80%)',
        borderRadius: '50%',
      }} />
      <p style={{
        color: 'rgba(255,255,255,0.9)', 
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size.title.fontSize, 
        textAlign: 'center', 
        margin: `0 0 ${size.title.marginBottom}`,
        letterSpacing: size.title.spacing, 
        textTransform: 'uppercase',
      }}>⏳ Cuenta Regresiva</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: size.container.borderRadius * 0.5,
            border: '1px solid rgba(255,255,255,0.25)',
            padding: size.cardPadding,
            textAlign: 'center' as const,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size.number.fontSize, 
              fontWeight: 700,
              color: '#fff', 
              lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: 'rgba(255,255,255,0.75)',
              textTransform: 'uppercase' as const, 
              letterSpacing: 1.5, 
              marginTop: size.label.marginTop,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ELEGANT ─── */
function ElegantCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Minutos' },
    { val: time.seconds, label: 'Segundos' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
      borderRadius: size.container.borderRadius, 
      padding: size.container.padding,
      border: '1px solid rgba(212,175,55,0.3)', 
      position: 'relative', 
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.08), transparent 80%)',
      }} />
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size.title.fontSize, 
        textAlign: 'center',
        color: '#d4af37', 
        letterSpacing: size.title.spacing * 2, 
        textTransform: 'uppercase',
        margin: `0 0 8px`, 
        position: 'relative',
      }}>✦ Faltan ✦</p>
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: size.gap, 
        flexWrap: 'wrap' as const, 
        position: 'relative',
        maxWidth: size.container.maxWidth,
        margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: size.gap }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: size.number.fontSize, 
                fontWeight: 700,
                color: '#d4af37', 
                lineHeight: 1,
                textShadow: '0 0 30px rgba(212,175,55,0.3)',
              }}>{pad(u.val)}</div>
              <div style={{
                fontSize: size.label.fontSize, 
                color: 'rgba(212,175,55,0.6)',
                textTransform: 'uppercase' as const, 
                letterSpacing: 2, 
                marginTop: size.label.marginTop,
                fontFamily: 'system-ui, sans-serif',
              }}>{u.label}</div>
            </div>
            {i < 3 && (
              <span style={{
                fontSize: size.number.fontSize, 
                color: 'rgba(212,175,55,0.4)',
                fontWeight: 300, 
                marginBottom: 16,
              }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NEON ─── */
function NeonCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'DÍAS' },
    { val: time.hours, label: 'HRS' },
    { val: time.minutes, label: 'MIN' },
    { val: time.seconds, label: 'SEG' },
  ];
  return (
    <div style={{
      background: '#0a0a0a', 
      borderRadius: size.container.borderRadius,
      padding: size.container.padding, 
      position: 'relative', 
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '80%', height: '80%',
        background: 'radial-gradient(ellipse, rgba(236,72,153,0.12), transparent 80%)',
      }} />
      <p style={{
        fontFamily: 'system-ui, sans-serif', 
        fontSize: size.title.fontSize,
        textAlign: 'center', 
        color: '#ec4899',
        textShadow: '0 0 10px rgba(236,72,153,0.8), 0 0 40px rgba(236,72,153,0.4)',
        letterSpacing: size.title.spacing * 2, 
        textTransform: 'uppercase',
        margin: `0 0 ${size.title.marginBottom}`, 
        position: 'relative',
      }}>Cuenta Regresiva</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto', 
        position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            border: '1px solid rgba(236,72,153,0.4)',
            borderRadius: size.container.borderRadius * 0.5,
            padding: size.cardPadding,
            textAlign: 'center' as const, 
            background: 'rgba(236,72,153,0.05)',
            boxShadow: '0 0 15px rgba(236,72,153,0.1), inset 0 0 15px rgba(236,72,153,0.05)',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: size.number.fontSize, 
              fontWeight: 700,
              color: '#ec4899', 
              lineHeight: 1.1,
              textShadow: '0 0 10px rgba(236,72,153,0.8), 0 0 30px rgba(236,72,153,0.4), 0 0 60px rgba(236,72,153,0.2)',
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: 'rgba(236,72,153,0.5)',
              letterSpacing: 2, 
              marginTop: size.label.marginTop, 
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MINIMAL ─── */
function MinimalCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'días' },
    { val: time.hours, label: 'hrs' },
    { val: time.minutes, label: 'min' },
    { val: time.seconds, label: 'seg' },
  ];
  return (
    <div style={{
      background: '#fafaf9', 
      borderRadius: size.container.borderRadius,
      padding: size.container.padding,
      border: '1px solid #e7e5e4',
      maxWidth: size.container.maxWidth,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'baseline',
        gap: size.gap, 
        flexWrap: 'wrap' as const,
      }}>
        {units.map((u, i) => (
          <div key={i} style={{ textAlign: 'center' as const }}>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: size.number.fontSize, 
              fontWeight: 400,
              color: '#292524', 
              lineHeight: 1, 
              letterSpacing: '-0.02em',
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: '#a8a29e',
              letterSpacing: 1, 
              marginTop: size.label.marginTop, 
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FLORAL ─── */
function FloralCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)',
      borderRadius: size.container.borderRadius, 
      padding: size.container.padding,
      position: 'relative', 
      overflow: 'hidden',
      border: '1px solid rgba(236,72,153,0.15)',
    }}>
      <div style={{
        position: 'absolute', top: -10, left: -10, 
        fontSize: size.iconSize,
        opacity: 0.45, 
        transform: 'rotate(-15deg)',
      }}>🌸</div>
      <div style={{
        position: 'absolute', bottom: -5, right: -5, 
        fontSize: `calc(${size.iconSize} * 0.75)`,
          opacity: 0.45,
        transform: 'rotate(20deg)',
      }}>🌺</div>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size.title.fontSize, 
        textAlign: 'center',
        color: '#be185d', 
        margin: `0 0 ${size.title.marginBottom}`,
        fontStyle: 'italic', 
        position: 'relative',
      }}>🌷 Faltan 🌷</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto', 
        position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%', 
            aspectRatio: '1',
            display: 'flex', 
            flexDirection: 'column' as const,
            justifyContent: 'center', 
            alignItems: 'center',
            border: '2px solid rgba(190,24,93,0.15)',
            boxShadow: '0 4px 15px rgba(190,24,93,0.08)',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size.number.fontSize, 
              fontWeight: 700,
              color: '#be185d', 
              lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: '#9d174d',
              textTransform: 'uppercase' as const, 
              letterSpacing: 1,
              fontFamily: 'system-ui, sans-serif', 
              marginTop: size.label.marginTop * 0.5,
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LUXURY ─── */
function LuxuryCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'Días' },
    { val: time.hours, label: 'Horas' },
    { val: time.minutes, label: 'Min' },
    { val: time.seconds, label: 'Seg' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(145deg, #1c1917, #292524, #1c1917)',
      borderRadius: 4, 
      padding: size.container.padding,
      position: 'relative', 
      overflow: 'hidden',
      borderTop: '2px solid #d4af37', 
      borderBottom: '2px solid #d4af37',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.33,
        backgroundImage: 'repeating-linear-gradient(45deg, #d4af37 0, #d4af37 1px, transparent 1px, transparent 20px)',
      }} />
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size.title.fontSize, 
        textAlign: 'center',
        color: '#d4af37', 
        letterSpacing: size.title.spacing * 3, 
        textTransform: 'uppercase',
        margin: `0 0 ${size.title.marginBottom}`, 
        position: 'relative',
      }}>— Cuenta Regresiva —</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto', 
        position: 'relative',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            borderLeft: i > 0 ? '1px solid rgba(212,175,55,0.2)' : 'none',
            paddingLeft: i > 0 ? size.gap : 0,
            textAlign: 'center' as const,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size.number.fontSize, 
              fontWeight: 400,
              color: '#fefce8', 
              lineHeight: 1, 
              letterSpacing: 2,
            }}>{pad(u.val)}</div>
            <div style={{
              width: 20, 
              height: 1, 
              background: '#d4af37',
              margin: `${size.label.marginTop * 1.5}px auto`,
            }} />
            <div style={{
              fontSize: size.label.fontSize, 
              color: '#d4af37',
              textTransform: 'uppercase' as const, 
              letterSpacing: 3,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── RETRO ─── */
function RetroCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'DÍAS' },
    { val: time.hours, label: 'HRS' },
    { val: time.minutes, label: 'MIN' },
    { val: time.seconds, label: 'SEG' },
  ];
  return (
    <div style={{
      background: '#fef3c7', 
      borderRadius: size.container.borderRadius,
      padding: size.container.padding,
      border: '3px solid #92400e',
      boxShadow: '6px 6px 0 #92400e',
    }}>
      <p style={{
        fontFamily: "'Courier New', monospace",
        fontSize: size.title.fontSize, 
        textAlign: 'center',
        color: '#92400e', 
        letterSpacing: size.title.spacing, 
        textTransform: 'uppercase',
        margin: `0 0 ${size.title.marginBottom}`, 
        fontWeight: 700,
      }}>⏰ CUENTA REGRESIVA ⏰</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: '#1c1917', 
            borderRadius: size.container.borderRadius * 0.4,
            padding: size.cardPadding,
            textAlign: 'center' as const, 
            border: '2px solid #78350f',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: size.number.fontSize, 
              fontWeight: 700,
              color: '#fbbf24', 
              lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: '#d97706',
              letterSpacing: 2, 
              marginTop: size.label.marginTop, 
              fontFamily: "'Courier New', monospace",
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GRADIENT CARDS ─── */
function GradientCardsCountdown({ time, size }: CountdownComponentProps) {
  const units = [
    { val: time.days, label: 'Días', gradient: 'linear-gradient(135deg, #f472b6, #e879f9)' },
    { val: time.hours, label: 'Horas', gradient: 'linear-gradient(135deg, #a78bfa, #818cf8)' },
    { val: time.minutes, label: 'Min', gradient: 'linear-gradient(135deg, #60a5fa, #38bdf8)' },
    { val: time.seconds, label: 'Seg', gradient: 'linear-gradient(135deg, #34d399, #2dd4bf)' },
  ];
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      borderRadius: size.container.borderRadius, 
      padding: size.container.padding,
    }}>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: size.title.fontSize, 
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)', 
        letterSpacing: size.title.spacing, 
        textTransform: 'uppercase',
        margin: `0 0 ${size.title.marginBottom}`,
      }}>🎉 No Faltes 🎉</p>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: size.gap, 
        maxWidth: size.container.maxWidth, 
        margin: '0 auto',
      }}>
        {units.map((u, i) => (
          <div key={i} style={{
            background: u.gradient,
            borderRadius: size.container.borderRadius,
            padding: size.cardPadding,
            textAlign: 'center' as const,
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size.number.fontSize, 
              fontWeight: 700,
              color: '#fff', 
              lineHeight: 1.1,
            }}>{pad(u.val)}</div>
            <div style={{
              fontSize: size.label.fontSize, 
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase' as const, 
              letterSpacing: 1, 
              marginTop: size.label.marginTop,
              fontFamily: 'system-ui, sans-serif',
            }}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mapa de componentes ─────────────────────────────────────
const COUNTDOWN_MAP: Record<string, React.FC<CountdownComponentProps>> = {
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
  size?: 'sm' | 'md' | 'lg';      // features.countdownSize → tamaño del contador
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  design = 'glass',
  size = 'md',
}) => {
  const time = useCountdown(targetDate);
  const sizeConfig = SIZE_CONFIGS[size];
  const CountdownComponent = COUNTDOWN_MAP[design] || GlassCountdown;

  return <CountdownComponent time={time} size={sizeConfig} />;
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

// ═════════════════════════════════════════════════════════════
// SELECTOR DE TAMAÑO — NUEVO
// ═════════════════════════════════════════════════════════════

interface CountdownSizeSelectorProps {
  selected: 'sm' | 'md' | 'lg';
  onChange: (size: 'sm' | 'md' | 'lg') => void;
}

export const CountdownSizeSelector: React.FC<CountdownSizeSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-neutral-600 mb-2">
        Tamaño del contador:
      </p>
      <div className="grid grid-cols-3 gap-2">
        {COUNTDOWN_SIZES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id as 'sm' | 'md' | 'lg')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
              selected === s.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <span className="text-xl">{s.icon}</span>
            <span className="text-[10px] font-medium text-neutral-700 leading-tight">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Countdown;