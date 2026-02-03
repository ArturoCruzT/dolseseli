import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { InvitationPreview } from '@/components/invitations/InvitationPreview';
import { CustomizationForm } from '@/components/invitations/CustomizationForm';

export default function Personalizar() {
  const router = useRouter();
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    message: '',
  });

  // Obtener datos del template de la URL
  const { templateId, templateName, color, preview, tipo } = router.query;

  const template = {
    id: Number(templateId) || 1,
    name: (templateName as string) || 'Royal Dreams',
    preview: (preview as string) || '👑',
    color: (color as string) || 'from-pink-400 via-rose-400 to-fuchsia-500',
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-display font-bold">Personalizar Invitación</h1>
                <p className="text-sm text-neutral-600">{template.name}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="secondary">
                Cancelar
              </Button>
              <Button variant="accent" onClick={() => router.push('/preview')}>
                Publicar Invitación
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-neutral-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 sticky top-24">
                <CustomizationForm onUpdate={setEventData} />
              </div>
            </div>

            {/* Right: Preview */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-24">
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                    Vista Previa en Tiempo Real
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Los cambios se reflejan automáticamente
                  </p>
                </div>
                <InvitationPreview template={template} eventData={eventData} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mobile Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-50">
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1">
            Cancelar
          </Button>
          <Button variant="accent" className="flex-1" onClick={() => router.push('/preview')}>
            Publicar
          </Button>
        </div>
      </div>
    </Layout>
  );
}