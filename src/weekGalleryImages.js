/**
 * Eager-loads raster images from src/assets/weeks/week1 … week10 for the OJT feed carousel.
 * HEIC/MOV and other non-web formats are excluded.
 */
const modules = import.meta.glob(
  "./assets/weeks/**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}",
  { eager: true, import: "default" }
);

function weekNumFromPath(p) {
  const m = p.match(/assets\/weeks\/week(\d+)\//i);
  return m ? parseInt(m[1], 10) : null;
}

const entries = Object.entries(modules).map(([path, url]) => ({
  path,
  url,
  weekNum: weekNumFromPath(path),
}));

/** @type {Record<string, string[]>} Keys: "01" … "10" */
export const WEEK_GALLERY_BY_ID = {};

for (const { path, url, weekNum } of entries) {
  if (weekNum == null || weekNum < 1 || weekNum > 10 || typeof url !== "string") continue;
  const id = String(weekNum).padStart(2, "0");
  if (!WEEK_GALLERY_BY_ID[id]) WEEK_GALLERY_BY_ID[id] = [];
  WEEK_GALLERY_BY_ID[id].push({ path, url });
}

for (const id of Object.keys(WEEK_GALLERY_BY_ID)) {
  WEEK_GALLERY_BY_ID[id].sort((a, b) =>
    a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: "base" })
  );
  WEEK_GALLERY_BY_ID[id] = WEEK_GALLERY_BY_ID[id].map((x) => x.url);
}
