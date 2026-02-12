import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { InvitationPreview } from '../components/invitations/InvitationPreview';
import { VisualEditor } from '../components/invitations/VisualEditor';
import { MobileCustomizationLayout } from '../components/invitations/MobileCustomizationLayout';
import { supabase } from '@/lib/supabase';
import type { Features, CustomStyles, EventData, MapFrameStyle, CountdownSize, EntryEffectType, EffectIntensity } from '../types/invitation';

export default function Personalizar() {
  const router = useRouter();

  const [eventData, setEventData] = useState<EventData>({
    // Básicos
    name: '',
    date: '',
    location: '',
    message: '',

    // Festejado
    honoree_name: '',
    honoree_name_2: '',
    honoree_age: undefined,
    honoree_photo: undefined,

    // Itinerario
    ceremony_time: '',
    ceremony_location: '',
    ceremony_address: '',
    ceremony_map_url: '',
    reception_time: '',
    reception_location: '',
    reception_address: '',
    reception_map_url: '',

    // Detalles
    dress_code: '',
    dress_code_colors: [],
    gift_registry: [],
    no_kids: false,
    parking_info: '',
    special_notes: '',

    // Familia
    parents: [],
    godparents: [],

    // Social
    hashtag: '',
  });

  const [customStyles, setCustomStyles] = useState<CustomStyles>({
    gradient: '',
    textColor: '#ffffff',
    font: 'font-display',
    textSize: { name: 'Mediano', title: 'text-4xl', subtitle: 'text-lg' },
    alignment: 'justify-center',
    padding: 8,
    animation: 'float',
    opacity: 100,
    backgroundImage: undefined,
    bgImageOpacity: 30,
    icon: '',
  });

  const [features, setFeatures] = useState<Features>({
    rsvp: false,
    map: false,
    gallery: false,
    countdown: false,
    galleryPhotos: [],
    mapUrl: '',
    mapFrameStyle: 'none',
    countdownDesign: '',
    countdownSize: 'md',
    entryEffect: 'none',
    entryEffectIntensity: 'medium',
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    console.log('🔄 Features actualizadas en personalizar:', features);
  }, [features]);

  // Obtener datos del template de la URL
  const { templateId, templateName, color, preview, tipo } = router.query;

  const template = {
    id: Number(templateId) || 1,
    name: (templateName as string) || 'Royal Dreams',
    preview: (preview as string) || '👑',
    color: (color as string) || 'from-pink-400 via-rose-400 to-fuchsia-500',
  };

  // ─── Cargar datos de edición si existen ───
  useEffect(() => {
    const editData = sessionStorage.getItem('editInvitation');
    if (editData) {
      try {
        const parsed = JSON.parse(editData);
        if (parsed.event) setEventData(parsed.event);
        if (parsed.styles) setCustomStyles(parsed.styles);
        if (parsed.features) setFeatures(parsed.features);
      } catch (e) {
        console.error('Error al cargar datos de edición:', e);
      }
    }
  }, []);

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
      const featuresForDB = {
        rsvp: features.rsvp,
        map: features.map,
        mapFrameStyle: features.mapFrameStyle,
        gallery: features.gallery,
        countdown: features.countdown,
        countdownDesign: features.countdownDesign,
        countdownSize: features.countdownSize,
        mapUrl: features.mapUrl,
        galleryPhotos: features.galleryPhotos,
        entryEffect: features.entryEffect,
        entryEffectIntensity: features.entryEffectIntensity,
      };

      // Limpiar eventData: remover campos vacíos para no llenar la DB de strings vacíos
      const cleanEventData = Object.fromEntries(
        Object.entries(eventData).filter(([_, v]) => {
          if (v === '' || v === undefined || v === null) return false;
          if (Array.isArray(v) && v.length === 0) return false;
          return true;
        })
      );

      // Verificar si es edición
      const editData = sessionStorage.getItem('editInvitation');
      let editId: string | null = null;
      if (editData) {
        try {
          const parsed = JSON.parse(editData);
          editId = parsed.id || null;
        } catch (e) {}
      }

      if (editId) {
        // UPDATE existente
        const { data: updatedInvitation, error } = await supabase
          .from('invitations')
          .update({
            event: cleanEventData,
            styles: customStyles,
            features: featuresForDB,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editId)
          .select()
          .single();

        if (error) throw error;

        sessionStorage.removeItem('editInvitation');
        router.push(`/preview?id=${updatedInvitation.id}`);
      } else {
        // INSERT nuevo
        const { data: newInvitation, error } = await supabase
          .from('invitations')
          .insert([{
            user_id: user.id,
            template: template,
            event: cleanEventData,
            styles: customStyles,
            features: featuresForDB,
            status: 'published',
            plan: user.plan,
            credits_allocated: user.plan === 'free' ? 10 : user.plan === 'basic' ? 100 : 150,
            credits_used: 0,
          }])
          .select()
          .single();

        if (error) throw error;

        router.push(`/preview?id=${newInvitation.id}`);
      }
    } catch (error) {
      console.error('Error al publicar invitación:', error);
      alert('❌ Error al publicar la invitación. Intenta de nuevo.');
    }
  };

  return (
    <>
      <MobileCustomizationLayout
        eventData={eventData}
        onUpdate={(data) =>
          setEventData({
            ...data,
            message: data.message ?? '',
          })
        }

        features={{
          ...features,
          mapFrameStyle: features.mapFrameStyle as 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft' | undefined
        }}
        onFeaturesUpdate={(f) =>
          setFeatures({
            rsvp: f.rsvp ?? false,
            map: f.map ?? false,
            gallery: f.gallery ?? false,
            countdown: f.countdown ?? false,
            galleryPhotos: f.galleryPhotos ?? [],
            mapUrl: f.mapUrl ?? '',
            countdownDesign: f.countdownDesign ?? '',
            countdownSize: (f.countdownSize ?? 'sm') as CountdownSize,
            mapFrameStyle: (f.mapFrameStyle ?? 'none') as MapFrameStyle,
            entryEffect: (f.entryEffect ?? 'none') as EntryEffectType,
            entryEffectIntensity: (f.entryEffectIntensity ?? 'medium') as EffectIntensity,
          })
        }

        customStyles={customStyles}
        onStylesUpdate={setCustomStyles}

        template={template}

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
                {eventData.honoree_name && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Festejado:</span>
                    <span className="font-semibold">
                      {eventData.honoree_name}
                      {eventData.honoree_name_2 ? ` & ${eventData.honoree_name_2}` : ''}
                    </span>
                  </div>
                )}
                {eventData.ceremony_time && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Ceremonia:</span>
                    <span className="font-semibold">{eventData.ceremony_time}</span>
                  </div>
                )}
                {eventData.reception_time && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Recepción:</span>
                    <span className="font-semibold">{eventData.reception_time}</span>
                  </div>
                )}
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
