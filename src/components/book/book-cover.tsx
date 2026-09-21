import { BOOK } from "@/lib/book-config";
import { cn } from "@/lib/utils";

/**
 * The mock-up cover, set in type rather than supplied as an image, so a new
 * title is a change in book-config, not a redesign. Every size is in container
 * units (cqw), so the same cover works as a thumbnail and as the hero.
 *
 * The mark: two parallel lines for the binary the Introduction describes, and a
 * third that leaves them. "It is not the middle point between two extremes. It
 * is a different quality of seeing."
 */
export function BookCover({
  className,
  tilt = false,
}: {
  className?: string;
  tilt?: boolean;
}) {
  return (
    <div className={cn(tilt && "[perspective:1400px]", className)}>
      <div
        role="img"
        aria-label={`Cover of ${BOOK.title} by ${BOOK.authors.join(" and ")}`}
        style={{ containerType: "inline-size" }}
        className={cn(
          "relative aspect-[2/3] w-full overflow-hidden rounded-[3px] bg-adi-black text-adi-offwhite shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]",
          tilt && "[transform-origin:left_center] [transform:rotateY(-12deg)]"
        )}
      >
        {/* Spine: a little light and shade on the left edge sells the object. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[5cqw] bg-gradient-to-r from-black/60 via-white/10 to-transparent"
        />
        <div aria-hidden className="absolute inset-[5cqw] border border-white/15" />

        <div
          aria-hidden
          className="absolute inset-[5cqw] flex flex-col items-center px-[6cqw] pt-[9cqw] pb-[8cqw] text-center"
        >
          <p className="text-[3cqw] font-medium uppercase tracking-[0.3em] text-white/55">
            {BOOK.publisher}
          </p>

          <svg viewBox="0 0 200 90" className="mt-[15cqw] w-[56cqw]" fill="none">
            <line x1="0" y1="32" x2="200" y2="32" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
            <line x1="0" y1="68" x2="200" y2="68" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
            <path
              d="M0 50 C 80 50, 125 47, 200 6"
              stroke="#C8102E"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>

          <p className="mt-[11cqw] font-[family-name:var(--font-cormorant)] text-[13.5cqw] font-semibold leading-[0.95] text-balance">
            {BOOK.title}
          </p>
          <p className="mt-[4cqw] font-[family-name:var(--font-cormorant)] text-[5.4cqw] italic leading-snug text-white/70">
            {BOOK.subtitle}
          </p>

          <div className="mt-auto flex flex-col items-center">
            <span className="mb-[4cqw] h-px w-[12cqw] bg-adi-red" />
            <p className="text-[3.4cqw] font-medium uppercase tracking-[0.2em] text-white/80">
              {BOOK.authors.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
