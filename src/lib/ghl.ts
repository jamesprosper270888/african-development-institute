const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;

export async function forwardToGHL(data: {
  name: string;
  email: string;
  source: string;
  roleOrg?: string;
  motivation?: string;
  message?: string;
}): Promise<void> {
  if (!GHL_WEBHOOK_URL) return;

  try {
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        source: data.source,
        role_org: data.roleOrg || "",
        motivation: data.motivation || "",
        message: data.message || "",
      }),
    });
  } catch (error) {
    console.error("[GHL] Webhook error:", error);
  }
}
