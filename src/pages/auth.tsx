import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const router = useRouter();
    const { login } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<any>({});

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email no válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (mode === 'register') {
            if (!formData.name) {
                newErrors.name = 'El nombre es obligatorio';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (mode === 'register') {
            // Verificar si el email ya existe en Supabase
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', formData.email)
                .single();

            if (existingUser) {
                setErrors({ email: 'Este email ya está registrado' });
                return;
            }

            // Crear usuario en Supabase
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        plan: 'free',
                        credits: 10,
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error creating user:', error);
                alert('Error al crear la cuenta. Intenta de nuevo.');
                return;
            }

            if (newUser) {
                const userData = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    plan: newUser.plan as 'free' | 'basic' | 'premium',
                    credits: newUser.credits,
                    createdAt: newUser.created_at,
                };

                login(userData);
                alert('✅ Cuenta creada exitosamente');
                router.push('/dashboard');
            }
        } else {
            // Login - buscar usuario en Supabase
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', formData.email)
                .single();

            if (error || !user) {
                setErrors({ email: 'Email o contraseña incorrectos' });
                return;
            }

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                plan: user.plan as 'free' | 'basic' | 'premium',
                credits: user.credits,
                createdAt: user.created_at,
            };

            login(userData);
            router.push('/dashboard');
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Layout>
                <section className="py-20 min-h-[80vh] flex items-center">
                    <Container>
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-200 p-8">
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-display font-bold mb-2">
                                        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    </h1>
                                    <p className="text-neutral-600">
                                        {mode === 'login'
                                            ? 'Accede a tu dashboard de invitaciones'
                                            : 'Comienza a crear invitaciones increíbles'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {mode === 'register' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.name
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                                                    : 'border-neutral-200 focus:border-neutral-900'
                                                    }`}
                                                placeholder="Ej: María García"
                                            />
                                            {errors.name && (
                                                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.email
                                                ? 'border-red-500 focus:border-red-600 bg-red-50'
                                                : 'border-neutral-200 focus:border-neutral-900'
                                                }`}
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Contraseña *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.password
                                                ? 'border-red-500 focus:border-red-600 bg-red-50'
                                                : 'border-neutral-200 focus:border-neutral-900'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && (
                                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                                        )}
                                    </div>

                                    {mode === 'register' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                                Confirmar Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${errors.confirmPassword
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50'
                                                    : 'border-neutral-200 focus:border-neutral-900'
                                                    }`}
                                                placeholder="••••••••"
                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                                            )}
                                        </div>
                                    )}

                                    <Button type="submit" variant="accent" className="w-full" size="lg">
                                        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    </Button>
                                </form>

                                {/* Google Sign In */}
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-neutral-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-neutral-500">O continúa con</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                try {
                                                    const decoded: any = jwtDecode(credentialResponse.credential!);

                                                    // Buscar si el usuario ya existe
                                                    const { data: existingUser } = await supabase
                                                        .from('users')
                                                        .select('*')
                                                        .eq('email', decoded.email)
                                                        .single();

                                                    let userData;

                                                    if (existingUser) {
                                                        // Usuario existente
                                                        userData = {
                                                            id: existingUser.id,
                                                            name: existingUser.name,
                                                            email: existingUser.email,
                                                            picture: existingUser.picture,
                                                            plan: existingUser.plan as 'free' | 'basic' | 'premium',
                                                            credits: existingUser.credits,
                                                            createdAt: existingUser.created_at,
                                                        };
                                                    } else {
                                                        // Crear nuevo usuario
                                                        const { data: newUser, error } = await supabase
                                                            .from('users')
                                                            .insert([
                                                                {
                                                                    name: decoded.name,
                                                                    email: decoded.email,
                                                                    picture: decoded.picture,
                                                                    google_id: decoded.sub,
                                                                    plan: 'free',
                                                                    credits: 10,
                                                                }
                                                            ])
                                                            .select()
                                                            .single();

                                                        if (error) {
                                                            console.error('Error creating Google user:', error);
                                                            alert('Error al iniciar sesión con Google');
                                                            return;
                                                        }

                                                        userData = {
                                                            id: newUser.id,
                                                            name: newUser.name,
                                                            email: newUser.email,
                                                            picture: newUser.picture,
                                                            plan: newUser.plan as 'free' | 'basic' | 'premium',
                                                            credits: newUser.credits,
                                                            createdAt: newUser.created_at,
                                                        };
                                                    }

                                                    login(userData);
                                                    router.push('/dashboard');
                                                } catch (error) {
                                                    console.error('Error al procesar login de Google:', error);
                                                    alert('Error al iniciar sesión con Google');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Toggle */}
                                <div className="mt-6 text-center">
                                    <p className="text-neutral-600">
                                        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                                        <button
                                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                            className="ml-2 font-semibold text-neutral-900 hover:underline"
                                        >
                                            {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
                                        </button>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                                <p className="text-sm text-blue-900">
                                    💡 <strong>Demo:</strong> Puedes crear una cuenta de prueba con cualquier email
                                </p>
                            </div>
                        </div>
                    </Container>
                </section>
            </Layout>
        </GoogleOAuthProvider>
    );
}