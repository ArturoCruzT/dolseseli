import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui';
import { supabase } from '@/lib/supabase';
import { CountdownDesignSelector, CountdownSizeSelector } from './Countdown';
import { FrameSelector } from './FrameSelector';
import type { Features, EventData } from '@/types/invitation';
import { log } from 'console';

// ============================================================
// MobileCustomizationLayout.tsx
// 
// Drop-in replacement for the personalizar.tsx page layout.
// - Desktop (lg+): renders the classic 2-column layout unchanged
// - Mobile (<lg): preview centered + floating buttons + overlay panels
//
// Props are identical to what personalizar.tsx already passes
// to CustomizationForm + VisualEditor + InvitationPreview
// ============================================================

// ─── Types ───────────────────────────────────────────────────


interface MobileCustomizationLayoutProps {
    eventData: EventData;
    onUpdate: (data: EventData) => void;

    features: Features;
    onFeaturesUpdate: (features: Features) => void;

    // Styles (for VisualEditor)
    customStyles: any;
    onStylesUpdate: (styles: any) => void;

    // Template info
    template: any;

    // Preview component (pass your existing InvitationPreview as a render prop)
    renderPreview: () => React.ReactNode;

    // Actions
    onPublish: () => void;
    onCancel: () => void;
    onPreviewFullscreen?: () => void;

    // Visual editor component (pass your existing VisualEditor as a render prop)
    renderVisualEditor?: () => React.ReactNode;
}

// ─── Bottom Sheet / Overlay Panel ────────────────────────────
const BottomSheet: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, icon, children }) => {
    const sheetRef = useRef<HTMLDivElement>(null);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ maxHeight: '88vh' }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1.5 bg-neutral-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <h3 className="text-lg font-display font-bold text-neutral-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    className="overflow-y-auto overscroll-contain px-5 py-4"
                    style={{ maxHeight: 'calc(88vh - 72px)' }}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

// ─── Floating Action Button ──────────────────────────────────
const FAB: React.FC<{
    icon: string;
    label: string;
    onClick: () => void;
    gradient: string;
    visible: boolean;
    delay: number;
}> = ({ icon, label, onClick, gradient, visible, delay }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all duration-300 ${visible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-6 pointer-events-none'
            }`}
        style={{
            background: gradient,
            transitionDelay: visible ? `${delay}ms` : '0ms',
        }}
    >
        <span className="text-base">{icon}</span>
        <span className="text-xs font-semibold text-white whitespace-nowrap">{label}</span>
    </button>
);

// ─── Main Component ──────────────────────────────────────────
export const MobileCustomizationLayout: React.FC<MobileCustomizationLayoutProps> = ({
    eventData,
    onUpdate,
    features,
    onFeaturesUpdate,
    customStyles,
    onStylesUpdate,
    template,
    renderPreview,
    onPublish,
    onCancel,
    onPreviewFullscreen,
    renderVisualEditor,
}) => {
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [errors, setErrors] = useState({ name: false, date: false, location: false });
    const [activeDesktopTab, setActiveDesktopTab] = useState<'content' | 'design'>('content');

    // Detect viewport
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const showFABs = activePanel === null;

    const openPanel = (panel: string) => setActivePanel(panel);
    const closePanel = () => setActivePanel(null);

    // ─── Shared handlers (same logic as your CustomizationForm) ──
    const handleChange = (field: string, value: string) => {
        const newData = { ...eventData, [field]: value };
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: false });
        }
        onUpdate(newData);
    };

    const handleFrameStyleChange = (newFrame: string) => {
        // Validar que sea un frame válido
        const validFrames = ['none', 'minimal', 'classic', 'modern', 'elegant', 'soft'] as const;
        type ValidFrame = typeof validFrames[number];

        if (validFrames.includes(newFrame as ValidFrame)) {
            onFeaturesUpdate({
                ...features,
                mapFrameStyle: newFrame as ValidFrame
            });
        }
    };

    const handleFeatureToggle = (feature: string) => {
        const newFeatures = { ...features, [feature]: !features[feature as keyof typeof features] };
        onFeaturesUpdate(newFeatures);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const currentPhotos = features.galleryPhotos || [];
        if (currentPhotos.length + files.length > 10) {
            alert('⚠️ Máximo 10 fotos permitidas');
            return;
        }

        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data, error } = await supabase.storage
                    .from('invitation-galleries')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('invitation-galleries')
                    .getPublicUrl(fileName);

                uploadedUrls.push(publicUrl);
            }

            onFeaturesUpdate({ ...features, galleryPhotos: [...currentPhotos, ...uploadedUrls] });
        } catch (error) {
            console.error('Error al subir fotos:', error);
            alert('❌ Error al subir las fotos. Intenta de nuevo.');
        }
    };

    const handleDeletePhoto = async (index: number) => {
        const currentPhotos = features.galleryPhotos || [];
        const photoUrl = currentPhotos[index];

        try {
            const urlParts = photoUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            if (fileName && photoUrl.includes('supabase')) {
                await supabase.storage.from('invitation-galleries').remove([fileName]);
            }
        } catch (error) {
            console.error('Error al eliminar foto:', error);
        }

        const newPhotos = currentPhotos.filter((_: any, i: number) => i !== index);
        onFeaturesUpdate({ ...features, galleryPhotos: newPhotos });
    };

    const validateForm = () => {
        const newErrors = {
            name: !eventData.name?.trim(),
            date: !eventData.date,
            location: !eventData.location?.trim(),
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.date && !newErrors.location;
    };

    // ─── Shared form field renderer ──
    const renderTextField = (
        field: string,
        label: string,
        placeholder: string,
        required: boolean = false,
        type: string = 'text'
    ) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    placeholder={placeholder}
                    value={(eventData as any)[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={(eventData as any)[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors[field as keyof typeof errors]
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-neutral-200 focus:border-neutral-900'
                        }`}
                />
            )}
            {required && errors[field as keyof typeof errors] && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    {field === 'date' ? 'Selecciona una fecha para el evento' : 'Este campo es obligatorio'}
                </p>
            )}
        </div>
    );

    // ─── Feature toggle renderer ──
    const renderFeatureToggle = (
        feature: string,
        icon: string,
        label: string,
        description: string,
        expandedContent?: React.ReactNode
    ) => (
        <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
            <input
                type="checkbox"
                checked={(features as any)[feature] || false}
                onChange={() => handleFeatureToggle(feature)}
                className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{description}</p>
                {(features as any)[feature] && expandedContent}
            </div>
        </label>
    );

    // ─── Map expanded content ──
    const mapExpandedContent = (
        <div className="mt-3 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                    <span>💡</span> Cómo obtener el enlace de Google Maps:
                </p>
                <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                    <li>Abre <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google Maps</a></li>
                    <li>Busca el lugar de tu evento</li>
                    <li>Selecciona la URL</li>
                    <li>Copia el enlace y pégalo aquí abajo</li>
                </ol>
            </div>

            <input
                type="text"
                placeholder="https://maps.app.goo.gl/ejemplo"
                value={features.mapUrl || ''}
                onChange={(e) => onFeaturesUpdate({ ...features, mapUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border-2 border-neutral-300 focus:border-blue-500 focus:outline-none"
            />

            <p className="text-xs text-neutral-500">
                Opcional: Si no pegas enlace se usará la ubicación escrita arriba
            </p>

            {/* FRAME SELECTOR - Integración corregida */}
            <div className="pt-3 border-t border-neutral-200">
                <FrameSelector
                    selectedFrame={(features.mapFrameStyle || 'none') as 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft'}
                    onFrameChange={handleFrameStyleChange}
                />
            </div>
        </div>
    );

    // ─── Gallery expanded content ──
    const galleryExpandedContent = (
        <div className="mt-3">
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="gallery-upload-mobile"
            />
            <label
                htmlFor="gallery-upload-mobile"
                className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
            >
                Subir Fotos ({(features.galleryPhotos || []).length}/10)
            </label>
            {(features.galleryPhotos || []).length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                    {(features.galleryPhotos || []).map((photo: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                            <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={(e) => { e.preventDefault(); handleDeletePhoto(i); }}
                                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 text-xs rounded-bl flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // ─── Countdown expanded content ──
    const countdownExpandedContent = (
        <div className="mt-3 space-y-3">
            {/* Selector de Diseño */}
            <CountdownDesignSelector
                selected={features.countdownDesign || 'glass'}
                onChange={(designId) => {
                    onFeaturesUpdate({ ...features, countdownDesign: designId });
                }}
            />

            {/* Selector de Tamaño */}
            <CountdownSizeSelector
                selected={(features.countdownSize || 'sm') as 'sm' | 'md' | 'lg'}
                onChange={(size) => {
                    onFeaturesUpdate({ ...features, countdownSize: size });
                }}
            />
        </div>
    );

    // ═════════════════════════════════════════════════════════════
    // MOBILE LAYOUT
    // ═════════════════════════════════════════════════════════════
    if (isMobile) {
        return (
            <div className="min-h-screen bg-neutral-950 relative flex flex-col">

                {/* ── Top Bar ── */}
                <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white text-sm active:scale-95 transition-transform"
                        >
                            ←
                        </button>
                        <div>
                            <p className="text-sm font-display font-bold text-white">Personalizar Invitación</p>
                            <p className="text-[10px] text-neutral-400">{template?.name || 'Plantilla'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (validateForm()) onPublish();
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-transform"
                    >
                        Publicar
                    </button>
                </div>

                {/* ── Preview (Center Stage) ── */}
                <div className="flex-1 flex items-center justify-center py-6 px-4">
                    <div className="w-full max-w-md">
                        {renderPreview()}
                    </div>
                </div>

                {/* ── Floating Action Buttons (Left) ── */}
                <div className="fixed left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
                    <FAB
                        icon="📝"
                        label="Contenido"
                        onClick={() => openPanel('content')}
                        gradient="linear-gradient(135deg, #667eea, #764ba2)"
                        visible={showFABs}
                        delay={0}
                    />
                    <FAB
                        icon="🎨"
                        label="Diseño"
                        onClick={() => openPanel('design')}
                        gradient="linear-gradient(135deg, #f093fb, #f5576c)"
                        visible={showFABs}
                        delay={60}
                    />
                    <FAB
                        icon="⚡"
                        label="Extras"
                        onClick={() => openPanel('features')}
                        gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
                        visible={showFABs}
                        delay={120}
                    />
                </div>

                {/* ── Bottom Sheet: Contenido ── */}
                <BottomSheet
                    isOpen={activePanel === 'content'}
                    onClose={closePanel}
                    title="Contenido"
                    icon="📝"
                >
                    {renderTextField('name', 'Nombre del Evento', 'Ej: Mis XV Años', true)}
                    {renderTextField('date', 'Fecha del Evento', '', true, 'date')}
                    {renderTextField('location', 'Ubicación', 'Ej: Salón de Fiestas La Elegancia', true)}
                    {renderTextField('message', 'Mensaje Especial (Opcional)', 'Ej: Tu presencia es el mejor regalo...', false, 'textarea')}

                    <button
                        onClick={closePanel}
                        className="w-full mt-4 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Aplicar Cambios
                    </button>
                </BottomSheet>

                {/* ── Bottom Sheet: Diseño ── */}
                <BottomSheet
                    isOpen={activePanel === 'design'}
                    onClose={closePanel}
                    title="Diseño"
                    icon="🎨"
                >
                    {renderVisualEditor ? (
                        renderVisualEditor()
                    ) : (
                        <p className="text-sm text-neutral-500 text-center py-8">
                            Editor visual no disponible
                        </p>
                    )}

                    <button
                        onClick={closePanel}
                        className="w-full mt-4 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Aplicar Diseño
                    </button>
                </BottomSheet>

                {/* ── Bottom Sheet: Características / Extras ── */}
                <BottomSheet
                    isOpen={activePanel === 'features'}
                    onClose={closePanel}
                    title="Características"
                    icon="⚡"
                >
                    <div className="space-y-3">
                        {renderFeatureToggle('map', '📍', 'Mapa de Ubicación', 'Muestra un mapa interactivo del lugar', mapExpandedContent)}
                        {renderFeatureToggle('gallery', '📸', 'Galería de Fotos', 'Agrega hasta 10 fotos', galleryExpandedContent)}
                        {renderFeatureToggle('countdown', '⏰', 'Contador Regresivo', 'Cuenta los días hasta el evento', countdownExpandedContent)}
                    </div>

                    <button
                        onClick={closePanel}
                        className="w-full mt-6 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Guardar
                    </button>
                </BottomSheet>

                {/* ── Preview fullscreen button (bottom) ── */}
                <div className="sticky bottom-0 z-20 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent px-4 pb-4 pt-8">
                    <button
                        onClick={() => {
                            if (validateForm() && onPreviewFullscreen) onPreviewFullscreen();
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-transform"
                    >
                        Vista Previa Completa
                    </button>
                </div>
            </div>
        );
    }

    // ═════════════════════════════════════════════════════════════
    // DESKTOP LAYOUT (existing layout preserved)
    // ═════════════════════════════════════════════════════════════
    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Left panel – Form */}
            <div className="w-[460px] bg-white border-r border-neutral-200 overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={onCancel}
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            ←
                        </button>
                        <div>
                            <h1 className="text-lg font-display font-bold">Personalizar Invitación</h1>
                            <p className="text-xs text-neutral-500">{template?.name || 'Plantilla'}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setActiveDesktopTab('content')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeDesktopTab === 'content'
                                ? 'bg-white shadow-sm text-neutral-900'
                                : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            📝 Contenido
                        </button>
                        <button
                            onClick={() => setActiveDesktopTab('design')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeDesktopTab === 'design'
                                ? 'bg-white shadow-sm text-neutral-900'
                                : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            🎨 Diseño
                        </button>
                    </div>

                    {/* Content Tab */}
                    {activeDesktopTab === 'content' && (
                        <div>
                            <h3 className="text-2xl font-display font-bold mb-6">Personaliza tu Invitación</h3>

                            {renderTextField('name', 'Nombre del Evento', 'Ej: Mis XV Años', true)}
                            {renderTextField('date', 'Fecha del Evento', '', true, 'date')}
                            {renderTextField('location', 'Ubicación', 'Ej: Salón de Fiestas La Elegancia', true)}
                            {renderTextField('message', 'Mensaje Especial (Opcional)', 'Ej: Tu presencia es el mejor regalo...', false, 'textarea')}

                            {/* Features */}
                            <div className="border-t border-neutral-200 pt-6 mt-6">
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                    Características Adicionales
                                </label>
                                <div className="space-y-3">
                                    {renderFeatureToggle('map', '📍', 'Mapa de Ubicación', 'Muestra un mapa interactivo del lugar', mapExpandedContent)}
                                    {renderFeatureToggle('gallery', '📸', 'Galería de Fotos', 'Agrega hasta 10 fotos', galleryExpandedContent)}
                                    {renderFeatureToggle('countdown', '⏰', 'Contador Regresivo', 'Cuenta los días hasta el evento', countdownExpandedContent)}
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    size="lg"
                                    onClick={() => {
                                        if (validateForm() && onPreviewFullscreen) {
                                            onPreviewFullscreen();
                                        } else {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Vista Previa Completa
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Design Tab */}
                    {activeDesktopTab === 'design' && (
                        <div>
                            {renderVisualEditor ? (
                                renderVisualEditor()
                            ) : (
                                <p className="text-sm text-neutral-500 text-center py-8">
                                    Editor visual no disponible
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right panel – Preview */}
            <div className="flex-1 flex flex-col">
                {/* Top actions */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200 bg-white">
                    <div>
                        <p className="text-sm font-semibold text-neutral-700">Vista Previa en Tiempo Real ✨</p>
                        <p className="text-xs text-neutral-500">Los cambios se reflejan automáticamente</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => { if (validateForm()) onPublish(); }}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            Publicar Invitación
                        </button>
                    </div>
                </div>

                {/* Preview area */}
                <div className="flex-1 flex items-start justify-center p-8 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-y-auto">
                    <div className="w-full max-w-sm">
                        {renderPreview()}
                    </div>
                </div>
            </div>
        </div>
    );
};