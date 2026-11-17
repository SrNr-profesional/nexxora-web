import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { IndustryProvider } from "@/components/industry/IndustryContext";
import IndustrySwitcher from "@/components/industry/IndustrySwitcher";
import Hero from "@/components/sections/Hero";
import Problems from "@/components/sections/Problems";
import SystemTransition from "@/components/sections/SystemTransition";
import Solutions from "@/components/sections/Solutions";
import VisionAI from "@/components/sections/VisionAI";
import HowItWorks from "@/components/sections/HowItWorks";
import Comparison from "@/components/sections/Comparison";
import Benefits from "@/components/sections/Benefits";
import Plans from "@/components/sections/Plans";
import DiagnosticForm from "@/components/form/DiagnosticForm";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <IndustryProvider>
      <Header />
      {/* pt-16 = alto del header fijo */}
      <main id="main-content" className="pt-16">
        {/*
          Bloque que depende del rubro. La barra de rubros es sticky dentro de
          este contenedor: acompaña desde el hero hasta los planes y se suelta
          al llegar al formulario.
        */}
        <div>
          <IndustrySwitcher />
          <Hero />
          <Problems />
          <SystemTransition />
          <Solutions />
          <VisionAI />
          <HowItWorks />
          <Comparison />
          <Benefits />
          <Plans />
        </div>
        <Suspense fallback={null}>
          <DiagnosticForm />
        </Suspense>
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </IndustryProvider>
  );
}
