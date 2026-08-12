from math import ceil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "public" / "images" / "wiki"
OUTPUT = ROOT / "过程文件" / "验证报告" / "2026-08-13-制作道具料理图标抽查.png"

ITEMS = [
    ("发光浆果", "glow-berry"),
    ("注能月亮碎片", "infused-moon-shard"),
    ("纯粹恐惧", "pure-horror"),
    ("暗影碎布", "dark-tatters"),
    ("黄色羽毛", "saffron-feather"),
    ("攻击吹箭", "blow-dart"),
    ("催眠吹箭", "sleep-dart"),
    ("火焰吹箭", "fire-dart"),
    ("电击吹箭", "electric-dart"),
    ("刷子", "brush"),
    ("牛鞍", "saddle"),
    ("战争牛鞍", "war-saddle"),
    ("薄纱牛鞍", "glossamer-saddle"),
    ("鞍具脱卸器", "saddlehorn"),
    ("活鳗鱼", "eel"),
    ("龙虾", "wobster"),
    ("龙虾正餐", "lobster-dinner"),
    ("龙虾汤", "lobster-bisque"),
    ("伏特羊肉冻", "volt-goat-chaud-froid"),
    ("水果圣代", "fruit-medley"),
]

COLS = 5
ROWS = ceil(len(ITEMS) / COLS)
CELL_W = 280
CELL_H = 250
MARGIN = 28
HEADER_H = 90
BACKGROUND = "#e3d8b6"
CARD = "#cbbf9b"
INK = "#171714"
ACCENT = "#7b271d"


def font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\msyh.ttc"),
        Path(r"C:\Windows\Fonts\simhei.ttf"),
        Path(r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def fit_icon(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as source:
        icon = source.convert("RGBA")
    icon.thumbnail(size, Image.Resampling.LANCZOS)
    return icon


def main() -> None:
    missing = [slug for _, slug in ITEMS if not (ICON_DIR / f"{slug}.png").exists()]
    if missing:
        raise FileNotFoundError(f"Missing contact-sheet icons: {', '.join(missing)}")

    width = MARGIN * 2 + COLS * CELL_W
    height = MARGIN * 2 + HEADER_H + ROWS * CELL_H
    sheet = Image.new("RGB", (width, height), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    title_font = font(32)
    name_font = font(23)
    slug_font = font(17)

    draw.text((MARGIN, MARGIN), "制作道具与料理图标高风险抽查 · 2026-08-13", fill=INK, font=title_font)
    draw.line((MARGIN, MARGIN + 52, width - MARGIN, MARGIN + 52), fill=ACCENT, width=4)

    for index, (title, slug) in enumerate(ITEMS):
        col = index % COLS
        row = index // COLS
        left = MARGIN + col * CELL_W
        top = MARGIN + HEADER_H + row * CELL_H
        right = left + CELL_W - 12
        bottom = top + CELL_H - 12
        draw.rectangle((left, top, right, bottom), fill=CARD, outline=INK, width=2)

        icon = fit_icon(ICON_DIR / f"{slug}.png", (150, 150))
        icon_x = left + (CELL_W - 12 - icon.width) // 2
        icon_y = top + 8 + (154 - icon.height) // 2
        sheet.paste(icon, (icon_x, icon_y), icon)

        title_box = draw.textbbox((0, 0), title, font=name_font)
        title_x = left + (CELL_W - 12 - (title_box[2] - title_box[0])) // 2
        draw.text((title_x, top + 166), title, fill=INK, font=name_font)

        slug_box = draw.textbbox((0, 0), slug, font=slug_font)
        slug_x = left + (CELL_W - 12 - (slug_box[2] - slug_box[0])) // 2
        draw.text((slug_x, top + 207), slug, fill=ACCENT, font=slug_font)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, format="PNG", optimize=True)
    print(f"Generated {OUTPUT} ({width}x{height}, {len(ITEMS)} icons)")


if __name__ == "__main__":
    main()
