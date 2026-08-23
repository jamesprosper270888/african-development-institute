/**
 * Server-to-server conversion postback into the PCM tracker
 * (prospectconnectmedia.com/api/postback). Matches the click that the
 * /r/<slug> redirect minted (`aff_sub` on the landing URL).
 *
 * Env: PCM_POSTBACK_KEY (POSTBACK_SECRET on the PCM side), PCM_OFFER_ID
 * (the offer networkOfferId, e.g. "adi-yana"), optional PCM_POSTBACK_URL.
 * Never throws.
 */
export async function postbackToPCM(input: {
  clickId?: string;
  txnId: string;
  payout: number; // currency units, not cents
  status?: "approved" | "pending";
}): Promise<boolean> {
  const key = process.env.PCM_POSTBACK_KEY;
  const offerId = process.env.PCM_OFFER_ID;
  if (!key || !offerId) {
    console.log(`[PCM] postback skipped (no key/offer): ${input.txnId}`);
    return false;
  }
  if (!input.clickId) {
    // Organic/untracked lead - PCM needs a click to attribute to.
    return false;
  }

  const base =
    process.env.PCM_POSTBACK_URL ||
    "https://prospectconnectmedia.com/api/postback";
  const url = new URL(base);
  url.searchParams.set("click_id", input.clickId);
  url.searchParams.set("txn_id", input.txnId);
  url.searchParams.set("payout", input.payout.toFixed(2));
  url.searchParams.set("status", input.status ?? "approved");
  url.searchParams.set("offer_id", offerId);
  url.searchParams.set("network", "direct");

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "X-Postback-Key": key },
    });
    if (!res.ok) {
      console.error("[PCM] postback failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[PCM] postback error:", error);
    return false;
  }
}
