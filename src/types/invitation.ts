// src/types/invitation.ts
// Tipos compartidos para invitaciones en todo el proyecto

// ─── Estilos de marco del mapa ───
export type MapFrameStyle = 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft';

// ─── Tamaño del countdown ───
export type CountdownSize = 'sm' | 'md' | 'lg';

// ─── Animaciones disponibles ───
export type AnimationType = 'float' | 'pulse' | 'none';

// ─── Planes disponibles ───
export type PlanType = 'free' | 'basic' | 'premium';

// ─── Template base ───
export interface Template {
  id: number;
  name: string;
  preview: string;
  color: string;
}

// ─── Datos del evento ───
export interface EventData {
  name?: string;
  date?: string;
  location?: string;
  message?: string;
}

// ─── Estilos personalizados ───
export interface CustomStyles {
  gradient?: string;
  textColor?: string;
  font?: string;
  textSize?: {
    name: string;
    title: string;
    subtitle: string;
  };
  alignment?: string;
  padding?: number;
  animation?: AnimationType;
  opacity?: number;
  backgroundImage?: string;
  bgImageOpacity?: number;
  icon?: string;
  musicUrl?: string;
}

// ─── Features de la invitación ───
export interface Features {
  rsvp: boolean;           // ← required, not optional
  map: boolean;            // ← required
  gallery: boolean;        // ← required
  countdown: boolean;      // ← required
  galleryPhotos?: string[];
  mapUrl?: string;
  mapFrameStyle?: MapFrameStyle;
  countdownDesign?: string;
  countdownSize?: CountdownSize;
}

export interface EventData {
  name?: string;
  date?: string;
  location?: string;
  message?: string;
}


