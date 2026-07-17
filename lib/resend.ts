import "server-only";
import { Resend } from "resend";
import { DiagnosticSchema } from "./validations";
import { buildWhatsappLink, SITE } from "./constants";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY no configurada: los emails no se enviarán.");
    return null;
  }
  return new Resend(apiKey);
}

const FROM_ADDRESS = `${SITE.name} <notificaciones@resend.dev>`; // reemplazar por dominio verificado en Resend

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendAdminNotification(data: DiagnosticSchema) {
  const resend = getResendClient();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return;

  const waLink = buildWhatsappLink(
    `Hola ${data.fullName}, te contacto de ${SITE.name} por el diagnóstico de ${data.restaurantName}.`
  );

  const rows: [string, string][] = [
    ["Nombre del contacto", data.fullName],
    ["Cargo", data.role],
    ["Restaurante", data.restaurantName],
    ["Teléfono", data.phone],
    ["Email", data.email],
    ["Ciudad", data.city],
    ["Instagram", data.instagram || "-"],
    ["Cantidad de sucursales", data.branchesCount],
    ["Pedidos diarios", data.dailyOrders],
    ["Empleados", data.employeesCount],
    ["Tipo de negocio", data.businessType],
    ["Canales de pedidos", data.orderChannels.join(", ")],
    ["Sistema actual", data.currentSystem],
    ["Problemas seleccionados", data.problems.join(", ")],
    ["Principal problema", data.mainProblem],
    ["Funciones solicitadas", data.desiredFeatures.join(", ")],
    ["Urgencia", data.urgency],
    ["Preferencia de contacto", data.contactPreference],
    ["Mejor horario", data.bestContactTime],
    ["Comentarios", data.extraComments || "-"],
    ["Fecha de envío", new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })],
  ];

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
    <h2 style="color:#1d4ed8;">Nuevo diagnóstico: ${escapeHtml(data.restaurantName)}</h2>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #e2e8f0; font-weight:600; width:220px;">${escapeHtml(label)}</td>
          <td style="padding:8px; border-bottom:1px solid #e2e8f0;">${escapeHtml(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
    <p style="margin-top:24px;">
      <a href="${waLink}" style="background:#25D366; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">
        Contactar por WhatsApp
      </a>
    </p>
  </div>`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: adminEmail,
    subject: `Nuevo diagnóstico: ${data.restaurantName}`,
    html,
  });
}

export async function sendClientConfirmation(data: DiagnosticSchema) {
  const resend = getResendClient();
  if (!resend) return;

  const waLink = buildWhatsappLink(
    `Hola, completé el diagnóstico para ${data.restaurantName}. Nuestro principal problema es ${data.mainProblem}.`
  );

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
    <h2 style="color:#1d4ed8;">Recibimos el diagnóstico de tu restaurante</h2>
    <p>Hola, ${escapeHtml(data.fullName)}.</p>
    <p>Gracias por contarnos cómo funciona <strong>${escapeHtml(data.restaurantName)}</strong>.</p>
    <p>Recibimos correctamente la información. Vamos a analizar los problemas y las funciones que
      seleccionaste para recomendarte una solución adecuada.</p>
    <p>Podés continuar la conversación por WhatsApp desde el siguiente botón.</p>
    <p style="margin-top:24px;">
      <a href="${waLink}" style="background:#25D366; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">
        Continuar por WhatsApp
      </a>
    </p>
    <p style="margin-top:32px; font-size:12px; color:#64748b;">${SITE.name} — ${SITE.description}</p>
  </div>`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: data.email,
    subject: "Recibimos el diagnóstico de tu restaurante",
    html,
  });
}
