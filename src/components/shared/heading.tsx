import { cn } from "@/lib/utils";

type Level = "h1" | "h2" | "h3";

const styles: Record<Level, string> = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight",
  h2: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold tracking-tight",
};

export function Heading({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: Level;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-[family-name:var(--font-cormorant)]",
        styles[Tag],
        className
      )}
    >
      {children}
    </Tag>
  );
}
