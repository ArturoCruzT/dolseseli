import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'todas' | 'activas' | 'borradores'>('todas');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth');
      return;
    }

    const loadInvitations = async () => {
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ Invitaciones cargadas desde Supabase:', data);
        setInvitations(data || []);
      } catch (error) {
        console.error('Error loading invitations:', error);
      }
    };

    loadInvitations();
  }, [isAuthenticated, user, router]);

  // ─── Eliminar invitación ───
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta invitación?')) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvitations(invitations.filter(inv => inv.id !== id));
      console.log('✅ Invitación eliminada');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      alert('Error al eliminar la invitación');
    }
  };

  // ─── Editar invitación ───
  const handleEdit = (invitation: any) => {
    // Guardar todos los datos en sessionStorage para cargarlos en personalizar
    sessionStorage.setItem('editInvitation', JSON.stringify({
      id: invitation.id,
      event: invitation.event,
      styles: invitation.styles,
      features: invitation.features,
      template: invitation.template,
    }));

    // Redirigir a personalizar (sin query params, los datos vienen de sessionStorage)
    router.push('/personalizar');
  };

  // ─── Duplicar invitación ───
  const handleDuplicate = async (invitation: any) => {
    if (!user) return;

    try {
      const { data: newInvitation, error } = await supabase
        .from('invitations')
        .insert([{
          user_id: user.id,
          template: invitation.template,
          event: {
            ...invitation.event,
            name: `${invitation.event.name} (Copia)`,
          },
          styles: invitation.styles,
          features: invitation.features,
          status: 'draft',
          plan: invitation.plan,
          credits_allocated: invitation.credits_allocated,
          credits_used: 0,
        }])
        .select()
        .single();

      if (error) throw error;

      setInvitations([newInvitation, ...invitations]);
      console.log('✅ Invitación duplicada');
    } catch (error) {
      console.error('Error duplicating invitation:', error);
      alert('Error al duplicar la invitación');
    }
  };

  // ─── Filtrar invitaciones por tab ───
  const filteredInvitations = invitations.filter((inv) => {
    if (activeTab === 'activas') return inv.status === 'published';
    if (activeTab === 'borradores') return inv.status === 'draft';
    return true;
  });

  const stats = {
    total: invitations.length,
    creditsUsed: invitations.reduce((acc, inv) => acc + (inv.credits_used || 0), 0),
    creditsAvailable: user?.credits || 0,
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Mi Dashboard</h1>
              <p className="text-neutral-300">Gestiona todas tus invitaciones en un solo lugar</p>
            </div>
            <Button
              variant="accent"
              size="lg"
              onClick={() => router.push('/')}
            >
              ➕ Nueva Invitación
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-neutral-300 text-sm">Invitaciones Totales</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.creditsUsed}</div>
              <div className="text-neutral-300 text-sm">Invitados Registrados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">{stats.creditsAvailable}</div>
              <div className="text-neutral-300 text-sm">Créditos Disponibles</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tabs */}
      <section className="py-8 border-b border-neutral-200">
        <Container>
          <div className="flex gap-4">
            {[
              { id: 'todas', label: 'Todas', count: invitations.length },
              { id: 'activas', label: 'Publicadas', count: invitations.filter(i => i.status === 'published').length },
              { id: 'borradores', label: 'Borradores', count: invitations.filter(i => i.status === 'draft').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
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

      {/* Invitations List */}
      <section className="py-12">
        <Container>
          {filteredInvitations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-display font-bold mb-2">
                {activeTab === 'borradores'
                  ? 'No tienes borradores'
                  : activeTab === 'activas'
                    ? 'No tienes invitaciones publicadas'
                    : 'No tienes invitaciones aún'
                }
              </h3>
              <p className="text-neutral-600 mb-6">Crea tu primera invitación y comienza a gestionar tus eventos</p>
              <Button variant="accent" onClick={() => router.push('/')}>
                Crear Primera Invitación
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvitations.map((invitation) => {
                const isDraft = invitation.status === 'draft';

                return (
                  <Card key={invitation.id} className="group">
                    {/* Preview */}
                    <div className={`h-48 bg-gradient-to-br ${invitation.styles?.gradient || invitation.template?.color || 'from-pink-400 to-fuchsia-500'} p-6 flex items-center justify-center text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                      </div>

                      {/* Badge de estado */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isDraft
                            ? 'bg-yellow-400/90 text-yellow-900'
                            : 'bg-green-400/90 text-green-900'
                        }`}>
                          {isDraft ? '📝 Borrador' : '✅ Publicada'}
                        </span>
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="text-5xl mb-2">
                          {invitation.styles?.icon || invitation.template?.preview || '🎉'}
                        </div>
                        <h3 className="font-display font-bold text-lg line-clamp-2">
                          {invitation.event?.name || 'Sin nombre'}
                        </h3>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-neutral-600">
                          {invitation.created_at
                            ? new Date(invitation.created_at).toLocaleDateString('es-MX')
                            : ''
                          }
                        </span>
                        {invitation.event?.honoree_name && (
                          <span className="text-xs text-neutral-500">
                            {invitation.event.honoree_name}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-neutral-600">
                        {invitation.event?.date && (
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>
                              {new Date(invitation.event.date).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        {invitation.event?.location && (
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span className="line-clamp-1">{invitation.event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats (solo para publicadas) */}
                      {!isDraft && (
                        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-neutral-50 rounded-xl">
                          <div className="text-center">
                            <div className="font-bold text-lg">{invitation.credits_used || 0}</div>
                            <div className="text-xs text-neutral-600">Vistas</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{invitation.credits_allocated || 0}</div>
                            <div className="text-xs text-neutral-600">Créditos</div>
                          </div>
                        </div>
                      )}

                      {/* Mensaje para borradores */}
                      {isDraft && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <p className="text-xs text-yellow-800 font-semibold flex items-center gap-1">
                            <span>⚠️</span> Borrador — no visible para invitados
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        {!isDraft && (
                          <Button
                            variant="secondary"
                            className="text-sm"
                            onClick={() => router.push('/i/' + invitation.id)}
                          >
                            👁️ Ver
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          className={`text-sm ${isDraft ? 'col-span-2' : ''}`}
                          onClick={() => handleEdit(invitation)}
                        >
                          ✏️ {isDraft ? 'Continuar Editando' : 'Editar'}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          onClick={() => handleDuplicate(invitation)}
                          className="px-4 py-2 text-sm border-2 border-neutral-200 rounded-xl hover:border-neutral-900 transition-all font-semibold"
                        >
                          📋 Duplicar
                        </button>
                        <button
                          onClick={() => handleDelete(invitation.id)}
                          className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all font-semibold"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>

                      {/* Gestionar invitados */}
                      <button
                        onClick={() => router.push(`/guests/${invitation.id}`)}
                        className="w-full mt-2 px-4 py-2.5 text-sm border-2 border-purple-200 text-purple-700 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all font-semibold"
                      >
                        👥 Gestionar Invitados
                      </button>

                      {/* Compartir (solo publicadas) */}
                      {!isDraft && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/i/${invitation.id}`;
                              const message = `¡Estás invitado! 🎉\n\n${invitation.event.name}\n📅 ${new Date(invitation.event.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}\n📍 ${invitation.event.location}\n\nVe tu invitación aquí: ${url}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                            }}
                            className="px-4 py-2 text-sm border-2 border-green-200 text-green-700 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all font-semibold"
                          >
                            📱 WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/i/${invitation.id}`;
                              navigator.clipboard.writeText(url);
                              alert('✅ Enlace copiado al portapapeles');
                            }}
                            className="px-4 py-2 text-sm border-2 border-blue-200 text-blue-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold"
                          >
                            🔗 Copiar Link
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}