import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { PublicLayout } from '@/components/layout/PublicLayout';

// IMPORTA TU PREVIEW REAL (ajusta la ruta si tu componente tiene otro nombre)
import { InvitationPreview } from '@/components/invitations/InvitationPreview';

export default function PublicInvitationPage() {
  const router = useRouter();
  const { id, guest } = router.query;

  const invitationId = useMemo(() => (typeof id === 'string' ? id : null), [id]);
  const guestCode = useMemo(() => (typeof guest === 'string' ? guest : null), [guest]);

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);

  useEffect(() => {
    if (!router.isReady || !invitationId) return;

    const load = async () => {
      setLoading(true);
      try {
        // 1) Cargar invitación (PÚBLICO)
        const { data: inv, error: invErr } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', invitationId)
          .single();

        if (invErr) throw invErr;

        // Si quieres bloquear no publicadas:
        if (!inv || inv.status !== 'published') {
          setInvitation(null);
          setGuestData(null);
          setLoading(false);
          return;
        }

        setInvitation(inv);

        // 2) Si viene guest=code, cargar invitado (PÚBLICO)
        if (guestCode) {
          const { data: g, error: gErr } = await supabase
            .from('guests')
            .select('*')
            .eq('invitation_id', invitationId)
            .eq('guest_code', guestCode)
            .single();

          // Si no existe, no truena toda la página
          if (!gErr) setGuestData(g);
        } else {
          setGuestData(null);
        }
      } catch (e) {
        console.error('Error loading public invitation:', e);
        setInvitation(null);
        setGuestData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, invitationId, guestCode]);

  return (
    <PublicLayout>
      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-neutral-600">Cargando invitación…</div>
          ) : !invitation ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold mb-2">Invitación no disponible</h1>
              <p className="text-neutral-600">
                Puede que el link sea incorrecto o que la invitación aún no esté publicada.
              </p>
            </div>
          ) : (
            <>
              {/* Si quieres mostrar el nombre del invitado arriba */}
              {guestData?.name && (
                <div className="mb-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <p className="text-sm text-neutral-600">Hola</p>
                  <p className="text-xl font-bold text-neutral-900">{guestData.name}</p>
                  {typeof guestData.max_passes === 'number' && (
                    <p className="text-sm text-neutral-600 mt-1">
                      Pases: <span className="font-semibold">{guestData.max_passes}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Render real */}
              <InvitationPreview
                eventData={invitation.event}
                customStyles={invitation.styles}
                features={invitation.features}
                template={invitation.template}
                // Si tu preview necesita guest info:
                guest={guestData}
              />
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
