import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Política de privacidad" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="py-32">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Política de privacidad</h1>
          <p className="mt-2 text-sm text-slate-500">Última actualización: {new Date().toLocaleDateString("es-AR")}</p>

          <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-slate-300">
            <p>
              En {SITE.name} valoramos tu privacidad. Este documento explica qué información recolectamos a
              través de nuestro sitio web, cómo la usamos y qué derechos tenés sobre tus datos. Este texto es
              una base general y debe ser revisado por un profesional legal antes de su uso definitivo.
            </p>

            <h2 className="text-lg font-semibold text-white">1. Información que recolectamos</h2>
            <p>
              Cuando completás el formulario de diagnóstico, recolectamos datos como nombre, cargo, nombre del
              restaurante, ciudad, teléfono, email, Instagram y respuestas relacionadas con la operación de tu
              negocio. También registramos la fecha de envío y, si corresponde, parámetros de origen (UTM) que
              nos permiten entender cómo llegaste a nuestro sitio.
            </p>

            <h2 className="text-lg font-semibold text-white">2. Uso de la información</h2>
            <p>
              Utilizamos esta información exclusivamente para analizar tu diagnóstico, contactarte y ofrecerte
              una propuesta adecuada a tu restaurante. No vendemos ni compartimos tus datos con terceros con
              fines comerciales ajenos a {SITE.name}.
            </p>

            <h2 className="text-lg font-semibold text-white">3. Almacenamiento y seguridad</h2>
            <p>
              Los datos se almacenan de forma segura en Supabase, con acceso restringido exclusivamente a
              nuestro equipo. Aplicamos buenas prácticas de seguridad para proteger tu información.
            </p>

            <h2 className="text-lg font-semibold text-white">4. Tus derechos</h2>
            <p>
              Podés solicitar en cualquier momento el acceso, la corrección o la eliminación de tus datos
              escribiéndonos a <a className="text-brand-cyan" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>

            <h2 className="text-lg font-semibold text-white">5. Contacto</h2>
            <p>
              Ante cualquier duda sobre esta política, podés contactarnos por WhatsApp o email desde la
              sección de contacto de nuestro sitio.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
