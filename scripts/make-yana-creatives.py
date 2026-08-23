"""Typographic ad creatives + OG image for the You Are Not Alone event (ADI brand)."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

RED, GREEN, BLACK, OFF = "#C8102E", "#006B3F", "#1C1C1C", "#FAF8F5"
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FONTS = r"C:\Windows\Fonts"
SERIF_B = os.path.join(FONTS, "georgiab.ttf")
SANS = os.path.join(FONTS, "arial.ttf")
SANS_B = os.path.join(FONTS, "arialbd.ttf")

def font(path, size):
    return ImageFont.truetype(path, size)

def card(w, h, angle, hook, sub, foot):
    im = Image.new("RGB", (w, h), BLACK)
    d = ImageDraw.Draw(im)
    pad = int(min(w, h) * 0.08)
    bar = int(h * 0.02)
    d.rectangle([0, h - bar, w // 2, h], fill=RED)
    d.rectangle([w // 2, h - bar, w, h], fill=GREEN)

    base = min(w, h)
    landscape = w > h
    hook_size = int(base * (0.15 if landscape else 0.135))
    sub_size = int(base * (0.045 if landscape else 0.037))
    foot_size = int(base * (0.034 if landscape else 0.027))
    angle_size = int(base * (0.036 if landscape else 0.03))
    f_hook, f_sub, f_foot, f_angle = font(SERIF_B, hook_size), font(SANS, sub_size), font(SANS_B, foot_size), font(SANS_B, angle_size)

    hook_lines = hook.split("\n"); sub_lines = sub.split("\n")
    hook_h = len(hook_lines) * hook_size * 1.05
    sub_h = len(sub_lines) * sub_size * 1.5
    block = angle_size * 2.2 + hook_h + h * 0.03 + sub_h
    y = (h - block) / 2 - h * (0.06 if landscape else 0.03)

    d.text((pad, y), angle.upper(), font=f_angle, fill=RED)
    y += angle_size * 2.2
    for l in hook_lines:
        d.text((pad, y), l, font=f_hook, fill=OFF)
        y += hook_size * 1.05
    y += h * 0.03
    for l in sub_lines:
        d.text((pad, y), l, font=f_sub, fill=(250, 248, 245, 220))
        y += sub_size * 1.5

    d.text((pad, h - pad - foot_size), foot, font=f_foot, fill=OFF)
    brand = "African Development Institute"
    bw = d.textlength(brand, font=f_foot)
    if pad + d.textlength(foot, font=f_foot) + bw + 40 < w:
        d.text((w - pad - bw, h - pad - foot_size), brand, font=f_foot, fill=GREEN)
    else:
        d.text((pad, h - pad - foot_size * 2.6), brand, font=f_foot, fill=GREEN)
    return im

SIZES = {"sq": (1080, 1080), "p45": (1080, 1350), "story": (1080, 1920), "og": (1200, 630)}
FOOT = "Sat 26 Sep · Weybridge · 20 seats · Early bird £24.99"
VARIANTS = {
    "A-work": ("For Black professionals", "The only one\nin the room.", "You are not alone.\nOne day with people who get it."),
    "B-social": ("For Black professionals", "Tired of\nexplaining?", "You are not alone.\nA room where you don’t have to."),
    "C-main": ("An ADI gathering for Black professionals", "You Are\nNot Alone.", "One day to understand what’s really\nhappening, say it out loud, and leave\nwith a plan and a community."),
}
for name, (angle, hook, sub) in VARIANTS.items():
    for k, (w, h) in SIZES.items():
        if k == "og" and name != "C-main":
            continue
        im = card(w, h, angle, hook, sub, FOOT)
        ext = "jpg" if k == "og" else "png"
        path = os.path.join(OUT, f"{name}_{k}_{w}x{h}.{ext}")
        im.save(path, quality=92) if ext == "jpg" else im.save(path)
        print("wrote", path)
