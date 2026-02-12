import React, { useEffect, useState, useMemo } from 'react';
import type { EntryEffectType, EffectIntensity } from '@/types/invitation';

// ═══════════════════════════════════════════════════════════
// EntryEffects.tsx
//
// Efectos visuales animados que se reproducen al cargar
// la invitación. Usa CSS puro (no canvas) para máxima
// compatibilidad mobile.
// ═══════════════════════════════════════════════════════════

interface EntryEffectsProps {
  effect: EntryEffectType;
  duration?: number;
  intensity?: EffectIntensity;
}

// ─── Configuración de cada efecto ────────────────────────

interface ParticleConfig {
  emoji?: string;
  emojis?: string[];
  count: { light: number; medium: number; heavy: number };
  sizeRange: [number, number];   // [min, max] en px
  durationRange: [number, number]; // [min, max] en segundos
  swayRange?: [number, number];  // movimiento horizontal
  rotateRange?: [number, number];
  opacity?: [number, number];
  glow?: boolean;
  useShapes?: boolean;           // Usa formas CSS en vez de emoji
  shapeColors?: string[];
}

const EFFECTS_CONFIG: Record<string, ParticleConfig> = {
  petals: {
    emojis: ['🌸', '🩷', '💮', '🌺'],
    count: { light: 12, medium: 20, heavy: 35 },
    sizeRange: [16, 28],
    durationRange: [4, 9],
    swayRange: [-80, 80],
    rotateRange: [0, 720],
    opacity: [0.6, 1],
  },
  confetti: {
    count: { light: 25, medium: 45, heavy: 70 },
    sizeRange: [6, 12],
    durationRange: [3, 7],
    swayRange: [-120, 120],
    rotateRange: [0, 1080],
    opacity: [0.8, 1],
    useShapes: true,
    shapeColors: [
      '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
      '#FF6EB4', '#A66CFF', '#FF8C32', '#45CFDD',
      '#F94C10', '#C0EDA6', '#FFB4B4', '#B2A4FF',
    ],
  },
  hearts: {
    emojis: ['❤️', '💕', '💖', '💗', '💝', '🩷'],
    count: { light: 10, medium: 18, heavy: 30 },
    sizeRange: [14, 26],
    durationRange: [4, 8],
    swayRange: [-60, 60],
    rotateRange: [-30, 30],
    opacity: [0.5, 1],
  },
  stars: {
    emojis: ['⭐', '✨', '🌟', '💫'],
    count: { light: 12, medium: 22, heavy: 38 },
    sizeRange: [12, 24],
    durationRange: [3, 7],
    swayRange: [-50, 50],
    rotateRange: [0, 360],
    opacity: [0.4, 1],
    glow: true,
  },
  bubbles: {
    emoji: '🫧',
    count: { light: 10, medium: 18, heavy: 28 },
    sizeRange: [14, 30],
    durationRange: [5, 10],
    swayRange: [-40, 40],
    rotateRange: [0, 0],
    opacity: [0.3, 0.7],
  },
  snow: {
    emojis: ['❄️', '❅', '❆', '•'],
    count: { light: 20, medium: 35, heavy: 55 },
    sizeRange: [10, 22],
    durationRange: [5, 12],
    swayRange: [-30, 30],
    rotateRange: [0, 360],
    opacity: [0.4, 0.9],
  },
  fireflies: {
    emoji: '•',
    count: { light: 15, medium: 25, heavy: 40 },
    sizeRange: [4, 8],
    durationRange: [4, 8],
    swayRange: [-100, 100],
    rotateRange: [0, 0],
    opacity: [0.3, 1],
    glow: true,
  },
  sparkles: {
    emojis: ['✦', '✧', '⋆', '✵', '✶'],
    count: { light: 15, medium: 25, heavy: 40 },
    sizeRange: [8, 18],
    durationRange: [2, 5],
    swayRange: [-60, 60],
    rotateRange: [0, 360],
    opacity: [0.3, 1],
    glow: true,
  },
  butterflies: {
    emojis: ['🦋', '🦋', '🦋'],
    count: { light: 6, medium: 12, heavy: 20 },
    sizeRange: [18, 30],
    durationRange: [6, 12],
    swayRange: [-120, 120],
    rotateRange: [-20, 20],
    opacity: [0.6, 1],
  },
};

// ─── Utilidades ──────────────────────────────────────────

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

// ─── Componente principal ────────────────────────────────

export const EntryEffects: React.FC<EntryEffectsProps> = ({
  effect,
  duration = 0,
  intensity = 'medium',
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (effect === 'none' || !visible) return null;

  const config = EFFECTS_CONFIG[effect];
  if (!config) return null;

  const count = config.count[intensity];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* CSS Keyframes inyectados */}
      <style>{generateKeyframes(effect, config)}</style>

      {/* Partículas */}
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} config={config} effect={effect} />
      ))}
    </div>
  );
};

// ─── Partícula individual ────────────────────────────────

const Particle: React.FC<{
  index: number;
  config: ParticleConfig;
  effect: EntryEffectType;
}> = ({ index, config, effect }) => {
  // Memoizar valores aleatorios para que no cambien en re-renders
  const particleStyle = useMemo(() => {
    const size = rand(config.sizeRange[0], config.sizeRange[1]);
    const duration = rand(config.durationRange[0], config.durationRange[1]);
    const delay = rand(0, 5);
    const startX = rand(0, 100);
    const opacity = config.opacity ? rand(config.opacity[0], config.opacity[1]) : 1;
    const swayX = config.swayRange ? rand(config.swayRange[0], config.swayRange[1]) : 0;
    const rotation = config.rotateRange ? rand(config.rotateRange[0], config.rotateRange[1]) : 0;

    // Para confetti, forma random
    let shapeStyle: React.CSSProperties = {};
    let content = '';

    if (config.useShapes && config.shapeColors) {
      const color = config.shapeColors[index % config.shapeColors.length];
      const shapeType = index % 3; // 0=rect, 1=circle, 2=rect rotado
      shapeStyle = {
        backgroundColor: color,
        borderRadius: shapeType === 1 ? '50%' : shapeType === 2 ? '2px' : '1px',
        width: `${size}px`,
        height: shapeType === 0 ? `${size * 0.4}px` : shapeType === 2 ? `${size * 1.5}px` : `${size}px`,
      };
    } else {
      const emojis = config.emojis || (config.emoji ? [config.emoji] : ['•']);
      content = emojis[index % emojis.length];
    }

    const isFirefly = effect === 'fireflies';
    const glowColor = isFirefly ? '#FFD700' : '#ffffff';

    const style: React.CSSProperties = {
      position: 'absolute' as const,
      left: `${startX}%`,
      top: '-5%',
      fontSize: config.useShapes ? undefined : `${size}px`,
      opacity,
      animation: `entryEffect-fall-${effect} ${duration}s linear ${delay}s infinite`,
      willChange: 'transform',
      ...shapeStyle,
      ...(config.glow ? {
        filter: `drop-shadow(0 0 ${isFirefly ? size : size / 2}px ${glowColor})`,
        ...(isFirefly ? { backgroundColor: '#FFD700', borderRadius: '50%', width: `${size}px`, height: `${size}px` } : {}),
      } : {}),
      ['--sway-x' as any]: `${swayX}px`,
      ['--rotation' as any]: `${rotation}deg`,
    };

    return { style, content };
  }, [index, config, effect]);

  return (
    <div style={particleStyle.style}>
      {particleStyle.content}
    </div>
  );
};

// ─── Generar keyframes CSS ───────────────────────────────

function generateKeyframes(effect: EntryEffectType, config: ParticleConfig): string {
  const isFirefly = effect === 'fireflies';
  const isButterfly = effect === 'butterflies';
  const isBubble = effect === 'bubbles';

  if (isBubble) {
    // Burbujas van de abajo hacia arriba
    return `
      @keyframes entryEffect-fall-${effect} {
        0% {
          transform: translateY(110vh) translateX(0) scale(0.5);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
          transform: translateY(90vh) translateX(var(--sway-x, 0px)) scale(0.8);
        }
        90% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-10vh) translateX(calc(var(--sway-x, 0px) * -1)) scale(1.1);
          opacity: 0;
        }
      }
    `;
  }

  if (isFirefly) {
    return `
      @keyframes entryEffect-fall-${effect} {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        15% {
          opacity: 1;
        }
        25% {
          transform: translateY(20vh) translateX(var(--sway-x, 0px));
        }
        50% {
          transform: translateY(45vh) translateX(calc(var(--sway-x, 0px) * -0.5));
          opacity: 0.3;
        }
        75% {
          transform: translateY(70vh) translateX(var(--sway-x, 0px));
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
      }
    `;
  }

  if (isButterfly) {
    return `
      @keyframes entryEffect-fall-${effect} {
        0% {
          transform: translateY(-5%) translateX(0) rotate(0deg) scaleX(1);
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        20% {
          transform: translateY(15vh) translateX(var(--sway-x, 0px)) rotate(var(--rotation, 10deg)) scaleX(-1);
        }
        40% {
          transform: translateY(35vh) translateX(calc(var(--sway-x, 0px) * -0.7)) rotate(calc(var(--rotation, 10deg) * -1)) scaleX(1);
        }
        60% {
          transform: translateY(55vh) translateX(var(--sway-x, 0px)) rotate(var(--rotation, 10deg)) scaleX(-1);
        }
        80% {
          transform: translateY(75vh) translateX(calc(var(--sway-x, 0px) * -0.3)) rotate(0deg) scaleX(1);
          opacity: 0.6;
        }
        100% {
          transform: translateY(110vh) translateX(0) rotate(var(--rotation, 10deg)) scaleX(-1);
          opacity: 0;
        }
      }
    `;
  }

  // Default: caída con meneo (pétalos, confetti, hearts, stars, snow, sparkles)
  return `
    @keyframes entryEffect-fall-${effect} {
      0% {
        transform: translateY(-5%) translateX(0) rotate(0deg);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      25% {
        transform: translateY(25vh) translateX(var(--sway-x, 0px)) rotate(calc(var(--rotation, 0deg) * 0.25));
      }
      50% {
        transform: translateY(50vh) translateX(calc(var(--sway-x, 0px) * -0.5)) rotate(calc(var(--rotation, 0deg) * 0.5));
      }
      75% {
        transform: translateY(75vh) translateX(var(--sway-x, 0px)) rotate(calc(var(--rotation, 0deg) * 0.75));
        opacity: 0.5;
      }
      100% {
        transform: translateY(110vh) translateX(0) rotate(var(--rotation, 0deg));
        opacity: 0;
      }
    }
  `;
}

// ═══════════════════════════════════════════════════════════
// EntryEffectSelector — Selector visual para el formulario
// ═══════════════════════════════════════════════════════════

interface EffectOption {
  id: EntryEffectType;
  label: string;
  icon: string;
  description: string;
}

const EFFECT_OPTIONS: EffectOption[] = [
  { id: 'none', label: 'Sin efecto', icon: '🚫', description: 'Sin animación' },
  { id: 'petals', label: 'Pétalos', icon: '🌸', description: 'Pétalos de flor cayendo' },
  { id: 'confetti', label: 'Confetti', icon: '🎊', description: 'Lluvia de confetti colorido' },
  { id: 'hearts', label: 'Corazones', icon: '💕', description: 'Corazones flotantes' },
  { id: 'stars', label: 'Estrellas', icon: '✨', description: 'Estrellas brillantes' },
  { id: 'sparkles', label: 'Destellos', icon: '✦', description: 'Destellos mágicos' },
  { id: 'bubbles', label: 'Burbujas', icon: '🫧', description: 'Burbujas subiendo' },
  { id: 'snow', label: 'Nieve', icon: '❄️', description: 'Copos de nieve' },
  { id: 'fireflies', label: 'Luciérnagas', icon: '🔥', description: 'Luces cálidas flotantes' },
  { id: 'butterflies', label: 'Mariposas', icon: '🦋', description: 'Mariposas volando' },
];

interface EntryEffectSelectorProps {
  selected: EntryEffectType;
  onChange: (effect: EntryEffectType) => void;
  selectedIntensity?: 'light' | 'medium' | 'heavy';
  onIntensityChange?: (intensity: 'light' | 'medium' | 'heavy') => void;
}

export const EntryEffectSelector: React.FC<EntryEffectSelectorProps> = ({
  selected,
  onChange,
  selectedIntensity = 'medium',
  onIntensityChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Grid de efectos */}
      <div className="grid grid-cols-2 gap-2">
        {EFFECT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
              selected === opt.id
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span className="text-xl flex-shrink-0">{opt.icon}</span>
            <div className="min-w-0">
              <p className={`text-xs font-bold ${selected === opt.id ? 'text-purple-700' : 'text-neutral-800'}`}>
                {opt.label}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Intensidad */}
      {selected !== 'none' && onIntensityChange && (
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-2">Intensidad</label>
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {(['light', 'medium', 'heavy'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onIntensityChange(level)}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  selectedIntensity === level
                    ? 'bg-white shadow-sm text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {level === 'light' ? '✦ Suave' : level === 'medium' ? '✦✦ Normal' : '✦✦✦ Intenso'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};