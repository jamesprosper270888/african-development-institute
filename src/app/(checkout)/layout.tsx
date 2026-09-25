import { FocusedShell } from "@/components/checkout/focused-shell";

/** The /pay pages: no site menu, nothing to click away to halfway through paying. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <FocusedShell secure>{children}</FocusedShell>;
}
