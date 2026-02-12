import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [guestCounts, setGuestCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'todas' | 'activas' | 'borradores'>('todas');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState<any>(null);
  const [showLinksModal, setShowLinksModal] = useState<any>(null); // { invitation, guests, link }
  const [userCredits, setUserCredits] = useState(0);

  // ─── Cargar créditos frescos desde DB ──────────────────
  const refreshCredits = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setUserCredits(data.credits);
      // Sincronizar localStorage
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.credits = data.credits;
        localStorage.setItem('currentUser', JSON.stringify(parsed));
      }
    }
  }, [user?.id]);

  // ─── Cargar todo al montar ─────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth');
      return;
    }

    const loadData = async () => {
      try {
        // Créditos frescos
        await refreshCredits();

        // Invitaciones
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvitations(data || []);

        // Conteo de invitados
        if (data && data.length > 0) {
          const ids = data.map(inv => inv.id);
          const { data: guests, error: gErr } = await supabase
            .from('guests')
            .select('invitation_id')
            .in('invitation_id', ids);

          if (!gErr && guests) {
            const counts: Record<string, number> = {};
            guests.forEach(g => {
              counts[g.invitation_id] = (counts[g.invitation_id] || 0) + 1;
            });
            setGuestCounts(counts);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [isAuthenticated, user, router, refreshCredits]);

  // ─── Eliminar ──────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta invitación?')) return;
    try {
      const { error } = await supabase.from('invitations').delete().eq('id', id);
      if (error) throw error;
      setInvitations(invitations.filter(inv => inv.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  // ─── Editar ────────────────────────────────────────────
  const handleEdit = (invitation: any) => {
    sessionStorage.setItem('editInvitation', JSON.stringify({
      id: invitation.id,
      event: invitation.event,
      styles: invitation.styles,
      features: invitation.features,
      template: invitation.template,
    }));
    router.push('/personalizar');
  };

  // ─── Duplicar ──────────────────────────────────────────
  const handleDuplicate = async (invitation: any) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          user_id: user.id,
          template: invitation.template,
          event: { ...invitation.event, name: `${invitation.event.name} (Copia)` },
          styles: invitation.styles,
          features: invitation.features,
          status: 'draft',
          plan: user.plan,
          credits_allocated: 0,
          credits_used: 0,
        }])
        .select()
        .single();

      if (error) throw error;
      setInvitations([data, ...invitations]);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al duplicar');
    }
  };

  // ═══════════════════════════════════════════════════════
  // PUBLICAR
  // ═══════════════════════════════════════════════════════
  const handlePublishClick = async (invitation: any) => {
    if (!user) return;

    // Refrescar créditos antes de validar
    await refreshCredits();

    const hasRSVP = invitation.features?.rsvp;
    const guestCount = guestCounts[invitation.id] || 0;

    if (hasRSVP) {
      if (guestCount === 0) {
        alert('⚠️ Debes agregar invitados antes de publicar.\n\nVe a "👥 Invitados" para agregarlos.');
        return;
      }
      if (guestCount > userCredits) {
        alert(`⚠️ No tienes suficientes créditos.\n\nTienes ${userCredits} créditos y necesitas ${guestCount} (1 por invitado).\n\nCompra más créditos en Planes.`);
        return;
      }
    } else {
      if (userCredits < 10) {
        alert(`⚠️ Necesitas al menos 10 créditos para publicar sin confirmación.\n\nTienes ${userCredits} créditos.`);
        return;
      }
    }

    setShowPublishModal(invitation);
  };

  const confirmPublish = async () => {
    const invitation = showPublishModal;
    if (!invitation || !user) return;

    setPublishingId(invitation.id);

    try {
      const hasRSVP = invitation.features?.rsvp;
      const guestCount = guestCounts[invitation.id] || 0;
      const creditsToConsume = hasRSVP ? guestCount : 10;

      // 1. Publicar invitación
      const { error: pubError } = await supabase
        .from('invitations')
        .update({
          status: 'published',
          credits_allocated: creditsToConsume,
          credits_used: creditsToConsume,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);
      if (pubError) throw pubError;

      // 2. Descontar créditos del usuario en DB
      const newCredits = userCredits - creditsToConsume;
      const { error: credError } = await supabase
        .from('users')
        .update({ credits: newCredits, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (credError) throw credError;

      // 3. Registrar transacción
      await supabase.from('transactions').insert([{
        user_id: user.id,
        plan_id: hasRSVP ? `publish-rsvp-${guestCount}` : 'publish-no-rsvp',
        amount: 0,
        credits: creditsToConsume,
        payment_method: 'credits',
        status: 'completed',
      }]);

      // 4. Actualizar créditos locales
      setUserCredits(newCredits);
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.credits = newCredits;
        localStorage.setItem('currentUser', JSON.stringify(parsed));
      }

      // 5. Actualizar invitación en lista local
      setInvitations(invitations.map(inv =>
        inv.id === invitation.id
          ? { ...inv, status: 'published', credits_allocated: creditsToConsume, credits_used: creditsToConsume }
          : inv
      ));

      setShowPublishModal(null);

      // 6. Mostrar modal con links generados
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const publicLink = `${baseUrl}/i/${invitation.id}`;

      if (hasRSVP) {
        // Cargar invitados con sus links
        const { data: guests } = await supabase
          .from('guests')
          .select('*')
          .eq('invitation_id', invitation.id)
          .order('name');

        setShowLinksModal({
          invitation,
          guests: guests || [],
          publicLink,
          hasRSVP: true,
        });
      } else {
        setShowLinksModal({
          invitation,
          guests: [],
          publicLink,
          hasRSVP: false,
        });
      }

    } catch (error) {
      console.error('Error al publicar:', error);
      alert('❌ Error al publicar. Intenta de nuevo.');
    } finally {
      setPublishingId(null);
    }
  };

  // ─── Copiar al portapapeles ────────────────────────────
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ─── Filtrar ───────────────────────────────────────────
  const filteredInvitations = invitations.filter((inv) => {
    if (activeTab === 'activas') return inv.status === 'published';
    if (activeTab === 'borradores') return inv.status === 'draft';
    return true;
  });

  const stats = {
    total: invitations.length,
    published: invitations.filter(i => i.status === 'published').length,
    drafts: invitations.filter(i => i.status === 'draft').length,
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Mi Dashboard</h1>
              <p className="text-neutral-300">Gestiona tus invitaciones</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/planes')}
                className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                💳 {userCredits} créditos
              </button>
              <Button variant="accent" size="lg" onClick={() => router.push('/')}>
                ➕ Nueva Invitación
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-neutral-300 text-xs mt-1">Total</div>
            </div>
            <div className="bg-green-500/20 rounded-2xl p-5 border border-green-400/30 text-center">
              <div className="text-3xl font-bold text-green-300">{stats.published}</div>
              <div className="text-green-200 text-xs mt-1">Publicadas</div>
            </div>
            <div className="bg-yellow-500/20 rounded-2xl p-5 border border-yellow-400/30 text-center">
              <div className="text-3xl font-bold text-yellow-300">{stats.drafts}</div>
              <div className="text-yellow-200 text-xs mt-1">Borradores</div>
            </div>
            <div className="bg-purple-500/20 rounded-2xl p-5 border border-purple-400/30 text-center">
              <div className="text-3xl font-bold text-purple-300">{userCredits}</div>
              <div className="text-purple-200 text-xs mt-1">Créditos disponibles</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tabs */}
      <section className="py-6 border-b border-neutral-200">
        <Container>
          <div className="flex gap-3">
            {[
              { id: 'todas', label: 'Todas', count: stats.total },
              { id: 'activas', label: 'Publicadas', count: stats.published },
              { id: 'borradores', label: 'Borradores', count: stats.drafts },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Lista */}
      <section className="py-10">
        <Container>
          {filteredInvitations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-display font-bold mb-2">
                {activeTab === 'borradores' ? 'No tienes borradores'
                  : activeTab === 'activas' ? 'No tienes publicadas'
                  : 'No tienes invitaciones aún'}
              </h3>
              <p className="text-neutral-600 mb-6">Crea tu primera invitación</p>
              <Button variant="accent" onClick={() => router.push('/')}>Crear Invitación</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvitations.map((invitation) => {
                const isDraft = invitation.status === 'draft';
                const hasRSVP = invitation.features?.rsvp;
                const invGuests = guestCounts[invitation.id] || 0;

                return (
                  <Card key={invitation.id} className="group">
                    {/* Preview */}
                    <div className={`h-44 bg-gradient-to-br ${invitation.styles?.gradient || invitation.template?.color || 'from-pink-400 to-fuchsia-500'} p-6 flex items-center justify-center text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isDraft ? 'bg-yellow-400/90 text-yellow-900' : 'bg-green-400/90 text-green-900'}`}>
                          {isDraft ? '📝 Borrador' : '✅ Publicada'}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasRSVP ? 'bg-blue-400/90 text-blue-900' : 'bg-white/30 text-white'}`}>
                          {hasRSVP ? '📋 RSVP' : '🔗 Abierta'}
                        </span>
                      </div>
                      <div className="relative z-10 text-center">
                        <div className="text-5xl mb-2">{invitation.styles?.icon || invitation.template?.preview || '🎉'}</div>
                        <h3 className="font-display font-bold text-lg line-clamp-2">{invitation.event?.name || 'Sin nombre'}</h3>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="space-y-1.5 mb-4 text-sm text-neutral-600">
                        {invitation.event?.date && (
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(invitation.event.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        )}
                        {invitation.event?.location && (
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span className="line-clamp-1">{invitation.event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Info contextual */}
                      {isDraft && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <p className="text-xs text-yellow-800 font-semibold">⚠️ No visible para invitados</p>
                          {hasRSVP ? (
                            <p className="text-xs text-yellow-700 mt-1">
                              👥 {invGuests} invitado{invGuests !== 1 ? 's' : ''}
                              {invGuests === 0 ? ' • Agrega invitados para publicar' : ` • Costará ${invGuests} crédito${invGuests !== 1 ? 's' : ''}`}
                            </p>
                          ) : (
                            <p className="text-xs text-yellow-700 mt-1">🔗 Sin RSVP • Publicar = 10 créditos</p>
                          )}
                        </div>
                      )}

                      {!isDraft && (
                        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-neutral-50 rounded-xl">
                          <div className="text-center">
                            <div className="font-bold text-lg">{hasRSVP ? invGuests : '∞'}</div>
                            <div className="text-xs text-neutral-500">{hasRSVP ? 'Invitados' : 'Abierta'}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{invitation.credits_used || 0}</div>
                            <div className="text-xs text-neutral-500">Créditos usados</div>
                          </div>
                        </div>
                      )}

                      {/* ─── ACCIONES ─── */}

                      {/* BORRADOR */}
                      {isDraft && (
                        <>
                          <button
                            onClick={() => handlePublishClick(invitation)}
                            disabled={publishingId === invitation.id}
                            className="w-full mb-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {publishingId === invitation.id ? '⏳ Publicando...' : '🚀 Publicar Invitación'}
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleEdit(invitation)} className="px-4 py-2 text-sm border-2 border-neutral-200 rounded-xl hover:border-neutral-400 font-semibold transition-all">
                              ✏️ Editar
                            </button>
                            {hasRSVP && (
                              <button onClick={() => router.push(`/guests/${invitation.id}`)} className="px-4 py-2 text-sm border-2 border-purple-200 text-purple-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 font-semibold transition-all">
                                👥 Invitados
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      {/* PUBLICADA */}
                      {!isDraft && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => router.push('/i/' + invitation.id)} className="px-4 py-2 text-sm border-2 border-neutral-200 rounded-xl hover:border-neutral-400 font-semibold transition-all">
                              👁️ Ver
                            </button>
                            <button onClick={() => handleEdit(invitation)} className="px-4 py-2 text-sm border-2 border-neutral-200 rounded-xl hover:border-neutral-400 font-semibold transition-all">
                              ✏️ Editar
                            </button>
                          </div>

                          {hasRSVP && (
                            <button onClick={() => router.push(`/guests/${invitation.id}`)} className="w-full mt-2 px-4 py-2.5 text-sm border-2 border-purple-200 text-purple-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 font-semibold transition-all">
                              👥 Gestionar Invitados ({invGuests})
                            </button>
                          )}

                          {/* Compartir links */}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                              onClick={async () => {
                                if (hasRSVP) {
                                  const { data: guests } = await supabase.from('guests').select('*').eq('invitation_id', invitation.id).order('name');
                                  setShowLinksModal({
                                    invitation,
                                    guests: guests || [],
                                    publicLink: `${window.location.origin}/i/${invitation.id}`,
                                    hasRSVP: true,
                                  });
                                } else {
                                  setShowLinksModal({
                                    invitation,
                                    guests: [],
                                    publicLink: `${window.location.origin}/i/${invitation.id}`,
                                    hasRSVP: false,
                                  });
                                }
                              }}
                              className="px-4 py-2 text-sm border-2 border-green-200 text-green-700 rounded-xl hover:border-green-500 hover:bg-green-50 font-semibold transition-all"
                            >
                              🔗 Links
                            </button>
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/i/${invitation.id}`;
                                const msg = `¡Estás invitado! 🎉\n\n${invitation.event?.name}\n📅 ${invitation.event?.date}\n📍 ${invitation.event?.location}\n\n${url}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="px-4 py-2 text-sm border-2 border-green-200 text-green-700 rounded-xl hover:border-green-500 hover:bg-green-50 font-semibold transition-all"
                            >
                              📱 WhatsApp
                            </button>
                          </div>
                        </>
                      )}

                      {/* Comunes */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={() => handleDuplicate(invitation)} className="px-4 py-2 text-sm border-2 border-neutral-200 rounded-xl hover:border-neutral-400 font-semibold transition-all">
                          📋 Duplicar
                        </button>
                        <button onClick={() => handleDelete(invitation.id)} className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:border-red-600 hover:bg-red-50 font-semibold transition-all">
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ═══ MODAL DE PUBLICACIÓN ═══ */}
      {showPublishModal && (() => {
        const inv = showPublishModal;
        const hasRSVP = inv.features?.rsvp;
        const invGuests = guestCounts[inv.id] || 0;
        const cost = hasRSVP ? invGuests : 10;
        const remaining = userCredits - cost;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-display font-bold mb-2">¿Publicar Invitación?</h2>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Evento:</span>
                  <span className="font-semibold">{inv.event?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Modo:</span>
                  <span className="font-semibold">{hasRSVP ? '📋 Con RSVP' : '🔗 Sin RSVP'}</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                {hasRSVP ? (
                  <div className="flex justify-between">
                    <span className="text-purple-700">{invGuests} invitado{invGuests !== 1 ? 's' : ''} × 1 crédito:</span>
                    <span className="font-bold text-purple-900">-{cost} créditos</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-purple-700">Tarifa fija (sin RSVP):</span>
                    <span className="font-bold text-purple-900">-10 créditos</span>
                  </div>
                )}
                <div className="border-t border-purple-200 pt-2 flex justify-between">
                  <span className="text-purple-700">Créditos actuales:</span>
                  <span className="font-bold text-purple-900">{userCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Después de publicar:</span>
                  <span className={`font-bold ${remaining >= 0 ? 'text-green-700' : 'text-red-600'}`}>{remaining}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 mb-4 text-center">
                {hasRSVP
                  ? 'Se generarán links personalizados para cada invitado.'
                  : 'Se generará un link genérico para compartir.'
                }
              </p>

              <div className="flex gap-3">
                <button onClick={() => setShowPublishModal(null)} className="flex-1 px-5 py-3 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={publishingId !== null}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {publishingId ? '⏳...' : `Publicar (-${cost})`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ MODAL DE LINKS GENERADOS ═══ */}
      {showLinksModal && (() => {
        const { invitation, guests, publicLink, hasRSVP } = showLinksModal;
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">✅</div>
                <h2 className="text-2xl font-display font-bold mb-1">¡Invitación Publicada!</h2>
                <p className="text-neutral-500 text-sm">
                  {hasRSVP
                    ? `${guests.length} link${guests.length !== 1 ? 's' : ''} personalizado${guests.length !== 1 ? 's' : ''} generado${guests.length !== 1 ? 's' : ''}`
                    : 'Link genérico listo para compartir'
                  }
                </p>
              </div>

              {/* Link público general */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Link público</label>
                <div className="mt-1 flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                  <p className="text-sm text-neutral-700 truncate flex-1 font-mono">{publicLink}</p>
                  <button
                    onClick={() => { copyToClipboard(publicLink); alert('✅ Link copiado'); }}
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold flex-shrink-0 hover:bg-neutral-800 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Links por invitado (solo RSVP) */}
              {hasRSVP && guests.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Links personalizados</label>
                  <div className="mt-2 space-y-2 max-h-[40vh] overflow-y-auto">
                    {guests.map((guest: any) => {
                      const guestLink = `${baseUrl}/i/${invitation.id}?guest=${guest.guest_code}`;
                      const phone = guest.phone ? guest.phone.replace(/\D/g, '') : '';
                      const waMsg = `¡Hola ${guest.name}! 🎉\n\nEstás invitado(a) a *${invitation.event?.name}*\nTienes *${guest.max_passes} pase${guest.max_passes !== 1 ? 's' : ''}*.\n\nAbre tu invitación:\n${guestLink}`;

                      return (
                        <div key={guest.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{guest.name}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">{guest.guest_code} • {guest.max_passes} pase{guest.max_passes !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`, '_blank')}
                              className="flex-1 px-2.5 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                            >
                              📱 WhatsApp
                            </button>
                            <button
                              onClick={() => { copyToClipboard(guestLink); alert(`✅ Link de ${guest.name} copiado`); }}
                              className="flex-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                            >
                              🔗 Copiar link
                            </button>
                            <button
                              onClick={() => { copyToClipboard(waMsg); alert('✅ Mensaje copiado'); }}
                              className="px-2.5 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-colors"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sin RSVP: botones de compartir */}
              {!hasRSVP && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => {
                      const msg = `¡Estás invitado! 🎉\n\n${invitation.event?.name}\n📅 ${invitation.event?.date}\n📍 ${invitation.event?.location}\n\n${publicLink}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="px-4 py-3 bg-green-50 text-green-700 border-2 border-green-200 rounded-xl font-semibold hover:bg-green-100 transition-colors"
                  >
                    📱 Compartir por WhatsApp
                  </button>
                  <button
                    onClick={() => { copyToClipboard(publicLink); alert('✅ Link copiado'); }}
                    className="px-4 py-3 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                  >
                    🔗 Copiar Link
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowLinksModal(null)}
                className="w-full mt-6 px-5 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        );
      })()}
    </Layout>
  );
}