/**
 * Generates the second wave of photographic creatives for the You Are Not
 * Alone campaign — same documentary language as C-only-photo, which took ~89%
 * of delivery and produced every lead the campaign has.
 *
 * Model: fal-ai/nano-banana-pro, 4:5, 2K (same price tier as 1K).
 * Cost: $0.15/image, 6 images = $0.90. Hard cap enforced below.
 *
 * Usage:
 *   FAL_KEY=... node scripts/gen-yana-photo-set.mjs [slug ...]
 *
 * Pass slugs to regenerate only those. Existing files are never overwritten.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const KEY = process.env.FAL_KEY;
if (!KEY) throw new Error("FAL_KEY not set");

const MODEL = "fal-ai/nano-banana-pro";
const PRICE_PER_IMAGE = 0.15;
const CAP_USD = 1.5;

// Shared tail — the tokens that make C read as documentary rather than stock.
const TAIL =
  "shallow depth of field, candid, real skin texture, natural imperfections, " +
  "no text, no logos, no watermark, no stock-photo gloss";

const SCENES = [
  {
    slug: "d-boardroom",
    headline: "The only one\nin the room.",
    prompt:
      "Documentary photograph, a Black British professional woman in her late 30s sitting at a long boardroom table in a modern London office, she is the only person in sharp focus, four colleagues around the table blurred and out of focus, she is mid-thought looking slightly away from the group, composed and self-contained; cool daylight through floor-to-ceiling windows mixed with warm overhead light, " +
      TAIL,
  },
  {
    slug: "e-car-before-work",
    headline: "Before you walk in,\nyou get ready.",
    prompt:
      "Documentary photograph, a Black British professional woman in her 40s sitting in the driver's seat of a parked car outside a glass office building early on a grey morning, both hands still resting on the steering wheel, gathering herself before going in, composed and a little tired; soft overcast daylight through the windscreen, faint reflections on the glass, " +
      TAIL,
  },
  {
    slug: "f-late-kitchen",
    headline: "Still working\nat 11pm.",
    prompt:
      "Documentary photograph, a Black British professional woman in her 30s alone at a kitchen table late at night in a British home, laptop still open beside her, a mug of tea gone cold, she has paused and is looking away from the screen, tired but composed; single warm lamp light, dark window behind her, lived-in kitchen, " +
      TAIL,
  },
  {
    slug: "g-corridor",
    headline: "You said nothing.\nAgain.",
    prompt:
      "Documentary photograph, a Black British professional woman in her 30s walking alone along an office corridor carrying a folder, seen from slightly behind and to the side, two colleagues laughing together blurred in the background behind her, her expression closed and composed; cool corridor light, " +
      TAIL,
  },
  {
    slug: "h-man-train",
    headline: "You Are\nNot Alone.",
    prompt:
      "Documentary photograph, a Black British professional man in his late 30s in a dark overcoat sitting alone on a quiet late-evening commuter train, looking out of the rain-streaked window, thoughtful, composed, a little tired; warm low interior light, blue evening city lights outside, no other people in focus, " +
      TAIL,
  },
  {
    slug: "i-the-room",
    headline: "One room where nobody\nneeds it explained.",
    sub: "Sat 26 September. Twenty Black professionals.\nOne day in Weybridge.",
    prompt:
      "Documentary photograph, eight Black British professionals in their 30s and 40s sitting in a loose circle in a warm hotel conference room, mid-conversation, two of them laughing, one leaning forward listening intently, notebooks and coffee cups on small round tables; warm natural window light, genuine expressions, " +
      TAIL,
  },
];

const wanted = process.argv.slice(2);
const todo = wanted.length ? SCENES.filter((s) => wanted.includes(s.slug)) : SCENES;

const estimate = todo.length * PRICE_PER_IMAGE;
if (estimate > CAP_USD) {
  throw new Error(`estimate $${estimate.toFixed(2)} exceeds cap $${CAP_USD.toFixed(2)}`);
}
console.log(`${todo.length} image(s), est. $${estimate.toFixed(2)} (cap $${CAP_USD.toFixed(2)})\n`);

const OUT = join(process.cwd(), "media-gen", "2026-09-07-yana-photo-set");
mkdirSync(OUT, { recursive: true });

const headers = { Authorization: `Key ${KEY}`, "Content-Type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(scene) {
  const dest = join(OUT, `${scene.slug}_raw.png`);
  if (existsSync(dest)) {
    console.log(`skip (exists) ${scene.slug}`);
    return { ...scene, file: dest, skipped: true };
  }

  const submit = await fetch(`https://queue.fal.run/${MODEL}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt: scene.prompt,
      aspect_ratio: "4:5",
      resolution: "2K",
      output_format: "png",
      num_images: 1,
    }),
  });
  if (!submit.ok) throw new Error(`${scene.slug} submit ${submit.status}: ${await submit.text()}`);
  const { status_url, response_url, request_id } = await submit.json();
  console.log(`queued  ${scene.slug} (${request_id})`);

  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const s = await fetch(status_url, { headers });
    const { status } = await s.json();
    if (status === "COMPLETED") break;
    if (status === "FAILED") throw new Error(`${scene.slug} FAILED`);
    if (i === 59) throw new Error(`${scene.slug} timed out`);
  }

  const out = await (await fetch(response_url, { headers })).json();
  const url = out.images?.[0]?.url;
  if (!url) throw new Error(`${scene.slug}: no image in response`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`done    ${scene.slug} -> ${(buf.length / 1e6).toFixed(1)} MB`);
  return { ...scene, file: dest };
}

const results = await Promise.allSettled(todo.map(generate));
const ok = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
const failed = results.filter((r) => r.status === "rejected");

const charged = ok.filter((r) => !r.skipped).length;
writeFileSync(
  join(OUT, "manifest.md"),
  [
    "# You Are Not Alone — photographic creatives, wave 2 (2026-09-07)",
    "",
    `Model: \`${MODEL}\` · aspect 4:5 · resolution 2K · $${PRICE_PER_IMAGE} per image`,
    `Generated: ${charged} · actual cost $${(charged * PRICE_PER_IMAGE).toFixed(2)}`,
    "",
    "Same documentary language as C-only-photo (the August winner): one Black",
    "professional in an ordinary, recognisable British moment, warm practical",
    "light, no stock gloss. Overlay + crops via `scripts/make-photo-creative.py`.",
    "",
    ...ok.flatMap((s) => [
      `## ${s.slug}`,
      "",
      `**Headline:** ${s.headline.replace(/\n/g, " / ")}`,
      "",
      `**Prompt:** ${s.prompt}`,
      "",
    ]),
  ].join("\n")
);

console.log(`\n${ok.length} ok, ${failed.length} failed`);
for (const f of failed) console.error("  " + f.reason.message);
console.log(`actual cost: $${(charged * PRICE_PER_IMAGE).toFixed(2)} (est $${estimate.toFixed(2)})`);
console.log(`output: ${OUT}`);
