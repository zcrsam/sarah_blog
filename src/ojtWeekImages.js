// Load every image/video under src/assets/weeks/week1 … week10 (Vite bundles as URLs).

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic)$/i;
const VIDEO_EXT = /\.(mov|mp4|webm|m4v)$/i;

const imageModules = import.meta.glob("./assets/weeks/**/*.{jpg,jpeg,png,gif,webp,heic,JPG,JPEG,PNG,GIF,WEBP,HEIC}", {
  eager: true,
  query: "?url",
  import: "default",
});

const videoModules = import.meta.glob("./assets/weeks/**/*.{mov,mp4,webm,m4v,MOV,MP4,WEBM,M4V}", {
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

  const add = (path, url, type) => {
    const idx = weekIndexFromPath(path);
    if (idx < 0 || idx > 9) return;
    buckets[idx].push({
      type,
      src: url,
      name: fileNameFromPath(path),
    });
  };

  for (const [path, url] of Object.entries(imageModules)) {
    if (IMAGE_EXT.test(path)) add(path, url, "image");
  }
  for (const [path, url] of Object.entries(videoModules)) {
    if (VIDEO_EXT.test(path)) add(path, url, "video");
  }

  buckets.forEach((items) => {
    items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  });

  return buckets;
}

/** @type {{ type: 'image' | 'video', src: string, name: string }[][]} */
export const OJT_WEEK_MEDIA = buildWeekBuckets();

/** @deprecated Use OJT_WEEK_MEDIA — image-only URLs for older call sites */
export const OJT_WEEK_IMAGES = OJT_WEEK_MEDIA.map((items) =>
  items.filter((i) => i.type === "image").map((i) => i.src)
);
