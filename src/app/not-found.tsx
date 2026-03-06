import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-adi-offwhite px-6 text-center">
      <h1 className="font-[family-name:var(--font-cormorant)] text-6xl font-semibold text-adi-black">
        404
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-md bg-adi-red px-6 text-sm font-medium text-white transition-colors hover:bg-adi-red/90"
      >
        Return Home
      </Link>
    </div>
  );
}
