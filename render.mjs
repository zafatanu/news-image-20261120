// Development-only renderer: screenshots page.html with the local headless
// Chrome over file:// (no network) into entry.png at exactly 1024x1024.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";

const repo = dirname(fileURLToPath(import.meta.url));
const chrome = join(process.env.HOME, ".agent-browser/browsers/chrome-157.0.8103.78/chrome");
const raw = join(tmpdir(), "mf-news-render-raw.png");
const out = join(repo, "entry.png");

const shot = spawnSync(chrome, [
  "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1", "--window-size=1024,1024",
  "--no-first-run", "--no-default-browser-check", "--disable-extensions",
  "--disable-background-networking", "--disable-component-update",
  `--screenshot=${raw}`, "--virtual-time-budget=4000",
  `file://${join(repo, "page.html")}`,
], { stdio: ["ignore", "pipe", "pipe"], timeout: 120000 });

if (shot.status !== 0) {
  process.stderr.write(String(shot.stderr));
  console.error("chrome screenshot failed with status", shot.status);
  process.exit(1);
}

const LIMIT = 1048576;
let png = readFileSync(raw);

// PNG IHDR: width and height live at bytes 16..24, big-endian.
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  console.error(`bad dimensions ${width}x${height}, expected 1024x1024`);
  process.exit(1);
}

if (png.length > LIMIT) {
  // Flat-colour newspaper art quantises losslessly enough for the gate.
  const opt = spawnSync("python3", ["-c",
    "import sys;from PIL import Image;" +
    "im=Image.open(sys.argv[1]).convert('RGB');" +
    "im.quantize(colors=256,method=Image.MEDIANCUT).save(sys.argv[2],optimize=True)",
    raw, out], { stdio: ["ignore", "pipe", "pipe"], timeout: 120000 });
  if (opt.status !== 0) {
    process.stderr.write(String(opt.stderr));
    console.error("optimisation failed");
    process.exit(1);
  }
  png = readFileSync(out);
} else {
  writeFileSync(out, png);
}

const bytes = statSync(out).size;
if (bytes > LIMIT) {
  console.error(`entry.png still ${bytes} bytes, over the 1 MiB cap`);
  process.exit(1);
}
console.log("entry.png written:", bytes, "bytes,", width + "x" + height);
console.log("sha256:", createHash("sha256").update(png).digest("hex"));
