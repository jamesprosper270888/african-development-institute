import { cn } from "@/lib/utils";

const variants = {
  light: "bg-background text-foreground",
  dark: "bg-adi-black text-white",
  offwhite: "bg-adi-offwhite text-foreground",
} as const;

export function Section({
  children,
  variant = "light",
  className,
  id,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32", variants[variant], className)}
    >
      {children}
    </section>
  );
}
