import React from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';

export default function Muestras() {
  const router = useRouter();

  const muestras = [
    {
      id: 1,
      tipo: 'Quinceañera',
      nombre: 'XV Años de Estefanía Jacqueline',
      descripcion: 'Elegancia y sofisticación en tonos lilas',
      imagen: 'from-purple-300 via-purple-400 to-purple-500',
      icon: '👑',
      fecha: '2026-12-06',
      ubicacion: 'Coahuila #101, Colonia Santa María de las Rosas, Toluca, México',
      mensaje: 'Hay historias y personas que no voy a olvidar y recuerdos como este que siempre voy a guardar. Porque son parte de mi vida, es mi deseo que compartan conmigo este día tan especial.',
      backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      features: ['countdown', 'map', 'rsvp'],
      textColor: '#4a148c',
    },
    {
      id: 2,
      tipo: 'Boda',
      nombre: 'Boda de Ana y Carlos',
      descripcion: 'Un amor que florece en cada detalle',
      imagen: 'from-rose-300 via-pink-400 to-rose-500',
      icon: '💍',
      fecha: '2025-06-15',
      ubicacion: 'Jardín Botánico, Ciudad de México',
      mensaje: 'Dos familias se unen, dos corazones laten como uno. Acompáñanos a celebrar nuestro amor eterno.',
      backgroundImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      features: ['countdown', 'map', 'gallery', 'rsvp'],
      textColor: '#ffffff',
    },
    {
      id: 3,
      tipo: 'Boda',
      nombre: 'Boda de María y Roberto',
      descripcion: 'Elegancia clásica en tonos dorados',
      imagen: 'from-amber-300 via-yellow-400 to-amber-500',
      icon: '💐',
      fecha: '2025-09-20',
      ubicacion: 'Hacienda San Miguel, Guadalajara',
      mensaje: 'Después de años de amor y complicidad, queremos compartir con ustedes el inicio de nuestra vida juntos.',
      backgroundImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
      features: ['countdown', 'map', 'rsvp'],
      textColor: '#ffffff',
    },
    {
      id: 4,
      tipo: 'Cumpleaños',
      nombre: '30 Años de Alejandra',
      descripcion: 'Celebración vibrante y llena de color',
      imagen: 'from-cyan-400 via-blue-500 to-indigo-600',
      icon: '🎉',
      fecha: '2025-03-10',
      ubicacion: 'Terraza Skybar, Monterrey',
      mensaje: '¡Tres décadas de aventuras y las mejores están por venir! Celebra conmigo esta nueva etapa.',
      backgroundImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      features: ['countdown', 'rsvp', 'gallery'],
      textColor: '#ffffff',
    },
    {
      id: 5,
      tipo: 'Quinceañera',
      nombre: 'XV Años de Valentina',
      descripcion: 'Sueños de princesa en rosa pastel',
      imagen: 'from-pink-200 via-pink-300 to-rose-400',
      icon: '🦋',
      fecha: '2025-11-25',
      ubicacion: 'Salón de Fiestas Crystal, Querétaro',
      mensaje: 'Como una mariposa que sale del capullo, hoy celebro mi transformación rodeada de quienes más amo.',
      backgroundImage: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800',
      features: ['countdown', 'map', 'gallery', 'rsvp'],
      textColor: '#831843',
    },
    {
      id: 6,
      tipo: 'Bautizo',
      nombre: 'Bautizo de Santiago',
      descripcion: 'Bendición celestial en azul suave',
      imagen: 'from-sky-200 via-blue-300 to-blue-400',
      icon: '👼',
      fecha: '2025-04-12',
      ubicacion: 'Parroquia San José, Puebla',
      mensaje: 'Con amor infinito, celebramos la llegada de nuestro pequeño ángel y su bendición sagrada.',
      backgroundImage: 'https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=800',
      features: ['map', 'rsvp'],
      textColor: '#ffffff',
    },
  ];

  const handleVerMuestra = (muestra: any) => {
    sessionStorage.setItem('invitationPreview', JSON.stringify({
      template: {
        preview: muestra.icon,
        color: muestra.imagen,
        icon: muestra.icon,
        gradient: muestra.imagen,
        textColor: muestra.textColor,
        font: 'font-display',
        backgroundImage: muestra.backgroundImage,
        bgImageOpacity: 40,
      },
      event: {
        name: muestra.nombre,
        date: muestra.fecha,
        location: muestra.ubicacion,
        message: muestra.mensaje,
      },
      features: {
        rsvp: muestra.features.includes('rsvp'),
        map: muestra.features.includes('map'),
        gallery: muestra.features.includes('gallery'),
        countdown: muestra.features.includes('countdown'),
        galleryPhotos: [],
      },
    }));
    window.open('/invitation-view', '_blank');
  };
  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 via-blue-50/30 to-purple-50/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              muestras de <span className="text-gradient">Invitaciones</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Inspírate con estas invitaciones reales creadas en nuestra plataforma
            </p>
            <Button variant="secondary" onClick={() => router.push('/')}>
              ← Volver al inicio
            </Button>
          </div>
        </Container>
      </section>

      {/* muestras Grid */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {muestras.map((muestra, index) => (
              <Card
                key={muestra.id}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Preview más realista */}
                <div className={`h-80 bg-gradient-to-br ${muestra.imagen} p-6 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                  {/* Background Image Preview */}
                  {muestra.backgroundImage && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30"
                      style={{ backgroundImage: `url(${muestra.backgroundImage})` }}
                    />
                  )}

                  {/* Content Preview */}
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-3 animate-float">
                      {muestra.icon}
                    </div>
                    <p className="text-xs tracking-widest uppercase mb-2 opacity-90">
                      Estás invitado a
                    </p>
                    <h4 className="text-xl font-display font-bold mb-3 line-clamp-2">
                      {muestra.nombre}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>📅 {new Date(muestra.fecha).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold z-20" style={{ color: muestra.textColor }}>
                    {muestra.tipo}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{muestra.mensaje}</p>

                  {/* Features Icons */}
                  <div className="flex gap-3 mb-4">
                    {muestra.features.includes('countdown') && (
                      <span className="text-2xl" title="Contador Regresivo">⏰</span>
                    )}
                    {muestra.features.includes('map') && (
                      <span className="text-2xl" title="Mapa">📍</span>
                    )}
                    {muestra.features.includes('gallery') && (
                      <span className="text-2xl" title="Galería">📸</span>
                    )}
                    {muestra.features.includes('rsvp') && (
                      <span className="text-2xl" title="RSVP">✅</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1 text-sm"
                      onClick={() => handleVerMuestra(muestra)}
                    >
                      👁️ Ver Muestra
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => router.push(`/${muestra.tipo.toLowerCase()}`)}
                    >
                      Usar →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              ¿Listo para crear la tuya?
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Empieza ahora y personaliza tu invitación perfecta
            </p>
            <Button
              variant="accent"
              size="lg"
              onClick={() => router.push('/#templates')}
            >
              Crear Mi Invitación →
            </Button>
          </div>
        </Container>
      </section>
    </Layout>
  );
}