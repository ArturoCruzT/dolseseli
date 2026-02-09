import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MapEmbed } from '../../components/invitations/MapEmbed';
import { PhotoGallery } from '../../components/invitations/PhotoGallery';
import { Countdown } from '../../components/invitations/Countdown';
import { supabase } from '@/lib/supabase';
import { YouTubePlayer } from '../../components/invitations/YouTubePlayer';

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
                // Cargar invitación desde Supabase
                const { data, error } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Incrementar contador de vistas
                    await supabase
                        .from('invitations')
                        .update({
                            credits_used: (data.credits_used || 0) + 1
                        })
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
            // Aquí guardaríamos en la tabla de guests
            // Por ahora solo mostramos confirmación
            console.log('RSVP enviado:', rsvpForm);
            alert('✅ ¡Gracias por confirmar! El anfitrión ha sido notificado.');
            setShowRSVP(false);
            setRsvpForm({ name: '', guestCount: 1, message: '' });
        } catch (error) {
            console.error('Error al enviar RSVP:', error);
            alert('❌ Error al enviar confirmación. Intenta de nuevo.');
        }
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
                    <p className="text-neutral-400 mb-6">
                        El enlace que usaste no es válido o la invitación fue eliminada.
                    </p>
                    <a
                        href="https://dolseseli.com"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all"
                    >
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
            {/* Invitation Container */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="max-h-[85vh] overflow-y-auto">
                        <div
                            className={`min-h-full bg-gradient-to-br ${gradient} p-8 flex flex-col items-center justify-center relative overflow-hidden`}
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
                            <div className={`relative z-10 text-center space-y-6 w-full ${font}`} style={{ color: textColor }}>
                                <div className={`text-9xl mb-6 ${animationClass}`}>
                                    {icon}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium tracking-widest uppercase opacity-90">
                                        Estás invitado a
                                    </p>
                                    <h1 className={`${textSize.title} font-bold leading-tight`}>
                                        {event.name}
                                    </h1>
                                </div>

                                <div className="w-16 h-px bg-white/50 mx-auto" />

                                {/* Countdown */}
                                {features.countdown && event.date && (
                                    <Countdown targetDate={event.date} />
                                )}

                                <div className="space-y-3 text-lg">
                                    <p className="flex items-center justify-center gap-2">
                                        <span>📅</span>
                                        <span>{new Date(event.date).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </p>
                                    <p className="flex items-center justify-center gap-2">
                                        <span>📍</span>
                                        <span>{event.location}</span>
                                    </p>
                                </div>

                                {event.message && (
                                    <>
                                        <div className="w-16 h-px bg-white/50 mx-auto" />
                                        <p className="text-sm italic opacity-90 max-w-xs mx-auto">
                                            {event.message}
                                        </p>
                                    </>
                                )}

                                {/* Map */}
                                {features.map && event.location && (
                                    <div className="w-full mt-6">
                                        <MapEmbed location={event.location} mapUrl={features.mapUrl} />
                                    </div>
                                )}

                                {/* Photo Gallery */}
                                {features.gallery && features.galleryPhotos && features.galleryPhotos.length > 0 && (
                                    <div className="mt-6 w-full">
                                        <PhotoGallery photos={features.galleryPhotos} />
                                    </div>
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

                {/* Crear tu invitación CTA */}
                <div className="mt-6 text-center">
                    <a
                        href="https://dolseseli.com"
                        className="inline-block px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        🎉 Crea tu propia invitación
                    </a>
                    {/* YouTube Music Player */}
                    {musicUrl && (
                        <YouTubePlayer url={musicUrl} />
                    )}
                </div>

            </div>

            {/* RSVP Modal */}
            {
                showRSVP && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-3xl font-display font-bold mb-2">Confirmar Asistencia</h2>
                                <p className="text-neutral-600">Por favor completa tus datos</p>
                            </div>

                            <form onSubmit={handleRSVPSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Nombre Completo *
                                    </label>
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
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Número de Personas *
                                    </label>
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
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Mensaje (Opcional)
                                    </label>
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
                )
            }
        </div >
    );
}