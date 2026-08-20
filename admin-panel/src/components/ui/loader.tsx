import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-spin h-5 w-5 border-2 border-t-transparent rounded-full",
        className
      )}
    />
  );
}
