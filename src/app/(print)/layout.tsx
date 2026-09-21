/**
 * Pages meant to be printed: no site header or footer, so what comes out of
 * the printer is only the thing itself.
 */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-adi-offwhite print:bg-white">{children}</main>;
}
