import React from 'react';
import { Container } from '../ui';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        {/* ... código existente del header ... */}
      </header>

      {/* Free Plan Banner */}
      {user && user.plan === 'free' && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2">
          <Container>
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">
                🎁 Plan Gratis: {user.credits || 10} invitados disponibles
              </p>
              <Link 
                href="/planes"
                className="px-4 py-1 bg-white text-purple-600 rounded-full font-bold hover:bg-neutral-100 transition-colors"
              >
                Actualizar Plan
              </Link>
            </div>
          </Container>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer Moderno */}
      <footer className="bg-neutral-900 text-white py-16 mt-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <h3 className="text-2xl font-display font-bold">Event Studio</h3>
              </div>
              <p className="text-neutral-400 max-w-md">
                Creamos invitaciones digitales elegantes y personalizadas para tus momentos más especiales.
              </p>
            </div>

            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="#templates" className="hover:text-white transition-colors">Plantillas</Link></li>
              <li><Link href="#about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
            </ul>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-neutral-400">
                <li>isc.arturo.cruz@outloo.com</li>
                <li>+52 722 2862041</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>© 2024 Event Studio. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};