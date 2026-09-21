"use client";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center justify-center rounded-md bg-adi-red px-6 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90 print:hidden"
    >
      {label}
    </button>
  );
}
