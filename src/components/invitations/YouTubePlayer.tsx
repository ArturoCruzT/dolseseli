import React, { useEffect, useState, useRef } from 'react';

interface YouTubePlayerProps {
  url: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const startMusic = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const togglePlay = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isMuted) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  if (!videoId) return null;

  return (
    <>
      {/* Botón de inicio si no ha comenzado */}
      {!hasStarted ? (
        <div className="w-full mt-6 animate-fade-in">
          <button
            onClick={startMusic}
            className="w-full py-4 px-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center gap-3 transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">
              🎵 Reproducir Música de Fondo
            </span>
          </button>
        </div>
      ) : (
        /* Control sutil cuando ya está reproduciendo */
        <div className="w-full mt-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            {/* Indicador de música */}
            <div className="flex items-center gap-2">
              {isPlaying && (
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                  <div className="w-1 h-4 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }} />
                  <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '0.6s' }} />
                </div>
              )}
              <span className="text-xs font-medium opacity-80">
                {isPlaying ? '♫ Reproduciendo' : '♫ Pausado'}
              </span>
            </div>

            {/* Controles */}
            <div className="flex gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube iframe (oculto, NO autoplay) */}
      <iframe
        ref={iframeRef}
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&loop=1&playlist=${videoId}&enablejsapi=1&controls=0`}
        title="Background Music"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: 'none' }}
      />
    </>
  );
};