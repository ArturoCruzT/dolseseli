import React, { useEffect, useState } from 'react';

interface YouTubePlayerProps {
  url: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Extraer el ID del video de YouTube
    const extractVideoId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    if (url) {
      const id = extractVideoId(url);
      setVideoId(id);
    }
  }, [url]);

  if (!videoId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-4 w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <span className="font-semibold text-sm">Música de fondo</span>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* YouTube iframe (oculto, solo reproducimos el audio) */}
        <iframe
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${videoId}&controls=0`}
          title="Background Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ display: 'none' }}
        />

        <div className="text-xs text-neutral-500 text-center">
          {isPlaying ? 'Reproduciendo...' : 'Pausado'}
        </div>
      </div>
    </div>
  );
};