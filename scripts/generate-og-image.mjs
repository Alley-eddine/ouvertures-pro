import sharp from "sharp";

const SOURCE = "public/images/hero/realisation-baies-vitrees-terrasse-moderne.webp";
const W = 1200;
const H = 630;

// Generate a dark gradient overlay + brand text via SVG composite
const overlaySvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="darken" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.15)" />
      <stop offset="50%" stop-color="rgba(0,0,0,0.25)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.85)" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#darken)" />
  <text
    x="60"
    y="510"
    font-family="Geist, Arial, sans-serif"
    font-size="68"
    font-weight="700"
    fill="white"
    letter-spacing="-1"
  >Ouvertures Pro</text>
  <text
    x="60"
    y="555"
    font-family="Geist, Arial, sans-serif"
    font-size="28"
    font-weight="500"
    fill="rgba(255,255,255,0.85)"
  >Fenêtres, portes, volets et portails — Île-de-France</text>
  <text
    x="60"
    y="595"
    font-family="Geist, Arial, sans-serif"
    font-size="22"
    font-weight="400"
    fill="#60a5fa"
  >Pose &amp; rénovation · Devis sous 24h · Note 4,8/5 sur Google</text>
</svg>
`;

const base = await sharp(SOURCE)
  .rotate()
  .resize(W, H, { fit: "cover", position: "center" })
  .toBuffer();

await sharp(base)
  .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
  .jpeg({ quality: 88, progressive: true })
  .toFile("app/opengraph-image.jpg");
console.log("✓ app/opengraph-image.jpg (1200×630) regenerated");

await sharp(base)
  .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
  .jpeg({ quality: 88, progressive: true })
  .toFile("app/twitter-image.jpg");
console.log("✓ app/twitter-image.jpg (1200×630) regenerated");
