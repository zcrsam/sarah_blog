import { useState, useEffect, useRef } from "react";

// ── SCENES ────────────────────────────────────────────────────────────────────
const hallwayPanels = [
  {
    id: "orientation",
    roomLabel: "ORIENTATION",
    detail: "Week 1 · Day 1",
    description: "First day jitters. A new badge, a new desk, and a hundred things I didn't know yet.",
    hasArtwork: true,
    artworkText: "Hello\nWorld",
  },
  {
    id: "about",
    roomLabel: "ABOUT ME",
    detail: "Background",
    description: "CS Student, 4th Year. I walked in as a student. I'd walk out as something more.",
    skills: ["React", "Node.js", "TypeScript", "CSS3"],
  },
  {
    id: "gallery",
    roomLabel: "THE GALLERY",
    detail: "Weeks 2–4",
    description: "Projects lined the walls. Each one a small victory, a lesson learned, a bug finally squashed.",
    hasArtwork: true,
    artworkText: "✦",
  },
  {
    id: "milestone",
    roomLabel: "MILESTONE",
    detail: "Week 5",
    description: "73% done. The codebase started making sense. I stopped copy-pasting Stack Overflow blindly.",
    percent: 73,
  },
  {
    id: "final",
    roomLabel: "GRADUATION",
    detail: "500 Hours",
    description: "500 hours. Countless bugs. Real friendships. Actual growth. OJT Complete.",
    isFinal: true,
  },
];

// ── PAPER TEXTURE ─────────────────────────────────────────────────────────────
const PaperTexture = () => (
  <svg
    style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", opacity: 0.045, zIndex: 0,
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ── ANALOG CLOCK ──────────────────────────────────────────────────────────────
function AnalogClock({ onClick }) {
  const [time, setTime] = useState(new Date());
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours() % 12;
  const sDeg = s * 6;
  const mDeg = m * 6 + s * 0.1;
  const hDeg = h * 30 + m * 0.5;

  const hand = (deg, len, width, color = "#2a2a2a") => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return (
      <line
        x1="50" y1="50"
        x2={50 + len * Math.cos(rad)}
        y2={50 + len * Math.sin(rad)}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s, filter 0.2s",
        transform: hovered ? "scale(1.12) rotate(-3deg)" : "scale(1)",
        filter: hovered ? "drop-shadow(0 4px 14px rgba(42,42,42,0.35))" : "none",
      }}
      title="Go to main page"
    >
      <svg width="80" height="80" viewBox="0 0 100 100">
        {/* Outer ring */}
        <circle cx="50" cy="50" r="46" fill="#f5f0e8" stroke="#2a2a2a" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#c0b8a8" strokeWidth="0.8" strokeDasharray="3,5" />
        {/* Hour ticks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 34 : 37;
          return (
            <line
              key={i}
              x1={50 + r1 * Math.cos(a)} y1={50 + r1 * Math.sin(a)}
              x2={50 + 40 * Math.cos(a)} y2={50 + 40 * Math.sin(a)}
              stroke="#2a2a2a" strokeWidth={i % 3 === 0 ? 2 : 1} strokeLinecap="round"
            />
          );
        })}
        {hand(hDeg, 24, 2.5)}
        {hand(mDeg, 32, 2)}
        {hand(sDeg, 36, 1, "#c0392b")}
        <circle cx="50" cy="50" r="3" fill="#2a2a2a" />
        {hovered && (
          <text x="50" y="72" textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "'Caveat', cursive", fill: "#666" }}>
            → home
          </text>
        )}
      </svg>
    </div>
  );
}

// ── LOADING SCENE ─────────────────────────────────────────────────────────────
const LoadingScene = ({ progress }) => (
  <div style={{
    position: "fixed", inset: 0, background: "#f0ece4",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    fontFamily: "'Caveat', cursive", zIndex: 100,
  }}>
    <PaperTexture />
    <svg width="200" height="300" viewBox="0 0 200 300" style={{ marginBottom: 20 }}>
      <polyline
        points={`100,10 90,60 110,110 95,160 105,${160 + progress}`}
        fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="105" cy={165 + progress} r="28" fill="none" stroke="#2a2a2a"
        strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="105" y={170 + progress} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 18, fontFamily: "'Caveat', cursive", fontWeight: 700, fill: "#2a2a2a" }}>
        {progress}%
      </text>
    </svg>
    <p style={{ fontSize: 14, color: "#666", letterSpacing: 3, textTransform: "uppercase", fontFamily: "serif" }}>
      Loading your journey...
    </p>
  </div>
);

// ── ENTRANCE SCENE ────────────────────────────────────────────────────────────
const EntranceScene = ({ onEnter, onGoHome, profileImage }) => {
  const [doorHovered, setDoorHovered] = useState(false);
  const [windowHovered, setWindowHovered] = useState(false);

  const doorColors = {
    left: doorHovered ? "#6b8cba" : "#eceae4",
    right: doorHovered ? "#7a9cc9" : "#eceae4",
    glow: doorHovered ? "drop-shadow(0 0 18px rgba(107,140,186,0.7))" : "none",
    sticker1: doorHovered ? "#f0c040" : "#f0c040",
    sticker2: doorHovered ? "#4db6e8" : "#4db6e8",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#ece8e0",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <PaperTexture />

      {/* Clock — top right */}
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 50 }}>
        <AnalogClock onClick={onGoHome} />
        <p style={{
          textAlign: "center", fontFamily: "serif", fontSize: 9,
          color: "#999", letterSpacing: 2, marginTop: 4,
        }}>CLICK TO GO HOME</p>
      </div>

      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Brick wall */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => {
            const offset = row % 2 === 0 ? 0 : 36;
            const x = col * 72 + offset - 36;
            const y = row * 46 + 20;
            return (
              <rect key={`${row}-${col}`} x={x} y={y} width="70" height="43"
                fill="none" stroke="#c0b8a8" strokeWidth="0.8" rx="1" />
            );
          })
        )}

        {/* Tree */}
        <ellipse cx="150" cy="220" rx="80" ry="90" fill="none" stroke="#2a2a2a" strokeWidth="1" />
        <line x1="150" y1="310" x2="150" y2="560" stroke="#2a2a2a" strokeWidth="5" strokeLinecap="round" />
        <line x1="150" y1="420" x2="80" y2="370" stroke="#2a2a2a" strokeWidth="3" />
        <line x1="150" y1="440" x2="230" y2="400" stroke="#2a2a2a" strokeWidth="3" />

        {/* Swing */}
        <line x1="120" y1="310" x2="120" y2="390" stroke="#2a2a2a" strokeWidth="1" />
        <line x1="160" y1="310" x2="160" y2="390" stroke="#2a2a2a" strokeWidth="1" />
        <rect x="100" y="388" width="80" height="12" fill="none" stroke="#2a2a2a" strokeWidth="1.5" rx="2" />

        {/* Cat */}
        <ellipse cx="190" cy="510" rx="18" ry="12" fill="none" stroke="#2a2a2a" strokeWidth="1.2" />
        <circle cx="190" cy="495" r="11" fill="none" stroke="#2a2a2a" strokeWidth="1.2" />
        <polyline points="183,487 180,480" stroke="#2a2a2a" strokeWidth="1" />
        <polyline points="197,487 200,480" stroke="#2a2a2a" strokeWidth="1" />
        <line x1="208" y1="510" x2="228" y2="505" stroke="#2a2a2a" strokeWidth="1.2" />

        {/* OJT JOURNEY sign */}
        <rect x="380" y="200" width="240" height="55" fill="none" stroke="#2a2a2a" strokeWidth="2" rx="4" />
        <text x="500" y="233" textAnchor="middle"
          style={{ fontFamily: "'Special Elite', monospace", fontSize: 26, fill: "#2a2a2a", fontWeight: 700, letterSpacing: 3 }}>
          OJT JOURNEY
        </text>
        <line x1="450" y1="200" x2="445" y2="175" stroke="#2a2a2a" strokeWidth="1.5" />
        <line x1="550" y1="200" x2="555" y2="175" stroke="#2a2a2a" strokeWidth="1.5" />

        {/* WINDOW — right side, hoverable */}
        <g
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setWindowHovered(true)}
          onMouseLeave={() => setWindowHovered(false)}
        >
          {/* Window frame */}
          <rect x="650" y="280" width="160" height="130" rx="4"
            fill={windowHovered ? "#d4e8f5" : "#b8d4e8"}
            stroke="#2a2a2a" strokeWidth="2.5" />
          {/* Window panes */}
          <line x1="730" y1="280" x2="730" y2="410" stroke="#2a2a2a" strokeWidth="2" />
          <line x1="650" y1="345" x2="810" y2="345" stroke="#2a2a2a" strokeWidth="2" />
          {/* Sill */}
          <rect x="640" y="408" width="180" height="10" rx="2" fill="#c0b8a8" stroke="#2a2a2a" strokeWidth="1.5" />

          {/* Peek photo / face when hovered */}
          {windowHovered && (
            <g style={{ animation: "peekIn 0.3s ease" }}>
              {profileImage ? (
                <image
                  href={profileImage}
                  x="671" y="308"
                  width="116" height="95"
                  clipPath="url(#windowClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                /* Placeholder cartoon face peeking */
                <g>
                  <ellipse cx="730" cy="380" rx="38" ry="32" fill="#f5d5b0" stroke="#2a2a2a" strokeWidth="1.5" />
                  <circle cx="718" cy="368" r="5" fill="#2a2a2a" />
                  <circle cx="742" cy="368" r="5" fill="#2a2a2a" />
                  <circle cx="719" cy="367" r="2" fill="white" />
                  <circle cx="743" cy="367" r="2" fill="white" />
                  <path d="M719,382 Q730,390 741,382" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Hair */}
                  <path d="M692,360 Q700,335 730,332 Q760,335 768,360" fill="#3a2a1a" stroke="#2a2a2a" strokeWidth="1" />
                  {/* Hands gripping sill */}
                  <ellipse cx="700" cy="408" rx="14" ry="9" fill="#f5d5b0" stroke="#2a2a2a" strokeWidth="1.2" />
                  <ellipse cx="760" cy="408" rx="14" ry="9" fill="#f5d5b0" stroke="#2a2a2a" strokeWidth="1.2" />
                  <text x="730" y="418" textAnchor="middle"
                    style={{ fontSize: 8, fontFamily: "'Caveat', cursive", fill: "#666" }}>
                    👋 hi!
                  </text>
                </g>
              )}
            </g>
          )}
          {!windowHovered && (
            <text x="730" y="350" textAnchor="middle"
              style={{ fontSize: 10, fontFamily: "'Caveat', cursive", fill: "#888" }}>
              peek →
            </text>
          )}

          {/* Window clip */}
          <defs>
            <clipPath id="windowClip">
              <rect x="651" y="281" width="158" height="127" rx="3" />
            </clipPath>
          </defs>
        </g>

        {/* DOUBLE DOORS — hoverable & clickable */}
        <g
          style={{
            cursor: "pointer",
            filter: doorColors.glow,
            transition: "filter 0.3s",
          }}
          onMouseEnter={() => setDoorHovered(true)}
          onMouseLeave={() => setDoorHovered(false)}
          onClick={onEnter}
        >
          {/* Door frame */}
          <rect x="418" y="318" width="164" height="204" rx="3"
            fill="none" stroke="#2a2a2a" strokeWidth="2.5" />
          {/* Left door */}
          <rect x="420" y="320" width="80" height="200"
            fill={doorColors.left} stroke="#2a2a2a" strokeWidth="1.8"
            style={{ transition: "fill 0.3s" }} />
          {/* Right door */}
          <rect x="500" y="320" width="80" height="200"
            fill={doorColors.right} stroke="#2a2a2a" strokeWidth="1.8"
            style={{ transition: "fill 0.3s" }} />
          {/* Door center line */}
          <line x1="500" y1="320" x2="500" y2="520" stroke="#2a2a2a" strokeWidth="2" />
          {/* Panels */}
          <rect x="428" y="330" width="65" height="80" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
          <rect x="428" y="420" width="65" height="90" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
          <rect x="507" y="330" width="65" height="80" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
          <rect x="507" y="420" width="65" height="90" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
          {/* Handles */}
          <circle cx="494" cy="430" r="5" fill="#d4a840" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="506" cy="430" r="5" fill="#d4a840" stroke="#2a2a2a" strokeWidth="1.5" />

          {/* JS sticker */}
          <circle cx="448" cy="360" r="14" fill={doorHovered ? "#ffd700" : "#f0c040"} stroke="#2a2a2a" strokeWidth="1"
            style={{ transition: "fill 0.3s" }} />
          <text x="448" y="364" textAnchor="middle"
            style={{ fontSize: 8, fontFamily: "monospace", fontWeight: 700, fill: "#2a2a2a" }}>JS</text>

          {/* TS sticker */}
          <circle cx="448" cy="398" r="14" fill={doorHovered ? "#60c8ff" : "#4db6e8"} stroke="#2a2a2a" strokeWidth="1"
            style={{ transition: "fill 0.3s" }} />
          <text x="448" y="402" textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "monospace", fontWeight: 700, fill: "white" }}>TS</text>

          {/* Hover hint */}
          {doorHovered && (
            <text x="500" y="540" textAnchor="middle"
              style={{ fontSize: 12, fontFamily: "'Caveat', cursive", fill: "#6b8cba" }}>
              Enter the hallway ›
            </text>
          )}
        </g>

        {/* Stone path */}
        {[[480, 545, 90, 28], [460, 578, 100, 26], [380, 554, 78, 26],
          [560, 548, 82, 26], [590, 580, 88, 26]].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
            fill="none" stroke="#2a2a2a" strokeWidth="1" />
        ))}
      </svg>

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(240,236,228,0.94)", borderTop: "1px solid #2a2a2a",
        padding: "14px 0", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Special Elite', monospace", fontSize: 15,
          color: "#2a2a2a", margin: 0, letterSpacing: 3,
        }}>EXPLORER</p>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: 13, color: "#888",
          margin: "4px 0 0", letterSpacing: 1,
        }}>
          Click the door to walk the hallway · Hover the window to say hi · Click the clock to go home
        </p>
      </div>
    </div>
  );
};

// ── HALLWAY (SCROLL-TRIGGERED) ────────────────────────────────────────────────
const HallwayScene = ({ onBack }) => {
  const containerRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = el.scrollTop / max;
      setScrollProgress(pct);
      const idx = Math.min(
        hallwayPanels.length - 1,
        Math.floor(pct * hallwayPanels.length)
      );
      setActivePanel(idx);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const panel = hallwayPanels[activePanel];

  // Perspective vanish amount based on scroll
  const vanish = 80 + scrollProgress * 120;
  const wallW = 300 + scrollProgress * 100;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        position: "relative",
        background: "#eceae4",
        scrollBehavior: "smooth",
      }}
    >
      <PaperTexture />

      {/* Tall scroll canvas — creates scroll room */}
      <div style={{ height: `${hallwayPanels.length * 100}vh`, position: "relative" }}>

        {/* Sticky viewport */}
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>

          {/* Hallway SVG */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="hallGlow" cx="50%" cy="65%">
                <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#eceae4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#eceae4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ceiling */}
            <line x1="0" y1="100" x2="1000" y2="100" stroke="#c0b8a8" strokeWidth="1" />
            {/* Ceiling cracks */}
            <line x1="200" y1="100" x2="182" y2="65" stroke="#b0a898" strokeWidth="0.7" />
            <line x1="700" y1="100" x2="718" y2="72" stroke="#b0a898" strokeWidth="0.7" />

            {/* Left wall perspective */}
            <line x1="0" y1="100" x2={500 - vanish} y2={240 + scrollProgress * 60}
              stroke="#2a2a2a" strokeWidth="1.2" />
            <line x1="0" y1="600" x2={500 - vanish} y2={430 - scrollProgress * 40}
              stroke="#2a2a2a" strokeWidth="1.2" />

            {/* Right wall perspective */}
            <line x1="1000" y1="100" x2={500 + vanish} y2={240 + scrollProgress * 60}
              stroke="#2a2a2a" strokeWidth="1.2" />
            <line x1="1000" y1="600" x2={500 + vanish} y2={430 - scrollProgress * 40}
              stroke="#2a2a2a" strokeWidth="1.2" />

            {/* Vanishing glow */}
            <ellipse cx="500" cy="380" rx={130 - scrollProgress * 30} ry={100 - scrollProgress * 20}
              fill="url(#hallGlow)" />

            {/* Floor boards */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i}
                x1={i * 90} y1={600}
                x2={440 + i * 12} y2={430}
                stroke="#c0b8a8" strokeWidth="0.7" />
            ))}

            {/* Wall art / panel specific content */}
            {panel.hasArtwork && (
              <g>
                <rect x="740" y="220" width="180" height="150"
                  fill="none" stroke="#2a2a2a" strokeWidth="2" rx="2" />
                <rect x="748" y="228" width="164" height="134"
                  fill="none" stroke="#2a2a2a" strokeWidth="0.7" />
                <text x="830" y="308" textAnchor="middle"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: 40, fill: "#2a2a2a" }}>
                  {panel.artworkText}
                </text>
              </g>
            )}

            {/* Skills tags for about panel */}
            {panel.skills && panel.skills.map((s, i) => (
              <g key={s}>
                <rect
                  x={640 + (i % 2) * 120} y={260 + Math.floor(i / 2) * 60}
                  width={108} height={42}
                  fill="none" stroke="#2a2a2a" strokeWidth="1" rx="21" strokeDasharray="3,2"
                />
                <text
                  x={694 + (i % 2) * 120} y={286 + Math.floor(i / 2) * 60}
                  textAnchor="middle"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: 16, fill: "#2a2a2a" }}
                >{s}</text>
              </g>
            ))}

            {/* Milestone circle */}
            {panel.percent && (
              <g>
                <circle cx="800" cy="320" r="60" fill="none" stroke="#2a2a2a"
                  strokeWidth="2" strokeDasharray="6,3" />
                <text x="800" y="316" textAnchor="middle"
                  style={{ fontSize: 26, fontFamily: "'Caveat', cursive", fontWeight: 700, fill: "#2a2a2a" }}>
                  {panel.percent}%
                </text>
                <text x="800" y="336" textAnchor="middle"
                  style={{ fontSize: 11, fontFamily: "serif", fill: "#888", letterSpacing: 2 }}>
                  DONE
                </text>
              </g>
            )}

            {/* Final — person illustration */}
            {panel.isFinal && (
              <g>
                <circle cx="800" cy="280" r="38" fill="none" stroke="#2a2a2a" strokeWidth="2" />
                <line x1="800" y1="318" x2="800" y2="400" stroke="#2a2a2a" strokeWidth="2.5" />
                <line x1="770" y1="345" x2="830" y2="345" stroke="#2a2a2a" strokeWidth="2.5" />
                <line x1="800" y1="400" x2="774" y2="450" stroke="#2a2a2a" strokeWidth="2.5" />
                <line x1="800" y1="400" x2="826" y2="450" stroke="#2a2a2a" strokeWidth="2.5" />
                <circle cx="789" cy="272" r="8" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
                <circle cx="811" cy="272" r="8" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
                <line x1="797" y1="272" x2="803" y2="272" stroke="#2a2a2a" strokeWidth="1.5" />
                <path d="M789,290 Q800,298 811,290" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}

            {/* Room label sign */}
            <rect x="430" y="248" width="140" height="34" fill="none" stroke="#2a2a2a" strokeWidth="1.5" rx="3" />
            <text x="500" y="270" textAnchor="middle"
              style={{ fontFamily: "'Special Elite', monospace", fontSize: 11, fill: "#2a2a2a", letterSpacing: 2 }}>
              {panel.roomLabel}
            </text>

            {/* Left wall door — decorative */}
            <rect x="80" y="310" width="100" height="180" fill="#e8dcc8" stroke="#2a2a2a" strokeWidth="1.5" rx="2" />
            <rect x="88" y="318" width="84" height="75" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
            <rect x="88" y="402" width="84" height="80" fill="none" stroke="#2a2a2a" strokeWidth="1" rx="2" />
            <circle cx="170" cy="445" r="5" fill="#d4a840" stroke="#2a2a2a" strokeWidth="1.2" />
          </svg>

          {/* Info card */}
          <div style={{
            position: "absolute", bottom: 60, left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(240,236,228,0.94)", border: "1px solid #2a2a2a",
            padding: "20px 36px", maxWidth: 440, textAlign: "center", borderRadius: 4,
            transition: "opacity 0.4s",
            zIndex: 10,
          }}>
            <p style={{
              fontFamily: "'Special Elite', monospace", fontSize: 10,
              color: "#888", letterSpacing: 3, marginBottom: 8, margin: "0 0 8px",
            }}>{panel.detail}</p>
            <p style={{
              fontFamily: "'Caveat', cursive", fontSize: 22,
              color: "#2a2a2a", margin: 0, lineHeight: 1.4,
            }}>{panel.description}</p>
          </div>

          {/* Scroll progress dots */}
          <div style={{
            position: "absolute", right: 20, top: "50%",
            transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 8, zIndex: 20,
          }}>
            {hallwayPanels.map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i === activePanel ? "#2a2a2a" : "transparent",
                border: "1.5px solid #2a2a2a",
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          {/* Scroll hint / back button */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: 16, alignItems: "center", zIndex: 20,
          }}>
            <button onClick={onBack} style={{
              background: "none", border: "1px dashed #2a2a2a",
              padding: "5px 14px", fontFamily: "'Caveat', cursive",
              fontSize: 14, color: "#2a2a2a", cursor: "pointer", borderRadius: 4,
            }}>← Exit hallway</button>
            <p style={{
              fontFamily: "serif", fontSize: 11, color: "#999",
              letterSpacing: 2, textTransform: "uppercase", margin: 0,
            }}>
              {activePanel < hallwayPanels.length - 1 ? "↓ Scroll to explore" : "✦ End of hallway"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function OJTJourney() {
  const [scene, setScene] = useState("loading");
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Special+Elite&display=swap";
    document.head.appendChild(link);

    // Add peek animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes peekIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const interval = setInterval(() => {
      setLoadProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return Math.min(100, p + Math.floor(Math.random() * 8) + 3);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadProgress >= 100 && scene === "loading") {
      setTimeout(() => setScene("entrance"), 500);
    }
  }, [loadProgress, scene]);

  const goHome = () => {
    // Navigate to mainpage — works in Next.js / React Router / Vite
    if (typeof window !== "undefined") {
      if (window.history && window.history.pushState) {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        window.location.href = "/";
      }
    }
  };

  if (scene === "loading") return <LoadingScene progress={Math.min(loadProgress, 100)} />;
  if (scene === "hallway") return <HallwayScene onBack={() => setScene("entrance")} />;

  return (
    <EntranceScene
      onEnter={() => setScene("hallway")}
      onGoHome={goHome}
      profileImage={null} // ← Pass your image URL or base64 here, e.g. "/me.jpg"
    />
  );
}