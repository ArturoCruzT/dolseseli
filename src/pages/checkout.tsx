import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const stored = sessionStorage.getItem('selectedPlan');
    if (!stored) {
      router.push('/planes');
      return;
    }

    setSelectedPlan(JSON.parse(stored));
  }, [isAuthenticated, router]);

  const handleCheckout = async () => {
    if (!user || !selectedPlan) return;

    setProcessing(true);

    try {
      // Leer créditos actuales desde DB
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits, plan')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const currentCredits = userData?.credits || 0;
      const newCredits = currentCredits + selectedPlan.credits;

      // Actualizar usuario: sumar créditos + cambiar a pro
      const { error: updateError } = await supabase
        .from('users')
        .update({
          credits: newCredits,
          plan: 'pro',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Registrar transacción
      await supabase.from('transactions').insert([{
        user_id: user.id,
        plan_id: selectedPlan.planId,
        amount: selectedPlan.price,
        credits: selectedPlan.credits,
        payment_method: 'simulation',
        status: 'completed',
      }]);

      // Actualizar localStorage
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.credits = newCredits;
        parsed.plan = 'pro';
        localStorage.setItem('currentUser', JSON.stringify(parsed));
      }

      // Limpiar y redirigir
      sessionStorage.removeItem('selectedPlan');
      alert(`✅ ¡Compra exitosa!\n\n+${selectedPlan.credits} créditos agregados.\nTotal: ${newCredits} créditos.\n\n${userData?.plan !== 'pro' ? '⭐ ¡Tu plan ahora es Pro!' : ''}`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('❌ Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-neutral-500">Cargando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20">
        <Container>
          <div className="max-w-lg mx-auto">
            <h1 className="text-4xl font-display font-bold text-center mb-8">Checkout</h1>

            <Card>
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">💎</div>
                  <h2 className="text-2xl font-bold">{selectedPlan.credits} Créditos</h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600">Paquete</span>
                    <span className="font-semibold">{selectedPlan.credits} créditos</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600">Precio</span>
                    <span className="font-semibold">${selectedPlan.price} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-600">Créditos actuales</span>
                    <span className="font-semibold">{user?.credits || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-green-50 border border-green-200 rounded-xl">
                    <span className="text-green-700 font-semibold">Total después</span>
                    <span className="font-bold text-green-800">{(user?.credits || 0) + selectedPlan.credits} créditos</span>
                  </div>
                  {user?.plan !== 'pro' && (
                    <div className="flex justify-between text-sm p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-purple-700 font-semibold">⭐ Plan</span>
                      <span className="font-bold text-purple-800">Se activa Pro</span>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-xs text-yellow-800 font-semibold">⚠️ Modo simulación</p>
                  <p className="text-xs text-yellow-700 mt-1">Los pagos están en modo de prueba. No se realizará ningún cobro real.</p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="accent"
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={processing}
                  >
                    {processing ? '⏳ Procesando...' : `Pagar $${selectedPlan.price} MXN`}
                  </Button>
                  <button
                    onClick={() => { sessionStorage.removeItem('selectedPlan'); router.push('/planes'); }}
                    className="w-full px-5 py-3 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </Layout>
  );
}