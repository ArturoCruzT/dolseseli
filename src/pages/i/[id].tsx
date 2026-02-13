import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MapEmbed } from '../../components/invitations/MapEmbed';
import { PhotoGallery } from '../../components/invitations/PhotoGallery';
import { Countdown } from '../../components/invitations/Countdown';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { YouTubePlayer } from '../../components/invitations/YouTubePlayer';
import { EntryEffects } from '../../components/invitations/EntryEffects';
import type { MapFrameStyle, PersonEntry, GiftRegistry, EntryEffectType, EffectIntensity, Guest, GuestStatus } from '../../types/invitation';

export default function PublicInvitation() {
    const router = useRouter();
    const { id, guest: guestCode } = router.query;
    const [invitationData, setInvitationData] = useState<any>(null);
    const [guestData, setGuestData] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRSVP, setShowRSVP] = useState(false);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [rsvpForm, setRsvpForm] = useState({
        confirmedPasses: 1,
        message: '',
    });

    useEffect(() => {
        if (!router.isReady || !id) return;

        const loadInvitation = async () => {
            try {
                const { data, error } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (!data || data.status !== 'published') {
                    setInvitationData(null);
                    setLoading(false);
                    return;
                }

                setInvitationData({
                    template: data.styles,
                    event: data.event,
                    features: data.features,
                    id: data.id,
                });

                if (guestCode && typeof guestCode === 'string') {
                    const { data: guest, error: guestError } = await supabase
                        .from('guests')
                        .select('*')
                        .eq('invitation_id', id)
                        .eq('guest_code', guestCode)
                        .single();

                    if (!guestError && guest) {
                        setGuestData(guest);
                        setRsvpForm(prev => ({
                            ...prev,
                            confirmedPasses: guest.status === 'confirmed' ? guest.confirmed_passes : guest.max_passes,
                        }));

                        if (!guest.first_access) {
                            await supabase
                                .from('guests')
                                .update({ first_access: new Date().toISOString() })
                                .eq('id', guest.id);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading invitation:', error);
                setInvitationData(null);
            } finally {
                setLoading(false);
            }
        };

        loadInvitation();
    }, [router.isReady, id, guestCode]);

    // ─── RSVP Submit ─────────────────────────────────────
    const handleRSVPSubmit = async (e: React.FormEvent, status: GuestStatus = 'confirmed') => {
        e.preventDefault();
        if (!guestData) return;

        setRsvpSubmitting(true);
        try {
            const { error } = await supabase
                .from('guests')
                .update({
                    status: status,
                    confirmed_passes: status === 'confirmed' ? rsvpForm.confirmedPasses : 0,
                    message: rsvpForm.message || null,
                    confirmed_at: new Date().toISOString(),
                })
                .eq('id', guestData.id);

            if (error) throw error;

            setGuestData({
                ...guestData,
                status: status,
                confirmed_passes: status === 'confirmed' ? rsvpForm.confirmedPasses : 0,
                message: rsvpForm.message,
                confirmed_at: new Date().toISOString(),
            });

            setShowRSVP(false);
        } catch (error) {
            console.error('Error al enviar RSVP:', error);
            alert('❌ Error al enviar confirmación. Intenta de nuevo.');
        } finally {
            setRsvpSubmitting(false);
        }
    };

    const formatTime = (time?: string) => {
        if (!time) return '';
        const [h, m] = time.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    // ─── Loading ─────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <p className="text-xl text-neutral-400">Cargando invitación...</p>
                </div>
            </div>
        );
    }

    // ─── No encontrada / No publicada ────────────────────
    if (!invitationData) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Invitación no disponible</h1>
                    <p className="text-neutral-400 mb-6">El enlace no es válido o la invitación aún no está publicada.</p>
                    <Link  href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all">
                        Ir a Dolseseli
                    </Link>
                </div>
            </div>
        );
    }

    // ─── Datos ───────────────────────────────────────────
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

    // ─── Render ──────────────────────────────────────────
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            <main className="flex-1 flex items-center justify-center py-6 px-4">
                <div className="w-full max-w-md">
                    {/* Invitation Card */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                        <div className="max-h-[85vh] overflow-y-auto">
                            <div className={`min-h-full bg-gradient-to-br ${gradient} p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
                                {backgroundImage && (
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})`, opacity: bgImageOpacity / 100 }} />
                                )}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
                                </div>
                                {features.entryEffect && features.entryEffect !== 'none' && (
                                    <EntryEffects effect={features.entryEffect as EntryEffectType} intensity={(features.entryEffectIntensity as EffectIntensity) || 'medium'} />
                                )}

                                <div className={`relative z-10 text-center space-y-6 w-full ${font}`} style={{ color: textColor }}>
                                    {musicUrl && <YouTubePlayer url={musicUrl} />}
                                    <div className={`text-9xl mb-6 ${animationClass}`}>{icon}</div>

                                    {event.honoree_photo && (
                                        <div className="flex justify-center">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                                                <img src={event.honoree_photo} alt="Festejado" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {guestData ? (
                                            <p className="text-sm font-medium tracking-widest uppercase opacity-90">¡{guestData.name}, estás invitado(a) a</p>
                                        ) : (
                                            <p className="text-sm font-medium tracking-widest uppercase opacity-90">Estás invitado a</p>
                                        )}
                                        <h1 className={`${textSize.title} font-bold leading-tight`}>{event.name}</h1>
                                    </div>

                                    {guestData && (
                                        <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3">
                                            <p className="text-sm font-bold">🎟️ {guestData.max_passes === 1 ? '1 pase reservado' : `${guestData.max_passes} pases reservados`}</p>
                                        </div>
                                    )}

                                    {(event.honoree_name || event.honoree_name_2) && (
                                        <div className="space-y-1">
                                            {event.honoree_name && <p className={`${textSize.subtitle} font-semibold`}>{event.honoree_name}</p>}
                                            {event.honoree_name_2 && <p className={`${textSize.subtitle} font-semibold`}>& {event.honoree_name_2}</p>}
                                            {event.honoree_age && <p className="text-sm opacity-80">{event.honoree_age} años</p>}
                                        </div>
                                    )}

                                    <div className="w-16 h-px bg-white/50 mx-auto" />

                                    {hasParents && (
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-widest opacity-70">Con la bendición de</p>
                                            {event.parents.map((p: PersonEntry, i: number) => (
                                                <p key={i} className="text-sm"><span className="opacity-70">{p.role}: </span><span className="font-semibold">{p.name}</span></p>
                                            ))}
                                        </div>
                                    )}

                                    {hasGodparents && (
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-widest opacity-70">Padrinos</p>
                                            {event.godparents.map((p: PersonEntry, i: number) => (
                                                <p key={i} className="text-sm"><span className="opacity-70">{p.role}: </span><span className="font-semibold">{p.name}</span></p>
                                            ))}
                                        </div>
                                    )}

                                    {(hasParents || hasGodparents) && <div className="w-16 h-px bg-white/50 mx-auto" />}

                                    {features.countdown && <Countdown targetDate={event.date} design={features.countdownDesign} />}

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

                                    {hasItinerary && (
                                        <>
                                            <div className="w-16 h-px bg-white/50 mx-auto" />
                                            <div className="space-y-4 w-full">
                                                <p className="text-xs uppercase tracking-widest opacity-70">Itinerario</p>
                                                {event.ceremony_time && (
                                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span>⛪</span><span className="font-bold text-sm">Ceremonia</span>
                                                            <span className="ml-auto text-sm font-semibold">{formatTime(event.ceremony_time)}</span>
                                                        </div>
                                                        {event.ceremony_location && <p className="text-xs ml-6 opacity-85">{event.ceremony_location}</p>}
                                                        {event.ceremony_address && <p className="text-xs ml-6 opacity-65">{event.ceremony_address}</p>}
                                                    </div>
                                                )}
                                                {event.reception_time && (
                                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span>🎉</span><span className="font-bold text-sm">Recepción</span>
                                                            <span className="ml-auto text-sm font-semibold">{formatTime(event.reception_time)}</span>
                                                        </div>
                                                        {event.reception_location && <p className="text-xs ml-6 opacity-85">{event.reception_location}</p>}
                                                        {event.reception_address && <p className="text-xs ml-6 opacity-65">{event.reception_address}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {event.message && (
                                        <>
                                            <div className="w-16 h-px bg-white/50 mx-auto" />
                                            <p className="text-sm italic opacity-90 max-w-xs mx-auto">{event.message}</p>
                                        </>
                                    )}

                                    {hasDressCode && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                            <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Código de Vestimenta</p>
                                            <p className="font-bold text-sm">{event.dress_code}</p>
                                            {event.dress_code_colors && event.dress_code_colors.length > 0 && (
                                                <p className="text-xs mt-1 opacity-80">Colores sugeridos: {event.dress_code_colors.join(', ')}</p>
                                            )}
                                        </div>
                                    )}

                                    {event.no_kids && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                            <p className="text-xs font-semibold">🚫 Evento exclusivo para adultos</p>
                                        </div>
                                    )}

                                    {event.parking_info && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                            <p className="text-xs">🅿️ {event.parking_info}</p>
                                        </div>
                                    )}

                                    {event.special_notes && (
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                                            <p className="text-xs">📝 {event.special_notes}</p>
                                        </div>
                                    )}

                                    {event.ceremony_map_url && (
                                        <div className="w-full pt-4">
                                            <p className="text-xs uppercase tracking-widest mb-2 opacity-70">📍 Ceremonia</p>
                                            <MapEmbed location={event.ceremony_location || ''} mapUrl={event.ceremony_map_url} frameStyle={features.mapFrameStyle as MapFrameStyle} />
                                        </div>
                                    )}

                                    {event.reception_map_url && (
                                        <div className="w-full pt-4">
                                            <p className="text-xs uppercase tracking-widest mb-2 opacity-70">📍 Recepción</p>
                                            <MapEmbed location={event.reception_location || ''} mapUrl={event.reception_map_url} frameStyle={features.mapFrameStyle as MapFrameStyle} />
                                        </div>
                                    )}

                                    {features.map && event.location && !event.ceremony_map_url && !event.reception_map_url && (
                                        <div className="w-full mt-15 pt-10">
                                            <MapEmbed location={event.location} mapUrl={features.mapUrl} frameStyle={features.mapFrameStyle as MapFrameStyle} />
                                        </div>
                                    )}

                                    {features.gallery && features.galleryPhotos && features.galleryPhotos.length > 0 && (
                                        <div className="mt-6 w-full">
                                            <PhotoGallery photos={features.galleryPhotos} />
                                        </div>
                                    )}

                                    {hasGiftRegistry && (
                                        <div className="w-full space-y-2">
                                            <div className="w-16 h-px bg-white/50 mx-auto" />
                                            <p className="text-xs uppercase tracking-widest opacity-70">🎁 Mesa de Regalos</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {event.gift_registry.map((reg: GiftRegistry, i: number) => (
                                                    <a key={i} href={reg.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                                                        🎁 {reg.name || 'Ver mesa de regalos'}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {event.hashtag && <p className="text-sm font-bold opacity-80">{event.hashtag}</p>}

                                    {/* RSVP — Con guest */}
                                    {guestData && (
                                        <div className="pt-4 w-full">
                                            {guestData.status === 'confirmed' ? (
                                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 text-center">
                                                    <div className="text-2xl mb-2">✅</div>
                                                    <p className="font-bold text-sm">¡Asistencia Confirmada!</p>
                                                    <p className="text-xs opacity-80 mt-1">{guestData.confirmed_passes} {guestData.confirmed_passes === 1 ? 'persona' : 'personas'}</p>
                                                    <button onClick={() => setShowRSVP(true)} className="mt-3 px-4 py-2 bg-white/20 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                                                        Modificar respuesta
                                                    </button>
                                                </div>
                                            ) : guestData.status === 'declined' ? (
                                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 text-center">
                                                    <div className="text-4xl mb-2">😢</div>
                                                    <p className="font-bold text-sm">No podrás asistir</p>
                                                    <button onClick={() => setShowRSVP(true)} className="mt-3 px-4 py-2 bg-white/20 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                                                        ¿Cambiaste de opinión?
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowRSVP(true)}
                                                    className="w-full px-8 py-4 bg-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                                                    style={{ color: gradient.includes('pink') ? '#ec4899' : '#8b5cf6' }}
                                                >
                                                    ✅ Confirmar Asistencia
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* RSVP — Sin guest (link genérico) */}
                                    {!guestData && features.rsvp && (
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 text-center">
                        <a onClick={() => router.push('/auth')} className="inline-block px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                            🎉 Crea tu propia invitación
                        </a>
                    </div>
                </div>
            </main>

            {/* RSVP Modal — Con guest */}
            {showRSVP && guestData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-display font-bold mb-1">{guestData.name}</h2>
                            <p className="text-neutral-500 text-sm">Tienes {guestData.max_passes} {guestData.max_passes === 1 ? 'pase' : 'pases'} para este evento</p>
                        </div>
                        <form onSubmit={(e) => handleRSVPSubmit(e, 'confirmed')} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">¿Cuántas personas asistirán?</label>
                                <select value={rsvpForm.confirmedPasses} onChange={(e) => setRsvpForm({ ...rsvpForm, confirmedPasses: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-purple-500 focus:outline-none">
                                    {Array.from({ length: guestData.max_passes }, (_, i) => i + 1).map(n => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Mensaje para el anfitrión (opcional)</label>
                                <textarea rows={3} value={rsvpForm.message} onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })} placeholder="Ej: ¡No nos lo perdemos! 🎉" className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-purple-500 focus:outline-none resize-none" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <button type="submit" disabled={rsvpSubmitting} className="w-full px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
                                    {rsvpSubmitting ? '⏳ Enviando...' : '✅ ¡Sí, confirmo asistencia!'}
                                </button>
                                <button type="button" disabled={rsvpSubmitting} onClick={(e) => handleRSVPSubmit(e as any, 'declined')} className="w-full px-6 py-3 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                                    😢 No podré asistir
                                </button>
                                <button type="button" onClick={() => setShowRSVP(false)} className="w-full px-6 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RSVP Modal — Sin guest (fallback) */}
            {showRSVP && !guestData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-3">💌</div>
                            <h2 className="text-2xl font-display font-bold mb-2">Confirmar Asistencia</h2>
                            <p className="text-neutral-500 text-sm">Este es un enlace general. Si recibiste un enlace personalizado, úsalo para confirmar.</p>
                        </div>
                        <button onClick={() => setShowRSVP(false)} className="w-full px-6 py-3 border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}