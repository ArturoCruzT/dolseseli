import React, { useState } from 'react';
import { Container } from '../ui';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <Container>
          <div className="flex items-center justify-between h-[73px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900">
               <span className="text-gradient">Event Studio</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link 
                href="/muestras" 
                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                Muestras
              </Link>
              <Link 
                href="/planes" 
                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                Planes
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-rose flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500">
                        {user.plan === 'free' ? 'Plan Gratuito' : user.plan === 'basic' ? 'Plan Básico' : 'Plan Premium'}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-card-hover border border-neutral-200 py-2 z-50 animate-scale-in">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-neutral-200">
                          <p className="font-semibold text-neutral-900">{user.name}</p>
                          <p className="text-sm text-neutral-500">{user.email}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {user.credits || 0} créditos
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {user.plan === 'free' ? 'Gratuito' : user.plan === 'basic' ? 'Básico' : 'Premium'}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span className="text-sm font-medium">Dashboard</span>
                          </Link>

                          <Link
                            href="/planes"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium">Actualizar Plan</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-neutral-200 pt-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              handleLogout();
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm font-medium">Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth"
                    className="hidden md:block px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth"
                    className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-rose text-white rounded-xl font-semibold text-sm hover:shadow-glow transition-all"
                  >
                    Crear Cuenta Gratis
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Free Plan Banner */}
      {user && user.plan === 'free' && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2">
          <Container>
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">
                🎁 Plan Gratis: {user.credits || 0} invitados disponibles
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

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-rose rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <span className="text-2xl font-display font-bold">Dolseseli</span>
              </div>
              <p className="text-neutral-400 mb-6 max-w-md">
                Crea invitaciones digitales profesionales para tus eventos más importantes.
                Fácil, rápido y sin complicaciones.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/muestras" className="hover:text-white transition-colors">Muestras</Link></li>
                <li><Link href="/planes" className="hover:text-white transition-colors">Planes</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 text-sm">
            <p>&copy; 2024 Dolseseli. Todos los derechos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};