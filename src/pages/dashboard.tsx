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

 const handleDelete = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta invitación?')) return;

  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Actualizar estado local
    const updated = invitations.filter(inv => inv.id !== id);
    setInvitations(updated);

    console.log('✅ Invitación eliminada');
  } catch (error) {
    console.error('Error deleting invitation:', error);
    alert('Error al eliminar la invitación');
  }
};
  const handleDuplicate = (invitation: any) => {
    const newInvitation = {
      ...invitation,
      id: Date.now().toString(),
      event: {
        ...invitation.event,
        name: `${invitation.event.name} (Copia)`,
      },
      publishedAt: new Date().toISOString(),
    };
    const updated = [...invitations, newInvitation];
    setInvitations(updated);
    localStorage.setItem('invitations', JSON.stringify(updated));
  };

  const stats = {
    total: invitations.length,
    creditsUsed: invitations.reduce((acc, inv) => acc + (inv.creditsUsed || 0), 0),
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
              <div className="text-neutral-300 text-sm">Invitaciones Publicadas</div>
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
              { id: 'activas', label: 'Activas', count: invitations.filter(i => i.status !== 'draft').length },
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
          {invitations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-display font-bold mb-2">No tienes invitaciones aún</h3>
              <p className="text-neutral-600 mb-6">Crea tu primera invitación y comienza a gestionar tus eventos</p>
              <Button variant="accent" onClick={() => router.push('/')}>
                Crear Primera Invitación
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="group">
                  {/* Preview */}
                  <div className={`h-48 bg-gradient-to-br ${invitation.styles?.gradient || invitation.template?.color} p-6 flex items-center justify-center text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="text-5xl mb-2">
                        {invitation.styles?.icon || invitation.template?.preview}
                      </div>
                      <h3 className="font-display font-bold text-lg line-clamp-2">
                        {invitation.event.name}
                      </h3>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-600">
                        {new Date(invitation.publishedAt).toLocaleDateString('es-MX')}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Activa
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{invitation.event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="line-clamp-1">{invitation.event.location}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-neutral-50 rounded-xl">
                      <div className="text-center">
                        <div className="font-bold text-lg">{invitation.stats?.views || 0}</div>
                        <div className="text-xs text-neutral-600">Vistas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{invitation.stats?.confirmed || 0}</div>
                        <div className="text-xs text-neutral-600">RSVP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{invitation.stats?.shares || 0}</div>
                        <div className="text-xs text-neutral-600">Shares</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        className="text-sm"
                        onClick={() => {
                          sessionStorage.setItem('publishedInvitation', JSON.stringify(invitation));
                          router.push('/i/'+invitation.id);
                        }}
                      >
                        👁️ Ver
                      </Button>
                      <Button
                        variant="primary"
                        className="text-sm"
                        onClick={() => {
                          // Aquí iría la lógica para editar
                          alert('Función de edición próximamente');
                        }}
                      >
                        ✏️ Editar
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
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       <button
    onClick={() => {
      const url = `${window.location.origin}/i/${invitation.id}`;
      const message = `¡Estás invitado! 🎉\n\n${invitation.event.name}\n📅 ${new Date(invitation.event.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}\n📍 ${invitation.event.location}\n\nVe tu invitación aquí: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }}
    className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all font-semibold"
                       title="Compartir por WhatsApp"
  >
    📱 WhatsApp
  </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}