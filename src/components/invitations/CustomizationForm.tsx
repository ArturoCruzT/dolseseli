import React, { useState } from 'react';
import { Button } from '../ui';
import { supabase } from '@/lib/supabase';

interface CustomizationFormProps {
  onUpdate: (data: any) => void;
  onFeaturesUpdate: (features: any) => void;
  eventData?: any;
  customStyles?: any;
  template?: any;
  onPreviewFullscreen?: () => void;
  currentFeatures?: any;
}

export const CustomizationForm: React.FC<CustomizationFormProps> = ({
  onUpdate,
  onFeaturesUpdate,
  eventData = {},
  customStyles = {},
  template = {},
  onPreviewFullscreen,
  currentFeatures = {},
}) => {
  // Usar los datos del padre
  const formData = eventData || {
    name: '',
    date: '',
    location: '',
    message: '',
  };

  // Usar features del padre
  const features = currentFeatures || {
    rsvp: false,
    map: false,
    gallery: false,
    countdown: false,
    galleryPhotos: [],
    mapUrl: '',
  };

  const [errors, setErrors] = useState({
    name: false,
    date: false,
    location: false,
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };

    // Limpiar error cuando el usuario escribe
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: false });
    }

    onUpdate(newData);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = { ...features, [feature]: !features[feature as keyof typeof features] };
    console.log('Features actualizadas:', newFeatures);
    onFeaturesUpdate(newFeatures);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = features.galleryPhotos || [];

    // Verificar límite
    if (currentPhotos.length + files.length > 10) {
      alert('⚠️ Máximo 10 fotos permitidas');
      return;
    }

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Generar nombre único
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Subir a Supabase Storage
        const { data, error } = await supabase.storage
          .from('invitation-galleries')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('invitation-galleries')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Actualizar features con las nuevas URLs
      const allPhotos = [...currentPhotos, ...uploadedUrls];
      onFeaturesUpdate({ ...features, galleryPhotos: allPhotos });

      console.log('✅ Fotos subidas:', uploadedUrls);
    } catch (error) {
      console.error('Error al subir fotos:', error);
      alert('❌ Error al subir las fotos. Intenta de nuevo.');
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      date: !formData.date,
      location: !formData.location.trim(),
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.date || newErrors.location) {
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display font-bold mb-6">
          Personaliza tu Invitación
        </h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Nombre del Evento *
          </label>
          <input
            type="text"
            placeholder="Ej: Mis XV Años"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.name
              ? 'border-red-500 focus:border-red-600 bg-red-50'
              : 'border-neutral-200 focus:border-neutral-900'
              }`}
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span>
              Este campo es obligatorio
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Fecha del Evento *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.date
              ? 'border-red-500 focus:border-red-600 bg-red-50'
              : 'border-neutral-200 focus:border-neutral-900'
              }`}
          />
          {errors.date && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span>
              Selecciona una fecha para el evento
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Ubicación *
          </label>
          <input
            type="text"
            placeholder="Ej: Salón de Fiestas La Elegancia"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.location
              ? 'border-red-500 focus:border-red-600 bg-red-50'
              : 'border-neutral-200 focus:border-neutral-900'
              }`}
          />
          {errors.location && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span>
              La ubicacion es necesaria para el evento
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Mensaje Especial (Opcional)
          </label>
          <textarea
            placeholder="Ej: Tu presencia es el mejor regalo..."
            value={formData.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6 mt-6">
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Características Adicionales
        </label>

        <div className="space-y-3">
          {/*
          <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={features.rsvp || false}
              onChange={() => handleFeatureToggle('rsvp')}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="font-semibold text-sm">Confirmación RSVP</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Permite que tus invitados confirmen asistencia</p>
            </div>
          </label>
        */}
          <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={features.map || false}
              onChange={() => handleFeatureToggle('map')}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span className="font-semibold text-sm">Mapa de Ubicación</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Muestra un mapa interactivo del lugar</p>
              {features.map && (
                <div className="mt-3 space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                      <span>💡</span>
                      Como obtener el enlace de Google Maps:
                    </p>
                    <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                      <li>Abre <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google Maps</a></li>
                      <li>Busca el lugar de tu evento</li>
                      <li>Seleciona la URL</li>
                      <li>Copia el enlace y pegalo aqui abajo</li>
                    </ol>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="https://maps.app.goo.gl/ejemplo"
                      value={features.mapUrl || ''}
                      onChange={(e) => {
                        onFeaturesUpdate({ ...features, mapUrl: e.target.value });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border-2 border-neutral-300 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Opcional: Si no pegas enlace se usara la ubicacion escrita arriba
                    </p>
                  </div>
                </div>
              )}
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={features.gallery || false}
              onChange={() => handleFeatureToggle('gallery')}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <span className="font-semibold text-sm">Galería de Fotos</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Agrega hasta 10 fotos</p>
              {features.gallery && (
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
                  >
                    Subir Fotos ({(features.galleryPhotos || []).length}/10)
                  </label>
                  {(features.galleryPhotos || []).length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {(features.galleryPhotos || []).map((photo: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                          <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              const currentPhotos = features.galleryPhotos || [];
                              const photoUrl = currentPhotos[i];

                              try {
                                // Extraer el nombre del archivo de la URL
                                const urlParts = photoUrl.split('/');
                                const fileName = urlParts[urlParts.length - 1];

                                if (fileName && photoUrl.includes('supabase')) {
                                  // Solo eliminar de Supabase si es una URL de Supabase
                                  const { error } = await supabase.storage
                                    .from('invitation-galleries')
                                    .remove([fileName]);

                                  if (error) {
                                    console.error('Error deleting from storage:', error);
                                  } else {
                                    console.log('✅ Foto eliminada de Supabase:', fileName);
                                  }
                                }

                                // Eliminar del estado local
                                const newPhotos = currentPhotos.filter((_: any, index: number) => index !== i);
                                onFeaturesUpdate({ ...features, galleryPhotos: newPhotos });
                              } catch (error) {
                                console.error('Error al eliminar foto:', error);
                                // Aún así eliminar del estado local
                                const newPhotos = currentPhotos.filter((_: any, index: number) => index !== i);
                                onFeaturesUpdate({ ...features, galleryPhotos: newPhotos });
                              }
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 text-xs rounded-bl flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={features.countdown || false}
              onChange={() => handleFeatureToggle('countdown')}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <span className="font-semibold text-sm">Contador Regresivo</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Cuenta los dias hasta el evento</p>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-6 space-y-3">
        <Button
          variant="accent"
          className="w-full"
          size="lg"
          onClick={() => {
            if (validateForm()) {
              if (onPreviewFullscreen) {
                onPreviewFullscreen();
              }
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          Vista Previa Completa
        </Button>
      </div>
    </div>
  );
};