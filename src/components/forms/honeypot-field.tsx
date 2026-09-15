import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * Off screen, skipped by Tab and hidden from screen readers, so no person
 * fills it in. See HONEYPOT_FIELD.
 *
 * Put it FIRST in the form. The forms use space-y, which in Tailwind 4 puts
 * margin under every child but the last, so as the last child it would push a
 * gap under the submit button.
 */
export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
