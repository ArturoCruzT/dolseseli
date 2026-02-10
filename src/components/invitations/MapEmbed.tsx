import React from 'react';

interface MapEmbedProps {
  location: string;
  mapUrl?: string;
  frameStyle?: 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft';
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ 
  location, 
  mapUrl,
  frameStyle = 'none'
}) => {
  const encodedLocation = encodeURIComponent(location);
  
  // Procesar URL de Google Maps
  let embedUrl = '';
  
  if (mapUrl) {
    if (mapUrl.includes('google.com/maps')) {
      const placeMatch = mapUrl.match(/place\/([^/]+)/);
      const coordsMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      
      if (coordsMatch) {
        const [, lat, lng] = coordsMatch;
        embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
      } else if (placeMatch) {
        embedUrl = `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
      }
    }
  }
  
  if (!embedUrl) {
    embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&output=embed`;
  }

  // Estilos de marcos elegantes y sobrios
  const frameStyles = {
    none: {
      container: '',
      decorTop: null,
      borderClass: 'border border-neutral-200',
      shadowClass: ''
    },
    minimal: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white px-4 py-1.5 rounded-full shadow-md border border-neutral-200">
            <span className="text-sm text-neutral-600">📍</span>
          </div>
        </div>
      ),
      borderClass: 'border border-neutral-300',
      shadowClass: 'shadow-sm'
    },
    classic: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-neutral-100 to-white px-5 py-1.5 rounded-lg shadow-lg border border-neutral-300">
            <span className="text-base">📍</span>
          </div>
        </div>
      ),
      borderClass: 'border-2 border-neutral-400',
      shadowClass: 'shadow-md'
    },
    modern: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-2 rounded-xl shadow-xl border border-slate-600">
            <span className="text-white text-sm">📍</span>
          </div>
        </div>
      ),
      borderClass: 'border-2 border-slate-300',
      shadowClass: 'shadow-lg shadow-slate-200/50'
    },
    elegant: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-gradient-to-br from-amber-50 to-white px-6 py-2 rounded-lg border border-amber-200 shadow-xl">
              <span className="text-amber-700 text-sm">📍</span>
            </div>
          </div>
        </div>
      ),
      borderClass: 'border-2 border-amber-200',
      shadowClass: 'shadow-xl shadow-amber-100/50'
    },
    soft: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-1.5 rounded-full shadow-lg border border-blue-200">
            <span className="text-blue-600 text-sm">📍</span>
          </div>
        </div>
      ),
      borderClass: 'border border-blue-200',
      shadowClass: 'shadow-md shadow-blue-100/50'
    }
  };

  const currentFrame = frameStyles[frameStyle];

  return (
    <div className={`w-full ${currentFrame.container} mb-8`}>
      {/* Decoración superior */}
      {currentFrame.decorTop}
      
      {/* Contenedor del mapa */}
      <div className={`relative rounded-xl overflow-hidden ${currentFrame.borderClass} ${currentFrame.shadowClass} bg-white`}>
        <iframe
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          src={embedUrl}
          title={`Mapa de ${location}`}
          allowFullScreen
          className="w-full"
        />
        
        {/* Pie del mapa */}
        <div className="bg-white p-3 text-center border-t border-neutral-100">
          <a 
            href={mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};