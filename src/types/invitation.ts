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

// ─── Persona (padre, padrino, etc.) ───
export interface PersonEntry {
  name: string;
  role: string; // "Mamá", "Papá", "Madrina", "Padrino", etc.
}

// ─── Mesa de regalos ───
export interface GiftRegistry {
  name: string;  // "Liverpool", "Amazon", etc.
  url: string;
}

// ─── Datos del evento ───
export interface EventData {
  // ─── Básicos (existentes) ───
  name?: string;
  date?: string;
  location?: string;
  message?: string;

  // ─── Festejado ───
  honoree_name?: string;
  honoree_name_2?: string;       // Para bodas (segundo nombre)
  honoree_age?: number;          // Para XV años, cumpleaños
  honoree_photo?: string;        // URL de Storage

  // ─── Itinerario ───
  ceremony_time?: string;
  ceremony_location?: string;
  ceremony_address?: string;
  ceremony_map_url?: string;
  reception_time?: string;
  reception_location?: string;
  reception_address?: string;
  reception_map_url?: string;

  // ─── Detalles ───
  dress_code?: string;
  dress_code_colors?: string[];
  gift_registry?: GiftRegistry[];
  no_kids?: boolean;
  parking_info?: string;
  special_notes?: string;

  // ─── Familia ───
  parents?: PersonEntry[];
  godparents?: PersonEntry[];

  // ─── Social ───
  hashtag?: string;
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

// ─── Efectos de entrada ───
export type EntryEffectType =
  | 'none'
  | 'petals'
  | 'confetti'
  | 'hearts'
  | 'stars'
  | 'bubbles'
  | 'snow'
  | 'fireflies'
  | 'sparkles'
  | 'butterflies';

export type EffectIntensity = 'light' | 'medium' | 'heavy';

// ─── Features de la invitación ───
export interface Features {
  rsvp: boolean;
  map: boolean;
  gallery: boolean;
  countdown: boolean;
  galleryPhotos?: string[];
  mapUrl?: string;
  mapFrameStyle?: MapFrameStyle;
  countdownDesign?: string;
  countdownSize?: CountdownSize;
  entryEffect?: EntryEffectType;
  entryEffectIntensity?: EffectIntensity;
}

// ─── Guest / Invitado ───
export type GuestStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  invitation_id: string;
  guest_code: string;         // Código único corto (ej: "mf7k2x")
  name: string;
  phone?: string;
  max_passes: number;         // Pases asignados por el admin
  confirmed_passes: number;   // Pases confirmados por el invitado
  status: GuestStatus;
  message?: string;           // Mensaje del invitado al confirmar
  first_access?: string;      // Timestamp primer acceso
  confirmed_at?: string;
  created_at: string;
}

export interface GuestInfo {
  id?: string;
  name?: string;
  guest_code?: string;
  max_passes?: number;
}