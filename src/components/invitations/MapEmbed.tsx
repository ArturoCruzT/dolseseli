import React from 'react';

interface MapEmbedProps {
  location: string;
  mapUrl?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ location, mapUrl }) => {
  const encodedLocation = encodeURIComponent(location);
  
  // Extraer coordenadas o place_id del URL de Google Maps si está disponible
  let embedUrl = '';
  
  if (mapUrl) {
    // Si el usuario pegó un enlace de Google Maps
    if (mapUrl.includes('google.com/maps')) {
      // Intentar convertir el enlace a formato embed
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
  
  // Fallback a búsqueda por ubicación
  if (!embedUrl) {
    embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&output=embed`;
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
      <iframe
        width="100%"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        src={embedUrl}
        title={`Mapa de ${location}`}
        allowFullScreen
      />
      <div className="bg-white/90 backdrop-blur-sm p-3 text-center">
        <p className="text-sm font-semibold text-neutral-800">📍 {location}</p>
        <a 
          href={mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
        >
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
};