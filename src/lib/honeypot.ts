/**
 * Hidden field on the public enquiry forms. People never see it; bots that
 * fill in every input fill this one too, and the API then drops the
 * submission quietly (a bot told it failed just tries again).
 *
 * The name is meaningless on purpose. Browsers autofill fields called things
 * like "website" or "company", and a real person whose autofill reached a
 * hidden box would lose their enquiry without knowing.
 */
export const HONEYPOT_FIELD = "adi_hp";

export function honeypotFilled(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}
