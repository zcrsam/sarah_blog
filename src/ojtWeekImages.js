// Load every image under src/assets/weeks/week1 … week10 (Vite bundles as URLs).

const imageModules = import.meta.glob("./assets/weeks/**/*.{jpg,jpeg,png,gif,webp,heic,JPG,JPEG,PNG,GIF,WEBP,HEIC}", {
  eager: true,
  query: "?url",
  import: "default",
});

function weekIndexFromPath(path) {
  const m = path.match(/\/week(\d+)\//i);
  return m ? parseInt(m[1], 10) - 1 : -1;
}

function fileNameFromPath(path) {
  return path.split("/").pop() || path;
}

function buildWeekBuckets() {
  const buckets = Array.from({ length: 10 }, () => []);

  for (const [path, url] of Object.entries(imageModules)) {
    const idx = weekIndexFromPath(path);
    if (idx < 0 || idx > 9) continue;
    buckets[idx].push({
      src: url,
      name: fileNameFromPath(path),
    });
  }

  buckets.forEach((items) => {
    items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  });

  return buckets;
}

/** @type {{ src: string, name: string }[][]} */
export const OJT_WEEK_MEDIA = buildWeekBuckets();

/** Image-only URLs, one array per week */
export const OJT_WEEK_IMAGES = OJT_WEEK_MEDIA.map((items) => items.map((i) => i.src));