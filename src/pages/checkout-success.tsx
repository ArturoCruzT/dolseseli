import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const savedPayment = sessionStorage.getItem('paymentSuccess');
    if (!savedPayment) {
      router.push('/planes');
      return;
    }

    setPaymentData(JSON.parse(savedPayment));
  }, [router]);

  if (!paymentData) {
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
      <section className="py-20 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-scale-in">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-up">
                ¡Pago Exitoso! 🎉
              </h1>
              <p className="text-xl text-neutral-600 animate-slide-up" style={{ animationDelay: '100ms' }}>
                Tu invitación está lista para ser creada
              </p>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-display font-bold mb-6">Detalles de la Compra</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Plan</span>
                  <span className="font-semibold">{paymentData.plan}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Monto Pagado</span>
                  <span className="font-semibold text-2xl text-green-600">
                    ${paymentData.amount.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Fecha</span>
                  <span className="font-semibold">
                    {new Date(paymentData.date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-neutral-600">Invitados Incluidos</span>
                  <span className="font-semibold text-purple-600">
                    {user?.credits || 0} invitados únicos
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900">
                  📧 Hemos enviado un comprobante de pago a tu correo: <strong>{user?.email}</strong>
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 mb-8">
              <h2 className="text-2xl font-display font-bold mb-6">Siguientes Pasos</h2>
              
              <div className="space-y-4">
                {[
                  { icon: '🎨', title: 'Crea tu invitación', desc: 'Personaliza cada detalle' },
                  { icon: '🔗', title: 'Comparte el enlace', desc: 'Envía a tus invitados vía WhatsApp' },
                  { icon: '📊', title: 'Monitorea accesos', desc: 'Ve quién ha visto tu invitación' },
                  { icon: '✅', title: 'Gestiona confirmaciones', desc: 'Recibe respuestas RSVP en tiempo real' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="text-4xl">{step.icon}</div>
                    <div>
                      <h3 className="font-bold mb-1">{step.title}</h3>
                      <p className="text-sm text-neutral-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={() => router.push('/')}
              >
                🎨 Crear Mi Invitación
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                📊 Ver Dashboard
              </Button>
            </div>

            {/* Support */}
            <div className="mt-8 text-center">
              <p className="text-neutral-600 mb-2">¿Necesitas ayuda?</p>
              <a 
                href="mailto:soporte@dolseseli.com"
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Contacta a nuestro equipo de soporte
              </a>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}