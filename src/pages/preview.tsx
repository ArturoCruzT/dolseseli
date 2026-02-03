import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';

export default function Preview() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  // Datos de ejemplo (en producción vendrían de la URL o estado)
const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dolseseli.com'}/inv/abc123xyz`;
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(invitationUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: '💬', color: 'from-green-500 to-green-600', action: () => window.open(`https://wa.me/?text=${encodeURIComponent('¡Estás invitado! ' + invitationUrl)}`) },
    { name: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-700', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}`) },
    { name: 'Twitter', icon: '🐦', color: 'from-sky-500 to-blue-500', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(invitationUrl)}&text=¡Estás invitado!`) },
    { name: 'Email', icon: '📧', color: 'from-gray-600 to-gray-700', action: () => window.location.href = `mailto:?subject=Invitación&body=${encodeURIComponent(invitationUrl)}` },
  ];

  return (
    <Layout>
      {/* Success Header */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-up">
              ¡Tu Invitación está Lista! 🎉
            </h1>
            <p className="text-xl text-neutral-600 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Ahora puedes compartirla con tus invitados
            </p>
          </div>
        </Container>
      </section>

      {/* Preview Section */}
      <section className="py-16 bg-neutral-50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Preview */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">Vista Previa</h2>
                <div className="bg-neutral-900 rounded-3xl p-4 shadow-2xl">
                  <div className="bg-white rounded-2xl overflow-hidden aspect-[9/16]">
                    <div className="h-full bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-500 p-8 flex flex-col items-center justify-center text-white">
                      <div className="text-7xl mb-4 animate-float">👑</div>
                      <div className="text-center space-y-4">
                        <p className="text-xs tracking-widest uppercase opacity-90">Estás invitado a</p>
                        <h3 className="text-3xl font-display font-bold">Mis XV Años</h3>
                        <div className="w-12 h-px bg-white/50 mx-auto" />
                        <div className="space-y-2">
                          <p className="text-sm">📅 15 de Marzo, 2024</p>
                          <p className="text-sm">📍 Salón de Eventos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => router.push('/personalizar')}>
                    ✏️ Editar
                  </Button>
                  <Button variant="primary" className="flex-1">
                    👁️ Ver Completa
                  </Button>
                </div>
              </div>

              {/* Right: Share Options */}
              <div className="space-y-8">
                {/* Link Section */}
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Enlace de Invitación</h2>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Tu enlace único
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={invitationUrl}
                        readOnly
                        className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-mono"
                      />
                      <Button 
                        variant={copied ? "primary" : "secondary"}
                        onClick={handleCopyLink}
                      >
                        {copied ? '✓' : '📋'}
                      </Button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 mt-2 animate-fade-in">
                        ✓ Enlace copiado al portapapeles
                      </p>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Código QR</h2>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-xl border-2 border-neutral-200 mb-4">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-sm text-neutral-600 text-center mb-4">
                        Escanea para ver la invitación
                      </p>
                      <Button variant="secondary" className="w-full">
                        📥 Descargar QR
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Compartir en Redes</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {shareOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={option.action}
                        className={`p-4 bg-gradient-to-br ${option.color} text-white rounded-2xl hover:scale-105 transition-transform`}
                      >
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <div className="text-sm font-semibold">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-display font-bold mb-4">Estadísticas</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">0</div>
                      <div className="text-xs text-neutral-400">Vistas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">0</div>
                      <div className="text-xs text-neutral-400">Confirmados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">0</div>
                      <div className="text-xs text-neutral-400">Compartidos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              Siguientes Pasos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '📊', title: 'Ver Respuestas', description: 'Revisa quién confirmó asistencia' },
                { icon: '✉️', title: 'Enviar Recordatorios', description: 'Notifica a tus invitados' },
                { icon: '🎨', title: 'Crear Otra', description: 'Diseña más invitaciones' },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 text-center hover:shadow-card-hover transition-shadow">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h3 className="font-display font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}