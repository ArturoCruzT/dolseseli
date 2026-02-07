import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export default function Preview() {
  const router = useRouter();
  const { id } = router.query;
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invitationUrl, setInvitationUrl] = useState('');

  useEffect(() => {
    if (invitation && typeof window !== 'undefined') {
      setInvitationUrl(`${window.location.origin}/i/${invitation.id}`);
    }
  }, [invitation]);

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

        setInvitation(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading invitation:', error);
        alert('Error al cargar la invitación');
        router.push('/dashboard');
      }
    };

    loadInvitation();
  }, [id, router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <p className="text-xl text-neutral-600">Cargando invitación...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invitation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl text-neutral-600">Invitación no encontrada</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-br from-neutral-50 via-purple-50/30 to-pink-50/30 min-h-screen">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-12 animate-slide-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">
                ¡Invitación Publicada! 🎉
              </h1>
              <p className="text-xl text-neutral-600">
                Tu invitación está lista para compartir
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-200 p-8 mb-8">
              <h2 className="text-2xl font-display font-bold mb-6">Comparte tu Invitación</h2>
              
              <div className="space-y-6">
                {/* URL */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Enlace de tu Invitación
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={invitationUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-xl font-mono text-sm"
                    />
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigator.clipboard.writeText(invitationUrl);
                        alert('✅ Enlace copiado al portapapeles');
                      }}
                    >
                      📋 Copiar
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Compartir en Redes Sociales
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`¡Estás invitado! ${invitationUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                    >
                      <span>WhatsApp</span>
                    </a>
                    
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <span>Facebook</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent('¡Estás invitado!')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-semibold"
                    >
                      <span>Twitter</span>
                    </a>
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent('¡Estás invitado!');
                        const body = encodeURIComponent(`Hola! Te invito a mi evento. Aquí está tu invitación: ${invitationUrl}`);
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 text-white rounded-xl hover:bg-neutral-800 transition-colors font-semibold"
                    >
                      <span>Email</span>
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-neutral-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">
                      {invitation.credits_used || 0}
                    </div>
                    <div className="text-sm text-neutral-600">Vistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">0</div>
                    <div className="text-sm text-neutral-600">Confirmados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">
                      {invitation.credits_allocated}
                    </div>
                    <div className="text-sm text-neutral-600">Disponibles</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`/invitation-view?id=${invitation.id}`, '_blank')}
                  >
                    👁️ Ver Invitación
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/dashboard')}
                  >
                    📊 Ir al Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}