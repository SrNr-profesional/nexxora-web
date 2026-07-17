import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Problems from "@/components/sections/Problems";
import SystemTransition from "@/components/sections/SystemTransition";
import RestaurantSolutionsSection from "@/components/sections/RestaurantSolutionsSection";
import HowItWorks from "@/components/sections/HowItWorks";
import Comparison from "@/components/sections/Comparison";
import Benefits from "@/components/sections/Benefits";
import DiagnosticForm from "@/components/form/DiagnosticForm";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Problems />
        <SystemTransition />
        <RestaurantSolutionsSection />
        <HowItWorks />
        <Comparison />
        <Benefits />
        <Suspense fallback={null}>
          <DiagnosticForm />
        </Suspense>
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
