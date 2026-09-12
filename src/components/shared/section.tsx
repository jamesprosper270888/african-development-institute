import { cn } from "@/lib/utils";

// NOTE: `light` and `offwhite` are the SAME colour. --background and
// --color-adi-offwhite are both #FAF8F5, so alternating between them does
// nothing visually. `white` is the only one that actually breaks up the page.
const variants = {
  light: "bg-background text-foreground",
  dark: "bg-adi-black text-white",
  offwhite: "bg-adi-offwhite text-foreground",
  white: "bg-card text-foreground",
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
      className={cn("py-16 md:py-20", variants[variant], className)}
    >
      {children}
    </section>
  );
}
