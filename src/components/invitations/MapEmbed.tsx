import React from 'react';

interface MapEmbedProps {
  location: string;
  mapUrl?: string;
  frameStyle?: 'none' | 'quinceanera' | 'boda' | 'cumpleanos' | 'bautizo' | 'elegante';
  eventType?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ 
  location, 
  mapUrl,
  frameStyle = 'boda',
  eventType = 'evento'
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

  // Estilos de marcos según el tipo de evento
  const frameStyles = {
    none: {
      container: '',
      decorTop: null,
      decorBottom: null,
      borderClass: 'border-2 border-white/20'
    },
    quinceanera: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full px-6 py-2 shadow-xl border-4 border-white">
            <span className="text-2xl">👑</span>
          </div>
        </div>
      ),
      decorBottom: (
        <>
          {/* Flores decorativas esquinas superiores */}
          <div className="absolute -top-3 -left-3 text-4xl animate-float">🌸</div>
          <div className="absolute -top-3 -right-3 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🌸</div>
          
          {/* Flores decorativas esquinas inferiores */}
          <div className="absolute -bottom-3 -left-3 text-4xl animate-float" style={{ animationDelay: '1s' }}>💐</div>
          <div className="absolute -bottom-3 -right-3 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>💐</div>
          
          {/* Estrellas flotantes */}
          <div className="absolute top-1/4 -left-4 text-2xl animate-pulse">✨</div>
          <div className="absolute top-3/4 -right-4 text-2xl animate-pulse" style={{ animationDelay: '0.7s' }}>✨</div>
        </>
      ),
      borderClass: 'border-4 border-double border-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
    },
    boda: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-b from-white to-rose-50 rounded-lg px-8 py-3 shadow-2xl border-2 border-rose-200">
            <div className="flex items-center gap-2">
              <span className="text-3xl">💍</span>
              <span className="text-xl font-serif text-rose-900">•</span>
              <span className="text-3xl">💕</span>
            </div>
          </div>
        </div>
      ),
      decorBottom: (
        <>
          {/* Ramas decorativas */}
          <div className="absolute -top-4 -left-4">
            <svg width="60" height="60" viewBox="0 0 60 60" className="text-rose-300">
              <path d="M 10 50 Q 20 20, 40 10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="15" cy="40" r="4" fill="currentColor" opacity="0.6"/>
              <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.7"/>
              <circle cx="35" cy="15" r="4" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          
          <div className="absolute -top-4 -right-4 scale-x-[-1]">
            <svg width="60" height="60" viewBox="0 0 60 60" className="text-rose-300">
              <path d="M 10 50 Q 20 20, 40 10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="15" cy="40" r="4" fill="currentColor" opacity="0.6"/>
              <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.7"/>
              <circle cx="35" cy="15" r="4" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Corazones flotantes */}
          <div className="absolute top-1/3 -left-5 text-2xl animate-pulse text-rose-400">💗</div>
          <div className="absolute top-2/3 -right-5 text-2xl animate-pulse text-rose-400" style={{ animationDelay: '0.5s' }}>💗</div>
          
          {/* Anillos en esquinas inferiores */}
          <div className="absolute -bottom-4 -left-4 text-3xl opacity-70">💍</div>
          <div className="absolute -bottom-4 -right-4 text-3xl opacity-70">💍</div>
        </>
      ),
      borderClass: 'border-[3px] border-rose-200 shadow-[0_0_40px_rgba(225,29,72,0.2)]'
    },
    cumpleanos: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 rounded-2xl px-6 py-2 shadow-xl border-3 border-white transform -rotate-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎂</span>
              <span className="text-2xl">🎉</span>
              <span className="text-2xl">🎈</span>
            </div>
          </div>
        </div>
      ),
      decorBottom: (
        <>
          {/* Globos en las esquinas */}
          <div className="absolute -top-5 -left-5 text-5xl animate-bounce">🎈</div>
          <div className="absolute -top-5 -right-5 text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎈</div>
          
          {/* Confeti */}
          <div className="absolute top-1/4 -left-4 text-3xl animate-spin" style={{ animationDuration: '3s' }}>🎊</div>
          <div className="absolute top-1/2 -right-4 text-3xl animate-spin" style={{ animationDuration: '4s' }}>🎊</div>
          
          {/* Regalos en esquinas inferiores */}
          <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse">🎁</div>
          <div className="absolute -bottom-4 -right-4 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>🎁</div>
        </>
      ),
      borderClass: 'border-4 border-dashed border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
    },
    bautizo: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-b from-blue-100 to-white rounded-full p-3 shadow-xl border-2 border-blue-200">
            <span className="text-3xl">🕊️</span>
          </div>
        </div>
      ),
      decorBottom: (
        <>
          {/* Angelitos en esquinas superiores */}
          <div className="absolute -top-4 -left-4 text-3xl opacity-80">👼</div>
          <div className="absolute -top-4 -right-4 text-3xl opacity-80">👼</div>
          
          {/* Nubes decorativas */}
          <div className="absolute top-1/3 -left-6 text-4xl opacity-60">☁️</div>
          <div className="absolute top-2/3 -right-6 text-4xl opacity-60">☁️</div>
          
          {/* Estrellas suaves */}
          <div className="absolute -bottom-3 -left-3 text-2xl animate-pulse text-blue-300">⭐</div>
          <div className="absolute -bottom-3 -right-3 text-2xl animate-pulse text-blue-300" style={{ animationDelay: '0.5s' }}>⭐</div>
        </>
      ),
      borderClass: 'border-3 border-blue-200 shadow-[0_0_25px_rgba(147,197,253,0.3)]'
    },
    elegante: {
      container: 'relative',
      decorTop: (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded px-8 py-2 shadow-2xl border border-amber-300">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600"></div>
              <span className="text-2xl text-amber-800 font-serif">✦</span>
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600"></div>
            </div>
          </div>
        </div>
      ),
      decorBottom: (
        <>
          {/* Ornamentos de esquina art deco */}
          <div className="absolute -top-3 -left-3">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-amber-600">
              <path d="M 5 35 L 20 5 L 35 35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="absolute -top-3 -right-3 scale-x-[-1]">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-amber-600">
              <path d="M 5 35 L 20 5 L 35 35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="absolute -bottom-3 -left-3 rotate-180">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-amber-600">
              <path d="M 5 35 L 20 5 L 35 35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="absolute -bottom-3 -right-3 scale-x-[-1] rotate-180">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-amber-600">
              <path d="M 5 35 L 20 5 L 35 35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="20" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Detalles elegantes laterales */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 text-amber-600">
            <div className="flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-current opacity-40"></div>
              <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
              <div className="w-1 h-1 rounded-full bg-current opacity-80"></div>
            </div>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 text-amber-600">
            <div className="flex flex-col gap-1">
              <div className="w-3 h-3 rounded-full bg-current opacity-40"></div>
              <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
              <div className="w-1 h-1 rounded-full bg-current opacity-80"></div>
            </div>
          </div>
        </>
      ),
      borderClass: 'border-2 border-amber-400 shadow-[0_0_30px_rgba(217,119,6,0.2)]'
    }
  };

  const currentFrame = frameStyles[frameStyle];

  return (
    <div className={`w-full ${currentFrame.container} mb-8`}>
      {/* Decoración superior */}
      {currentFrame.decorTop}
      
      {/* Decoraciones adicionales */}
      {currentFrame.decorBottom}
      
      {/* Contenedor del mapa */}
      <div className={`relative rounded-2xl overflow-hidden ${currentFrame.borderClass} bg-white/95 backdrop-blur-sm`}>
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
        <div className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm p-2 text-center border-t border-neutral-200">
          <a 
            href={mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};