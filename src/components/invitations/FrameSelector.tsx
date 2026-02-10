import React from 'react';

interface FrameSelectorProps {
  selectedFrame: 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft';
  onFrameChange: (frame: 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft') => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrame,
  onFrameChange,
}) => {
  const frameOptions = [
    {
      id: 'none' as const,
      name: 'Sin Marco',
      preview: 'border border-neutral-200',
      description: 'Limpio y simple'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      preview: 'border border-neutral-300 shadow-sm',
      description: 'Discreto y elegante'
    },
    {
      id: 'classic' as const,
      name: 'Clásico',
      preview: 'border-2 border-neutral-400 shadow-md',
      description: 'Tradicional y sobrio'
    },
    {
      id: 'modern' as const,
      name: 'Moderno',
      preview: 'border-2 border-slate-300 shadow-lg',
      description: 'Contemporáneo'
    },
    {
      id: 'elegant' as const,
      name: 'Elegante',
      preview: 'border-2 border-amber-200 shadow-xl shadow-amber-100/50',
      description: 'Refinado y dorado'
    },
    {
      id: 'soft' as const,
      name: 'Suave',
      preview: 'border border-blue-200 shadow-md shadow-blue-100/50',
      description: 'Delicado y azul'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-neutral-700">
        Marco del Mapa
      </label>

      <div className="grid grid-cols-3 gap-2">
        {frameOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onFrameChange(option.id)}
            className={`
              group relative overflow-hidden
              p-2.5 rounded-lg border-2 transition-all duration-200
              ${selectedFrame === option.id
                ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-sm'
              }
            `}
          >
            {/* Preview del borde */}
            <div className={`
              w-full h-12 mb-2 rounded
              flex items-center justify-center
              bg-gradient-to-br from-neutral-50 to-neutral-100
              ${option.preview}
              transition-all duration-200 group-hover:scale-[1.03]
            `}>
              <span className="text-lg">📍</span>
            </div>

            {/* Nombre */}
            <p className={`
              text-[10px] font-semibold transition-colors text-center
              ${selectedFrame === option.id ? 'text-blue-700' : 'text-neutral-700'}
            `}>
              {option.name}
            </p>

            {/* Indicador de selección */}
            {selectedFrame === option.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Descripción del marco seleccionado */}
      <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-200">
        <p className="text-[10px] text-neutral-500">
          <span className="font-semibold text-neutral-700">
            {frameOptions.find(f => f.id === selectedFrame)?.name}:
          </span>{' '}
          {frameOptions.find(f => f.id === selectedFrame)?.description}
        </p>
      </div>
    </div>
  );
};