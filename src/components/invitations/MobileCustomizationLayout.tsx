import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui';
import { supabase } from '@/lib/supabase';
import { CountdownDesignSelector, CountdownSizeSelector } from './Countdown';
import { FrameSelector } from './FrameSelector';
import { EntryEffectSelector } from './EntryEffects';
import type { Features, EventData, PersonEntry, GiftRegistry, EntryEffectType, EffectIntensity } from '@/types/invitation';

// ============================================================
// MobileCustomizationLayout.tsx
//
// Drop-in replacement for the personalizar.tsx page layout.
// - Desktop (lg+): renders the classic 2-column layout unchanged
// - Mobile (<lg): preview centered + floating buttons + overlay panels
// ============================================================

// ─── Types ───────────────────────────────────────────────────

interface MobileCustomizationLayoutProps {
    eventData: EventData;
    onUpdate: (data: EventData) => void;

    features: Features;
    onFeaturesUpdate: (features: Features) => void;

    customStyles: any;
    onStylesUpdate: (styles: any) => void;

    template: any;

    renderPreview: () => React.ReactNode;

    onSaveDraft: () => void;
    onCancel: () => void;
    onDashboard: () => void;
    onPreviewFullscreen?: () => void;

    renderVisualEditor?: () => React.ReactNode;

    isEditMode?: boolean;
    isSaving?: boolean;
    userPlan?: 'free' | 'pro';
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
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                ref={sheetRef}
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '88vh' }}
            >
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1.5 bg-neutral-300 rounded-full" />
                </div>
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

// ─── Collapsible Section ─────────────────────────────────────
const CollapsibleSection: React.FC<{
    title: string;
    icon: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-neutral-800">{title}</span>
                </div>
                <span className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="px-4 py-4 border-t border-neutral-100">
                    {children}
                </div>
            )}
        </div>
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
    onSaveDraft,
    onCancel,
    onDashboard,
    onPreviewFullscreen,
    renderVisualEditor,
    isEditMode = false,
    isSaving = false,
    userPlan = 'free',
}) => {
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [errors, setErrors] = useState({ name: false, date: false, location: false });
    const [activeDesktopTab, setActiveDesktopTab] = useState<'content' | 'design'>('content');

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const showFABs = activePanel === null;
    const openPanel = (panel: string) => setActivePanel(panel);
    const closePanel = () => setActivePanel(null);

    // ─── Handlers ────────────────────────────────────────────
    const handleChange = (field: string, value: any) => {
        const newData = { ...eventData, [field]: value };
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: false });
        }
        onUpdate(newData);
    };

    const handleFrameStyleChange = (newFrame: string) => {
        const validFrames = ['none', 'minimal', 'classic', 'modern', 'elegant', 'soft'] as const;
        type ValidFrame = typeof validFrames[number];
        if (validFrames.includes(newFrame as ValidFrame)) {
            onFeaturesUpdate({ ...features, mapFrameStyle: newFrame as ValidFrame });
        }
    };

    const handleFeatureToggle = (feature: string) => {
        const newFeatures = { ...features, [feature]: !features[feature as keyof typeof features] };
        onFeaturesUpdate(newFeatures);
    };

    // ─── Parents / Godparents handlers ───────────────────────
    const handleAddPerson = (field: 'parents' | 'godparents') => {
        const current = eventData[field] || [];
        const defaultRole = field === 'parents' ? 'Mamá' : 'Madrina';
        handleChange(field, [...current, { name: '', role: defaultRole }]);
    };

    const handleUpdatePerson = (field: 'parents' | 'godparents', index: number, key: 'name' | 'role', value: string) => {
        const current = [...(eventData[field] || [])];
        current[index] = { ...current[index], [key]: value };
        handleChange(field, current);
    };

    const handleRemovePerson = (field: 'parents' | 'godparents', index: number) => {
        const current = (eventData[field] || []).filter((_: any, i: number) => i !== index);
        handleChange(field, current);
    };

    // ─── Gift Registry handlers ──────────────────────────────
    const handleAddRegistry = () => {
        const current = eventData.gift_registry || [];
        handleChange('gift_registry', [...current, { name: '', url: '' }]);
    };

    const handleUpdateRegistry = (index: number, key: 'name' | 'url', value: string) => {
        const current = [...(eventData.gift_registry || [])];
        current[index] = { ...current[index], [key]: value };
        handleChange('gift_registry', current);
    };

    const handleRemoveRegistry = (index: number) => {
        const current = (eventData.gift_registry || []).filter((_: any, i: number) => i !== index);
        handleChange('gift_registry', current);
    };

    // ─── Dress code colors handlers ──────────────────────────
    const handleAddColor = () => {
        const current = eventData.dress_code_colors || [];
        if (current.length < 5) {
            handleChange('dress_code_colors', [...current, '']);
        }
    };

    const handleUpdateColor = (index: number, value: string) => {
        const current = [...(eventData.dress_code_colors || [])];
        current[index] = value;
        handleChange('dress_code_colors', current);
    };

    const handleRemoveColor = (index: number) => {
        const current = (eventData.dress_code_colors || []).filter((_: any, i: number) => i !== index);
        handleChange('dress_code_colors', current);
    };

    // ─── Honoree photo upload ────────────────────────────────
    const handleHonoreePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `honoree_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('invitation-galleries')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('invitation-galleries')
                .getPublicUrl(fileName);

            handleChange('honoree_photo', publicUrl);
        } catch (error) {
            console.error('Error al subir foto:', error);
            alert('❌ Error al subir la foto. Intenta de nuevo.');
        }
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

    // ═══════════════════════════════════════════════════════════
    // SHARED FIELD RENDERERS
    // ═══════════════════════════════════════════════════════════

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
                    rows={3}
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

    // ═══════════════════════════════════════════════════════════
    // NEW: PERSON LIST RENDERER (Parents / Godparents)
    // ═══════════════════════════════════════════════════════════

    const renderPersonList = (
        field: 'parents' | 'godparents',
        label: string,
        roleOptions: string[]
    ) => {
        const people = eventData[field] || [];
        return (
            <div>
                {people.map((person: PersonEntry, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                        <select
                            value={person.role}
                            onChange={(e) => handleUpdatePerson(field, index, 'role', e.target.value)}
                            className="w-28 px-2 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none text-sm"
                        >
                            {roleOptions.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={person.name}
                            onChange={(e) => handleUpdatePerson(field, index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none text-sm"
                        />
                        <button
                            onClick={() => handleRemovePerson(field, index)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => handleAddPerson(field)}
                    className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-1"
                >
                    <span>＋</span> Agregar {label.toLowerCase()}
                </button>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════
    // NEW: GIFT REGISTRY RENDERER
    // ═══════════════════════════════════════════════════════════

    const renderGiftRegistry = () => {
        const registries = eventData.gift_registry || [];
        return (
            <div>
                {registries.map((reg: GiftRegistry, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Tienda (ej: Liverpool)"
                            value={reg.name}
                            onChange={(e) => handleUpdateRegistry(index, 'name', e.target.value)}
                            className="w-32 px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none text-sm"
                        />
                        <input
                            type="url"
                            placeholder="https://..."
                            value={reg.url}
                            onChange={(e) => handleUpdateRegistry(index, 'url', e.target.value)}
                            className="flex-1 px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none text-sm"
                        />
                        <button
                            onClick={() => handleRemoveRegistry(index)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddRegistry}
                    className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-1"
                >
                    <span>＋</span> Agregar mesa de regalos
                </button>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════
    // CONTENT FORM (shared between mobile & desktop)
    // ═══════════════════════════════════════════════════════════

    const renderContentForm = () => (
        <div>
            {/* ─── SECCIÓN 1: Datos básicos del evento ─── */}
            <CollapsibleSection title="Datos del Evento" icon="📋" defaultOpen={true}>
                {renderTextField('name', 'Nombre del Evento', 'Ej: Mis XV Años, Boda de Ana y Carlos', true)}
                {renderTextField('date', 'Fecha del Evento', '', true, 'date')}
                {renderTextField('location', 'Ubicación Principal', 'Ej: Salón de Fiestas La Elegancia', true)}
                {renderTextField('message', 'Mensaje Especial', 'Ej: Tu presencia es el mejor regalo...', false, 'textarea')}
            </CollapsibleSection>

            {/* ─── SECCIÓN 2: Festejado ─── */}
            <CollapsibleSection title="Festejado(s)" icon="👤">
                {renderTextField('honoree_name', 'Nombre del Festejado', 'Ej: María Fernanda')}
                {renderTextField('honoree_name_2', 'Segundo Nombre (Bodas)', 'Ej: Carlos & Ana')}

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Edad (XV Años / Cumpleaños)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Ej: 15"
                        value={eventData.honoree_age || ''}
                        onChange={(e) => handleChange('honoree_age', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Foto del Festejado
                    </label>
                    {eventData.honoree_photo ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-neutral-200 mb-2">
                            <img src={eventData.honoree_photo} alt="Festejado" className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleChange('honoree_photo', undefined)}
                                className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 text-xs rounded-bl flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ) : null}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleHonoreePhotoUpload}
                        className="hidden"
                        id="honoree-photo-upload"
                    />
                    <label
                        htmlFor="honoree-photo-upload"
                        className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
                    >
                        {eventData.honoree_photo ? 'Cambiar Foto' : 'Subir Foto'}
                    </label>
                </div>
            </CollapsibleSection>

            {/* ─── SECCIÓN 3: Itinerario ─── */}
            <CollapsibleSection title="Itinerario" icon="⏰">
                <p className="text-xs text-neutral-500 mb-4">Agrega los horarios y lugares de ceremonia y recepción</p>

                {/* Ceremonia */}
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <span>⛪</span> Ceremonia
                    </h4>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Hora</label>
                        <input
                            type="time"
                            value={eventData.ceremony_time || ''}
                            onChange={(e) => handleChange('ceremony_time', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-purple-500 focus:outline-none text-sm"
                        />
                    </div>
                    {renderTextField('ceremony_location', 'Lugar', 'Ej: Parroquia de San José')}
                    {renderTextField('ceremony_address', 'Dirección', 'Ej: Av. Juárez #123, Col. Centro')}
                    {renderTextField('ceremony_map_url', 'Google Maps (URL)', 'https://maps.app.goo.gl/...')}
                </div>

                {/* Recepción */}
                <div className="bg-pink-50 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-pink-900 mb-3 flex items-center gap-2">
                        <span>🎉</span> Recepción
                    </h4>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Hora</label>
                        <input
                            type="time"
                            value={eventData.reception_time || ''}
                            onChange={(e) => handleChange('reception_time', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-pink-500 focus:outline-none text-sm"
                        />
                    </div>
                    {renderTextField('reception_location', 'Lugar', 'Ej: Salón Imperial')}
                    {renderTextField('reception_address', 'Dirección', 'Ej: Blvd. de la Luz #456')}
                    {renderTextField('reception_map_url', 'Google Maps (URL)', 'https://maps.app.goo.gl/...')}
                </div>
            </CollapsibleSection>

            {/* ─── SECCIÓN 4: Familia ─── */}
            <CollapsibleSection title="Padres y Padrinos" icon="👨‍👩‍👧">
                <p className="text-xs text-neutral-500 mb-4">Agrega los nombres de padres y padrinos que aparecerán en la invitación</p>

                <div className="mb-5">
                    <h4 className="text-sm font-bold text-neutral-800 mb-3">Padres</h4>
                    {renderPersonList('parents', 'padre/madre', ['Mamá', 'Papá', 'Madre', 'Padre'])}
                </div>

                <div>
                    <h4 className="text-sm font-bold text-neutral-800 mb-3">Padrinos</h4>
                    {renderPersonList('godparents', 'padrino/madrina', ['Madrina', 'Padrino', 'Madrina de Honor', 'Padrino de Honor'])}
                </div>
            </CollapsibleSection>

            {/* ─── SECCIÓN 5: Detalles ─── */}
            <CollapsibleSection title="Detalles del Evento" icon="📌">
                {/* Código de vestimenta */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Código de Vestimenta
                    </label>
                    <select
                        value={eventData.dress_code || ''}
                        onChange={(e) => handleChange('dress_code', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors"
                    >
                        <option value="">Sin especificar</option>
                        <option value="Formal">Formal</option>
                        <option value="Semi-formal">Semi-formal</option>
                        <option value="Cocktail">Cocktail</option>
                        <option value="Casual Elegante">Casual Elegante</option>
                        <option value="Casual">Casual</option>
                        <option value="Etiqueta">Etiqueta</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                {/* Colores sugeridos */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Colores Sugeridos de Vestimenta
                    </label>
                    {(eventData.dress_code_colors || []).map((color: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Ej: Rosa pastel, Dorado..."
                                value={color}
                                onChange={(e) => handleUpdateColor(index, e.target.value)}
                                className="flex-1 px-3 py-2.5 rounded-lg border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none text-sm"
                            />
                            <button
                                onClick={() => handleRemoveColor(index)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-sm"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {(eventData.dress_code_colors || []).length < 5 && (
                        <button
                            onClick={handleAddColor}
                            className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-1"
                        >
                            <span>＋</span> Agregar color
                        </button>
                    )}
                </div>

                {/* No niños */}
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer mb-4">
                    <input
                        type="checkbox"
                        checked={eventData.no_kids || false}
                        onChange={(e) => handleChange('no_kids', e.target.checked)}
                        className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                        <span className="font-semibold text-sm">🚫 Evento solo para adultos</span>
                        <p className="text-xs text-neutral-500 mt-0.5">Se mostrará un aviso en la invitación</p>
                    </div>
                </label>

                {renderTextField('parking_info', 'Estacionamiento', 'Ej: Estacionamiento gratuito disponible')}
                {renderTextField('special_notes', 'Notas Adicionales', 'Ej: No se permite fumar, Traer zapatos cómodos...', false, 'textarea')}
            </CollapsibleSection>

            {/* ─── SECCIÓN 6: Mesa de Regalos ─── */}
            <CollapsibleSection title="Mesa de Regalos" icon="🎁">
                <p className="text-xs text-neutral-500 mb-4">Agrega los enlaces a tus mesas de regalos</p>
                {renderGiftRegistry()}
            </CollapsibleSection>

            {/* ─── SECCIÓN 7: Social ─── */}
            <CollapsibleSection title="Redes Sociales" icon="📱">
                {renderTextField('hashtag', 'Hashtag del Evento', 'Ej: #XVDeMafer, #BodaAnaYCarlos')}
            </CollapsibleSection>
        </div>
    );

    // ═══════════════════════════════════════════════════════════
    // FEATURES FORM (shared between mobile & desktop)
    // ═══════════════════════════════════════════════════════════

    // Map expanded content
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
            <div className="pt-3 border-t border-neutral-200">
                <FrameSelector
                    selectedFrame={(features.mapFrameStyle || 'none') as 'none' | 'minimal' | 'classic' | 'modern' | 'elegant' | 'soft'}
                    onFrameChange={handleFrameStyleChange}
                />
            </div>
        </div>
    );

    // Gallery expanded content
    const galleryExpandedContent = (
        <div className="mt-3">
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" id="gallery-upload-mobile" />
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

    // Countdown expanded content
    const countdownExpandedContent = (
        <div className="mt-3 space-y-3">
            <CountdownDesignSelector
                selected={features.countdownDesign || 'glass'}
                onChange={(designId) => onFeaturesUpdate({ ...features, countdownDesign: designId })}
            />
            <CountdownSizeSelector
                selected={(features.countdownSize || 'sm') as 'sm' | 'md' | 'lg'}
                onChange={(size) => onFeaturesUpdate({ ...features, countdownSize: size })}
            />
        </div>
    );

    // Entry effect expanded content
    const entryEffectExpandedContent = (
        <div className="mt-3">
            <EntryEffectSelector
                selected={(features.entryEffect as EntryEffectType) || 'none'}
                onChange={(effect) => onFeaturesUpdate({ ...features, entryEffect: effect })}
                selectedIntensity={(features.entryEffectIntensity as EffectIntensity) || 'medium'}
                onIntensityChange={(intensity) => onFeaturesUpdate({ ...features, entryEffectIntensity: intensity })}
            />
        </div>
    );

    const renderFeaturesForm = () => (
        <div className="space-y-4">
            {/* ─── RSVP: Decisión principal ─── */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
                features.rsvp
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-neutral-200 bg-white'
            }`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                            <p className="text-sm font-bold text-neutral-900">Confirmación de Asistencia (RSVP)</p>
                            <p className="text-xs text-neutral-500">
                                {features.rsvp
                                    ? 'Cada invitado tendrá un link personalizado para confirmar'
                                    : 'La invitación será un link genérico (sin tracking)'
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onFeaturesUpdate({ ...features, rsvp: !features.rsvp })}
                        className={`w-12 h-7 rounded-full transition-all flex-shrink-0 ${
                            features.rsvp ? 'bg-purple-500' : 'bg-neutral-300'
                        }`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform mx-1 ${
                            features.rsvp ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                </div>

                {/* Info de costos */}
                <div className={`mt-3 p-3 rounded-lg text-xs ${
                    features.rsvp ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-600'
                }`}>
                    {features.rsvp ? (
                        <div className="space-y-1">
                            <p className="font-semibold">📌 Con RSVP activado:</p>
                            <p>• Podrás agregar invitados desde el Dashboard</p>
                            <p>• Cada invitado recibe un link único personalizado</p>
                            <p>• Costo: <span className="font-bold">{userPlan === 'pro' ? '2 créditos' : '1 crédito'} por invitado</span></p>
                            {userPlan === 'pro' && <p className="text-purple-600 font-semibold mt-1">⭐ Plan Pro activo</p>}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className="font-semibold">📌 Sin RSVP:</p>
                            <p>• Se genera un link genérico para compartir</p>
                            <p>• No se rastrean confirmaciones</p>
                            <p>• Costo: <span className="font-bold">{userPlan === 'pro' ? '50' : '10'} créditos fijos</span> al publicar</p>
                            {userPlan === 'pro' && <p className="text-purple-600 font-semibold mt-1">⭐ Plan Pro activo</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Separador ─── */}
            <div className="border-t border-neutral-200 pt-3">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Extras</p>
            </div>

            {/* ─── Otros features ─── */}
            {renderFeatureToggle('gallery', '📸', 'Galería de Fotos', 'Agrega hasta 10 fotos', galleryExpandedContent)}
            {renderFeatureToggle('countdown', '⏰', 'Contador Regresivo', 'Cuenta los días hasta el evento', countdownExpandedContent)}
            {renderFeatureToggle('entryEffect', '✨', 'Efectos de Entrada', 'Animaciones al abrir la invitación (pétalos, confetti, etc.)', entryEffectExpandedContent)}
        </div>
    );

    // ═══════════════════════════════════════════════════════════
    // MOBILE LAYOUT
    // ═══════════════════════════════════════════════════════════
    if (isMobile) {
        return (
            <div className="min-h-screen bg-neutral-950 relative flex flex-col">
                {/* Top Bar */}
                <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white text-sm active:scale-95 transition-transform"
                        >
                            ←
                        </button>
                        <div>
                            <p className="text-sm font-display font-bold text-white">
                                {isEditMode ? 'Editar Invitación' : 'Personalizar Invitación'}
                            </p>
                            <p className="text-[10px] text-neutral-400">{template?.name || 'Plantilla'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDashboard}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white text-sm active:scale-95 transition-transform"
                            title="Ir al Dashboard"
                        >
                            📊
                        </button>
                        <button
                            onClick={onSaveDraft}
                            disabled={isSaving}
                            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-transform disabled:opacity-50"
                        >
                            {isSaving ? '⏳ Guardando...' : '💾 Guardar'}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="flex-1 flex items-center justify-center py-6 px-4">
                    <div className="w-full max-w-md">
                        {renderPreview()}
                    </div>
                </div>

                {/* FABs */}
                <div className="fixed left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
                    <FAB icon="📝" label="Contenido" onClick={() => openPanel('content')} gradient="linear-gradient(135deg, #667eea, #764ba2)" visible={showFABs} delay={0} />
                    <FAB icon="🎨" label="Diseño" onClick={() => openPanel('design')} gradient="linear-gradient(135deg, #f093fb, #f5576c)" visible={showFABs} delay={60} />
                    <FAB icon="⚡" label="Extras" onClick={() => openPanel('features')} gradient="linear-gradient(135deg, #4facfe, #00f2fe)" visible={showFABs} delay={120} />
                </div>

                {/* Bottom Sheet: Contenido */}
                <BottomSheet isOpen={activePanel === 'content'} onClose={closePanel} title="Contenido" icon="📝">
                    {renderContentForm()}
                    <button
                        onClick={closePanel}
                        className="w-full mt-4 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Aplicar Cambios
                    </button>
                </BottomSheet>

                {/* Bottom Sheet: Diseño */}
                <BottomSheet isOpen={activePanel === 'design'} onClose={closePanel} title="Diseño" icon="🎨">
                    {renderVisualEditor ? renderVisualEditor() : (
                        <p className="text-sm text-neutral-500 text-center py-8">Editor visual no disponible</p>
                    )}
                    <button
                        onClick={closePanel}
                        className="w-full mt-4 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Aplicar Diseño
                    </button>
                </BottomSheet>

                {/* Bottom Sheet: Extras */}
                <BottomSheet isOpen={activePanel === 'features'} onClose={closePanel} title="Características" icon="⚡">
                    {renderFeaturesForm()}
                    <button
                        onClick={closePanel}
                        className="w-full mt-6 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Guardar
                    </button>
                </BottomSheet>

                {/* Preview fullscreen button */}
                <div className="sticky bottom-0 z-20 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent px-4 pb-4 pt-8">
                    <button
                        onClick={() => { if (validateForm() && onPreviewFullscreen) onPreviewFullscreen(); }}
                        className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-transform"
                    >
                        Vista Previa Completa
                    </button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════
    // DESKTOP LAYOUT
    // ═══════════════════════════════════════════════════════════
    return (
        <div className="flex h-screen bg-neutral-50 overflow-hidden">
            {/* Left panel – Scrolleable independiente */}
            <div className="w-[460px] bg-white border-r border-neutral-200 h-screen overflow-y-auto flex-shrink-0">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">←</button>
                        <div>
                            <h1 className="text-lg font-display font-bold">
                                {isEditMode ? 'Editar Invitación' : 'Personalizar Invitación'}
                            </h1>
                            <p className="text-xs text-neutral-500">{template?.name || 'Plantilla'}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setActiveDesktopTab('content')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeDesktopTab === 'content' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            📝 Contenido
                        </button>
                        <button
                            onClick={() => setActiveDesktopTab('design')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeDesktopTab === 'design' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            🎨 Diseño
                        </button>
                    </div>

                    {/* Content Tab */}
                    {activeDesktopTab === 'content' && (
                        <div>
                            <h3 className="text-2xl font-display font-bold mb-6">Personaliza tu Invitación</h3>

                            {renderContentForm()}

                            {/* Features */}
                            <div className="border-t border-neutral-200 pt-6 mt-6">
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                    Características Adicionales
                                </label>
                                {renderFeaturesForm()}
                            </div>

                            <div className="pt-6 pb-8">
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    size="lg"
                                    onClick={() => {
                                        if (validateForm() && onPreviewFullscreen) {
                                            onPreviewFullscreen();
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
                            {renderVisualEditor ? renderVisualEditor() : (
                                <p className="text-sm text-neutral-500 text-center py-8">Editor visual no disponible</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right panel – Preview fijo en pantalla */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top bar fija */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200 bg-white flex-shrink-0">
                    <div>
                        <p className="text-sm font-semibold text-neutral-700">Vista Previa en Tiempo Real ✨</p>
                        <p className="text-xs text-neutral-500">Los cambios se reflejan automáticamente</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onDashboard}
                            className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                            📊 Dashboard
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSaveDraft}
                            disabled={isSaving}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSaving ? '⏳ Guardando...' : '💾 Guardar Invitación'}
                        </button>
                    </div>
                </div>

                {/* Preview centrado y fijo */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                    <div className="w-full max-w-sm">
                        {renderPreview()}
                    </div>
                </div>
            </div>
        </div>
    );
};