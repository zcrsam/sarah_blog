import React, { useEffect, useState } from "react";

const normalizeMedia = (items) => {
  if (!items?.length) return [];
  return items.map((item) => (typeof item === "string" ? { type: "image", src: item } : item));
};

const MediaSlide = ({ item, fit = "cover", style = {}, videoProps = {} }) => {
  if (!item?.src) return null;
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "100%", objectFit: fit, display: "block", background: "#000", ...style }}
        {...videoProps}
      />
    );
  }
  return <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: fit, display: "block", ...style }} />;
};

const WeekMediaCarousel = ({ media }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allMedia = normalizeMedia(media);
  const total = allMedia.length;
  const current = allMedia[currentIdx];

  useEffect(() => {
    setCurrentIdx(0);
  }, [media]);

  if (total === 0) return null;

  const prev = (e) => { e.stopPropagation(); setCurrentIdx((i) => (i - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setCurrentIdx((i) => (i + 1) % total); };

  return (
    <>
      {lightboxOpen && current?.type !== "video" && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "none", border: "none", color: "#fff",
              fontSize: "28px", cursor: "pointer", lineHeight: 1, zIndex: 1,
            }}
          >✕</button>
          {total > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i - 1 + total) % total); }} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "28px", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer" }}>‹</button>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <MediaSlide item={current} fit="contain" style={{ maxWidth: "90vw", maxHeight: "90vh" }} />
          </div>
          {total > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentIdx((i) => (i + 1) % total); }} style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "28px", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer" }}>›</button>
          )}
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "'Georgia',serif", letterSpacing: "0.1em" }}>{currentIdx + 1} / {total}</div>
        </div>
      )}

      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "100%", height: "200px", overflow: "hidden", position: "relative",
            background: "rgba(0,0,0,0.04)",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            cursor: current?.type === "video" ? "default" : "zoom-in",
          }}
          onClick={() => { if (current?.type !== "video") setLightboxOpen(true); }}
        >
          <MediaSlide key={`main-${currentIdx}`} item={current} fit="cover" />
          {current?.type === "video" && (
            <div style={{ position: "absolute", top: "10px", left: "12px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "9px", fontFamily: "'Georgia', serif", padding: "3px 8px", borderRadius: "10px", letterSpacing: "0.12em", textTransform: "uppercase", zIndex: 2 }}>Video</div>
          )}
          {total > 1 && (
            <>
              <button type="button" onClick={prev} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", zIndex: 2 }}>‹</button>
              <button type="button" onClick={next} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", zIndex: 2 }}>›</button>
            </>
          )}
          {total > 1 && (
            <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px", zIndex: 2 }}>
              {allMedia.map((_, i) => (
                <div key={i} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }} style={{ width: i === currentIdx ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === currentIdx ? "#fff" : "rgba(255,255,255,0.55)", cursor: "pointer" }} />
              ))}
            </div>
          )}
          <div style={{ position: "absolute", top: "10px", right: "12px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "10px", fontFamily: "'Georgia', serif", padding: "3px 8px", borderRadius: "10px", zIndex: 2 }}>{currentIdx + 1} / {total}</div>
          {current?.type !== "video" && (
            <div style={{ position: "absolute", bottom: "10px", left: "12px", background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.7)", fontSize: "9px", fontFamily: "'Georgia', serif", padding: "2px 7px", borderRadius: "10px", zIndex: 2 }}>tap to expand</div>
          )}
        </div>
        {total > 1 && (
          <div style={{ display: "flex", gap: "2px", background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            {allMedia.map((item, i) => (
              <div key={i} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }} style={{ flex: 1, height: "36px", overflow: "hidden", cursor: "pointer", opacity: i === currentIdx ? 1 : 0.45, outline: i === currentIdx ? "2px solid #1a1a1a" : "2px solid transparent", outlineOffset: "-2px", position: "relative" }}>
                <MediaSlide item={item} fit="cover" videoProps={{ muted: true, playsInline: true }} />
                {item.type === "video" && (
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#fff", textShadow: "0 1px 3px #000", pointerEvents: "none" }}>▶</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WeekMediaCarousel;
