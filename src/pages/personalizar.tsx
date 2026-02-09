import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { InvitationPreview } from '../components/invitations/InvitationPreview';
import { CustomizationForm } from '../components/invitations/CustomizationForm';
import { VisualEditor } from '../components/invitations/VisualEditor';
import { supabase } from '@/lib/supabase';

export default function Personalizar() {

  const router = useRouter();
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    message: '',
  });

  const [customStyles, setCustomStyles] = useState({
    gradient: '',
    textColor: '#ffffff',
    font: 'font-display',
    textSize: { name: 'Mediano', title: 'text-4xl', subtitle: 'text-lg' },
    alignment: 'justify-center',
    padding: 8,
    animation: 'float',
    opacity: 100,
    backgroundImage: undefined as string | undefined,
    bgImageOpacity: 30,
    icon: '',
  });

  const [features, setFeatures] = useState({
    rsvp: false,
    map: false,
    gallery: false,
    countdown: false,
    galleryPhotos: [] as string[],
    mapUrl: '',
  });


  // Agregar este console.log temporal
  console.log('📦 Estado actual de features en personalizar:', features);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  useEffect(() => {
    console.log('🔄 Features actualizadas en personalizar:', features);
  }, [features]);

  console.log('🔍 Estado actual de features en personalizar:', features);
  const [activeSection, setActiveSection] = useState<'content' | 'design'>('content');

  // Obtener datos del template de la URL
  const { templateId, templateName, color, preview, tipo } = router.query;

  const template = {
    id: Number(templateId) || 1,
    name: (templateName as string) || 'Royal Dreams',
    preview: (preview as string) || '👑',
    color: (color as string) || 'from-pink-400 via-rose-400 to-fuchsia-500',
  };

const handlePublish = async () => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert('⚠️ Debes iniciar sesión para publicar tu invitación');
    router.push('/auth');
    return;
  }

  const user = JSON.parse(currentUser);
  
  if (user.plan === 'free' && (!user.credits || user.credits <= 0)) {
    alert('⚠️ Plan gratuito agotado. Actualiza tu plan para publicar.');
    router.push('/planes');
    return;
  }

  try {
    // Ahora las fotos ya son URLs de Supabase, no base64
    const featuresForDB = {
      rsvp: features.rsvp,
      map: features.map,
      gallery: features.gallery,
      countdown: features.countdown,
      mapUrl: features.mapUrl,
      galleryPhotos: features.galleryPhotos || [], // URLs de Supabase
    };

    // Crear invitación en Supabase
    const { data: newInvitation, error } = await supabase
      .from('invitations')
      .insert([
        {
          user_id: user.id,
          template: template,
          event: eventData,
          styles: customStyles,
          features: featuresForDB,
          status: 'published',
          plan: user.plan,
          credits_allocated: user.plan === 'free' ? 10 : user.plan === 'basic' ? 100 : 150,
          credits_used: 0,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }
    
    // Redirigir a preview con el ID
    router.push(`/preview?id=${newInvitation.id}`);
  } catch (error) {
    console.error('Error al publicar invitación:', error);
    alert('❌ Error al publicar la invitación. Intenta de nuevo.');
  }
};

  return (
    <Layout>

      {/* Header */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-display font-bold">Personalizar Invitación</h1>
                <p className="text-sm text-neutral-600">{template.name}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
                    router.push('/');
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  if (!eventData.name || !eventData.date || !eventData.location) {
                    alert('⚠️ Por favor completa todos los campos obligatorios');
                    setActiveSection('content');
                    return;
                  }
                  setShowPublishModal(true);
                }}
              >
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
            {/* Left: Editor */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 sticky top-48">
                {/* Toggle between Content and Design */}
                <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl mb-6">
                  <button
                    onClick={() => setActiveSection('content')}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${activeSection === 'content'
                      ? 'bg-white shadow-soft text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                  >
                    📝 Contenido
                  </button>
                  <button
                    onClick={() => setActiveSection('design')}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${activeSection === 'design'
                      ? 'bg-white shadow-soft text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                  >
                    🎨 Diseño
                  </button>
                </div>

                {/* Content Form */}
                {activeSection === 'content' && (
                  <div className="animate-fade-in">
                    <CustomizationForm
                      onUpdate={setEventData}
                      onFeaturesUpdate={setFeatures}
                      eventData={eventData}
                      customStyles={customStyles}
                      template={template}
                      onPreviewFullscreen={() => setIsFullscreen(true)}
                      currentFeatures={features}
                    />
                  </div>
                )}

                {/* Visual Editor */}
                {activeSection === 'design' && (
                  <div className="animate-fade-in">
                    <VisualEditor
                      onStyleChange={setCustomStyles}
                      currentStyles={customStyles}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-48">
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                    Vista Previa en Tiempo Real ✨
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Los cambios se reflejan automáticamente
                  </p>
                </div>
                <InvitationPreview
                  template={template}
                  eventData={eventData}
                  customStyles={customStyles}
                  features={features}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mobile Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-50">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              if (confirm('¿Cancelar edición? Se perderán los cambios.')) {
                router.push('/');
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={() => {
              if (!eventData.name || !eventData.date || !eventData.location) {
                alert('⚠️ Por favor completa todos los campos obligatorios');
                setActiveSection('content');
                return;
              }
              setShowPublishModal(true);
              const invitationData = {
                template: template,
                event: eventData,
                styles: customStyles,
                features: features,
                publishedAt: new Date().toISOString(),
              };

              const savedInvitations = JSON.parse(localStorage.getItem('invitations') || '[]');
              const invitationId = Date.now().toString();
              savedInvitations.push({ id: invitationId, ...invitationData });
              localStorage.setItem('invitations', JSON.stringify(savedInvitations));

              sessionStorage.setItem('publishedInvitation', JSON.stringify({ id: invitationId, ...invitationData }));

              router.push('/preview');
            }}
          >
            Publicar
          </Button>
        </div>
      </div>
      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-md h-[90vh]">
            <InvitationPreview
              template={template}
              eventData={eventData}
              customStyles={customStyles}
              features={features}
            />
          </div>
        </div>
      )}
      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-display font-bold mb-2">
                ¿Publicar Invitación?
              </h2>
              <p className="text-neutral-600">
                Tu invitación estará lista para compartir con tus invitados
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Evento:</span>
                  <span className="font-semibold">{eventData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fecha:</span>
                  <span className="font-semibold">{eventData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Ubicación:</span>
                  <span className="font-semibold">{eventData.location}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowPublishModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => {
                  setShowPublishModal(false);
                  handlePublish();
                }}
              >
                Publicar Ahora
              </Button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}