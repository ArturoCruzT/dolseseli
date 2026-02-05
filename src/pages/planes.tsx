import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Planes() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: { monthly: 0, annual: 0 },
      description: 'Perfecto para probar la plataforma',
      features: [
        '3 invitaciones activas',
        'Plantillas básicas',
        'Editor básico',
        'Estadísticas limitadas',
        'Marca de agua',
      ],
      limitations: [
        'Sin galería de fotos',
        'Sin música personalizada',
        'Sin exportación',
      ],
      color: 'from-neutral-400 to-neutral-600',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 199, annual: 1990 },
      description: 'Para eventos especiales sin límites',
      features: [
        '✨ Invitaciones ilimitadas',
        '🎨 Todas las plantillas premium',
        '📸 Galería de fotos ilimitada',
        '🎵 Música personalizada',
        '📊 Estadísticas avanzadas',
        '🎯 Sin marca de agua',
        '📥 Exportar en PDF/PNG',
        '💬 Soporte prioritario',
        '🔄 Actualizaciones automáticas',
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: { monthly: 499, annual: 4990 },
      description: 'Para agencias y organizadores profesionales',
      features: [
        '⭐ Todo lo de Premium',
        '👥 Multi-usuario (hasta 10)',
        '🏢 Dominio personalizado',
        '🎨 Diseños personalizados',
        '📈 Analytics avanzados',
        '🔗 API Access',
        '💼 Gestor de cuenta dedicado',
        '🎓 Capacitación incluida',
      ],
      limitations: [],
      color: 'from-amber-500 to-orange-600',
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (planId === 'free') {
      alert('Ya tienes el plan gratuito activo');
      return;
    }

    // Guardar plan seleccionado en sessionStorage
    sessionStorage.setItem('selectedPlan', JSON.stringify({
      planId,
      billingCycle,
    }));

    router.push('/checkout');
  };

  const getPrice = (plan: any) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual;
    if (price === 0) return 'Gratis';
    return `$${price.toLocaleString('es-MX')} MXN`;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === 'annual' && plan.price.monthly > 0) {
      const monthlyCost = plan.price.monthly * 12;
      const savings = monthlyCost - plan.price.annual;
      return `Ahorras $${savings.toLocaleString('es-MX')} MXN`;
    }
    return null;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 via-purple-50/30 to-pink-50/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Elige el Plan <span className="text-gradient">Perfecto</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Crea invitaciones profesionales sin límites. Cancela cuando quieras.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 bg-white rounded-2xl border border-neutral-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Anual
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Plans */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'ring-4 ring-purple-500 ring-offset-4' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="text-3xl text-white">
                      {plan.id === 'free' ? '🎁' : plan.id === 'premium' ? '⭐' : '🏢'}
                    </span>
                  </div>

                  {/* Header */}
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-neutral-600 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-1">
                      {getPrice(plan)}
                    </div>
                    {plan.price.monthly > 0 && (
                      <div className="text-sm text-neutral-600">
                        {billingCycle === 'monthly' ? 'por mes' : 'por año'}
                      </div>
                    )}
                    {getSavings(plan) && (
                      <div className="text-sm text-green-600 font-semibold mt-1">
                        {getSavings(plan)}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    variant={plan.popular ? 'accent' : 'primary'}
                    className="w-full mb-6"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={user?.plan === plan.id}
                  >
                    {user?.plan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-neutral-700">Incluye:</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-neutral-700">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <p className="text-sm font-semibold text-neutral-700 mt-4">Limitaciones:</p>
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-neutral-500">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Puedo cambiar de plan en cualquier momento?',
                  a: 'Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente.',
                },
                {
                  q: '¿Ofrecen reembolsos?',
                  a: 'Ofrecemos reembolso completo dentro de los primeros 14 días si no estás satisfecho.',
                },
                {
                  q: '¿Qué métodos de pago aceptan?',
                  a: 'Aceptamos tarjetas de crédito/débito, PayPal, y transferencias bancarias.',
                },
                {
                  q: '¿Las invitaciones tienen límite de vistas?',
                  a: 'No, tus invitaciones pueden ser vistas ilimitadas veces sin costo adicional.',
                },
              ].map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <summary className="font-semibold cursor-pointer hover:text-purple-600 transition-colors">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-neutral-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}