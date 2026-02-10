import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { InvitationPreview } from '../components/invitations/InvitationPreview';
// import { CustomizationForm } from '../components/invitations/CustomizationForm';  ← YA NO SE USA
import { VisualEditor } from '../components/invitations/VisualEditor';
import { MobileCustomizationLayout } from '../components/invitations/MobileCustomizationLayout';  // ← NUEVO
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
    countdownDesign: '',
    galleryPhotos: [] as string[],
    mapUrl: '',
    countdownSize: "sm" | 'md' | 'lg',
    mapFrameStyle: 'none' | 'quinceanera' | 'boda' | 'cumpleanos' | 'bautizo' | 'elegante',
  });


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
        mapFrameStyle: features.mapFrameStyle,
        gallery: features.gallery,
        countdown: features.countdown,
        countdownDesign: features.countdownDesign,
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
    <>
      <MobileCustomizationLayout
        // Datos del evento (ya los tienes)
        eventData={eventData}
        onUpdate={(data) =>
          setEventData({
            ...data,
            message: data.message ?? "",
          })
        }

        // Features (ya las tienes)
        features={features}
        onFeaturesUpdate={(f) =>
          setFeatures({
            ...f,
            rsvp: f.rsvp ?? '',
            map: f.map ?? '',
            gallery: f.gallery ?? '',
            countdown: f.countdown ?? '',
            countdownDesign: f.countdownDesign ?? '',
            galleryPhotos: f.galleryPhotos ?? [],
            mapUrl: f.mapUrl ?? '',
            mapFrameStyle: f.mapFrameStyle,
          })
        }




        // Estilos (ya los tienes)
        customStyles={customStyles}
        onStylesUpdate={setCustomStyles}

        // Template (ya lo tienes)
        template={template}

        // Render props: pasas tus componentes TAL CUAL
        renderPreview={() => (
          <InvitationPreview
            template={template}
            eventData={eventData}
            customStyles={customStyles}
            features={features}
          />
        )}

        renderVisualEditor={() => (
          <VisualEditor
            onStyleChange={setCustomStyles}
            currentStyles={customStyles}
          />
        )}

        // Acciones
        onPublish={() => {
          if (!eventData.name || !eventData.date || !eventData.location) {
            alert('⚠️ Por favor completa todos los campos obligatorios');
            return;
          }
          setShowPublishModal(true);
        }}
        onCancel={() => {
          if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
            router.push('/');
          }
        }}
        onPreviewFullscreen={() => setIsFullscreen(true)}
      />

      {/* ═══ Los modales se quedan IGUAL ═══ */}

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
    </>
  );
}