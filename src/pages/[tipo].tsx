import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Card, Button } from '@/components/ui';

const templates = {
  quinceanera: [
    {
      id: 1,
      name: 'Royal Dreams',
      preview: '👑',
      color: 'from-pink-400 via-rose-400 to-fuchsia-500',
      description: 'Elegancia real con detalles dorados',
      features: ['Animaciones suaves', 'Música de fondo', 'RSVP integrado']
    },
    {
      id: 2,
      name: 'Golden Princess',
      preview: '✨',
      color: 'from-amber-300 via-yellow-400 to-amber-500',
      description: 'Lujo y sofisticación en cada detalle',
      features: ['Galería de fotos', 'Contador regresivo', 'Mapa de ubicación']
    },
    {
      id: 3,
      name: 'Modern Purple',
      preview: '💜',
      color: 'from-purple-400 via-violet-500 to-purple-600',
      description: 'Diseño contemporáneo y vibrante',
      features: ['Diseño minimalista', 'Transiciones 3D', 'Share social']
    },
    {
      id: 4,
      name: 'Pink Elegance',
      preview: '🌸',
      color: 'from-pink-300 via-pink-400 to-rose-500',
      description: 'Delicadeza y romance',
      features: ['Efectos florales', 'Música personalizada', 'Gift registry']
    },
  ],
  boda: [
    {
      id: 1,
      name: 'Classic Gold',
      preview: '💍',
      color: 'from-amber-200 via-yellow-300 to-amber-400',
      description: 'Elegancia atemporal para tu gran día',
      features: ['Línea de tiempo', 'Lista de invitados', 'Confirmación RSVP']
    },
    {
      id: 2,
      name: 'Romantic Blush',
      preview: '🌸',
      color: 'from-rose-300 via-pink-400 to-rose-500',
      description: 'Romance y delicadeza en cada detalle',
      features: ['Galería romántica', 'Historia de amor', 'Mesa de regalos']
    },
    {
      id: 3,
      name: 'Minimalist Chic',
      preview: '🤍',
      color: 'from-neutral-200 via-neutral-300 to-stone-400',
      description: 'Sofisticación en su forma más pura',
      features: ['Diseño limpio', 'Animaciones sutiles', 'Multi-idioma']
    },
    {
      id: 4,
      name: 'Garden Wedding',
      preview: '🌿',
      color: 'from-green-300 via-emerald-400 to-teal-500',
      description: 'Naturaleza y elegancia combinadas',
      features: ['Temas botánicos', 'Efectos naturales', 'Eco-friendly']
    },
  ],
  cumpleanos: [
    {
      id: 1,
      name: 'Party Time',
      preview: '🎉',
      color: 'from-blue-400 via-cyan-500 to-teal-500',
      description: 'Energía y diversión sin límites',
      features: ['Animaciones festivas', 'Playlist integrado', 'Juegos interactivos']
    },
    {
      id: 2,
      name: 'Tropical Vibes',
      preview: '🌴',
      color: 'from-lime-400 via-green-500 to-emerald-600',
      description: 'Celebración tropical y vibrante',
      features: ['Temas de verano', 'Filtros de fotos', 'Booth virtual']
    },
    {
      id: 3,
      name: 'Sweet Moments',
      preview: '🍰',
      color: 'from-pink-300 via-rose-400 to-pink-500',
      description: 'Dulzura en cada momento',
      features: ['Diseño kawaii', 'Stickers animados', 'Wishlist']
    },
    {
      id: 4,
      name: 'Neon Night',
      preview: '🌟',
      color: 'from-purple-500 via-fuchsia-600 to-pink-600',
      description: 'Fiesta nocturna con estilo',
      features: ['Efectos neón', 'Dark mode', 'DJ playlist']
    },
  ],
  bautizo: [
    {
      id: 1,
      name: 'Heavenly Blue',
      preview: '🕊️',
      color: 'from-sky-200 via-blue-300 to-sky-400',
      description: 'Pureza y paz celestial',
      features: ['Música sacra', 'Bendiciones', 'Álbum digital']
    },
    {
      id: 2,
      name: 'Angel Baby',
      preview: '👼',
      color: 'from-blue-100 via-indigo-200 to-blue-300',
      description: 'Ternura angelical',
      features: ['Animaciones suaves', 'Dedicatorias', 'Prayer section']
    },
    {
      id: 3,
      name: 'Cloud Dreams',
      preview: '☁️',
      color: 'from-cyan-200 via-sky-300 to-blue-400',
      description: 'Serenidad y esperanza',
      features: ['Efectos de nubes', 'Timeline del bebé', 'Padrinos']
    },
    {
      id: 4,
      name: 'Pink Blessing',
      preview: '🎀',
      color: 'from-pink-200 via-rose-300 to-pink-400',
      description: 'Bendición en tonos rosa',
      features: ['Tema femenino', 'Galería tierna', 'Agradecimientos']
    },
  ],
};

const titles: any = {
  quinceanera: 'Quinceañera',
  boda: 'Boda',
  cumpleanos: 'Cumpleaños',
  bautizo: 'Bautizo',
};

const descriptions: any = {
  quinceanera: 'Diseños elegantes y sofisticados para celebrar tus 15 años con estilo único',
  boda: 'Invitaciones románticas y profesionales para el día más importante de tu vida',
  cumpleanos: 'Diseños divertidos y coloridos para hacer de tu celebración algo memorable',
  bautizo: 'Plantillas tiernas y delicadas para celebrar este momento especial',
};

export default function TipoInvitacion() {
  const router = useRouter();
  const { tipo } = router.query;
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const currentTemplates = templates[tipo as keyof typeof templates] || [];
  const title = titles[tipo as string] || 'Invitación';
  const description = descriptions[tipo as string] || '';

  return (
    <Layout>
      {/* Header con breadcrumb */}
      <section className="py-12 bg-neutral-100 border-b border-neutral-200">
        <Container>
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-neutral-900 transition-colors">
              Inicio
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{title}</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Plantillas de <span className="text-gradient">{title}</span>
            </h1>
            <p className="text-xl text-neutral-600">
              {description}
            </p>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-neutral-200 sticky top-[73px] z-40">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Filtrar por:</span>
            <div className="flex flex-wrap gap-3">
              {['Todos', 'Moderno', 'Clásico', 'Elegante'].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'Todos'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Templates Grid */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTemplates.map((template, index) => (
              <Card
                key={template.id}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Preview Card */}
                <div className={`relative h-80 bg-gradient-to-br ${template.color} p-8 flex items-center justify-center overflow-hidden`}>
                  {/* Pattern Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12" />
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 text-9xl animate-float group-hover:scale-110 transition-transform duration-500">
                    {template.preview}
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900">
                    Premium
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-2 text-neutral-900 group-hover:text-gradient transition-all">
                    {template.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {template.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push({
                          pathname: '/personalizar',
                          query: {
                            tipo: tipo,
                            templateId: template.id,
                            templateName: template.name,
                            color: template.color,
                            preview: template.preview
                          }
                        });
                      }}
                    >
                      Personalizar
                    </Button>
                    <button
                      className="px-4 py-3 border-2 border-neutral-200 rounded-xl hover:border-neutral-900 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Guardar datos temporales para preview
                        sessionStorage.setItem('invitationPreview', JSON.stringify({
                          template: {
                            preview: template.preview,
                            color: template.color,
                            icon: template.preview,
                            gradient: template.color,
                            textColor: '#ffffff',
                            font: 'font-display',
                          },
                          event: {
                            name: 'Vista Previa',
                            date: '2024-12-31',
                            location: 'Ubicación del Evento',
                            message: 'Este es un ejemplo de cómo se verá tu invitación',
                          },
                          features: {
                            rsvp: true,
                            map: false,
                            gallery: false,
                            countdown: false,
                            galleryPhotos: [],
                          },
                        }));
                        window.open('/invitation-view', '_blank');
                      }}
                      title="Vista previa rápida"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-neutral-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-xl text-neutral-400 mb-8">
              Contáctanos para crear una plantilla 100% personalizada
            </p>
            <Button variant="accent" size="lg">
              Solicitar Diseño Personalizado
            </Button>
          </div>
        </Container>
      </section>
    </Layout>
  );
}