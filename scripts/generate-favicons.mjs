import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "public/images/logofinal.png";

// Source is 731×341. The house icon occupies roughly:
//   x: ~150 to ~580 (width ~430)
//   y: ~10 to ~195 (height ~185)
// We crop tightly to the house then square it.

await mkdir("app", { recursive: true });

// === Tight crop on the house icon ===
const iconCrop = await sharp(SOURCE)
  .extract({ left: 145, top: 8, width: 440, height: 195 })
  .toBuffer();

// Pad to square with white background (440×440 → square based on width)
const iconSquare = await sharp(iconCrop)
  .resize({
    width: 440,
    height: 440,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .toBuffer();

await sharp(iconSquare).resize(64, 64).png().toFile("app/icon.png");
console.log("✓ app/icon.png (64×64) — house icon only");

// === Apple touch icon: full logo padded to square ===
const fullSquare = await sharp(SOURCE)
  .resize({
    width: 731,
    height: 731,
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .toBuffer();

await sharp(fullSquare).resize(180, 180).png().toFile("app/apple-icon.png");
console.log("✓ app/apple-icon.png (180×180) — full logo");
