import React from 'react';
import { MapEmbed } from './MapEmbed';
import { PhotoGallery } from './PhotoGallery';
import { Countdown } from './Countdown';
import { EntryEffects } from './EntryEffects';
import type {
  Template,
  EventData,
  CustomStyles,
  Features,
  PersonEntry,
  GiftRegistry,
  EntryEffectType,
  EffectIntensity,
  GuestInfo 
} from '../../types/invitation';

interface InvitationPreviewProps {
  template: Template;
  eventData?: EventData;
  customStyles?: CustomStyles;
  features?: Features;
    guest?: GuestInfo;

  // Opcional: por si en público quieres quitar marco de “celular”
  showDeviceFrame?: boolean;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  template,
  eventData = {} as EventData,
  customStyles = {} as CustomStyles,
  features = {} as Features,
  showDeviceFrame = true,
}) => {
  const gradient = customStyles.gradient || template.color;
  const textColor = customStyles.textColor || '#ffffff';
  const font = customStyles.font || 'font-display';
  const textSize = customStyles.textSize || { title: 'text-4xl', subtitle: 'text-lg' };
  const alignment = customStyles.alignment || 'justify-center';

  // padding viene como “8” (tipo tailwind), lo convertimos a px aprox (8 * 4 = 32px)
  const padding = Number(customStyles.padding ?? 8);
  const paddingPx = Math.max(0, padding) * 4;

  const animation = customStyles.animation || 'float';
  const opacity = customStyles.opacity || 100;

  const backgroundImage = customStyles.backgroundImage;
  const bgImageOpacity = customStyles.bgImageOpacity || 30;
  const customIcon = customStyles.icon;

  const animationClass =
    animation === 'float' ? 'animate-float' : animation === 'pulse' ? 'animate-pulse' : '';

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const hasItinerary = !!(eventData.ceremony_time || eventData.reception_time);
  const hasParents = !!(eventData.parents && eventData.parents.length > 0);
  const hasGodparents = !!(eventData.godparents && eventData.godparents.length > 0);
  const hasGiftRegistry = !!(eventData.gift_registry && eventData.gift_registry.length > 0);
  const hasDressCode = !!eventData.dress_code;

  const content = (
    <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/16] relative">
      <div className="h-full overflow-y-auto">
        <div
          className={`min-h-full bg-gradient-to-br ${gradient} flex flex-col items-center ${alignment} relative overflow-hidden`}
          style={{ opacity: opacity / 100, padding: paddingPx }}
        >
          {/* Background Image */}
          {backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                opacity: bgImageOpacity / 100,
              }}
            />
          )}

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>

          {/* Entry Effects */}
          {features.entryEffect && features.entryEffect !== 'none' && (
            <EntryEffects
              effect={features.entryEffect as EntryEffectType}
              intensity={(features.entryEffectIntensity as EffectIntensity) || 'medium'}
            />
          )}

          {/* Content */}
          <div
            className={`relative z-10 text-center space-y-6 w-full max-w-sm py-8 ${font}`}
            style={{ color: textColor }}
          >
            {/* Icon */}
            <div className={`text-8xl mb-4 ${animationClass}`}>{customIcon || template.preview}</div>

            {/* Honoree Photo */}
            {eventData.honoree_photo && (
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                  <img
                    src={eventData.honoree_photo}
                    alt="Festejado"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Event Name */}
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-widest uppercase" style={{ opacity: 0.9 }}>
                Estás invitado a
              </p>
              <h2 className={`${textSize.title} font-bold`}>{eventData.name || 'Tu Evento Especial'}</h2>
            </div>

            {/* Honoree Name(s) */}
            {(eventData.honoree_name || eventData.honoree_name_2) && (
              <div className="space-y-1">
                {eventData.honoree_name && (
                  <p className={`${textSize.subtitle} font-semibold`}>{eventData.honoree_name}</p>
                )}
                {eventData.honoree_name_2 && (
                  <p className={`${textSize.subtitle} font-semibold`}>& {eventData.honoree_name_2}</p>
                )}
                {eventData.honoree_age && (
                  <p className="text-sm" style={{ opacity: 0.8 }}>
                    {eventData.honoree_age} años
                  </p>
                )}
              </div>
            )}

            <div className="w-16 h-px bg-current opacity-50 mx-auto" />

            {/* Parents */}
            {hasParents && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.7 }}>
                  Con la bendición de
                </p>
                {eventData.parents!.map((p: PersonEntry, i: number) => (
                  <p key={i} className="text-sm">
                    <span style={{ opacity: 0.7 }}>{p.role}: </span>
                    <span className="font-semibold">{p.name}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Godparents */}
            {hasGodparents && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.7 }}>
                  Padrinos
                </p>
                {eventData.godparents!.map((p: PersonEntry, i: number) => (
                  <p key={i} className="text-sm">
                    <span style={{ opacity: 0.7 }}>{p.role}: </span>
                    <span className="font-semibold">{p.name}</span>
                  </p>
                ))}
              </div>
            )}

            {(hasParents || hasGodparents) && <div className="w-16 h-px bg-current opacity-50 mx-auto" />}

            {/* Countdown */}
            {features.countdown && eventData.date && (
              <Countdown
                targetDate={eventData.date}
                design={features.countdownDesign}
                size={features.countdownSize}
              />
            )}

            {/* Date & Location */}
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

            {/* Itinerary */}
            {hasItinerary && (
              <>
                <div className="w-16 h-px bg-current opacity-50 mx-auto" />
                <div className="space-y-4 w-full">
                  <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.7 }}>
                    Itinerario
                  </p>

                  {eventData.ceremony_time && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span>⛪</span>
                        <span className="font-bold text-sm">Ceremonia</span>
                        <span className="ml-auto text-sm font-semibold">
                          {formatTime(eventData.ceremony_time)}
                        </span>
                      </div>
                      {eventData.ceremony_location && (
                        <p className="text-xs ml-6" style={{ opacity: 0.85 }}>
                          {eventData.ceremony_location}
                        </p>
                      )}
                      {eventData.ceremony_address && (
                        <p className="text-xs ml-6" style={{ opacity: 0.65 }}>
                          {eventData.ceremony_address}
                        </p>
                      )}
                    </div>
                  )}

                  {eventData.reception_time && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span>🎉</span>
                        <span className="font-bold text-sm">Recepción</span>
                        <span className="ml-auto text-sm font-semibold">
                          {formatTime(eventData.reception_time)}
                        </span>
                      </div>
                      {eventData.reception_location && (
                        <p className="text-xs ml-6" style={{ opacity: 0.85 }}>
                          {eventData.reception_location}
                        </p>
                      )}
                      {eventData.reception_address && (
                        <p className="text-xs ml-6" style={{ opacity: 0.65 }}>
                          {eventData.reception_address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Message */}
            {eventData.message && (
              <>
                <div className="w-16 h-px bg-current opacity-50 mx-auto" />
                <p className="text-sm italic max-w-xs" style={{ opacity: 0.9 }}>
                  {eventData.message}
                </p>
              </>
            )}

            {/* Dress Code */}
            {hasDressCode && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest mb-1" style={{ opacity: 0.7 }}>
                  Código de Vestimenta
                </p>
                <p className="font-bold text-sm">{eventData.dress_code}</p>
                {eventData.dress_code_colors && eventData.dress_code_colors.length > 0 && (
                  <p className="text-xs mt-1" style={{ opacity: 0.8 }}>
                    Colores sugeridos: {eventData.dress_code_colors.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* No Kids */}
            {eventData.no_kids && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-xs font-semibold">🚫 Evento exclusivo para adultos</p>
              </div>
            )}

            {/* Parking */}
            {eventData.parking_info && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-xs">🅿️ {eventData.parking_info}</p>
              </div>
            )}

            {/* Special Notes */}
            {eventData.special_notes && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-xs">📝 {eventData.special_notes}</p>
              </div>
            )}

            {/* Map - Ceremony */}
            {eventData.ceremony_map_url && (
              <div className="w-full pt-4">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ opacity: 0.7 }}>
                  📍 Ceremonia
                </p>
                <MapEmbed
                  location={eventData.ceremony_location || ''}
                  mapUrl={eventData.ceremony_map_url}
                  frameStyle={(features.mapFrameStyle || 'none') as any}
                />
              </div>
            )}

            {/* Map - Reception */}
            {eventData.reception_map_url && (
              <div className="w-full pt-4">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ opacity: 0.7 }}>
                  📍 Recepción
                </p>
                <MapEmbed
                  location={eventData.reception_location || ''}
                  mapUrl={eventData.reception_map_url}
                  frameStyle={(features.mapFrameStyle || 'none') as any}
                />
              </div>
            )}

            {/* Map - General */}
            {features.map && eventData.location && !eventData.ceremony_map_url && !eventData.reception_map_url && (
              <div className="w-full pt-10">
                <MapEmbed
                  location={eventData.location}
                  mapUrl={features.mapUrl}
                  frameStyle={(features.mapFrameStyle || 'none') as any}
                />
              </div>
            )}

            {/* Photo Gallery */}
            {features.gallery && features.galleryPhotos && features.galleryPhotos.length > 0 && (
              <div className="mt-6 w-full">
                <PhotoGallery photos={features.galleryPhotos} />
              </div>
            )}

            {/* Gift Registry */}
            {hasGiftRegistry && (
              <div className="w-full space-y-2">
                <div className="w-16 h-px bg-current opacity-50 mx-auto" />
                <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.7 }}>
                  🎁 Mesa de Regalos
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {eventData.gift_registry!.map((reg: GiftRegistry, i: number) => (
                    <a
                      key={i}
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold hover:bg-white/30 transition-colors"
                    >
                      {reg.name || 'Ver mesa de regalos'}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtag */}
            {eventData.hashtag && (
              <p className="text-sm font-bold" style={{ opacity: 0.8 }}>
                {eventData.hashtag}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Con marco (preview en dashboard) o sin marco (página pública)
  if (!showDeviceFrame) {
    return <div className="w-full max-w-2xl mx-auto">{content}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-neutral-900 rounded-[3rem] p-4 shadow-2xl">{content}</div>
    </div>
  );
};
