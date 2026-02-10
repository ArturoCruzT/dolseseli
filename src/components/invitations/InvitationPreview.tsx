import React from 'react';
import { Button } from '../ui';
import { MapEmbed } from './MapEmbed';
import { PhotoGallery } from './PhotoGallery';
import { Countdown } from './Countdown';

interface InvitationPreviewProps {
  template: {
    id: number;
    name: string;
    preview: string;
    color: string;
  };
  eventData?: {
    name?: string;
    date?: string;
    location?: string;
    message?: string;
  };
  customStyles?: {
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
    animation?: string;
    opacity?: number;
    backgroundImage?: string;
    bgImageOpacity?: number;
    icon?: string;
  };
  features?: {
    rsvp?: boolean;
    map?: boolean;
    gallery?: boolean;
    countdown?: boolean;
    galleryPhotos?: string[];
    mapUrl?: string;
    countdownDesign?: string;
     countdownSize?: 'sm' | 'md' | 'lg'; 
  };
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  template,
  eventData = {},
  customStyles = {},
  features = {}
}) => {

  const gradient = customStyles.gradient || template.color;
  const textColor = customStyles.textColor || '#ffffff';
  const font = customStyles.font || 'font-display';
  const textSize = customStyles.textSize || { title: 'text-4xl', subtitle: 'text-lg' };
  const alignment = customStyles.alignment || 'justify-center';
  const padding = customStyles.padding || 8;
  const animation = customStyles.animation || 'float';
  const opacity = customStyles.opacity || 100;
  const backgroundImage = customStyles.backgroundImage;
  const bgImageOpacity = customStyles.bgImageOpacity || 30;
  const customIcon = customStyles.icon;

  const animationClass = animation === 'float' ? 'animate-float' : animation === 'pulse' ? 'animate-pulse' : '';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Device Frame */}
      <div className="bg-neutral-900 rounded-[3rem] p-4 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/16] relative">
          {/* Invitation Content - Con scroll */}
          <div className="h-full overflow-y-auto">
            <div
              className={`min-h-full bg-gradient-to-br ${gradient} p-${padding} flex flex-col items-center ${alignment} relative overflow-hidden`}
              style={{ opacity: opacity / 100 }}
            >
              {/* Background Image */}
              {backgroundImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    opacity: bgImageOpacity / 100
                  }}
                />
              )}

              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
              </div>

              {/* Content */}
              <div className={`relative z-10 text-center space-y-6 w-full max-w-sm py-8 ${font}`} style={{ color: textColor }}>
                <div className={`text-8xl mb-4 ${animationClass}`}>
                  {customIcon || template.preview}
                </div>

                <div className="space-y-2">
                  <p className={`text-sm font-medium tracking-widest uppercase`} style={{ opacity: 0.9 }}>
                    Estás invitado a
                  </p>
                  <h2 className={`${textSize.title} font-bold`}>
                    {eventData.name || 'Tu Evento Especial'}
                  </h2>
                </div>

                <div className="w-16 h-px bg-current opacity-50 mx-auto" />

                {/* Countdown */}
                {features.countdown && eventData.date && (
                  <Countdown targetDate={eventData.date} 
                     design={features.countdownDesign }
                     size={features.countdownSize}/>
                )}

                <div className={`space-y-3 ${textSize.subtitle}`}>
                  <p className="flex items-center justify-center gap-2">
                    <span>📅</span>
                    <span>{eventData.date || '15 de Marzo, 2024'}</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span>📍</span>
                    <span>{eventData.location || 'Salón de Eventos'}</span>
                  </p>
                </div>

                {/* Map */}
                {/* Map */}
                {features.map && eventData.location && (
                  <div className="w-full mt-6">
                    <MapEmbed location={eventData.location} mapUrl={features.mapUrl} />
                  </div>
                )}

                {eventData.message && (
                  <>
                    <div className="w-16 h-px bg-current opacity-50 mx-auto" />
                    <p className="text-sm italic max-w-xs" style={{ opacity: 0.9 }}>
                      {eventData.message}
                    </p>
                  </>
                )}

                {/* Photo Gallery */}
                {features.gallery && features.galleryPhotos && features.galleryPhotos.length > 0 && (
                  <div className="mt-6 w-full">
                    <PhotoGallery photos={features.galleryPhotos} />
                  </div>
                )}

                {/* RSVP Button 
                <div className="pt-4">
                  <button
                    className="px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                    style={{ backgroundColor: textColor, color: gradient.includes('pink') ? '#ec4899' : '#8b5cf6' }}
                  >
                    {features.rsvp ? 'Confirmar Asistencia' : 'Ver Invitación'}
                  </button>

                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};