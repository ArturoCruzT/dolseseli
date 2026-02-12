import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Container, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Guest, GuestStatus } from '@/types/invitation';

// ─── Generar código único corto ──────────────────────────
const generateGuestCode = (): string => {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'; // sin l,o,1,0 para evitar confusión
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export default function GuestManager() {
  const router = useRouter();
  const { id } = router.query; // invitation ID
  const { user, isAuthenticated } = useAuth();

  const [invitation, setInvitation] = useState<any>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPasses, setFormPasses] = useState(1);

  // Bulk add state
  const [bulkText, setBulkText] = useState('');

  // ─── Cargar datos ──────────────────────────────────────
  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const loadData = async () => {
      try {
        // Cargar invitación
        const { data: inv, error: invError } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (invError) throw invError;
        setInvitation(inv);

        // Cargar invitados
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('invitation_id', id)
          .order('created_at', { ascending: true });

        if (guestError) throw guestError;
        setGuests(guestData || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isAuthenticated]);

  // ─── Agregar invitado ──────────────────────────────────
  const handleAddGuest = async () => {
    if (!formName.trim()) {
      alert('⚠️ El nombre es obligatorio');
      return;
    }

    try {
      const guestCode = generateGuestCode();

      const { data, error } = await supabase
        .from('guests')
        .insert([{
          invitation_id: id,
          guest_code: guestCode,
          name: formName.trim(),
          phone: formPhone.trim() || null,
          max_passes: formPasses,
          confirmed_passes: 0,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      setGuests([...guests, data]);
      resetForm();
    } catch (error) {
      console.error('Error agregando invitado:', error);
      alert('❌ Error al agregar invitado. Intenta de nuevo.');
    }
  };

  // ─── Agregar múltiples invitados ───────────────────────
  const handleBulkAdd = async () => {
    const lines = bulkText.split('\n').filter(l => l.trim());
    if (lines.length === 0) return;

    try {
      const newGuests = lines.map(line => {
        // Formato: "Nombre, teléfono, pases" o simplemente "Nombre"
        const parts = line.split(',').map(p => p.trim());
        return {
          invitation_id: id,
          guest_code: generateGuestCode(),
          name: parts[0] || 'Sin nombre',
          phone: parts[1] || null,
          max_passes: parseInt(parts[2]) || 1,
          confirmed_passes: 0,
          status: 'pending' as GuestStatus,
        };
      });

      const { data, error } = await supabase
        .from('guests')
        .insert(newGuests)
        .select();

      if (error) throw error;

      setGuests([...guests, ...(data || [])]);
      setBulkText('');
      setShowBulkAdd(false);
      alert(`✅ ${data?.length || 0} invitados agregados`);
    } catch (error) {
      console.error('Error en carga masiva:', error);
      alert('❌ Error al agregar invitados');
    }
  };

  // ─── Editar invitado ───────────────────────────────────
  const handleUpdateGuest = async () => {
    if (!editingGuest) return;

    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: formName.trim(),
          phone: formPhone.trim() || null,
          max_passes: formPasses,
        })
        .eq('id', editingGuest.id);

      if (error) throw error;

      setGuests(guests.map(g =>
        g.id === editingGuest.id
          ? { ...g, name: formName.trim(), phone: formPhone.trim(), max_passes: formPasses }
          : g
      ));
      resetForm();
    } catch (error) {
      console.error('Error actualizando invitado:', error);
      alert('❌ Error al actualizar');
    }
  };

  // ─── Eliminar invitado ─────────────────────────────────
  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('¿Eliminar este invitado?')) return;

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      setGuests(guests.filter(g => g.id !== guestId));
    } catch (error) {
      console.error('Error eliminando invitado:', error);
    }
  };

  // ─── Reset form ────────────────────────────────────────
  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormPasses(1);
    setShowAddForm(false);
    setEditingGuest(null);
  };

  // ─── Abrir edición ─────────────────────────────────────
  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPhone(guest.phone || '');
    setFormPasses(guest.max_passes);
    setShowAddForm(true);
  };

  // ─── Generar link de WhatsApp ──────────────────────────
  const getWhatsAppLink = (guest: Guest) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dolseseli.vercel.app';
    const guestUrl = `${baseUrl}/i/${id}?guest=${guest.guest_code}`;
    const eventName = invitation?.event?.name || 'nuestro evento';
    const passText = guest.max_passes === 1 ? '1 pase' : `${guest.max_passes} pases`;

    const message = `¡Hola ${guest.name}! 🎉\n\nEstás invitado(a) a *${eventName}*\nTienes *${passText}* reservados.\n\nAbre tu invitación aquí:\n${guestUrl}`;

    const phone = guest.phone ? guest.phone.replace(/\D/g, '') : '';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // ─── Copiar link ───────────────────────────────────────
  const copyGuestLink = (guest: Guest) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dolseseli.vercel.app';
    const url = `${baseUrl}/i/${id}?guest=${guest.guest_code}`;
    navigator.clipboard.writeText(url);
    alert('✅ Link copiado al portapapeles');
  };

  // ─── Stats ─────────────────────────────────────────────
  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    declined: guests.filter(g => g.status === 'declined').length,
    pending: guests.filter(g => g.status === 'pending').length,
    totalPasses: guests.reduce((acc, g) => acc + g.max_passes, 0),
    confirmedPasses: guests.reduce((acc, g) => acc + (g.confirmed_passes || 0), 0),
  };

  // ─── Loading / Error states ────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">📋</div>
            <p className="text-neutral-600">Cargando invitados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invitation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-neutral-600 mb-4">Invitación no encontrada</p>
            <Button variant="accent" onClick={() => router.push('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusBadge = (status: GuestStatus) => {
    const config = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-800', icon: '✅' },
      declined: { label: 'No asiste', color: 'bg-red-100 text-red-800', icon: '❌' },
    };
    const c = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.color}`}>
        {c.icon} {c.label}
      </span>
    );
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-10 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <Container>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold">Gestionar Invitados</h1>
              <p className="text-neutral-300 text-sm">{invitation.event?.name || 'Evento'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-neutral-300 text-xs mt-1">Invitados</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-5 border border-green-400/30 text-center">
              <div className="text-3xl font-bold text-green-300">{stats.confirmed}</div>
              <div className="text-green-200 text-xs mt-1">Confirmados</div>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-5 border border-yellow-400/30 text-center">
              <div className="text-3xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-yellow-200 text-xs mt-1">Pendientes</div>
            </div>
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-400/30 text-center">
              <div className="text-3xl font-bold text-purple-300">{stats.confirmedPasses}/{stats.totalPasses}</div>
              <div className="text-purple-200 text-xs mt-1">Pases confirmados</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Actions Bar */}
      <section className="py-6 border-b border-neutral-200 bg-white sticky top-0 z-20">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
            >
              ➕ Agregar Invitado
            </Button>
            <button
              onClick={() => setShowBulkAdd(!showBulkAdd)}
              className="px-5 py-2.5 border-2 border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 hover:border-neutral-400 transition-colors"
            >
              📋 Carga Masiva
            </button>
            <div className="ml-auto text-sm text-neutral-500">
              {stats.total} invitado{stats.total !== 1 ? 's' : ''} registrado{stats.total !== 1 ? 's' : ''}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          {/* ─── Formulario Agregar/Editar ─── */}
          {showAddForm && (
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-display font-bold mb-4">
                {editingGuest ? '✏️ Editar Invitado' : '➕ Nuevo Invitado'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej: Familia García"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-purple-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="Ej: 5512345678"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Pases</label>
                  <select
                    value={formPasses}
                    onChange={(e) => setFormPasses(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-purple-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'pase' : 'pases'}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={editingGuest ? handleUpdateGuest : handleAddGuest}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    {editingGuest ? 'Actualizar' : 'Agregar'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Carga Masiva ─── */}
          {showBulkAdd && (
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-display font-bold mb-2">📋 Carga Masiva de Invitados</h3>
              <p className="text-sm text-neutral-500 mb-4">
                Un invitado por línea. Formato: <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs">Nombre, teléfono, pases</code>
              </p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
                placeholder={`Familia García, 5512345678, 4\nMaría López, 5587654321, 2\nJuan Pérez, , 1\nAna Rodríguez`}
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-blue-500 focus:outline-none font-mono text-sm resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleBulkAdd}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Agregar {bulkText.split('\n').filter(l => l.trim()).length} invitados
                </button>
                <button
                  onClick={() => setShowBulkAdd(false)}
                  className="px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* ─── Lista de invitados ─── */}
          {guests.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-2xl font-display font-bold mb-2">Sin invitados aún</h3>
              <p className="text-neutral-600 mb-6">
                Agrega invitados para generar links personalizados y rastrear confirmaciones
              </p>
              <Button variant="accent" onClick={() => setShowAddForm(true)}>
                Agregar Primer Invitado
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header de tabla (desktop) */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <div className="col-span-3">Nombre</div>
                <div className="col-span-2">Teléfono</div>
                <div className="col-span-1 text-center">Pases</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-4 text-right">Acciones</div>
              </div>

              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white border border-neutral-200 rounded-xl p-4 md:p-5 hover:border-neutral-300 hover:shadow-sm transition-all"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-neutral-900">{guest.name}</p>
                        {guest.phone && (
                          <p className="text-sm text-neutral-500">{guest.phone}</p>
                        )}
                      </div>
                      {statusBadge(guest.status as GuestStatus)}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">
                        🎟️ {guest.status === 'confirmed' ? guest.confirmed_passes : 0}/{guest.max_passes} pases
                      </span>
                      {guest.confirmed_at && (
                        <span className="text-xs text-neutral-400">
                          {new Date(guest.confirmed_at).toLocaleDateString('es-MX')}
                        </span>
                      )}
                    </div>

                    {guest.message && (
                      <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600 italic">
                        "{guest.message}"
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(getWhatsAppLink(guest), '_blank')}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                      >
                        📱 WhatsApp
                      </button>
                      <button
                        onClick={() => copyGuestLink(guest)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        🔗 Copiar
                      </button>
                      <button
                        onClick={() => openEdit(guest)}
                        className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="font-bold text-neutral-900">{guest.name}</p>
                      {guest.message && (
                        <p className="text-xs text-neutral-400 italic mt-0.5 truncate">"{guest.message}"</p>
                      )}
                    </div>
                    <div className="col-span-2 text-sm text-neutral-600">
                      {guest.phone || '—'}
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="font-bold">
                        {guest.status === 'confirmed' ? guest.confirmed_passes : 0}
                      </span>
                      <span className="text-neutral-400">/{guest.max_passes}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      {statusBadge(guest.status as GuestStatus)}
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(getWhatsAppLink(guest), '_blank')}
                        className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                      >
                        📱 WhatsApp
                      </button>
                      <button
                        onClick={() => copyGuestLink(guest)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        🔗 Link
                      </button>
                      <button
                        onClick={() => openEdit(guest)}
                        className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="px-3 py-1.5 text-red-500 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}