import { FocusedShell } from "@/components/checkout/focused-shell";

/**
 * Where people land after reserving or paying: same clean frame as checkout,
 * without "Secure checkout" (they are done paying, or never had to).
 */
export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <FocusedShell>{children}</FocusedShell>;
}
