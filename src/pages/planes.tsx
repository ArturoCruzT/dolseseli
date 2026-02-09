import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Planes() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Invitación Gratis',
      price: 0,
      credits: 10,
      description: 'Prueba la plataforma sin costo',
      icon: '🎁',
      color: 'from-gray-400 to-gray-600',
      features: [
        '✅ Hasta 10 invitados únicos',
        '🎨 Plantillas básicas',
        '📝 Personalización básica',
        '🔗 Enlace compartible',
        '📍 Mapa de ubicación',
        '✅ Confirmación RSVP',
        '🎵 Música personalizada',
        '📸 Galería de fotos ',
        '⏰ Contador regresivo',
      ],
      notIncluded: [
        'RSVP',

      ],
    },
    {
      id: 'basic',
      name: 'Invitación Básica',
      price: 299,
      credits: 100,
      description: 'Perfecta para eventos pequeños e íntimos',
      icon: '🎈',
      color: 'from-blue-400 to-blue-600',
      features: [
        '✅ Hasta 100 invitados únicos',
        '🎨 Todas las plantillas',
        '📝 Personalización completa',
        '🔗 Enlace compartible',
        '📍 Mapa de ubicación',
        // '✅ Confirmación RSVP',
        '🎵 Música personalizada',
        '📸 Galería de fotos ',
        '⏰ Contador regresivo',
      ],
      notIncluded: [

      ],
    },
    {
      id: 'premium',
      name: 'Invitación Premium',
      price: 599,
      credits: 150,
      description: 'Para eventos especiales sin límites',
      icon: '⭐',
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        '✨ Hasta 150 invitados únicos',
        '🎨 Todas las plantillas premium',
        '📝 Personalización avanzada',
        '✅ Confirmación RSVP',
        '🎵 Música personalizada',
        '📸 Galería de fotos ',
        '⏰ Contador regresivo',
        // '📊 Analytics completos',
        // '🌐 Dominio personalizado',
        // '💬 Soporte prioritario',
      ],
      notIncluded: [],
    },
  ];

  const creditPacks = [
    { credits: 50, price: 149, popular: false },
    { credits: 150, price: 399, popular: true },
    { credits: 300, price: 699, popular: false },
  ];

  const handleSelectPlan = (planId: string, price: number, credits: number) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    sessionStorage.setItem('selectedPlan', JSON.stringify({
      planId,
      price,
      credits,
      type: 'invitation',
    }));

    router.push('/checkout');
  };

  const handleBuyCredits = (credits: number, price: number) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    sessionStorage.setItem('selectedPlan', JSON.stringify({
      planId: 'credits',
      price,
      credits,
      type: 'credits',
    }));

    router.push('/checkout');
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 via-purple-50/30 to-pink-50/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Paga Solo por <span className="text-gradient">Tu Evento</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-4">
              Sin mensualidades. Un solo pago por invitación.
            </p>
            <p className="text-lg text-neutral-500">
              Cobra únicamente por invitados reales que accedan a tu evento
            </p>
          </div>
        </Container>
      </section>

      {/* Plans */}
      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Elige tu Invitación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'ring-4 ring-purple-500 ring-offset-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="text-3xl">{plan.icon}</span>
                  </div>

                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-neutral-600 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-neutral-600">MXN</span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">Pago único por evento</p>
                    <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">
                        Incluye {plan.credits} invitados únicos
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={plan.popular ? 'accent' : plan.price === 0 ? 'secondary' : 'primary'}
                    className="w-full mb-6"
                    onClick={() => {
                      if (plan.price === 0) {
                        // Plan gratuito: ir directamente a crear
                        if (!isAuthenticated) {
                          router.push('/auth');
                        } else {
                          router.push('/');
                        }
                      } else {
                        handleSelectPlan(plan.id, plan.price, plan.credits);
                      }
                    }}
                  >
                    {plan.price === 0 ? 'Comenzar Gratis' : 'Crear Invitación'}
                  </Button>

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

                    {plan.notIncluded.length > 0 && (
                      <>
                        <p className="text-sm font-semibold text-neutral-700 mt-4">No incluye:</p>
                        {plan.notIncluded.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-neutral-500">{item}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Credit Packs */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                ¿Necesitas más invitados?
              </h2>
              <p className="text-xl text-neutral-600">
                Compra créditos adicionales en cualquier momento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPacks.map((pack) => (
                <Card key={pack.credits} className={pack.popular ? 'ring-2 ring-purple-500' : ''}>
                  <div className="p-6 text-center">
                    {pack.popular && (
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          Mejor Valor
                        </span>
                      </div>
                    )}
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-3xl font-bold mb-2">+{pack.credits}</h3>
                    <p className="text-neutral-600 text-sm mb-4">invitados adicionales</p>
                    <div className="text-2xl font-bold mb-4">${pack.price} MXN</div>
                    <p className="text-sm text-neutral-500 mb-4">
                      ${(pack.price / pack.credits).toFixed(2)} por invitado
                    </p>
                    <Button
                      variant={pack.popular ? 'accent' : 'secondary'}
                      className="w-full"
                      onClick={() => handleBuyCredits(pack.credits, pack.price)}
                    >
                      Comprar Créditos
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-neutral-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: '🎨', title: 'Crea tu invitación', desc: 'Personaliza sin límites' },
                { icon: '💳', title: 'Paga una sola vez', desc: 'Sin mensualidades' },
                { icon: '🔗', title: 'Comparte el enlace', desc: 'Vía WhatsApp o redes' },
                { icon: '📊', title: 'Monitorea accesos', desc: 'Solo invitados reales' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: '¿Qué es un invitado único?',
                  a: 'Un invitado único es una persona que accede a tu invitación mediante su cuenta de Google. Aunque vea la invitación múltiples veces, solo cuenta como un invitado.',
                },
                {
                  q: '¿Qué pasa si necesito más invitados?',
                  a: 'Puedes comprar créditos adicionales en cualquier momento desde tu dashboard. Los créditos se suman a tu invitación existente.',
                },
                {
                  q: '¿Los invitados necesitan crear cuenta?',
                  a: 'Los invitados solo necesitan iniciar sesión con su cuenta de Google para acceder. Es rápido y seguro.',
                },
                {
                  q: '¿Cuánto tiempo está activa mi invitación?',
                  a: 'Tu invitación permanece activa de forma indefinida. No hay límite de tiempo.',
                },
                {
                  q: '¿Ofrecen reembolsos?',
                  a: 'Sí, ofrecemos reembolso completo si no has publicado tu invitación. Una vez publicada, no aplican reembolsos.',
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