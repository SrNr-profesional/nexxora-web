"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus, Loader2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/admin/EmptyState";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Priority, Profile, Task, TaskStatus } from "@/lib/crm/types";
import { PRIORITY_ICON, TASK_STATUS_LABELS } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";
import { ListChecks } from "lucide-react";

const FILTERS = ["mias", "todas", "hoy", "atrasadas", "semana"] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_LABELS: Record<Filter, string> = {
  mias: "Mis tareas",
  todas: "Todas",
  hoy: "Hoy",
  atrasadas: "Atrasadas",
  semana: "Semana",
};

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("mias");
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    const [tasksRes, profilesRes, meRes] = await Promise.all([
      fetch("/api/admin/tasks").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
      fetch("/api/admin/me").then((r) => r.json()),
    ]);
    if (tasksRes.ok) setTasks(tasksRes.tasks.filter((t: Task) => t.status !== "cancelada"));
    if (profilesRes.ok) setProfiles(profilesRes.profiles);
    if (meRes.ok) setMe(meRes.profile);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const profileName = (id: string | null) => profiles.find((p) => p.id === id)?.fullName || "Sin asignar";

  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const filtered = tasks.filter((t) => {
    if (filter === "mias") return me && t.assignedTo === me.id;
    if (filter === "hoy") return t.dueDate === today;
    if (filter === "atrasadas") return t.dueDate && t.dueDate < today && t.status !== "completada";
    if (filter === "semana") return t.dueDate && t.dueDate >= today && t.dueDate <= weekEnd;
    return true;
  });

  const toggle = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "completada" ? "pendiente" : "completada";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    await fetch(`/api/admin/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tareas</h1>
          <p className="text-sm text-slate-500">{filtered.length} tarea(s)</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Nueva tarea
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === f ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400"
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRows rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={ListChecks} title="No hay tareas acá" description="Creá una nueva tarea o cambiá el filtro." />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-opacity",
                t.status === "completada" && "opacity-50"
              )}
            >
              <button onClick={() => toggle(t)} className="focus-ring mt-0.5 flex-shrink-0 text-slate-500 transition-colors hover:text-emerald-400">
                {t.status === "completada" ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium text-white", t.status === "completada" && "line-through")}>
                  {PRIORITY_ICON[t.priority]} {t.title}
                </p>
                {t.description && <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>}
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {t.dueDate && <span>{new Date(t.dueDate + "T00:00:00").toLocaleDateString("es-AR")}</span>}
                  <span>· {profileName(t.assignedTo)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewTaskModal open={modalOpen} onClose={() => setModalOpen(false)} profiles={profiles} me={me} onCreated={(t) => setTasks((prev) => [t, ...prev])} />
    </div>
  );
}

function NewTaskModal({
  open,
  onClose,
  profiles,
  me,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  profiles: Profile[];
  me: Profile | null;
  onCreated: (t: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState(me?.id || "");
  const [priority, setPriority] = useState<Priority>("B");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (me) setAssignedTo(me.id);
  }, [me]);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, assignedTo, priority, dueDate: dueDate || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      onCreated(data.task);
      setTitle("");
      setDueDate("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva tarea">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Título</label>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Asignar a</label>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white">
              {profiles.map((p) => (
                <option key={p.id} value={p.id} className="bg-base-900">{p.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Fecha</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Prioridad</label>
          <div className="flex gap-2">
            {(["A", "B", "C"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={cn("flex-1 rounded-lg border py-2 text-sm font-medium transition-colors", priority === p ? "border-brand-blue bg-brand-blue/15 text-white" : "border-white/10 text-slate-400")}
              >
                {PRIORITY_ICON[p]} {p}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear tarea"}
        </Button>
      </div>
    </Modal>
  );
}
