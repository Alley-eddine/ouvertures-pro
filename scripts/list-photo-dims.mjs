import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const dirs = [
  "public/images/realisations/avant-apres",
  "public/images/realisations/portail-cloture",
];

const candidates = [];
for (const dir of dirs) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".webp"));
  for (const f of files) {
    const fp = path.join(dir, f).replace(/\\/g, "/");
    const meta = await sharp(fp).metadata();
    const size = (await stat(fp)).size;
    const ratio = meta.width / meta.height;
    candidates.push({
      f: fp,
      w: meta.width,
      h: meta.height,
      ratio: Number(ratio.toFixed(2)),
      kb: Math.round(size / 1024),
    });
  }
}

const landscapes = candidates
  .filter((c) => c.ratio >= 1.3)
  .sort((a, b) => b.w * b.h - a.w * a.h);

console.log(`Total candidates : ${candidates.length}`);
console.log(`Landscape (ratio >= 1.3) : ${landscapes.length}\n`);
console.log("=== TOP 12 PAYSAGE par résolution ===");
for (const c of landscapes.slice(0, 12)) {
  console.log(
    c.f.padEnd(58),
    `${c.w}x${c.h}`.padEnd(12),
    `ratio ${c.ratio}`.padEnd(12),
    `${c.kb}Ko`
  );
}

const filterApresOnly = landscapes.filter(
  (c) =>
    c.f.includes("/avant-apres/") &&
    /apres\.webp$/i.test(c.f)
);
const portail = landscapes.filter((c) => c.f.includes("/portail-cloture/"));

console.log(`\n=== APRES paysage (${filterApresOnly.length}) ===`);
for (const c of filterApresOnly) {
  console.log(c.f.padEnd(58), `${c.w}x${c.h}`, `ratio ${c.ratio}`, `${c.kb}Ko`);
}
console.log(`\n=== PORTAIL/CLOTURE paysage (${portail.length}) ===`);
for (const c of portail.slice(0, 10)) {
  console.log(c.f.padEnd(58), `${c.w}x${c.h}`, `ratio ${c.ratio}`, `${c.kb}Ko`);
}
