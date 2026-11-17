"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { TextField, TextAreaField } from "./FormField";
import SelectField from "./SelectField";
import { ChipMultiGroup, ChipSingleGroup } from "./ChipGroup";
import ProgressBar from "./ProgressBar";
import DiagnosticSummary from "./DiagnosticSummary";
import { useIndustry } from "@/components/industry/IndustryContext";
import { INDUSTRIES, type IndustryId } from "@/lib/industries";
import {
  diagnosticSchema,
  DiagnosticSchema,
  STEP_FIELDS,
  PROBLEM_OPTIONS,
  FEATURE_OPTIONS,
  URGENCY_OPTIONS,
  CONTACT_PREFERENCE_OPTIONS,
  BRANCHES_OPTIONS,
  EMPLOYEES_OPTIONS,
} from "@/lib/validations";

const TOTAL_STEPS = 5;
const UNSURE_OPTION = "No estoy seguro, necesito asesoramiento";
const INDUSTRY_LABELS = INDUSTRIES.map((i) => i.label);

export default function DiagnosticForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittedRef = useRef(false);
  const { industry, setIndustry } = useIndustry();
  const isGastro = industry.id === "gastronomia";

  // Opciones del formulario según el rubro elegido.
  const problemOptions = isGastro
    ? PROBLEM_OPTIONS
    : [...industry.problems.map((p) => p.title), "Falta de organización", "Control de varias sedes", "Otro"];
  const featureOptions = isGastro
    ? [
        ...FEATURE_OPTIONS.filter((f) => f !== UNSURE_OPTION),
        ...industry.services.filter((s) => s.tier === "vision").map((s) => s.title),
        UNSURE_OPTION,
      ]
    : [...industry.services.map((s) => s.title), UNSURE_OPTION];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DiagnosticSchema>({
    resolver: zodResolver(diagnosticSchema),
    mode: "onTouched",
    defaultValues: {
      orderChannels: [],
      problems: [],
      desiredFeatures: [],
      acceptsPrivacyPolicy: false as unknown as true,
      website: "",
    },
  });

  useEffect(() => {
    setValue("source", typeof window !== "undefined" ? window.location.pathname : "web");
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
    const map: Record<string, keyof DiagnosticSchema> = {
      utm_source: "utmSource",
      utm_medium: "utmMedium",
      utm_campaign: "utmCampaign",
      utm_term: "utmTerm",
      utm_content: "utmContent",
    };
    utmKeys.forEach((k) => {
      const v = searchParams?.get(k);
      if (v) setValue(map[k], v as any);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al cambiar de rubro cambian las opciones: se limpian las respuestas que dependen de él.
  const previousIndustry = useRef<IndustryId>(industry.id);
  useEffect(() => {
    if (previousIndustry.current === industry.id) return;
    previousIndustry.current = industry.id;
    setValue("businessType", "");
    setValue("dailyOrders", "");
    setValue("currentSystem", "");
    setValue("orderChannels", []);
    setValue("problems", []);
    setValue("desiredFeatures", []);
  }, [industry.id, setValue]);

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields as any, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (formData: DiagnosticSchema) => {
    if (submittedRef.current) return;
    // El rubro viaja dentro de "Tipo de negocio" para no requerir cambios en la base de datos.
    const data: DiagnosticSchema = isGastro
      ? formData
      : { ...formData, businessType: `${industry.label} · ${formData.businessType}` };
    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.error || "No pudimos enviar el diagnóstico. Intentá nuevamente.");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "nexxora_diagnostic_summary",
          JSON.stringify({
            restaurantName: data.restaurantName,
            mainProblem: data.mainProblem,
            desiredFeatures: data.desiredFeatures,
            contactPreference: data.contactPreference,
          })
        );
      }

      router.push("/gracias");
    } catch (err: any) {
      submittedRef.current = false;
      setSubmitError(err.message || "Ocurrió un error inesperado. Probá de nuevo en unos minutos.");
    } finally {
      setSubmitting(false);
    }
  };

  const values = watch();

  return (
    <section id="diagnostico" className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Diagnóstico gratuito"
          title={`Contanos cómo funciona ${industry.noun}`}
          description="Completá este diagnóstico. Analizaremos tus necesidades y te mostraremos qué partes de tu operación podrían automatizarse."
        />

        <div className="mx-auto mt-14 max-w-5xl">
        <DiagnosticSummary values={values} variant="collapsible" />
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[1.75rem] glass-strong p-6 shadow-card sm:p-10"
          noValidate
        >
          {/* honeypot antispam */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
            {...register("website")}
          />

          <ProgressBar step={step} total={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {step === 1 && (
                <>
                  <h3 className="text-lg font-bold text-white">Información del negocio</h3>
                  <ChipSingleGroup
                    label="Rubro"
                    required
                    options={INDUSTRY_LABELS}
                    value={industry.label}
                    onChange={(label) => {
                      const next = INDUSTRIES.find((i) => i.label === label);
                      if (next) setIndustry(next.id);
                    }}
                  />
                  <TextField
                    id="fullName"
                    label="Nombre y apellido"
                    required
                    placeholder="Ej: Martina Gómez"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                  <TextField
                    id="role"
                    label="Cargo o relación con el negocio"
                    required
                    placeholder="Ej: Dueña, encargado, gerente"
                    error={errors.role?.message}
                    {...register("role")}
                  />
                  <TextField
                    id="restaurantName"
                    label={industry.form.nameLabel}
                    required
                    placeholder={industry.form.namePlaceholder}
                    error={errors.restaurantName?.message}
                    {...register("restaurantName")}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      id="city"
                      label="Ciudad"
                      required
                      placeholder="Ej: Mendoza"
                      error={errors.city?.message}
                      {...register("city")}
                    />
                    <TextField
                      id="phone"
                      label="Número de teléfono"
                      required
                      type="tel"
                      placeholder="Ej: 261 555-1234"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      id="email"
                      label="Email"
                      required
                      type="email"
                      placeholder="Ej: nombre@empresa.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <TextField
                      id="instagram"
                      label="Instagram o sitio web"
                      placeholder="Ej: @minegocio"
                      error={errors.instagram?.message}
                      {...register("instagram")}
                    />
                  </div>
                  <ChipSingleGroup
                    label="Cantidad de sucursales o sedes"
                    required
                    options={BRANCHES_OPTIONS}
                    value={values.branchesCount}
                    onChange={(v) => setValue("branchesCount", v, { shouldValidate: true })}
                    error={errors.branchesCount?.message}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-lg font-bold text-white">Operación actual</h3>
                  <ChipSingleGroup
                    label={industry.form.volumeLabel}
                    required
                    options={industry.form.volumeOptions}
                    value={values.dailyOrders}
                    onChange={(v) => setValue("dailyOrders", v, { shouldValidate: true })}
                    error={errors.dailyOrders?.message}
                  />
                  <ChipSingleGroup
                    label="Cantidad de empleados"
                    required
                    options={EMPLOYEES_OPTIONS}
                    value={values.employeesCount}
                    onChange={(v) => setValue("employeesCount", v, { shouldValidate: true })}
                    error={errors.employeesCount?.message}
                  />
                  <SelectField
                    id="businessType"
                    label="Tipo de negocio"
                    required
                    key={industry.id}
                    options={industry.form.subtypes}
                    error={errors.businessType?.message}
                    {...register("businessType")}
                  />
                  <ChipMultiGroup
                    label={industry.form.channelsLabel}
                    required
                    options={industry.form.channels}
                    value={values.orderChannels || []}
                    onChange={(v) => setValue("orderChannels", v, { shouldValidate: true })}
                    error={errors.orderChannels?.message}
                  />
                  <ChipSingleGroup
                    label="¿Qué sistema utilizan actualmente?"
                    required
                    options={industry.form.currentSystems}
                    value={values.currentSystem}
                    onChange={(v) => setValue("currentSystem", v, { shouldValidate: true })}
                    error={errors.currentSystem?.message}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-lg font-bold text-white">Problemas actuales</h3>
                  <ChipMultiGroup
                    label="¿Qué problemas querés solucionar?"
                    required
                    options={problemOptions}
                    value={values.problems || []}
                    onChange={(v) => setValue("problems", v, { shouldValidate: true })}
                    error={errors.problems?.message}
                  />
                  <TextAreaField
                    id="mainProblem"
                    label="Contanos cuál es el principal problema que te gustaría resolver"
                    required
                    placeholder={industry.form.mainProblemPlaceholder}
                    error={errors.mainProblem?.message}
                    {...register("mainProblem")}
                  />
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="text-lg font-bold text-white">Funciones deseadas</h3>
                  <ChipMultiGroup
                    label="¿Qué funciones te interesaría incorporar?"
                    required
                    options={featureOptions}
                    value={values.desiredFeatures || []}
                    onChange={(v) => setValue("desiredFeatures", v, { shouldValidate: true })}
                    error={errors.desiredFeatures?.message}
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <h3 className="text-lg font-bold text-white">Prioridad y contacto</h3>
                  <ChipSingleGroup
                    label="¿Cuándo te gustaría implementar una solución?"
                    required
                    options={URGENCY_OPTIONS}
                    value={values.urgency}
                    onChange={(v) => setValue("urgency", v, { shouldValidate: true })}
                    error={errors.urgency?.message}
                  />
                  <TextField
                    id="bestContactTime"
                    label="Mejor horario para contactarte"
                    required
                    placeholder="Ej: Tardes de lunes a viernes"
                    error={errors.bestContactTime?.message}
                    {...register("bestContactTime")}
                  />
                  <ChipSingleGroup
                    label="Preferencia de contacto"
                    required
                    options={CONTACT_PREFERENCE_OPTIONS}
                    value={values.contactPreference}
                    onChange={(v) => setValue("contactPreference", v, { shouldValidate: true })}
                    error={errors.contactPreference?.message}
                  />
                  <TextAreaField
                    id="extraComments"
                    label="¿Hay algo más que deberíamos saber?"
                    placeholder="Opcional"
                    error={errors.extraComments?.message}
                    {...register("extraComments")}
                  />

                  <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <input
                      type="checkbox"
                      className="focus-ring mt-0.5 h-4 w-4 flex-shrink-0 rounded border-white/20 bg-white/5 text-brand-blue"
                      {...register("acceptsPrivacyPolicy")}
                    />
                    <span className="text-xs leading-relaxed text-slate-400">
                      Acepto la{" "}
                      <a href="/politica-de-privacidad" target="_blank" className="text-brand-cyan underline">
                        política de privacidad
                      </a>{" "}
                      y autorizo a Nexxora a contactarme para brindarme información sobre el sistema.
                    </span>
                  </label>
                  {errors.acceptsPrivacyPolicy && (
                    <p role="alert" className="text-xs font-medium text-red-400">
                      {errors.acceptsPrivacyPolicy.message}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={goBack} disabled={submitting}>
                <ArrowLeft className="h-4 w-4" /> Volver
              </Button>
            ) : (
              <span />
            )}

            {step < TOTAL_STEPS ? (
              <Button type="button" onClick={goNext}>
                Siguiente <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Enviar diagnóstico
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
        <DiagnosticSummary values={values} variant="aside" />
        </div>
        </div>
      </Container>
    </section>
  );
}
