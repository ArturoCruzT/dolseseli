import React from 'react';
import { Button } from '../ui';

interface InvitationPreviewProps {
  template: {
    id: number;
    name: string;
    preview: string;
    color: string;
  };
  eventData?: {
    name?: string;
    date?: string;
    location?: string;
    message?: string;
  };
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  template,
  eventData = {}
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Device Frame */}
      <div className="bg-neutral-900 rounded-[3rem] p-4 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/16] relative">
          {/* Invitation Content */}
          <div className={`h-full bg-gradient-to-br ${template.color} p-8 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center space-y-6 animate-fade-in">
              <div className="text-8xl mb-4 animate-float">
                {template.preview}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-widest uppercase opacity-90">
                  Estás invitado a
                </p>
                <h2 className="text-4xl font-display font-bold">
                  {eventData.name || 'Tu Evento Especial'}
                </h2>
              </div>
              
              <div className="w-16 h-px bg-white/50 mx-auto" />
              
              <div className="space-y-3 text-lg">
                <p className="flex items-center justify-center gap-2">
                  <span>📅</span>
                  <span>{eventData.date || '15 de Marzo, 2024'}</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>📍</span>
                  <span>{eventData.location || 'Salón de Eventos'}</span>
                </p>
              </div>
              
              {eventData.message && (
                <>
                  <div className="w-16 h-px bg-white/50 mx-auto" />
                  <p className="text-sm italic opacity-90 max-w-xs">
                    "{eventData.message}"
                  </p>
                </>
              )}
              
              <div className="pt-4">
                <button className="px-8 py-3 bg-white text-neutral-900 rounded-full font-semibold hover:scale-105 transition-transform">
                  Confirmar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 mt-8 justify-center">
        <Button variant="secondary">
          <span>📱</span>
          Ver en móvil
        </Button>
        <Button variant="primary">
          <span>💾</span>
          Guardar y compartir
        </Button>
      </div>
    </div>
  );
};
