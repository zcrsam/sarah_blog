/**
 * Eager-loads images and videos from src/assets/weeks/week1 … week10 for the OJT feed carousel.
 * HEIC is excluded (not a reliable web format). Slides are sorted by filename within each week.
 */
const imageModules = import.meta.glob(
  "./assets/weeks/**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}",
  { eager: true, import: "default" }
);
const videoModules = import.meta.glob(
  "./assets/weeks/**/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}",
  { eager: true, import: "default" }
);

function weekNumFromPath(p) {
  const m = p.match(/assets\/weeks\/week(\d+)\//i);
  return m ? parseInt(m[1], 10) : null;
}

/** @typedef {{ url: string, isVideo: boolean }} WeekMediaSlide */

/** @type {Record<string, WeekMediaSlide[]>} Keys: "01" … "10" */
export const WEEK_GALLERY_BY_ID = {};

const entries = [];

for (const [path, url] of Object.entries(imageModules)) {
  const weekNum = weekNumFromPath(path);
  if (weekNum == null || weekNum < 1 || weekNum > 10 || typeof url !== "string") continue;
  entries.push({ path, url, weekNum, isVideo: false });
}

for (const [path, url] of Object.entries(videoModules)) {
  const weekNum = weekNumFromPath(path);
  if (weekNum == null || weekNum < 1 || weekNum > 10 || typeof url !== "string") continue;
  entries.push({ path, url, weekNum, isVideo: true });
}

for (const { path, url, weekNum, isVideo } of entries) {
  const id = String(weekNum).padStart(2, "0");
  if (!WEEK_GALLERY_BY_ID[id]) WEEK_GALLERY_BY_ID[id] = [];
  WEEK_GALLERY_BY_ID[id].push({ path, url, isVideo });
}

for (const id of Object.keys(WEEK_GALLERY_BY_ID)) {
  WEEK_GALLERY_BY_ID[id].sort((a, b) =>
    a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: "base" })
  );
  WEEK_GALLERY_BY_ID[id] = WEEK_GALLERY_BY_ID[id].map(({ url, isVideo }) => ({ url, isVideo }));
}
