"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail, Save, Loader2 } from "lucide-react";
import { ContactRecord, ContactStatus, CONTACT_STATUS_LABELS } from "@/types/contact";
import { buildWhatsappLink } from "@/lib/constants";
import Button from "@/components/ui/Button";

const STATUS_ORDER: ContactStatus[] = [
  "nuevo",
  "contactado",
  "reunion_agendada",
  "propuesta_enviada",
  "negociacion",
  "cliente_cerrado",
  "no_interesado",
];

export default function ContactDrawer({
  contact,
  onClose,
  onUpdated,
}: {
  contact: ContactRecord | null;
  onClose: () => void;
  onUpdated: (c: ContactRecord) => void;
}) {
  const [status, setStatus] = useState<ContactStatus>("nuevo");
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setStatus(contact.status);
      setNotes(contact.internalNotes || "");
      setFollowUp(contact.nextFollowUpDate || "");
    }
  }, [contact]);

  if (!contact) return null;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes, nextFollowUpDate: followUp || null }),
      });
      const result = await res.json();
      if (result.ok) onUpdated(result.contact);
    } finally {
      setSaving(false);
    }
  };

  const waLink = buildWhatsappLink(
    `Hola ${contact.fullName}, te contacto de Nexxora por el diagnóstico de ${contact.restaurantName}.`
  );

  const Row = ({ label, value }: { label: string; value?: string | string[] | null }) => {
    const display = Array.isArray(value) ? value.join(", ") : value;
    if (!display) return null;
    return (
      <div className="border-b border-white/10 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm text-slate-200">{display}</p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {contact && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-base-950 p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">Diagnóstico completo</p>
                <h2 className="text-xl font-bold text-white">{contact.restaurantName}</h2>
              </div>
              <button onClick={onClose} className="focus-ring rounded-lg p-1.5 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-2 rounded-full bg-[#25D366]/15 px-3.5 py-2 text-xs font-semibold text-[#25D366]"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="focus-ring flex items-center gap-2 rounded-full bg-brand-blue/15 px-3.5 py-2 text-xs font-semibold text-brand-cyan"
              >
                <Mail className="h-3.5 w-3.5" /> Enviar email
              </a>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Row label="Nombre" value={contact.fullName} />
              <Row label="Cargo" value={contact.role} />
              <Row label="Ciudad" value={contact.city} />
              <Row label="Teléfono" value={contact.phone} />
              <Row label="Email" value={contact.email} />
              <Row label="Instagram" value={contact.instagram} />
              <Row label="Sucursales" value={contact.branchesCount} />
              <Row label="Pedidos diarios" value={contact.dailyOrders} />
              <Row label="Empleados" value={contact.employeesCount} />
              <Row label="Tipo de negocio" value={contact.businessType} />
              <Row label="Canales de pedidos" value={contact.orderChannels} />
              <Row label="Sistema actual" value={contact.currentSystem} />
              <Row label="Problemas" value={contact.problems} />
              <Row label="Principal problema" value={contact.mainProblem} />
              <Row label="Funciones deseadas" value={contact.desiredFeatures} />
              <Row label="Urgencia" value={contact.urgency} />
              <Row label="Mejor horario" value={contact.bestContactTime} />
              <Row label="Preferencia de contacto" value={contact.contactPreference} />
              <Row label="Comentarios" value={contact.extraComments} />
              <Row label="Origen" value={contact.source} />
              <Row
                label="UTM"
                value={[contact.utmSource, contact.utmMedium, contact.utmCampaign].filter(Boolean).join(" / ") || undefined}
              />
              <Row label="Fecha de envío" value={new Date(contact.createdAt).toLocaleString("es-AR")} />
            </div>

            <div className="mt-6 space-y-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4">
              <h3 className="text-sm font-semibold text-white">Gestión comercial</h3>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContactStatus)}
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s} className="bg-base-900">
                      {CONTACT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Próximo seguimiento</label>
                <input
                  type="date"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Notas internas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                  placeholder="Notas sobre la conversación, próximos pasos, etc."
                />
              </div>

              <Button onClick={save} disabled={saving} className="w-full">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar cambios
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
