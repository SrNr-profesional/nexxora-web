import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export const TextField = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(function TextField({ label, error, required, hint, className, id, ...props }, ref) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn(
          "focus-ring w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200",
          error ? "border-red-500/60" : "border-white/10 hover:border-white/20 focus:border-brand-blue focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextAreaField({ label, error, required, hint, className, id, ...props }, ref) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={4}
        className={cn(
          "focus-ring w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200",
          error ? "border-red-500/60" : "border-white/10 hover:border-white/20 focus:border-brand-blue focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});
