"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { NAV_LINKS, WHATSAPP_DEFAULT_LINK } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToForm = () => {
    setOpen(false);
    document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-base-950/85 shadow-[0_1px_0_0_rgba(34,211,238,0.15),0_12px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-white/[0.04] bg-base-950/40 backdrop-blur-md"
      }`}
    >
      <Container
        className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14 py-2.5" : "h-16 py-3.5"
        }`}
      >
        <a href="#inicio" aria-label="Nexxora - Inicio">
          <Logo />
        </a>

        <nav className="relative hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="border border-[#25D366]/25 bg-[#25D366]/[0.06] text-[#7fe3a8] hover:bg-[#25D366]/[0.12] hover:text-white"
            onClick={() => window.open(WHATSAPP_DEFAULT_LINK, "_blank")}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="primary" size="sm" onClick={scrollToForm}>
            Diagnóstico gratuito
          </Button>
        </div>

        <button
          className="focus-ring rounded-lg p-2 text-white lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-base-950/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`focus-ring rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      isActive ? "bg-white/5 text-white" : "text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="mt-3 flex flex-col gap-2.5">
                <Button
                  variant="ghost"
                  className="border border-[#25D366]/25 bg-[#25D366]/[0.06] text-[#7fe3a8] hover:bg-[#25D366]/[0.12] hover:text-white"
                  onClick={() => window.open(WHATSAPP_DEFAULT_LINK, "_blank")}
                >
                  <MessageCircle className="h-4 w-4" />
                  Hablar por WhatsApp
                </Button>
                <Button variant="primary" onClick={scrollToForm}>
                  Solicitar diagnóstico gratuito
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
