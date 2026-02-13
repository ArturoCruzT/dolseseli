import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Container, Card, Button } from '@/components/ui';
import { useRouter } from 'next/router';

const invitationTypes = [
  {
    id: 'quinceanera',
    title: 'Quinceañera',
    description: 'Diseños elegantes para celebrar tus 15 años con estilo único',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    icon: '👑',
  },
  {
    id: 'boda',
    title: 'Boda',
    description: 'Invitaciones sofisticadas para el día más importante',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    icon: '💍',
  },
  {
    id: 'cumpleanos',
    title: 'Cumpleaños',
    description: 'Celebra con diseños modernos y vibrantes',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    icon: '🎂',
  },
  {
    id: 'bautizo',
    title: 'Bautizo',
    description: 'Momentos especiales con diseños tiernos y memorables',
    gradient: 'from-sky-400 via-blue-400 to-indigo-500',
    icon: '🕊️',
  },
];

export default function Home() {
  const router = useRouter();

  const handleSelectInvitation = (type: string) => {
    router.push(`/${type}`);
  };

  return (
    <Layout>
      {/* Hero Section Moderno */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background con gradiente moderno */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-blue-50/30 to-purple-50/30" />

        <Container>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-neutral-700">Diseño profesional en minutos</span>
            </div>

            <h1 className="section-title animate-slide-up">
              Invitaciones Digitales
              <br />
              <span className="text-gradient">Elegantes y Memorables</span>
            </h1>

            <p className="section-subtitle mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Crea invitaciones únicas con diseños profesionales para tus eventos más especiales.
              Sin complicaciones, con resultados impresionantes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button
                variant="accent"
                size="lg"
                onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar Plantillas
                <span>→</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/muestras')}
              >
                Ver Ejemplos
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              {[
                { number: '500+', label: 'Diseños' },
                { number: '10K+', label: 'Usuarios' },
                { number: '4.9★', label: 'Rating' },
              ].map((stat, i) => (
                <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${300 + i * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.number}</div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

 <section className="py-20 md:py-32">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-purple via-accent-rose to-accent-gold p-12 md:p-20 text-center text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Empieza a Crear Hoy
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Miles de personas ya confían en Event Studio para sus eventos especiales
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  router.push('/personalizar?tipo=otropleanos')}}
                  
              >
                Crear Mi Invitación
                <span>→</span>
              </Button>
            </div>
          </div>
        </Container>
      </section>
      {/* Templates Section */}
      <section id="templates" className="py-20 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Elige tu <span className="text-gradient">Tipo de Evento</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Cada plantilla está diseñada profesionalmente y es completamente personalizable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {invitationTypes.map((type, index) => (
              <Card
                key={type.id}
                onClick={() => handleSelectInvitation(type.id)}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative h-64 bg-gradient-to-br ${type.gradient} p-8 flex flex-col justify-between overflow-hidden`}>
                  {/* Patrón decorativo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-6xl mb-4 animate-float group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      Popular
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-2 text-neutral-900 group-hover:text-gradient transition-all">
                    {type.title}
                  </h3>
                  <p className="text-neutral-600 mb-6 text-sm leading-relaxed">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">12+ plantillas</span>
                    <span className="text-neutral-900 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-neutral-900 text-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              ¿Por qué <span className="text-gradient">Event Studio</span>?
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              La plataforma más completa para crear invitaciones digitales profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Diseños Premium',
                description: 'Plantillas creadas por diseñadores profesionales con atención a cada detalle',
              },
              {
                icon: '📱',
                title: 'Totalmente Responsive',
                description: 'Tus invitaciones se ven perfectas en cualquier dispositivo y plataforma',
              },
              {
                icon: '⚡',
                title: 'Rápido y Fácil',
                description: 'Personaliza y comparte tu invitación en menos de 5 minutos',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-neutral-800/50 backdrop-blur-sm rounded-3xl p-8 border border-neutral-700/50 hover:border-neutral-600 transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
     
    </Layout>
  );
}