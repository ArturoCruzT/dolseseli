import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { supabase } from '@/lib/supabase';

interface VisualEditorProps {
    onStyleChange: (styles: any) => void;
    currentStyles: any;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
    onStyleChange,
    currentStyles
}) => {
    const [activeTab, setActiveTab] = useState('colors');
    const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

    const fonts = [
        { name: 'Elegante', value: 'font-serif', preview: 'Playfair Display' },
        { name: 'Moderna', value: 'font-sans', preview: 'Inter' },
        { name: 'Display', value: 'font-display', preview: 'Poppins' },
        { name: 'Monospace', value: 'font-mono', preview: 'Courier New' },
    ];

    const gradients = [
        { name: 'Rosa Romántico', value: 'from-pink-400 via-rose-400 to-fuchsia-500', preview: 'bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500' },
        { name: 'Azul Cielo', value: 'from-blue-400 via-cyan-500 to-teal-500', preview: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500' },
        { name: 'Púrpura Real', value: 'from-purple-500 via-violet-600 to-purple-700', preview: 'bg-gradient-to-r from-purple-500 via-violet-600 to-purple-700' },
        { name: 'Atardecer', value: 'from-orange-400 via-red-500 to-pink-600', preview: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-600' },
        { name: 'Bosque', value: 'from-green-400 via-emerald-500 to-teal-600', preview: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600' },
        { name: 'Oro Elegante', value: 'from-amber-300 via-yellow-400 to-amber-500', preview: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500' },
        { name: 'Lavanda', value: 'from-purple-300 via-purple-400 to-purple-500', preview: 'bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500' },
        { name: 'Océano', value: 'from-blue-500 via-blue-600 to-indigo-700', preview: 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700' },
        { name: 'Rosa Pastel', value: 'from-pink-200 via-pink-300 to-rose-400', preview: 'bg-gradient-to-r from-pink-200 via-pink-300 to-rose-400' },
        { name: 'Menta', value: 'from-teal-300 via-cyan-400 to-blue-400', preview: 'bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-400' },
        { name: 'Coral', value: 'from-rose-400 via-pink-500 to-orange-500', preview: 'bg-gradient-to-r from-rose-400 via-pink-500 to-orange-500' },
        { name: 'Noche Estrellada', value: 'from-indigo-600 via-purple-600 to-pink-600', preview: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' },
        { name: 'Primavera', value: 'from-lime-300 via-green-400 to-emerald-500', preview: 'bg-gradient-to-r from-lime-300 via-green-400 to-emerald-500' },
        { name: 'Fuego', value: 'from-red-500 via-orange-600 to-yellow-500', preview: 'bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500' },
        { name: 'Amatista', value: 'from-violet-400 via-purple-500 to-fuchsia-600', preview: 'bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-600' },
        { name: 'Caramelo', value: 'from-yellow-300 via-orange-400 to-red-400', preview: 'bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400' },
        { name: 'Aurora', value: 'from-green-300 via-blue-400 to-purple-500', preview: 'bg-gradient-to-r from-green-300 via-blue-400 to-purple-500' },
        { name: 'Chocolate', value: 'from-amber-700 via-orange-700 to-red-700', preview: 'bg-gradient-to-r from-amber-700 via-orange-700 to-red-700' },
        { name: 'Perla', value: 'from-gray-100 via-gray-200 to-gray-300', preview: 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300' },
        { name: 'Neón', value: 'from-pink-500 via-purple-500 to-cyan-500', preview: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500' },
    ];
    const icons = [
        { category: 'Quinceañera', emojis: ['👑', '💎', '✨', '🎀', '💖', '🌸', '🦋', '⭐', '💫', '🌹'] },
        { category: 'Boda', emojis: ['💍', '💒', '💐', '🤵', '👰', '💑', '💕', '🥂', '🎊', '🕊️'] },
        { category: 'Cumpleaños', emojis: ['🎂', '🎉', '🎈', '🎁', '🍰', '🎊', '🥳', '🌟', '🎪', '🍭'] },
        { category: 'Bautizo', emojis: ['🕊️', '👼', '☁️', '🎀', '🍼', '👶', '✝️', '🙏', '💙', '🤍'] },
        { category: 'Otros', emojis: ['🌺', '🌻', '🌈', '🎵', '🎭', '🎨', '🏆', '🌙', '☀️', '🌊'] },
    ];
    const textSizes = [
        { name: 'Pequeño', title: 'text-3xl', subtitle: 'text-base' },
        { name: 'Mediano', title: 'text-4xl', subtitle: 'text-lg' },
        { name: 'Grande', title: 'text-5xl', subtitle: 'text-xl' },
        { name: 'Extra Grande', title: 'text-6xl', subtitle: 'text-2xl' },
    ];

    const tabs = [
        { id: 'colors', label: 'Colores', icon: '🎨' },
        { id: 'fonts', label: 'Fuentes', icon: '✍️' },
        { id: 'layout', label: 'Diseño', icon: '📐' },
        { id: 'effects', label: 'Efectos', icon: '✨' },
        { id: 'media', label: 'Multimedia', icon: '🎵' },
    ];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-white shadow-soft text-neutral-900'
                            : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Colors Tab */}
            {activeTab === 'colors' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Esquema de Color</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {gradients.map((gradient) => (
                                <button
                                    key={gradient.name}
                                    onClick={() => onStyleChange({ ...currentStyles, gradient: gradient.value })}
                                    className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${currentStyles.gradient === gradient.value
                                        ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2'
                                        : 'border-neutral-200'
                                        }`}
                                >
                                    <div className={`w-full h-full ${gradient.preview}`} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {gradient.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colores Sólidos */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-neutral-700 mb-3">
                            Colores Sólidos
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {[
                                { name: 'Rosa', value: 'bg-pink-500' },
                                { name: 'Rojo', value: 'bg-red-500' },
                                { name: 'Naranja', value: 'bg-orange-500' },
                                { name: 'Amarillo', value: 'bg-yellow-400' },
                                { name: 'Verde', value: 'bg-green-500' },
                                { name: 'Azul', value: 'bg-blue-500' },
                                { name: 'Índigo', value: 'bg-indigo-500' },
                                { name: 'Púrpura', value: 'bg-purple-500' },
                                { name: 'Rosa Oscuro', value: 'bg-pink-700' },
                                { name: 'Rojo Oscuro', value: 'bg-red-700' },
                                { name: 'Café', value: 'bg-amber-700' },
                                { name: 'Verde Oscuro', value: 'bg-green-700' },
                                { name: 'Azul Oscuro', value: 'bg-blue-700' },
                                { name: 'Índigo Oscuro', value: 'bg-indigo-700' },
                                { name: 'Púrpura Oscuro', value: 'bg-purple-700' },
                                { name: 'Negro', value: 'bg-neutral-900' },
                            ].map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => onStyleChange({ ...currentStyles, gradient: color.value })}
                                    className={`h-12 rounded-lg ${color.value} border-2 transition-all hover:scale-110 ${currentStyles.gradient === color.value
                                        ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2'
                                        : 'border-neutral-200'
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Custom Color Picker */}
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Color de Texto</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                                className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-neutral-200 rounded-2xl hover:border-neutral-900 transition-all"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl border-2 border-neutral-200"
                                    style={{ backgroundColor: currentStyles.textColor || '#ffffff' }}
                                />
                                <span className="font-semibold">Seleccionar Color</span>
                            </button>
                        </div>
                        {showColorPicker === 'text' && (
                            <div className="mt-4 p-4 bg-white border-2 border-neutral-200 rounded-2xl animate-scale-in">
                                <HexColorPicker
                                    color={currentStyles.textColor || '#ffffff'}
                                    onChange={(color) => onStyleChange({ ...currentStyles, textColor: color })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Fonts Tab */}
            {activeTab === 'fonts' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Familia de Fuente</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {fonts.map((font) => (
                                <button
                                    key={font.name}
                                    onClick={() => onStyleChange({ ...currentStyles, font: font.value })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left ${currentStyles.font === font.value
                                        ? 'border-neutral-900 bg-neutral-50'
                                        : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm">{font.name}</span>
                                        {currentStyles.font === font.value && (
                                            <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className={`text-2xl ${font.value}`} style={{ fontFamily: font.preview }}>
                                        Aa Bb Cc 123
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Tamaño de Texto</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {textSizes.map((size) => (
                                <button
                                    key={size.name}
                                    onClick={() => onStyleChange({ ...currentStyles, textSize: size })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${currentStyles.textSize?.name === size.name
                                        ? 'border-neutral-900 bg-neutral-50'
                                        : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                >
                                    <span className="text-sm font-semibold">{size.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Alineación del Contenido</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { name: 'Arriba', value: 'justify-start', icon: '⬆️' },
                                { name: 'Centro', value: 'justify-center', icon: '◼️' },
                                { name: 'Abajo', value: 'justify-end', icon: '⬇️' },
                            ].map((align) => (
                                <button
                                    key={align.name}
                                    onClick={() => onStyleChange({ ...currentStyles, alignment: align.value })}
                                    className={`p-4 rounded-2xl border-2 transition-all ${currentStyles.alignment === align.value
                                        ? 'border-neutral-900 bg-neutral-50'
                                        : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{align.icon}</div>
                                    <span className="text-sm font-semibold">{align.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Espaciado</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-neutral-700 mb-2 block">
                                    Padding: {currentStyles.padding || 8}
                                </label>
                                <input
                                    type="range"
                                    min="4"
                                    max="16"
                                    value={currentStyles.padding || 8}
                                    onChange={(e) => onStyleChange({ ...currentStyles, padding: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Icono Principal</h3>
                        <div className="space-y-4">
                            {icons.map((category) => (
                                <div key={category.category}>
                                    <p className="text-sm font-semibold text-neutral-600 mb-2">{category.category}</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {category.emojis.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => onStyleChange({ ...currentStyles, icon: emoji })}
                                                className={`text-4xl p-3 rounded-xl border-2 transition-all hover:scale-110 ${currentStyles.icon === emoji
                                                    ? 'border-neutral-900 bg-neutral-50 scale-110'
                                                    : 'border-neutral-200 hover:border-neutral-400'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Animaciones</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Flotante', value: 'float', description: 'El ícono flota suavemente' },
                                { name: 'Pulso', value: 'pulse', description: 'Efecto de pulso continuo' },
                                { name: 'Sin animación', value: 'none', description: 'Estático' },
                            ].map((animation) => (
                                <label
                                    key={animation.name}
                                    className="flex items-start gap-3 p-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-400 cursor-pointer transition-all"
                                >
                                    <input
                                        type="radio"
                                        name="animation"
                                        checked={currentStyles.animation === animation.value}
                                        onChange={() => onStyleChange({ ...currentStyles, animation: animation.value })}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">{animation.name}</div>
                                        <div className="text-sm text-neutral-600">{animation.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Opacidad de Fondo</h3>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={currentStyles.opacity || 100}
                            onChange={(e) => onStyleChange({ ...currentStyles, opacity: parseInt(e.target.value) })}
                            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center text-sm text-neutral-600 mt-2">
                            {currentStyles.opacity || 100}%
                        </div>
                    </div>
                </div>
            )}
            {/* Media Tab */}
            {activeTab === 'media' && (
                <div className="space-y-6 animate-fade-in">
                    <div>

                        <div>
                            <h3 className="text-lg font-display font-bold mb-4">Música de Fondo</h3>

                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                                        <span>💡</span>
                                        Cómo agregar música de YouTube:
                                    </p>
                                    <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                                        <li>Ve a YouTube y busca la canción que quieres</li>
                                        <li>Copia el enlace del video (ej: https://www.youtube.com/watch?v=xxxxx)</li>
                                        <li>Pégalo en el campo de abajo</li>
                                    </ol>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Enlace de YouTube
                                    </label>
                                    <input
                                        type="text"
                                        value={currentStyles.musicUrl || ''}
                                        onChange={(e) => onStyleChange({ ...currentStyles, musicUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=xxxxx"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                    />
                                    <p className="text-xs text-neutral-500 mt-2">
                                        La música se reproducirá automáticamente cuando tus invitados abran la invitación
                                    </p>
                                </div>

                                {currentStyles.musicUrl && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-green-900">✅ Música configurada</span>
                                            <button
                                                onClick={() => onStyleChange({ ...currentStyles, musicUrl: '' })}
                                                className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <p className="text-xs text-green-800">
                                            URL: {currentStyles.musicUrl}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                    <div>
                        <h3 className="text-lg font-display font-bold mb-4">Imagen de Fondo</h3>
                        <div className="p-6 border-2 border-dashed border-neutral-300 rounded-2xl text-center hover:border-neutral-400 transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🖼️</span>
                            </div>
                            <p className="font-semibold mb-2">Agregar Imagen de Fondo</p>
                            <p className="text-sm text-neutral-600 mb-4">JPG, PNG (máx. 5MB)</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Verificar tamaño
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert('⚠️ La imagen no debe superar 5MB');
                                        return;
                                    }

                                    try {
                                        // Generar nombre único
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `bg_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

                                        // Subir a Supabase Storage
                                        const { data, error } = await supabase.storage
                                            .from('invitation-galleries')
                                            .upload(fileName, file, {
                                                cacheControl: '3600',
                                                upsert: false
                                            });

                                        if (error) {
                                            console.error('Error uploading background:', error);
                                            throw error;
                                        }

                                        // Obtener URL firmada (1 año)
                                        const { data: signedData, error: signedError } = await supabase.storage
                                            .from('invitation-galleries')
                                            .createSignedUrl(fileName, 31536000);

                                        if (signedError) throw signedError;

                                        console.log('✅ Imagen de fondo subida:', signedData.signedUrl);
                                        onStyleChange({ ...currentStyles, backgroundImage: signedData.signedUrl });
                                    } catch (error) {
                                        console.error('Error al subir imagen de fondo:', error);
                                        alert('❌ Error al subir la imagen. Intenta de nuevo.');
                                    }
                                }}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold cursor-pointer hover:bg-neutral-800 transition-colors">
                                Seleccionar Imagen
                            </label>
                        </div>

                        {currentStyles.backgroundImage && (
                            <div className="mt-4 p-4 bg-neutral-100 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">Vista previa de la imagen</span>
                                    <button
                                        onClick={async () => {
                                            // Intentar eliminar de Supabase
                                            const imageUrl = currentStyles.backgroundImage;
                                            try {
                                                if (imageUrl && imageUrl.includes('supabase')) {
                                                    const urlParts = imageUrl.split('/');
                                                    // Buscar el nombre del archivo antes del ?token
                                                    const fileNameWithToken = urlParts[urlParts.length - 1];
                                                    const fileName = fileNameWithToken.split('?')[0];

                                                    if (fileName.startsWith('bg_')) {
                                                        await supabase.storage
                                                            .from('invitation-galleries')
                                                            .remove([fileName]);
                                                        console.log('✅ Imagen de fondo eliminada:', fileName);
                                                    }
                                                }
                                            } catch (error) {
                                                console.error('Error al eliminar imagen:', error);
                                            }

                                            // Eliminar del estado
                                            onStyleChange({ ...currentStyles, backgroundImage: undefined });
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <img
                                    src={currentStyles.backgroundImage}
                                    alt="Background preview"
                                    className="w-full h-32 object-cover rounded-xl"
                                />
                                <div className="mt-3">
                                    <label className="text-sm font-semibold text-neutral-700 block mb-2">
                                        Opacidad de la imagen: {currentStyles.bgImageOpacity || 30}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={currentStyles.bgImageOpacity || 30}
                                        onChange={(e) => onStyleChange({ ...currentStyles, bgImageOpacity: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};