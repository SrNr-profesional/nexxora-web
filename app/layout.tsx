import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Automatización y digitalización de restaurantes`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "automatización de restaurantes",
    "digitalización gastronómica",
    "menú digital QR",
    "pantalla de cocina",
    "software para restaurantes",
    "sistema de pedidos online",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Automatización y digitalización de restaurantes`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Automatización y digitalización de restaurantes`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
