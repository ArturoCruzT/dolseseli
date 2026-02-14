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
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');

  const isEditMode = !!editId;

  useEffect(() => {
    console.log('🔄 Features actualizadas en personalizar:', features);
  }, [features]);

  // Leer plan del usuario
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserPlan(parsed.plan === 'pro' ? 'pro' : 'free');
      } catch (e) {}
    }
  }, []);

  // Obtener datos del template de la URL
  const { templateId, templateName, color, preview, tipo } = router.query;

  const [template, setTemplate] = useState({
    id: 1,
    name: 'Royal Dreams',
    preview: '👑',
    color: 'from-pink-400 via-rose-400 to-fuchsia-500',
  });

  // Sincronizar template con query params
  useEffect(() => {
    if (templateId || templateName || color || preview) {
      setTemplate({
        id: Number(templateId) || 1,
        name: (templateName as string) || 'Royal Dreams',
        preview: (preview as string) || '👑',
        color: (color as string) || 'from-pink-400 via-rose-400 to-fuchsia-500',
      });
    }
  }, [templateId, templateName, color, preview]);

  // ─── Cargar datos de edición si existen ───
  useEffect(() => {
    const editData = sessionStorage.getItem('editInvitation');
    if (editData) {
      try {
        const parsed = JSON.parse(editData);
        if (parsed.id) setEditId(parsed.id);
        if (parsed.event) setEventData(prev => ({ ...prev, ...parsed.event }));
        if (parsed.styles) setCustomStyles(prev => ({ ...prev, ...parsed.styles }));
        if (parsed.features) setFeatures(prev => ({ ...prev, ...parsed.features }));
        if (parsed.template) setTemplate(parsed.template);
      } catch (e) {
        console.error('Error al cargar datos de edición:', e);
      }
    }
  }, []);

  // ─── Helpers compartidos ───
  const buildFeaturesForDB = () => ({
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
  });

  const buildCleanEventData = () =>
    Object.fromEntries(
      Object.entries(eventData).filter(([_, v]) => {
        if (v === '' || v === undefined || v === null) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      })
    );

  // ─── Guardar como borrador ───
  const handleSaveDraft = async () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('⚠️ Debes iniciar sesión para guardar');
      router.push('/auth');
      return;
    }

    const user = JSON.parse(currentUser);
    setIsSaving(true);

    try {
      const featuresForDB = buildFeaturesForDB();
      const cleanEventData = buildCleanEventData();

      if (editId) {
        // UPDATE existente (mantener su status actual)
        const { error } = await supabase
          .from('invitations')
          .update({
            event: cleanEventData,
            styles: customStyles,
            features: featuresForDB,
            template: template,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editId);

        if (error) throw error;
      } else {
        // INSERT nuevo como borrador
        const { data: newInvitation, error } = await supabase
          .from('invitations')
          .insert([{
            user_id: user.id,
            template: template,
            event: cleanEventData,
            styles: customStyles,
            features: featuresForDB,
            status: 'draft',
            plan: user.plan || 'free',
            credits_allocated: 0,
            credits_used: 0,
            published_at: null,
          }])
          .select()
          .single();

        if (error) throw error;

        // Guardar el ID para que futuros "guardar" sean UPDATE
        setEditId(newInvitation.id);
        sessionStorage.setItem('editInvitation', JSON.stringify({
          id: newInvitation.id,
          event: cleanEventData,
          styles: customStyles,
          features: featuresForDB,
          template: template,
        }));
      }

      alert('✅ Invitación guardada correctamente');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      alert('❌ Error al guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
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

        onSaveDraft={handleSaveDraft}
        isEditMode={isEditMode}
        isSaving={isSaving}
        userPlan={userPlan}
        onDashboard={() => {
          if (confirm('¿Ir al Dashboard? Los cambios no guardados se perderán.')) {
            sessionStorage.removeItem('editInvitation');
            router.push('/dashboard');
          }
        }}
        onCancel={() => {
          if (confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
            sessionStorage.removeItem('editInvitation');
            router.push(isEditMode ? '/dashboard' : '/');
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

    </>
  );
}