import { ContactRecord } from "@/types/contact";

/** Convierte una fila de Supabase (snake_case) al formato usado en el frontend (camelCase). */
export function mapContactRow(row: any): ContactRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    role: row.role,
    restaurantName: row.restaurant_name,
    city: row.city,
    phone: row.phone,
    email: row.email,
    instagram: row.instagram,
    branchesCount: row.branches_count,
    dailyOrders: row.daily_orders,
    employeesCount: row.employees_count,
    businessType: row.business_type,
    orderChannels: row.order_channels || [],
    currentSystem: row.current_system,
    problems: row.problems || [],
    mainProblem: row.main_problem,
    desiredFeatures: row.desired_features || [],
    urgency: row.urgency,
    bestContactTime: row.best_contact_time,
    contactPreference: row.contact_preference,
    extraComments: row.extra_comments,
    acceptsPrivacyPolicy: row.accepts_privacy_policy,
    source: row.source,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmTerm: row.utm_term,
    utmContent: row.utm_content,
    status: row.status,
    internalNotes: row.internal_notes,
    nextFollowUpDate: row.next_follow_up_date,
  };
}
