// Convertit tous les webp de public/images/{galerie,services,team,hero,realisations/avant-apres}
// en JPG dans ~/Downloads/ouvertures-pro-google-business/.
// Google Business n'accepte que JPG et PNG, pas WebP.
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const SOURCES = [
  "public/images/galerie",
  "public/images/services",
  "public/images/team",
  "public/images/hero",
  "public/images/realisations/avant-apres",
  "public/images/realisations/portail-cloture",
];

const OUT_BASE = path.join(os.homedir(), "Downloads", "ouvertures-pro-google-business");

await mkdir(OUT_BASE, { recursive: true });

let total = 0;
let totalBytesIn = 0;
let totalBytesOut = 0;

for (const src of SOURCES) {
  const folderName = src.replace("public/images/", "").replace(/\//g, "-");
  const outDir = path.join(OUT_BASE, folderName);
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(src)).filter((f) => f.endsWith(".webp"));
  for (const f of files) {
    const inPath = path.join(src, f);
    const outName = path.basename(f, ".webp") + ".jpg";
    const outPath = path.join(outDir, outName);

    const sizeIn = (await stat(inPath)).size;
    await sharp(inPath)
      .jpeg({ quality: 92, progressive: true, mozjpeg: true })
      .toFile(outPath);
    const sizeOut = (await stat(outPath)).size;

    totalBytesIn += sizeIn;
    totalBytesOut += sizeOut;
    total++;
    console.log(`${folderName.padEnd(24)} ${outName.padEnd(50)} ${(sizeIn / 1024).toFixed(0)}Ko → ${(sizeOut / 1024).toFixed(0)}Ko`);
  }
}

console.log("─".repeat(80));
console.log(`Total : ${total} fichiers, ${(totalBytesIn / 1024 / 1024).toFixed(1)}Mo (webp) → ${(totalBytesOut / 1024 / 1024).toFixed(1)}Mo (jpg)`);
console.log(`\nFichiers JPG dans : ${OUT_BASE}`);
