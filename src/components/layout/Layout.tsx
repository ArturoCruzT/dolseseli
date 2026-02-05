import React from 'react';
import { Container } from '../ui';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header Moderno */}
      <header className="glass-effect sticky top-0 z-50 border-b border-neutral-200/50">
        <Container>
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                <span className="text-gradient">Event Studio</span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Inicio
              </Link>
              <Link href="#templates" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Plantillas
              </Link>
              <Link href="/dashboard" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Dashboard
              </Link>

            </nav>

            <button className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
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