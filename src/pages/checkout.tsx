import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'transfer'>('card');
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
            return;
        }

        const savedPlan = sessionStorage.getItem('selectedPlan');
        console.log('🔍 Datos del plan guardado:', savedPlan);

        if (!savedPlan) {
            console.log('❌ No hay plan guardado');
            router.push('/planes');
            return;
        }

        const planData = JSON.parse(savedPlan);
        console.log('📦 Plan parseado:', planData);

        // Mapeo de planes
        const planDetails: any = {
            'free': {
                name: 'Invitación Gratis',
                features: ['10 invitados únicos', 'Plantillas básicas'],
            },
            'basic': {
                name: 'Invitación Básica',
                features: ['100 invitados únicos', 'Todas las plantillas', 'Personalización completa'],
            },
            'premium': {
                name: 'Invitación Premium',
                features: ['150 invitados únicos', 'RSVP', 'Música', 'Galería ilimitada', 'Analytics'],
            },
            'credits': {
                name: `Paquete de ${planData.credits} Créditos`,
                features: [`+${planData.credits} invitados adicionales`],
            },
        };

        const details = planDetails[planData.planId];

        if (details) {
            setSelectedPlan({
                id: planData.planId,
                name: details.name,
                type: planData.type,
                credits: planData.credits,
                totalPrice: planData.price,
                features: details.features,
            });
            console.log('✅ Plan cargado correctamente');
        } else {
            console.log('❌ Plan no encontrado');
            router.push('/planes');
        }
    }, [isAuthenticated, router]);

    const handleCardChange = (field: string, value: string) => {
        let formattedValue = value;

        if (field === 'number') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        } else if (field === 'expiry') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
        } else if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardData({ ...cardData, [field]: formattedValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!user) {
                alert('Error: Usuario no autenticado');
                setProcessing(false);
                return;
            }

            // Calcular nuevos créditos
            const newCredits = (user.credits || 0) + selectedPlan.credits;
            const newPlan = selectedPlan.type === 'credits' ? user.plan : selectedPlan.id;

            // Actualizar usuario en Supabase
            const { error: userError } = await supabase
                .from('users')
                .update({
                    plan: newPlan,
                    credits: newCredits,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (userError) throw userError;

            // Guardar transacción
            const { error: transactionError } = await supabase
                .from('transactions')
                .insert([
                    {
                        user_id: user.id,
                        plan_id: selectedPlan.id,
                        amount: selectedPlan.totalPrice,
                        credits: selectedPlan.credits,
                        payment_method: paymentMethod,
                        status: 'completed',
                    }
                ]);

            if (transactionError) throw transactionError;

            // Actualizar usuario local
            const updatedUser = {
                ...user,
                plan: newPlan as 'free' | 'basic' | 'premium',
                credits: newCredits,
            };

            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            setProcessing(false);

            // Guardar confirmación de pago
            sessionStorage.setItem('paymentSuccess', JSON.stringify({
                plan: selectedPlan.name,
                amount: selectedPlan.totalPrice,
                date: new Date().toISOString(),
            }));

            router.push('/checkout-success');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error al procesar el pago. Intenta de nuevo.');
            setProcessing(false);
        }
    };

    if (!selectedPlan) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <p className="text-xl text-neutral-600">Cargando...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="py-12 bg-neutral-50 min-h-screen">
                <Container>
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: Payment Form */}
                            <div>
                                <div className="bg-white rounded-3xl border border-neutral-200 p-8">
                                    <h2 className="text-2xl font-display font-bold mb-6">Información de Pago</h2>

                                    {/* Payment Method Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                            Método de Pago
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'card', label: 'Tarjeta', icon: '💳' },
                                                { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                                                { id: 'transfer', label: 'Transferencia', icon: '🏦' },
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id as any)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                                            ? 'border-neutral-900 bg-neutral-50'
                                                            : 'border-neutral-200 hover:border-neutral-400'
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-1">{method.icon}</div>
                                                    <div className="text-xs font-semibold">{method.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Form */}
                                    {paymentMethod === 'card' && (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                    Número de Tarjeta *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardData.number}
                                                    onChange={(e) => handleCardChange('number', e.target.value)}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                    Nombre en la Tarjeta *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardData.name}
                                                    onChange={(e) => handleCardChange('name', e.target.value)}
                                                    placeholder="NOMBRE APELLIDO"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                        Fecha de Expiración *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardData.expiry}
                                                        onChange={(e) => handleCardChange('expiry', e.target.value)}
                                                        placeholder="MM/AA"
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                        CVV *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardData.cvv}
                                                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                                                        placeholder="123"
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-neutral-900 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="accent"
                                                className="w-full mt-6"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    `Pagar $${selectedPlan.totalPrice.toLocaleString('es-MX')} MXN`
                                                )}
                                            </Button>
                                        </form>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="text-center py-8">
                                            <div className="text-6xl mb-4">🅿️</div>
                                            <p className="text-neutral-600 mb-4">Serás redirigido a PayPal para completar el pago</p>
                                            <Button variant="accent" className="w-full" onClick={() => alert('Integración de PayPal próximamente')}>
                                                Continuar con PayPal
                                            </Button>
                                        </div>
                                    )}

                                    {paymentMethod === 'transfer' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                            <h3 className="font-bold mb-3">Datos para Transferencia:</h3>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Banco:</strong> BBVA</p>
                                                <p><strong>Cuenta:</strong> 0123456789</p>
                                                <p><strong>CLABE:</strong> 012345678901234567</p>
                                                <p><strong>Beneficiario:</strong> Dolseseli S.A. de C.V.</p>
                                                <p className="mt-4 text-neutral-600">
                                                    Una vez realizada la transferencia, envía tu comprobante a: artukok@gmail.com
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
                                        🔒 Pago seguro. Tu información está protegida con encriptación SSL.
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div>
                                <div className="bg-white rounded-3xl border border-neutral-200 p-8 sticky top-8">
                                    <h2 className="text-2xl font-display font-bold mb-6">Resumen del Pedido</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600">
                                                {selectedPlan.type === 'credits' ? 'Créditos' : 'Plan'}
                                            </span>
                                            <span className="font-semibold">{selectedPlan.name}</span>
                                        </div>
                                        {selectedPlan.type !== 'credits' && (
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Tipo</span>
                                                <span className="font-semibold">Pago único</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600">Invitados</span>
                                            <span className="font-semibold text-purple-600">
                                                +{selectedPlan.credits} invitados únicos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-200 pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-3xl font-bold text-neutral-900">
                                                ${selectedPlan.totalPrice.toLocaleString('es-MX')} MXN
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            Pago único por evento
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm">Incluye:</h3>
                                        {selectedPlan.features.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-neutral-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                                        <p className="font-semibold mb-1">💡 Garantía de 2 días</p>
                                        <p className="text-neutral-600">
                                            Si no estás satisfecho, te devolvemos tu dinero. Sin preguntas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </Layout>
    );
}