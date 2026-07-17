import { cn } from "@/lib/utils";

export default function PhoneMockup({
  children,
  className,
  height = 480,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[280px]", className)}>
      <div className="relative rounded-[2.25rem] border-4 border-base-700 bg-base-900 p-2 shadow-card">
        <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-base-950" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-[1.75rem] bg-base-950" style={{ height }}>
          {children}
        </div>
      </div>
    </div>
  );
}
