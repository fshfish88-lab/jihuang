from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
ICON_DIR = ROOT / "public" / "images" / "wiki"
OUTPUT = Path(__file__).with_name("2026-08-08-进阶图标抽查.png")
SLUGS = [
    "eyebrella", "dragonfly", "antlion", "moggles", "ancient-pseudoscience-station",
    "thulecite-crown", "ancient-guardian", "boat-patch", "mast", "boat-lantern",
    "salt-box", "lunar-island", "moon-moth", "crab-king", "malbatross",
    "twins-of-terror", "ancient-fuelweaver", "celestial-champion", "lunar-rift", "deadly-brightshade",
    "brightshade-armour", "brightshade-bomb", "shadow-rift", "sanctum", "waymark-compass",
    "ancient-guard-tower", "heat-gland", "ardent-axe", "pyretic-pickaxe", "thermal-balm",
]

CELL_W, CELL_H = 190, 174
COLS = 5
ROWS = (len(SLUGS) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CELL_W, ROWS * CELL_H), "#e8dec3")
draw = ImageDraw.Draw(sheet)
font_path = Path("C:/Windows/Fonts/arial.ttf")
font = ImageFont.truetype(str(font_path), 14) if font_path.exists() else ImageFont.load_default()

for index, slug in enumerate(SLUGS):
    x = (index % COLS) * CELL_W
    y = (index // COLS) * CELL_H
    draw.rounded_rectangle((x + 5, y + 5, x + CELL_W - 5, y + CELL_H - 5), 8, fill="#f7f0dd", outline="#4c463a", width=2)
    icon = Image.open(ICON_DIR / f"{slug}.png").convert("RGBA")
    icon.thumbnail((126, 126), Image.Resampling.LANCZOS)
    icon_x = x + (CELL_W - icon.width) // 2
    icon_y = y + 12 + (126 - icon.height) // 2
    sheet.paste(icon, (icon_x, icon_y), icon)
    bbox = draw.textbbox((0, 0), slug, font=font)
    draw.text((x + (CELL_W - (bbox[2] - bbox[0])) / 2, y + 146), slug, fill="#191713", font=font)

sheet.save(OUTPUT)
print(OUTPUT)
