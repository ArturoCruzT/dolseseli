import React, { useState } from 'react';
import { Button } from '../ui';

interface CustomizationFormProps {
  onUpdate: (data: any) => void;
}

export const CustomizationForm: React.FC<CustomizationFormProps> = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display font-bold mb-6">
          Personaliza tu Invitación
        </h3>
      </div>

      {/* Form Fields */}
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
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Fecha del Evento *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
          />
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
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Mensaje Especial (Opcional)
          </label>
          <textarea
            placeholder="Ej: Tu presencia es el mejor regalo..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Color Options */}
  {/* Color Options */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Esquema de Color
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { gradient: 'from-pink-400 to-purple-600', name: 'Rosa' },
            { gradient: 'from-amber-400 to-orange-500', name: 'Dorado' },
            { gradient: 'from-blue-400 to-cyan-500', name: 'Azul' },
            { gradient: 'from-green-400 to-emerald-500', name: 'Verde' },
            { gradient: 'from-purple-400 to-pink-500', name: 'Púrpura' },
          ].map((color, i) => (
            <button
              key={i}
              title={color.name}
              className={`h-12 rounded-xl bg-gradient-to-br ${color.gradient} hover:scale-110 transition-transform border-2 border-transparent hover:border-neutral-900 relative group`}
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Style */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Estilo de Fuente
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Elegante', font: 'font-serif' },
            { name: 'Moderna', font: 'font-sans' },
            { name: 'Display', font: 'font-display' },
          ].map((style, i) => (
            <button
              key={i}
              className={`p-3 rounded-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all ${style.font}`}
            >
              <span className="text-sm font-semibold">Aa</span>
              <p className="text-xs text-neutral-600 mt-1">{style.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Music Option */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Música de Fondo (Opcional)
        </label>
        <div className="flex items-center gap-3">
          <button className="flex-1 p-4 rounded-xl border-2 border-neutral-200 hover:border-neutral-900 transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-lg flex items-center justify-center text-white">
                🎵
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Agregar Música</p>
                <p className="text-xs text-neutral-500">MP3, WAV</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 space-y-3">
        <Button variant="accent" className="w-full" size="lg">
          Vista Previa Completa
        </Button>
        <Button variant="secondary" className="w-full">
          Guardar Borrador
        </Button>
      </div>
    </div>
  );
};

