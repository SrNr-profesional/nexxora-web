"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";
import { SITE, WHATSAPP_DEFAULT_LINK, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-base-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_DEFAULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="focus-ring flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:text-white"
              >
                <Mail className="h-4 w-4 text-brand-cyan" /> {SITE.email}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <h3 className="mb-4 text-sm font-semibold text-white">Navegación</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="focus-ring text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/politica-de-privacidad" className="focus-ring text-sm text-slate-400 transition-colors hover:text-white">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="/terminos-y-condiciones" className="focus-ring text-sm text-slate-400 transition-colors hover:text-white">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="/admin" className="focus-ring text-sm text-slate-500 transition-colors hover:text-slate-300">
                  Acceso interno
                </a>
              </li>
              <li className="text-xs leading-relaxed text-slate-500">
                Los resultados de la implementación pueden variar según cada restaurante.
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
          <p>Automatización y sistemas personalizados para restaurantes.</p>
        </div>
      </Container>
    </footer>
  );
}
