import React from 'react';

interface FrameSelectorProps {
  selectedFrame: 'none' | 'quinceanera' | 'boda' | 'cumpleanos' | 'bautizo' | 'elegante';
  onFrameChange: (frame: 'none' | 'quinceanera' | 'boda' | 'cumpleanos' | 'bautizo' | 'elegante') => void;
  eventType?: string;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrame,
  onFrameChange,
  eventType = 'quinceañera'
}) => {
  const frameOptions = [
    {
      id: 'none' as const,
      name: 'Sin Marco',
      icon: '⬜',
      description: 'Mapa simple sin decoración',
      preview: 'border-2 border-neutral-300'
    },
    {
      id: 'quinceanera' as const,
      name: 'Quinceañera',
      icon: '👑',
      description: 'Coronas y flores rosadas',
      preview: 'border-4 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50',
      recommended: eventType.toLowerCase().includes('quince')
    },
    {
      id: 'boda' as const,
      name: 'Boda',
      icon: '💍',
      description: 'Elegante con anillos y flores',
      preview: 'border-3 border-rose-200 bg-gradient-to-br from-rose-50 to-white',
      recommended: eventType.toLowerCase().includes('boda')
    },
    {
      id: 'cumpleanos' as const,
      name: 'Cumpleaños',
      icon: '🎈',
      description: 'Festivo con globos y confeti',
      preview: 'border-4 border-yellow-400 border-dashed bg-gradient-to-br from-yellow-50 to-orange-50',
      recommended: eventType.toLowerCase().includes('cumple')
    },
    {
      id: 'bautizo' as const,
      name: 'Bautizo',
      icon: '🕊️',
      description: 'Suave con angelitos',
      preview: 'border-3 border-blue-200 bg-gradient-to-br from-blue-50 to-white',
      recommended: eventType.toLowerCase().includes('bautiz')
    },
    {
      id: 'elegante' as const,
      name: 'Elegante',
      icon: '✦',
      description: 'Sofisticado art deco',
      preview: 'border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-white'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-neutral-700">
          Marco del Mapa
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {frameOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onFrameChange(option.id)}
            className={`
              relative group overflow-hidden
              p-4 rounded-xl border-2 transition-all duration-300
              ${selectedFrame === option.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md'
              }
            `}
          >
            {/* Badge de recomendado */}
            {option.recommended && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r 
              from-green-500 to-emerald-500 text-white text-[5px] font-bold px-1 
              py-0.5 rounded-full shadow-md z-10">
                ⭐ Recomendado
              </div>
            )}

            {/* Preview del borde */}
            <div className={`
              w-full h-10 mb-3 rounded-lg
              flex items-center justify-center
              ${option.preview}
              transition-transform duration-300 group-hover:scale-105
            `}>
              <span className="text-2xl">{option.icon}</span>
            </div>
            {/* Indicador de selección */}
            {selectedFrame === option.id && (
              <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-1 h-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Vista previa del marco seleccionado */}
      <div className="mt-6 p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200">
    
          <p className="text-sm text-neutral-700">
            <span className="font-semibold">Marco seleccionado:</span>{' '}
            <span className="text-blue-600">
              {frameOptions.find(f => f.id === selectedFrame)?.name}
            </span>
          </p>
      </div>
    </div>
  );
};