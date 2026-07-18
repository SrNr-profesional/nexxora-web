import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: string[];
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(function SelectField(
  { label, error, required, options, placeholder = "Seleccioná una opción", className, id, ...props },
  ref
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-brand-cyan">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            "focus-ring w-full appearance-none rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white transition-colors",
            error ? "border-red-500/60" : "border-white/10 hover:border-white/20 focus:border-brand-blue",
            className
          )}
          aria-invalid={!!error}
          defaultValue=""
          {...props}
        >
          <option value="" disabled className="bg-base-900">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-base-900">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default SelectField;
