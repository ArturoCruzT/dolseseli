import React, { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-xl font-display font-bold mb-4 opacity-90">📸 Galería de Fotos</h3>
      <div className="grid grid-cols-3 gap-3">
        {photos.slice(0, 9).map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhoto(index)}
            className="aspect-square rounded-xl overflow-hidden border-2 border-white/30 hover:border-white/60 transition-all hover:scale-105 shadow-lg"
          >
            <img 
              src={photo} 
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {photos.length > 9 && (
        <p className="text-center text-sm mt-3 opacity-80">
          +{photos.length - 9} fotos más
        </p>
      )}

      {/* Modal para ver foto completa */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white text-2xl hover:bg-white/30 transition-all flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          
          {/* Navigation */}
          {selectedPhoto > 0 && (
            <button
              className="absolute left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto - 1);
              }}
            >
              ←
            </button>
          )}
          
          {selectedPhoto < photos.length - 1 && (
            <button
              className="absolute right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto + 1);
              }}
            >
              →
            </button>
          )}
          
          <img 
            src={photos[selectedPhoto]} 
            alt={`Foto ${selectedPhoto + 1}`}
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
};