import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Términos y condiciones" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-32">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Términos y condiciones</h1>
          <p className="mt-2 text-sm text-slate-500">Última actualización: {new Date().toLocaleDateString("es-AR")}</p>

          <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-slate-300">
            <p>
              El uso de este sitio web implica la aceptación de los siguientes términos. Este texto es una
              base general y debe ser revisado por un profesional legal antes de su uso definitivo.
            </p>

            <h2 className="text-lg font-semibold text-white">1. Objeto del sitio</h2>
            <p>
              Este sitio tiene como finalidad presentar los servicios de automatización y digitalización de
              {" "}{SITE.name} para restaurantes, y permitir a los usuarios solicitar un diagnóstico gratuito de
              su negocio.
            </p>

            <h2 className="text-lg font-semibold text-white">2. Demostración interactiva</h2>
            <p>
              La demostración interactiva presentada en el sitio ("Distrito Burger") utiliza datos ficticios
              con fines exclusivamente ilustrativos y no representa un cliente real de {SITE.name}.
            </p>

            <h2 className="text-lg font-semibold text-white">3. Propiedad intelectual</h2>
            <p>
              El contenido, diseño y marca de {SITE.name} son propiedad de la empresa y no pueden ser
              reproducidos sin autorización previa.
            </p>

            <h2 className="text-lg font-semibold text-white">4. Limitación de responsabilidad</h2>
            <p>
              Los beneficios y resultados mencionados en el sitio son orientativos. Los resultados reales
              pueden variar según la operación y el nivel de implementación de cada restaurante.
            </p>

            <h2 className="text-lg font-semibold text-white">5. Contacto</h2>
            <p>
              Para consultas sobre estos términos, escribinos a{" "}
              <a className="text-brand-cyan" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
