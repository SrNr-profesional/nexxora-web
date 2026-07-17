import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export function TextField({
  label,
  error,
  required,
  hint,
  className,
  id,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <input
        id={id}
        className={cn(
          "focus-ring w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors",
          error ? "border-red-500/60" : "border-white/10 hover:border-white/20 focus:border-brand-blue",
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
}

export function TextAreaField({
  label,
  error,
  required,
  hint,
  className,
  id,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        className={cn(
          "focus-ring w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors",
          error ? "border-red-500/60" : "border-white/10 hover:border-white/20 focus:border-brand-blue",
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
}
