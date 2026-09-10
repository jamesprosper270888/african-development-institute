"""
Photographic ad creatives for the You Are Not Alone campaign.

Takes a generated photo and lays the ADI ad furniture over it — red kicker,
serif headline, subhead, details line, red/green bar — then writes the three
placements Meta needs (4:5 feed, 1:1 feed, 9:16 story/reels).

This is the overlay that produced C-only-photo in August; it was done ad-hoc
at the time and never committed, so the winning creative could not be
reproduced. It can now.

Usage:
  python scripts/make-photo-creative.py <photo.png> <out-dir> <slug> \
      "HEADLINE line one\\nline two" ["subhead line one\\nline two"]

Story safe area: Instagram overlays its own UI on the top ~14% and bottom
~20% of a 9:16 frame, so nothing but the colour bar goes below that line.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

RED, GREEN, OFF = "#C8102E", "#006B3F", "#FAF8F5"
FONTS = r"C:\Windows\Fonts"
SERIF_B = os.path.join(FONTS, "georgiab.ttf")
SANS = os.path.join(FONTS, "arial.ttf")
SANS_B = os.path.join(FONTS, "arialbd.ttf")

KICKER = "An ADI gathering for Black professionals"
# Details line. Override with YANA_FOOT when the offer changes (the early bird
# closes 13 Sep, and a creative that still says £24.99 after that is wrong).
FOOT = os.environ.get("YANA_FOOT", "Sat 26 Sep · Weybridge · 20 seats · Early bird £24.99")
DEFAULT_SUB = "One day to understand what's really happening,\nsay it out loud, and leave with a plan."
SIZES = {"p45": (1080, 1350), "sq": (1080, 1080), "story": (1080, 1920)}


def font(path, size):
    return ImageFont.truetype(path, size)


def fit(lines, font_path, size, max_w, floor):
    """Largest size <= `size` at which every line fits `max_w`."""
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    while size > floor:
        f = font(font_path, size)
        if max((probe.textlength(l, font=f) for l in lines), default=0) <= max_w:
            break
        size -= 2
    return size


def cover(im, w, h):
    """Scale-and-crop to exactly w x h, keeping the centre (biased to the top
    third, where faces usually sit)."""
    src_r, dst_r = im.width / im.height, w / h
    if src_r > dst_r:  # source too wide -> crop sides
        new_w = int(im.height * dst_r)
        left = (im.width - new_w) // 2
        im = im.crop((left, 0, left + new_w, im.height))
    else:  # source too tall -> crop top/bottom, biased to keep the top
        new_h = int(im.width / dst_r)
        top = int((im.height - new_h) * 0.35)
        im = im.crop((0, top, im.width, top + new_h))
    return im.resize((w, h), Image.LANCZOS)


def scrim(im, start, full, strength=0.78):
    """Dark gradient up from the bottom so the type always reads.

    Ramps from clear at `start` to `strength` at `full` (both 0-1 of height)
    and holds it below. `full` is the top of the text block, so the type never
    sits on a half-faded highlight — which is what a long ease does when the
    block starts high up a 9:16 frame.
    """
    w, h = im.size
    grad = Image.new("L", (1, h), 0)
    px = grad.load()
    y0, y1 = int(h * start), max(int(h * full), int(h * start) + 1)
    for y in range(y0, h):
        t = min(1.0, (y - y0) / (y1 - y0))
        px[0, y] = int(255 * strength * (t ** 1.2))
    mask = grad.resize((w, h))
    return Image.composite(Image.new("RGB", (w, h), (0, 0, 0)), im, mask)


def compose(photo, w, h, headline, sub):
    base = min(w, h)
    pad = int(base * 0.08)
    bar = int(h * 0.02)

    kick_size = int(base * 0.030)
    hook_size = int(base * 0.135)
    sub_size = int(base * 0.037)
    foot_size = int(base * 0.027)

    hook_lines = headline.split("\n")
    sub_lines = [l for l in sub.split("\n") if l]

    # Shrink type until the longest line fits the column. C's headline was two
    # short lines and fitted at full size; "One room where nobody needs it
    # explained." does not, and silently ran off the canvas before this.
    content_w = w - 2 * pad
    hook_size = fit(hook_lines, SERIF_B, hook_size, content_w, int(base * 0.055))
    sub_size = fit(sub_lines, SANS, sub_size, content_w, int(base * 0.026))
    foot_size = fit([FOOT], SANS_B, foot_size, content_w, int(base * 0.018))

    # Bottom of the text block: clear of the colour bar, and clear of
    # Instagram's UI strip on story placements.
    bottom_safe = bar + (int(h * 0.20) if h / w > 1.5 else pad)
    block_h = (
        kick_size * 2.2
        + len(hook_lines) * hook_size * 1.05
        + h * 0.03
        + len(sub_lines) * sub_size * 1.5
        + foot_size * 2.4
    )
    top = h - bottom_safe - block_h

    # Scrim starts just above the type, wherever the type ended up, so the
    # headline never lands on an un-darkened highlight.
    im = scrim(
        cover(photo.convert("RGB"), w, h),
        start=max(0.0, top / h - 0.24),
        full=top / h + 0.01,
    )
    d = ImageDraw.Draw(im)
    f_kick, f_hook = font(SANS_B, kick_size), font(SERIF_B, hook_size)
    f_sub, f_foot = font(SANS, sub_size), font(SANS_B, foot_size)

    y = top
    d.rectangle([0, h - bar, w // 2, h], fill=RED)
    d.rectangle([w // 2, h - bar, w, h], fill=GREEN)

    d.text((pad, y), KICKER.upper(), font=f_kick, fill=RED)
    y += kick_size * 2.2
    for line in hook_lines:
        d.text((pad, y), line, font=f_hook, fill=OFF)
        y += hook_size * 1.05
    y += h * 0.03
    for line in sub_lines:
        d.text((pad, y), line, font=f_sub, fill=(250, 248, 245))
        y += sub_size * 1.5
    y += foot_size * 0.6
    d.text((pad, y), FOOT, font=f_foot, fill=OFF)
    return im


def main():
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(1)
    src, out, slug, headline = sys.argv[1:5]
    sub = sys.argv[5] if len(sys.argv) > 5 else DEFAULT_SUB
    headline = headline.replace("\\n", "\n")
    sub = sub.replace("\\n", "\n")

    os.makedirs(out, exist_ok=True)
    photo = Image.open(src)
    for key, (w, h) in SIZES.items():
        path = os.path.join(out, f"{slug}_{key}_{w}x{h}.png")
        if os.path.exists(path):
            print("skip (exists)", path)
            continue
        compose(photo, w, h, headline, sub).save(path)
        print("wrote", path)


if __name__ == "__main__":
    main()
