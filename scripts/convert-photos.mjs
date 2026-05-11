import sharp from "sharp";
import heicConvert from "heic-convert";
import { readdir, stat, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

async function loadInput(src) {
  const buf = await readFile(src);
  // HEIC/HEIF magic: bytes 4-11 contain "ftyp" + brand (heic/heix/hevc/mif1/msf1/heim/heis/...)
  const isHeic =
    buf.length > 12 &&
    buf.slice(4, 8).toString("ascii") === "ftyp" &&
    /^(heic|heix|hevc|hevx|mif1|msf1|heim|heis|hevm|hevs)/.test(
      buf.slice(8, 12).toString("ascii")
    );
  if (!isHeic) return src;
  const jpegBuf = await heicConvert({ buffer: buf, format: "JPEG", quality: 0.95 });
  return Buffer.from(jpegBuf);
}

const [, , srcDir, outDir] = process.argv;
if (!srcDir || !outDir) {
  console.error("Usage: node scripts/convert-photos.mjs <srcDir> <outDir>");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const exts = new Set([".jpg", ".jpeg", ".png", ".bmp"]);
const entries = await readdir(srcDir, { withFileTypes: true });
const files = entries
  .filter((e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort();

let totalIn = 0;
let totalOut = 0;
const failed = [];

for (const file of files) {
  const src = path.join(srcDir, file);
  const base = path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/-+/g, "-");
  const dst = path.join(outDir, `${base}.webp`);

  const before = (await stat(src)).size;
  try {
    const input = await loadInput(src);
    await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(dst);
    const after = (await stat(dst)).size;
    totalIn += before;
    totalOut += after;

    const pct = ((1 - after / before) * 100).toFixed(1);
    console.log(
      `${file.padEnd(40)} ${(before / 1024).toFixed(0).padStart(6)}Ko → ${(after / 1024).toFixed(0).padStart(5)}Ko  (-${pct}%)`
    );
  } catch (err) {
    failed.push({ file, reason: err.message.split("\n")[0] });
    console.log(`${file.padEnd(40)} ❌ ${err.message.split("\n")[0]}`);
  }
}

console.log("─".repeat(70));
console.log(
  `Total convertis (${files.length - failed.length}/${files.length}) : ${(totalIn / 1024 / 1024).toFixed(1)}Mo → ${(totalOut / 1024 / 1024).toFixed(1)}Mo  (-${((1 - totalOut / totalIn) * 100).toFixed(1)}%)`
);

if (failed.length > 0) {
  console.log(`\n⚠️  ${failed.length} fichier(s) échoués (probablement HEIC iPhone sous extension .jpg) :`);
  for (const f of failed) console.log(`  - ${f.file}`);
}
