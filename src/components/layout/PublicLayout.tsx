import React from 'react';
import Link from 'next/link';
import { Container } from '../ui';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header público */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <Container>
          <div className="flex items-center justify-between h-[73px]">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900">
                <span className="text-gradient">Event Studio</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Inicio
              </Link>
              <Link href="/muestras" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Muestras
              </Link>
              <Link href="/planes" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
                Planes
              </Link>
              <Link href="/auth" className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-rose text-white rounded-xl font-semibold text-sm hover:shadow-glow transition-all">
                Crear invitación
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer público */}
      <footer className="bg-neutral-900 text-white py-12 mt-10">
        <Container>
          <div className="text-center text-neutral-400 text-sm">
            <p>&copy; 2024 Dolseseli. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};
