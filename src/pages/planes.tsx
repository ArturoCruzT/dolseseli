import React from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Planes() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const userPlan = user?.plan === 'pro' ? 'pro' : 'free';

  // ─── Paquetes de créditos ──────────────────────────────
  const creditPacks = [
    { id: 'pack-50',  credits: 50,  price: 99,  perCredit: 1.98 },
    { id: 'pack-100', credits: 100, price: 179, perCredit: 1.79, popular: true },
    { id: 'pack-200', credits: 200, price: 299, perCredit: 1.50 },
    { id: 'pack-500', credits: 500, price: 599, perCredit: 1.20, best: true },
  ];

  const handleBuyCredits = (pack: typeof creditPacks[0]) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    sessionStorage.setItem('selectedPlan', JSON.stringify({
      planId: pack.id,
      price: pack.price,
      credits: pack.credits,
      type: 'credits',
      upgradeToPro: true,
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
              Compra <span className="text-gradient">Créditos</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-4">
              Sin mensualidades. Compra créditos y úsalos cuando quieras.
            </p>
            {isAuthenticated && (
              <div className="inline-flex items-center gap-3 mt-4 px-5 py-3 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${userPlan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>
                  {userPlan === 'pro' ? '⭐ Pro' : '🎁 Gratis'}
                </span>
                <span className="text-sm text-neutral-600">
                  Tienes <span className="font-bold text-neutral-900">{user?.credits || 0}</span> créditos
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Cómo funcionan los créditos */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              ¿Cómo funcionan los créditos?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Sin RSVP */}
              <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sin Confirmación</h3>
                    <p className="text-xs text-neutral-500">Link genérico para compartir</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-neutral-200 rounded-full font-bold">GRATIS</span>
                      <span className="text-sm text-neutral-700">Por invitación</span>
                    </div>
                    <span className="font-bold text-neutral-900">10 créditos</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full font-bold">PRO</span>
                      <span className="text-sm text-neutral-700">Por invitación</span>
                    </div>
                    <span className="font-bold text-purple-900">50 créditos</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3">Un solo link que puedes compartir con todos</p>
              </div>

              {/* Con RSVP */}
              <div className="bg-white rounded-2xl border-2 border-purple-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Con Confirmación (RSVP)</h3>
                    <p className="text-xs text-neutral-500">Links personalizados por invitado</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-neutral-200 rounded-full font-bold">GRATIS</span>
                      <span className="text-sm text-neutral-700">Por invitado</span>
                    </div>
                    <span className="font-bold text-neutral-900">1 crédito</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full font-bold">PRO</span>
                      <span className="text-sm text-neutral-700">Por invitado</span>
                    </div>
                    <span className="font-bold text-purple-900">2 créditos</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3">Cada invitado recibe su link único para confirmar asistencia</p>
              </div>
            </div>

            {/* Ejemplo práctico */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="font-bold text-sm text-purple-900 mb-3">💡 Ejemplo: XV Años con 80 invitados (RSVP)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-3">
                  <p className="text-neutral-500 text-xs mb-1">Plan Gratis</p>
                  <p className="font-bold text-neutral-900">80 × 1 = <span className="text-lg">80 créditos</span></p>
                </div>
                <div className="bg-white/70 rounded-xl p-3">
                  <p className="text-purple-600 text-xs mb-1">Plan Pro</p>
                  <p className="font-bold text-purple-900">80 × 2 = <span className="text-lg">160 créditos</span></p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Planes Free vs Pro */}
      <section className="py-16 bg-neutral-50">
        <Container>
          <h2 className="text-3xl font-display font-bold text-center mb-4">
            Gratis vs Pro
          </h2>
          <p className="text-center text-neutral-600 mb-12">
            Tu primera compra de créditos te convierte en Pro automáticamente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <Card>
              <div className="p-8">
                <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-3xl">🎁</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-1">Gratis</h3>
                <p className="text-neutral-500 text-sm mb-6">Para empezar</p>

                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-bold text-lg">10 créditos de regalo</p>
                  <p className="text-green-700 text-xs mt-1">Al registrarte</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-neutral-50">
                    <span className="text-neutral-600">Sin RSVP</span>
                    <span className="font-bold">10 cr / invitación</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-neutral-50">
                    <span className="text-neutral-600">Con RSVP</span>
                    <span className="font-bold">1 cr / invitado</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    '✅ Todas las plantillas',
                    '✅ Personalización completa',
                    '✅ Mapa, galería, countdown',
                    '✅ Música de YouTube',
                    '✅ Efectos de entrada',
                    '✅ Link compartible',
                  ].map((f, i) => (
                    <p key={i} className="text-sm text-neutral-700">{f}</p>
                  ))}
                </div>

                {userPlan === 'free' && isAuthenticated && (
                  <div className="mt-6 p-3 bg-neutral-100 rounded-xl text-center">
                    <p className="text-xs text-neutral-600 font-semibold">✨ Este es tu plan actual</p>
                  </div>
                )}

                {!isAuthenticated && (
                  <Button variant="secondary" className="w-full mt-6" onClick={() => router.push('/auth')}>
                    Comenzar Gratis
                  </Button>
                )}
              </div>
            </Card>

            {/* Pro */}
            <Card className="ring-4 ring-purple-500 ring-offset-4 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold">
                  Recomendado
                </span>
              </div>
              <div className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-1">Pro</h3>
                <p className="text-neutral-500 text-sm mb-6">Desde tu primera compra</p>

                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <p className="text-purple-800 font-bold text-lg">Se activa al comprar créditos</p>
                  <p className="text-purple-700 text-xs mt-1">Sin cuota mensual, para siempre</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-purple-50">
                    <span className="text-purple-700">Sin RSVP</span>
                    <span className="font-bold text-purple-900">50 cr / invitación</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-purple-50">
                    <span className="text-purple-700">Con RSVP</span>
                    <span className="font-bold text-purple-900">2 cr / invitado</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    '✅ Todo lo del plan Gratis',
                    '✅ RSVP con confirmación',
                    '✅ Links personalizados',
                    '✅ Dashboard de invitados',
                    '✅ Estadísticas de acceso',
                    '⭐ Soporte prioritario',
                  ].map((f, i) => (
                    <p key={i} className="text-sm text-neutral-700">{f}</p>
                  ))}
                </div>

                {userPlan === 'pro' && isAuthenticated && (
                  <div className="mt-6 p-3 bg-purple-100 rounded-xl text-center">
                    <p className="text-xs text-purple-700 font-semibold">⭐ Este es tu plan actual</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Paquetes de créditos */}
      <section className="py-20">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Compra Créditos
              </h2>
              <p className="text-lg text-neutral-600">
                Elige el paquete que necesites. Sin vencimiento.
              </p>
              {userPlan === 'free' && isAuthenticated && (
                <p className="text-sm text-purple-600 font-semibold mt-2">
                  🎉 Tu primera compra activa el plan Pro automáticamente
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {creditPacks.map((pack) => (
                <Card key={pack.id} className={`relative ${pack.popular ? 'ring-2 ring-purple-500' : ''} ${pack.best ? 'ring-2 ring-yellow-400' : ''}`}>
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 bg-purple-500 text-white rounded-full text-[10px] font-bold whitespace-nowrap">
                        Más Popular
                      </span>
                    </div>
                  )}
                  {pack.best && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-[10px] font-bold whitespace-nowrap">
                        Mejor Precio
                      </span>
                    </div>
                  )}
                  <div className="p-5 text-center">
                    <div className="text-4xl mb-3">💎</div>
                    <h3 className="text-3xl font-bold mb-1">{pack.credits}</h3>
                    <p className="text-neutral-500 text-xs mb-4">créditos</p>
                    <div className="text-2xl font-bold mb-1">${pack.price}</div>
                    <p className="text-[11px] text-neutral-400 mb-4">${pack.perCredit.toFixed(2)} / crédito</p>
                    <Button
                      variant={pack.popular || pack.best ? 'accent' : 'secondary'}
                      className="w-full"
                      onClick={() => handleBuyCredits(pack)}
                    >
                      Comprar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-neutral-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '📝', title: 'Regístrate', desc: 'Obtén 10 créditos gratis' },
                { icon: '🎨', title: 'Crea tu invitación', desc: 'Personaliza todo' },
                { icon: '💎', title: 'Compra créditos', desc: 'Si necesitas más' },
                { icon: '🚀', title: 'Publica y comparte', desc: 'Links listos al instante' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-neutral-600">{step.desc}</p>
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
                  q: '¿Los créditos tienen fecha de vencimiento?',
                  a: 'No. Tus créditos no vencen nunca. Úsalos cuando quieras.',
                },
                {
                  q: '¿Qué diferencia hay entre Gratis y Pro?',
                  a: 'Con el plan Gratis recibes 10 créditos de inicio. Las tarifas son: 10 créditos por invitación sin RSVP y 1 crédito por invitado con RSVP. Al hacer tu primera compra de créditos pasas a Pro, donde las tarifas son: 50 créditos sin RSVP y 2 créditos por invitado con RSVP.',
                },
                {
                  q: '¿Por qué Pro cuesta más créditos por invitación?',
                  a: 'El plan Pro está pensado para eventos más grandes. El precio por crédito es más bajo al comprar paquetes grandes, así que en total sale más económico. Además, al ser Pro desbloqueas funciones premium como RSVP con confirmación y estadísticas.',
                },
                {
                  q: '¿Cuál es la diferencia entre invitación con y sin RSVP?',
                  a: 'Sin RSVP se genera un link genérico que compartes con todos. Con RSVP cada invitado recibe un link personalizado donde puede confirmar su asistencia y número de acompañantes.',
                },
                {
                  q: '¿Puedo crear varias invitaciones?',
                  a: 'Sí. Puedes crear todas las invitaciones que quieras. Cada una consume sus propios créditos al momento de publicar.',
                },
                {
                  q: '¿Qué pasa si me quedo sin créditos?',
                  a: 'Simplemente compra más créditos desde tu Dashboard o la página de Planes. Puedes comprar en cualquier momento.',
                },
                {
                  q: '¿Cuánto tiempo está activa mi invitación?',
                  a: 'Tu invitación permanece activa de forma indefinida. No hay límite de tiempo.',
                },
              ].map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl p-6 border border-neutral-200">
                  <summary className="font-semibold cursor-pointer hover:text-purple-600 transition-colors">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-neutral-600 text-sm">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}