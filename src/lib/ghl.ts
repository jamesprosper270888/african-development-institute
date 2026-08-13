const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";

function ghlHeaders() {
  return {
    Authorization: `Bearer ${GHL_API_TOKEN}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
}

// Fire-and-forget: contact creation in the CRM must never block or fail a
// form submission. The site database remains the source of truth.
export async function forwardToGHL(data: {
  name: string;
  email: string;
  source: string;
  roleOrg?: string;
  motivation?: string;
  message?: string;
}): Promise<void> {
  if (!GHL_API_TOKEN || !GHL_LOCATION_ID) return;

  try {
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        email: data.email,
        source: `website:${data.source}`,
        tags: ["website", data.source],
      }),
    });

    if (!res.ok) {
      console.error("[GHL] Upsert failed:", res.status, await res.text());
      return;
    }

    const detail = [
      data.message && `Message: ${data.message}`,
      data.motivation && `Motivation: ${data.motivation}`,
      data.roleOrg && `Role/Org: ${data.roleOrg}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (detail) {
      const { contact } = await res.json();
      if (contact?.id) {
        await fetch(`${GHL_API_BASE}/contacts/${contact.id}/notes`, {
          method: "POST",
          headers: ghlHeaders(),
          body: JSON.stringify({
            body: `[website:${data.source}]\n${detail}`,
          }),
        });
      }
    }
  } catch (error) {
    console.error("[GHL] API error:", error);
  }
}
