// Convierte filas de Supabase (snake_case) al formato usado en el frontend
// (camelCase), mismo patrón que lib/mapContact.ts.

import type {
  Activity,
  AppNotification,
  Company,
  FeatureRequest,
  Goal,
  ImplementationItem,
  LostReason,
  Person,
  Profile,
  Proposal,
  Task,
} from "./types";

export function mapProfileRow(row: any): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarColor: row.avatar_color,
    role: row.role,
    createdAt: row.created_at,
  };
}

export function mapCompanyRow(row: any): Company {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    legalName: row.legal_name,
    industry: row.industry,
    subcategory: row.subcategory,
    address: row.address,
    city: row.city,
    province: row.province,
    mapsUrl: row.maps_url,
    website: row.website,
    instagram: row.instagram,
    facebook: row.facebook,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    employeesEstimate: row.employees_estimate,
    branchesCount: row.branches_count,
    sizeEstimate: row.size_estimate,
    notes: row.notes,
    status: row.status,
    priority: row.priority,
    painPoints: row.pain_points || [],
    score: row.score,
    probability: row.probability,
    mrrPotential: Number(row.mrr_potential) || 0,
    mrrActual: Number(row.mrr_actual) || 0,
    setupFeeActual: Number(row.setup_fee_actual) || 0,
    nextActionType: row.next_action_type,
    nextActionDate: row.next_action_date,
    nextActionTime: row.next_action_time,
    nextActionComment: row.next_action_comment,
    nextActionAssignedTo: row.next_action_assigned_to,
    lostReasonId: row.lost_reason_id,
    lostComment: row.lost_comment,
    source: row.source,
    sourceContactId: row.source_contact_id,
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    clientSince: row.client_since,
    nextRenewalDate: row.next_renewal_date,
    archived: row.archived,
    isDemo: row.is_demo,
  };
}

export function mapPersonRow(row: any): Person {
  return {
    id: row.id,
    companyId: row.company_id,
    firstName: row.first_name,
    lastName: row.last_name,
    position: row.position,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    bestContactTime: row.best_contact_time,
    decisionLevel: row.decision_level,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
  };
}

export function mapActivityRow(row: any): Activity {
  return {
    id: row.id,
    companyId: row.company_id,
    type: row.type,
    content: row.content,
    metadata: row.metadata || {},
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapTaskRow(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    companyId: row.company_id,
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    priority: row.priority,
    dueDate: row.due_date,
    dueTime: row.due_time,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function mapProposalRow(row: any): Proposal {
  return {
    id: row.id,
    companyId: row.company_id,
    planName: row.plan_name,
    setupFee: Number(row.setup_fee) || 0,
    monthlyFee: Number(row.monthly_fee) || 0,
    currency: row.currency,
    services: row.services || [],
    sentDate: row.sent_date,
    expiryDate: row.expiry_date,
    assignedTo: row.assigned_to,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapGoalRow(row: any): Goal {
  return {
    id: row.id,
    profileId: row.profile_id,
    periodMonth: row.period_month,
    metric: row.metric,
    target: Number(row.target) || 0,
    createdAt: row.created_at,
  };
}

export function mapImplementationItemRow(row: any): ImplementationItem {
  return {
    id: row.id,
    companyId: row.company_id,
    label: row.label,
    done: row.done,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function mapFeatureRequestRow(row: any): FeatureRequest {
  return {
    id: row.id,
    companyId: row.company_id,
    feature: row.feature,
    createdAt: row.created_at,
  };
}

export function mapLostReasonRow(row: any): LostReason {
  return { id: row.id, label: row.label, sortOrder: row.sort_order };
}

export function mapNotificationRow(row: any): AppNotification {
  return {
    id: row.id,
    profileId: row.profile_id,
    type: row.type,
    content: row.content,
    relatedCompanyId: row.related_company_id,
    read: row.read,
    createdAt: row.created_at,
  };
}
