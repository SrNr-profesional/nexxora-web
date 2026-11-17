export const SITE = {
  name: "Nexxora",
  tagline: "Automatización, digitalización e IA con cámaras para empresas",
  description:
    "Nexxora analiza, optimiza y automatiza la operación de tu negocio: sistemas a medida, inteligencia artificial y visión con cámaras para gastronomía, logística, retail, industria, construcción, agro, salud y más.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nexxora.com.ar",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@nexxora.com.ar",
  whatsappNumber: "5492616584233",
};

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_LINK = buildWhatsappLink(
  "Hola, quiero conocer las soluciones de automatización de Nexxora."
);

export const WHATSAPP_THANKYOU_LINK = buildWhatsappLink(
  "Hola, completé el diagnóstico de mi negocio y quiero conocer la propuesta."
);

export const NAV_LINKS = [
  { label: "Problemas", href: "#problemas" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Visión IA", href: "#vision-ia" },
  { label: "Proceso", href: "#como-funciona" },
  { label: "Planes", href: "#planes" },
  { label: "Diagnóstico", href: "#diagnostico" },
];
