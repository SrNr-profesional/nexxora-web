"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import KanbanColumn from "@/components/admin/KanbanColumn";
import CompanyCard from "@/components/admin/CompanyCard";
import { SkeletonRows } from "@/components/admin/Skeleton";
import type { Activity, Company, CompanyStatus, Person, Profile } from "@/lib/crm/types";
import { PIPELINE_STAGES } from "@/lib/crm/constants";

export default function PipelinePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/companies?pageSize=500").then((r) => r.json()),
      fetch("/api/admin/profiles").then((r) => r.json()),
    ]).then(async ([companiesRes, profilesRes]) => {
      const list: Company[] = companiesRes.ok ? companiesRes.companies.filter((c: Company) => !c.archived) : [];
      setCompanies(list);
      if (profilesRes.ok) setProfiles(profilesRes.profiles);

      const results = await Promise.all(list.slice(0, 150).map((c) => fetch(`/api/admin/companies/${c.id}`).then((r) => r.json())));
      const acts: Activity[] = [];
      const ppl: Person[] = [];
      results.forEach((r) => {
        if (r.ok) {
          acts.push(...r.company.activities);
          ppl.push(...r.company.people);
        }
      });
      setActivities(acts);
      setPeople(ppl);
      setLoading(false);
    });
  }, []);

  const profileNameById = Object.fromEntries(profiles.map((p) => [p.id, p.fullName]));

  const byStatus = useMemo(() => {
    const map: Record<string, Company[]> = {};
    PIPELINE_STAGES.forEach((s) => (map[s.id] = []));
    companies.forEach((c) => map[c.status]?.push(c));
    return map;
  }, [companies]);

  const findStatusOf = (id: string): CompanyStatus | null => {
    if (PIPELINE_STAGES.some((s) => s.id === id)) return id as CompanyStatus;
    const company = companies.find((c) => c.id === id);
    return company?.status ?? null;
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = findStatusOf(String(over.id));
    if (!newStatus) return;

    const company = companies.find((c) => c.id === active.id);
    if (!company || company.status === newStatus) return;

    setCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, status: newStatus } : c)));

    await fetch(`/api/admin/companies/${company.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const activeCompany = activeId ? companies.find((c) => c.id === activeId) : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <SkeletonRows rows={5} />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-sm text-slate-500">Arrastrá las tarjetas entre columnas para mover el estado.</p>
      </div>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              label={stage.label}
              companies={byStatus[stage.id] || []}
              activities={activities}
              people={people}
              profileNameById={profileNameById}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCompany && (
            <CompanyCard company={activeCompany} activities={activities} people={people} profileNameById={profileNameById} dragging />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
