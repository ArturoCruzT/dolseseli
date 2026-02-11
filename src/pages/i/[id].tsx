import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MapEmbed } from '../../components/invitations/MapEmbed';
import { PhotoGallery } from '../../components/invitations/PhotoGallery';
import { Countdown } from '../../components/invitations/Countdown';
import { supabase } from '@/lib/supabase';
import { YouTubePlayer } from '../../components/invitations/YouTubePlayer';
import type { MapFrameStyle, PersonEntry, GiftRegistry } from '../../types/invitation';

export default function PublicInvitation() {
    const router = useRouter();
    const { id } = router.query;
    const [invitationData, setInvitationData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRSVP, setShowRSVP] = useState(false);
    const [rsvpForm, setRsvpForm] = useState({
        name: '',
        guestCount: 1,
        message: '',
    });

    useEffect(() => {
        if (!id) return;
        const loadInvitation = async () => {
            try {
                const { data, error } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                if (data) {
                    await supabase
                        .from('invitations')
                        .update({ credits_used: (data.credits_used || 0) + 1 })
                        .eq('id', id);
                    setInvitationData({
                        template: data.styles,
                        event: data.event,
                        features: data.features,
                        id: data.id,
                    });
                } else {
                    throw new Error('Invitación no encontrada');
                }
            } catch (error) {
                console.error('Error loading invitation:', error);
                setInvitationData(null);
            } finally {
                setLoading(false);
            }
        };
        loadInvitation();
    }, [id]);

    const handleRSVPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('RSVP enviado:', rsvpForm);
            alert('✅ ¡Gracias por confirmar! El anfitrión ha sido notificado.');
            setShowRSVP(false);
            setRsvpForm({ name: '', guestCount: 1, message: '' });
        } catch (error) {
            console.error('Error al enviar RSVP:', error);
            alert('❌ Error al enviar confirmación. Intenta de nuevo.');
        }
    };

    const formatTime = (time?: string) => {
        if (!time) return '';
        const [h, m] = time.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <p className="text-xl">Cargando invitación...</p>
                </div>
            </div>
        );
    }

    if (!invitationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
                <div className="text-white text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-3xl font-bold mb-2">Invitación no encontrada</h1>
                    <p className="text-neutral-400 mb-6">El enlace que usaste no es válido o la invitación fue eliminada.</p>
                    <a href="https://dolseseli.com" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all">
                        Ir a Dolseseli
                    </a>
                </div>
            </div>
        );
    }

    const { template, event, features } = invitationData;

    const gradient = template.gradient || 'from-pink-400 via-rose-400 to-fuchsia-500';
    const textColor = template.textColor || '#ffffff';
    const font = template.font || 'font-display';
    const icon = template.icon || '👑';
    const animation = template.animation || 'float';
    const backgroundImage = template.backgroundImage;
    const bgImageOpacity = template.bgImageOpacity || 30;
    const musicUrl = template.musicUrl || null;
    const textSize = template.textSize || { title: 'text-5xl', subtitle: 'text-lg' };
    const animationClass = animation === 'float' ? 'animate-float' : animation === 'pulse' ? 'animate-pulse' : '';

    const hasItinerary = event.ceremony_time || event.reception_time;
    const hasParents = event.parents && event.parents.length > 0;
    const hasGodparents = event.godparents && event.godparents.length > 0;
    const hasGiftRegistry = event.gift_registry && event.gift_registry.length > 0;
    const hasDressCode = !!event.dress_code;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="max-h-[85vh] overflow-y-auto">
                        <div className={`min-h-full bg-gradient-to-br ${gradient} p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
                            {/* Background Image */}
                            {backgroundImage && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${backgroundImage})`, opacity: bgImageOpacity / 100 }}
                                />
                            )}

                            {/* Decorative Elements */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
                            </div>

                            {/* Content */}
                            <div className={`relative z-10 text-center space-y-6 w-full ${font}`} style={{ color: textColor }}>
                                {musicUrl && <YouTubePlayer url={musicUrl} />}

                                <div className={`text-9xl mb-6 ${animationClass}`}>{icon}</div>

                                {/* Honoree Photo */}
                                {event.honoree_photo && (
                                    <div className="flex justify-center">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                                            <img src={event.honoree_photo} alt="Festejado" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}

                                {/* Event Name */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium tracking-widest uppercase opacity-90">Estás invitado a</p>
                                    <h1 className={`${textSize.title} font-bold leading-tight`}>{event.name}</h1>
                                </div>

                                {/* Honoree Names */}
                                {(event.honoree_name || event.honoree_name_2) && (
                                    <div className="space-y-1">
                                        {event.honoree_name && (
                                            <p className={`${textSize.subtitle} font-semibold`}>{event.honoree_name}</p>
                                        )}
                                        {event.honoree_name_2 && (
                                            <p className={`${textSize.subtitle} font-semibold`}>& {event.honoree_name_2}</p>
                                        )}
                                        {event.honoree_age && (
                                            <p className="text-sm opacity-80">{event.honoree_age} años</p>
                                        )}
                                    </div>
                                )}

                                <div className="w-16 h-px bg-white/50 mx-auto" />

                                {/* Parents */}
                                {hasParents && (
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-widest opacity-70">Con la bendición de</p>
                                        {event.parents.map((p: PersonEntry, i: number) => (
                                            <p key={i} className="text-sm">
                                                <span className="opacity-70">{p.role}: </span>
                                                <span className="font-semibold">{p.name}</span>
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Godparents */}
                                {hasGodparents && (
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-widest opacity-70">Padrinos</p>
                                        {event.godparents.map((p: PersonEntry, i: number) => (
                                            <p key={i} className="text-sm">
                                                <span className="opacity-70">{p.role}: </span>
                                                <span className="font-semibold">{p.name}</span>
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {(hasParents || hasGodparents) && (
                                    <div className="w-16 h-px bg-white/50 mx-auto" />
                                )}

                                {/* Countdown */}
                                {features.countdown && (
                                    <Countdown targetDate={event.date} design={features.countdownDesign} />
                                )}

                                {/* Date & Location */}
                                <div className="space-y-3 text-lg">
                                    <p className="flex items-center justify-center gap-2">
                                        <span>📅</span>
                                        <span>{new Date(event.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <span>📍</span>
                                        <span>{event.location}</span>
                                    </p>
                                </div>

                                {/* ─── Itinerary ─── */}
                                {hasItinerary && (
                                    <>
                                        <div className="w-16 h-px bg-white/50 mx-auto" />
                                        <div className="space-y-4 w-full">
                                            <p className="text-xs uppercase tracking-widest opacity-70">Itinerario</p>

                                            {event.ceremony_time && (
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span>⛪</span>
                                                        <span className="font-bold text-sm">Ceremonia</span>
                                                        <span className="ml-auto text-sm font-semibold">{formatTime(event.ceremony_time)}</span>
                                                    </div>
                                                    {event.ceremony_location && (
                                                        <p className="text-xs ml-6 opacity-85">{event.ceremony_location}</p>
                                                    )}
                                                    {event.ceremony_address && (
                                                        <p className="text-xs ml-6 opacity-65">{event.ceremony_address}</p>
                                                    )}
                                                </div>
                                            )}

                                            {event.reception_time && (
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span>🎉</span>
                                                        <span className="font-bold text-sm">Recepción</span>
                                                        <span className="ml-auto text-sm font-semibold">{formatTime(event.reception_time)}</span>
                                                    </div>
                                                    {event.reception_location && (
                                                        <p className="text-xs ml-6 opacity-85">{event.reception_location}</p>
                                                    )}
                                                    {event.reception_address && (
                                                        <p className="text-xs ml-6 opacity-65">{event.reception_address}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Message */}
                                {event.message && (
                                    <>
                                        <div className="w-16 h-px bg-white/50 mx-auto" />
                                        <p className="text-sm italic opacity-90 max-w-xs mx-auto">{event.message}</p>
                                    </>
                                )}

                                {/* ─── Dress Code ─── */}
                                {hasDressCode && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Código de Vestimenta</p>
                                        <p className="font-bold text-sm">{event.dress_code}</p>
                                        {event.dress_code_colors && event.dress_code_colors.length > 0 && (
                                            <p className="text-xs mt-1 opacity-80">
                                                Colores sugeridos: {event.dress_code_colors.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* ─── No Kids ─── */}
                                {event.no_kids && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                        <p className="text-xs font-semibold">🚫 Evento exclusivo para adultos</p>
                                    </div>
                                )}

                                {/* ─── Parking ─── */}
                                {event.parking_info && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                        <p className="text-xs">🅿️ {event.parking_info}</p>
                                    </div>
                                )}

                                {/* ─── Special Notes ─── */}
                                {event.special_notes && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                        <p className="text-xs">📝 {event.special_notes}</p>
                                    </div>
                                )}

                                {/* Map - Ceremony */}
                                {event.ceremony_map_url && (
                                    <div className="w-full pt-4">
                                        <p className="text-xs uppercase tracking-widest mb-2 opacity-70">📍 Ceremonia</p>
                                        <MapEmbed
                                            location={event.ceremony_location || ''}
                                            mapUrl={event.ceremony_map_url}
                                            frameStyle={features.mapFrameStyle as MapFrameStyle}
                                        />
                                    </div>
                                )}

                                {/* Map - Reception */}
                                {event.reception_map_url && (
                                    <div className="w-full pt-4">
                                        <p className="text-xs uppercase tracking-widest mb-2 opacity-70">📍 Recepción</p>
                                        <MapEmbed
                                            location={event.reception_location || ''}
                                            mapUrl={event.reception_map_url}
                                            frameStyle={features.mapFrameStyle as MapFrameStyle}
                                        />
                                    </div>
                                )}

                                {/* Map - General (fallback) */}
                                {features.map && event.location && !event.ceremony_map_url && !event.reception_map_url && (
                                    <div className="w-full mt-15 pt-10">
                                        <MapEmbed
                                            location={event.location}
                                            mapUrl={features.mapUrl}
                                            frameStyle={features.mapFrameStyle as MapFrameStyle}
                                        />
                                    </div>
                                )}

                                {/* Photo Gallery */}
                                {features.gallery && features.galleryPhotos && features.galleryPhotos.length > 0 && (
                                    <div className="mt-6 w-full">
                                        <PhotoGallery photos={features.galleryPhotos} />
                                    </div>
                                )}

                                {/* ─── Gift Registry ─── */}
                                {hasGiftRegistry && (
                                    <div className="w-full space-y-2">
                                        <div className="w-16 h-px bg-white/50 mx-auto" />
                                        <p className="text-xs uppercase tracking-widest opacity-70">🎁 Mesa de Regalos</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {event.gift_registry.map((reg: GiftRegistry, i: number) => (
                                                <a
                                                    key={i}
                                                    href={reg.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold hover:bg-white/30 transition-colors"
                                                >
                                                    🎁 {reg.name || 'Ver mesa de regalos'}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ─── Hashtag ─── */}
                                {event.hashtag && (
                                    <p className="text-sm font-bold opacity-80">{event.hashtag}</p>
                                )}

                                {/* RSVP Button */}
                                {features.rsvp && (
                                    <div className="pt-4">
                                        <button
                                            onClick={() => setShowRSVP(true)}
                                            className="px-10 py-4 bg-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                                            style={{ color: gradient.includes('pink') ? '#ec4899' : '#8b5cf6' }}
                                        >
                                            ✅ Confirmar Asistencia
                                        </button>
                                    </div>
                                )}

                                {/* Powered by */}
                                <div className="pt-8 opacity-60">
                                    <p className="text-xs">
                                        Hecho con 💜 en{' '}
                                        <a href="https://dolseseli.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:opacity-80">
                                            Dolseseli
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                    <a href="https://dolseseli.com" className="inline-block px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:shadow-lg transition-all">
                        🎉 Crea tu propia invitación
                    </a>
                </div>
            </div>

            {/* RSVP Modal */}
            {showRSVP && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-3xl font-display font-bold mb-2">Confirmar Asistencia</h2>
                            <p className="text-neutral-600">Por favor completa tus datos</p>
                        </div>
                        <form onSubmit={handleRSVPSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={rsvpForm.name}
                                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                                    placeholder="Ej: María García"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Número de Personas *</label>
                                <select
                                    required
                                    value={rsvpForm.guestCount}
                                    onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                >
                                    <option value={1}>1 persona</option>
                                    <option value={2}>2 personas</option>
                                    <option value={3}>3 personas</option>
                                    <option value={4}>4 personas</option>
                                    <option value={5}>5+ personas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Mensaje (Opcional)</label>
                                <textarea
                                    rows={3}
                                    value={rsvpForm.message}
                                    onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                                    placeholder="Deja un mensaje especial..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRSVP(false)}
                                    className="flex-1 px-6 py-3 border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}