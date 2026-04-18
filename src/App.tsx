import { useState, useEffect, useRef, useCallback } from 'react';

const PROJECTS = [
  {
    id: 1,
    title: 'WRK',
    subtitle: 'dd',
    category: 'Website',
    year: '2023',
    light: { bg: '#e5e1db', textColor: '#111111' },
    dark:  { bg: '#111111', textColor: '#e2ddd7' },
    gradient: 'linear-gradient(135deg, #111 0%, #1e1e1e 40%, #0a0a0a 70%, #181818 100%)',
  },
  {
    id: 2,
    title: 'Hut 8',
    subtitle: 'Energy Corp.',
    category: 'Branding',
    year: '2025',
    light: { bg: '#f0ede7', textColor: '#111111' },
    dark:  { bg: '#0e0e0e', textColor: '#ede9e2' },
    gradient: 'linear-gradient(130deg, #b2afa9 0%, #ccc9c3 50%, #d5d1cb 100%)',
  },
  {
    id: 3,
    title: 'OOONO',
    subtitle: 'Safer Everyday',
    category: 'Branding',
    year: '202ddd4',
    light: { bg: '#d6d2cc', textColor: '#1a1a1a' },
    dark:  { bg: '#1a1a1a', textColor: '#d6d2cc' },
    gradient: 'linear-gradient(150deg, #161616 0%, #222 35%, #111 70%, #1c1c1c 100%)',
  },
];

const TOTAL = PROJECTS.length;
const HOURS_PER_PROJECT = 12 / TOTAL;
const SCROLL_THRESHOLD = 100;

function projectForClockHour(clockHour: number): number {
  return Math.floor((((clockHour % 12) + 12) % 12) / HOURS_PER_PROJECT) % TOTAL;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildArcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string | null {
  const span = endDeg - startDeg;
  if (span < 0.5) return null;
  const toRad = function(d: number): number { return ((d - 90) * Math.PI) / 180; };
  const sx = cx + r * Math.cos(toRad(startDeg));
  const sy = cy + r * Math.sin(toRad(startDeg));
  const ex = cx + r * Math.cos(toRad(endDeg));
  const ey = cy + r * Math.sin(toRad(endDeg));
  const large = span > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

// ─── Clock SVG ────────────────────────────────────────────────────────────────

interface ClockSVGProps {
  handDeg: number;
  textColor: string;
  arcStart: number;
  arcEnd: number;
  onHourClick: (h: number) => void;
  hoveredHour: number | null;
  setHoveredHour: (h: number | null) => void;
}

function ClockSVG({ handDeg, textColor, arcStart, arcEnd, onHourClick, hoveredHour, setHoveredHour }: ClockSVGProps) {
  const R = 44;
  const TICK = 60;

  const ticks = [];
  for (let i = 0; i < TICK; i++) {
    const deg = (i / TICK) * 360;
    const rad = (deg * Math.PI) / 180;
    const major = i % 5 === 0;
    if (major) {
      const iR = 37.5, oR = 43;
      const cx1 = Math.sin(rad) * iR, cy1 = -Math.cos(rad) * iR;
      const cx2 = Math.sin(rad) * oR, cy2 = -Math.cos(rad) * oR;
      const p = rad + Math.PI / 2, hw = 0.7;
      const pts = [
        [cx1 + Math.sin(p) * hw, cy1 - Math.cos(p) * hw],
        [cx1 - Math.sin(p) * hw, cy1 + Math.cos(p) * hw],
        [cx2 - Math.sin(p) * hw * 0.55, cy2 + Math.cos(p) * hw * 0.55],
        [cx2 + Math.sin(p) * hw * 0.55, cy2 - Math.cos(p) * hw * 0.55],
      ].map(pt => pt.join(',')).join(' ');
      ticks.push(<polygon key={i} points={pts} fill={textColor} opacity={0.55} />);
    } else {
      const iR = 41.5, oR = 43.5;
      ticks.push(<line key={i}
        x1={Math.sin(rad) * iR} y1={-Math.cos(rad) * iR}
        x2={Math.sin(rad) * oR} y2={-Math.cos(rad) * oR}
        stroke={textColor} strokeWidth={0.2} opacity={0.25} />);
    }
  }

  const hourMarkers = Array.from({ length: 12 }, (_, h) => {
    const deg = h * 30;
    const rad = (deg * Math.PI) / 180;
    const lR = 31;
    const lx = Math.sin(rad) * lR;
    const ly = -Math.cos(rad) * lR;
    const isHov = hoveredHour === h;
    return (
      <g key={h} onClick={() => onHourClick(h)}
        onMouseEnter={() => setHoveredHour(h)}
        onMouseLeave={() => setHoveredHour(null)}
        style={{ cursor: 'none' }}>
        <circle cx={lx} cy={ly} r={6} fill="transparent" />
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
          fontSize={isHov ? 5.2 : 3.8}
          fill={textColor}
          opacity={isHov ? 1 : 0.3}
          fontFamily="Helvetica, sans-serif"
          style={{ transition: 'opacity 0.3s, font-size 0.2s', userSelect: 'none', pointerEvents: 'none' }}>
          {h === 0 ? '12' : h}
        </text>
      </g>
    );
  });

  const hr = (handDeg * Math.PI) / 180;
  const tipR = R * 0.92;
  const tipX = Math.sin(hr) * tipR, tipY = -Math.cos(hr) * tipR;
  const baseX = -Math.sin(hr) * 8, baseY = Math.cos(hr) * 8;

  const mR = R * 0.64;
  const mX = Math.sin(hr) * mR, mY = -Math.cos(hr) * mR;
  const pr = hr + Math.PI / 2, mw = 1.4, ml = 5.5;
  const markerPts = [
    [mX + Math.sin(pr) * mw - Math.sin(hr) * ml * 0.5, mY - Math.cos(pr) * mw + Math.cos(hr) * ml * 0.5],
    [mX - Math.sin(pr) * mw - Math.sin(hr) * ml * 0.5, mY + Math.cos(pr) * mw + Math.cos(hr) * ml * 0.5],
    [mX - Math.sin(pr) * mw * 0.5 + Math.sin(hr) * ml * 0.5, mY + Math.cos(pr) * mw * 0.5 - Math.cos(hr) * ml * 0.5],
    [mX + Math.sin(pr) * mw * 0.5 + Math.sin(hr) * ml * 0.5, mY - Math.cos(pr) * mw * 0.5 - Math.cos(hr) * ml * 0.5],
  ].map(pt => pt.join(',')).join(' ');
  const pvR = 3.5;

  const arc = buildArcPath(0, 0, R - 1.5, arcStart, arcEnd);

  return (
    <svg viewBox="-50 -50 100 100" style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(92vw, 92vh)', height: 'min(92vw, 92vh)',
      pointerEvents: 'none', zIndex: 4,
    }}>
      <circle cx={0} cy={0} r={R} fill="none" stroke={textColor} strokeWidth={0.22} opacity={0.2} />
      {ticks}

      <g style={{ pointerEvents: 'all' }}>{hourMarkers}</g>

      {arc && (
        <path d={arc} fill="none" stroke={textColor} strokeWidth={1.8} opacity={0.8} strokeLinecap="round" />
      )}

      <line x1={baseX} y1={baseY} x2={tipX} y2={tipY} stroke={textColor} strokeWidth={0.28} opacity={0.75} />
      <polygon points={markerPts} fill={textColor} opacity={0.9} />

      <circle cx={mX} cy={mY} r={pvR} fill="none" stroke={textColor} strokeWidth={0.45} opacity={0.75} />
      <line x1={mX - pvR * 0.6} y1={mY} x2={mX + pvR * 0.6} y2={mY} stroke={textColor} strokeWidth={0.35} opacity={0.75} />
      <line x1={mX} y1={mY - pvR * 0.6} x2={mX} y2={mY + pvR * 0.6} stroke={textColor} strokeWidth={0.35} opacity={0.75} />

      <circle cx={0} cy={0} r={0.9} fill={textColor} opacity={0.55} />
    </svg>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, visible }: { project: typeof PROJECTS[0]; visible: boolean }) {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.97})`,
      width: 'clamp(280px, 50vw, 700px)',
      height: 'clamp(180px, 36vw, 480px)',
      background: project.gradient,
      zIndex: 2, overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: 'none',
    }}>
      {project.id === 1 && <WRKMockup />}
      {project.id === 2 && <Hut8Mockup />}
      {project.id === 3 && <OOONOMockup />}
    </div>
  );
}

// ─── Fullscreen Project ───────────────────────────────────────────────────────

function FullscreenProject({
  project,
  bg,
  textColor,
  onBack,
}: {
  project: typeof PROJECTS[0];
  bg: string;
  textColor: string;
  onBack: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: bg,
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <button
        data-cur=""
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 'clamp(20px,3.5vw,40px)',
          left: 'clamp(18px,3vw,38px)',
          background: 'none', border: 'none', cursor: 'none',
          color: textColor,
          fontSize: 'clamp(11px,1.2vw,14px)',
          letterSpacing: '0.12em',
          fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: 0, opacity: 0.7,
          transition: 'opacity 0.2s', zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <line x1="20" y1="6" x2="1" y2="6" stroke={textColor} strokeWidth="0.8" />
          <polyline points="7,1 1,6 7,11" stroke={textColor} strokeWidth="0.8" fill="none" />
        </svg>
        Back
      </button>

      <div style={{
        position: 'absolute',
        top: 'clamp(20px,3.5vw,40px)',
        right: 'clamp(18px,3vw,38px)',
        color: textColor, textAlign: 'right',
        opacity: 0.55,
        fontSize: 'clamp(10px,1.1vw,13px)',
        letterSpacing: '0.08em',
      }}>
        <div>{project.category}</div>
        <div>{project.year}</div>
      </div>

      <div style={{
        width: 'clamp(320px,72vw,960px)',
        height: 'clamp(220px,54vw,660px)',
        background: project.gradient,
        overflow: 'hidden', position: 'relative',
        transform: mounted ? 'scale(1)' : 'scale(0.93)',
        transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {project.id === 1 && <WRKMockup />}
        {project.id === 2 && <Hut8Mockup />}
        {project.id === 3 && <OOONOMockup />}
      </div>

      <div style={{
        marginTop: 'clamp(24px,3vw,40px)',
        color: textColor, textAlign: 'center',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.6s 0.15s cubic-bezier(0.4,0,0.2,1), transform 0.6s 0.15s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ fontSize: 'clamp(22px,4.5vw,58px)', fontWeight: 400, lineHeight: 1 }}>
          {project.title}
        </div>
        <div style={{
          fontSize: 'clamp(13px,2vw,26px)', fontWeight: 300,
          opacity: 0.5, marginTop: '6px', letterSpacing: '0.04em',
        }}>
          {project.subtitle}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup Components ────────────────────────────────────────────────────────

function WRKMockup() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '3%',
    }}>
      <div style={{
        width: '78%', height: '65%', background: '#f4f4f4',
        borderRadius: '5px 5px 0 0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 -12px 50px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          height: '9%', background: '#ddd',
          display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#bbb' }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.12)',
            fontSize: 'clamp(14px,2.5vw,36px)',
            letterSpacing: '0.2em',
            fontFamily: 'Helvetica, sans-serif',
            textTransform: 'uppercase', fontWeight: 700,
          }}>WRK</div>
          <div style={{
            color: 'rgba(255,255,255,0.07)',
            fontSize: 'clamp(6px,0.9vw,12px)',
            letterSpacing: '0.25em',
            fontFamily: 'Helvetica, sans-serif',
          }}>Introducing ACF-01</div>
          <div style={{ width: 28, height: 0.5, background: 'rgba(255,100,0,0.7)', marginTop: 4 }} />
        </div>
      </div>
      <div style={{ width: '85%', height: '4%', background: '#1c1c1c', borderRadius: '0 0 3px 3px' }} />
      <div style={{ width: '22%', height: '2%', background: '#111', borderRadius: '0 0 4px 4px' }} />
    </div>
  );
}

function Hut8Mockup() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,24px)' }}>
        <SunIcon />
        <span style={{
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: 'clamp(20px,4vw,60px)',
          fontWeight: 700, color: '#1a1a1a',
          letterSpacing: '-0.02em',
        }}>Hut 7</span>
      </div>
    </div>
  );
}

function SunIcon() {
  const rays = 18;
  return (
    <svg width="clamp(36px,5.5vw,80px)" height="clamp(36px,5.5vw,80px)" viewBox="0 0 60 60">
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const x1 = 30 + Math.cos(a) * 11, y1 = 30 + Math.sin(a) * 11;
        const x2 = 30 + Math.cos(a) * 27, y2 = 30 + Math.sin(a) * 27;
        const pa = a + Math.PI / 2, w1 = 2.4, w2 = 0.5;
        const pts = [
          [x1 + Math.cos(pa) * w1, y1 + Math.sin(pa) * w1],
          [x1 - Math.cos(pa) * w1, y1 - Math.sin(pa) * w1],
          [x2 - Math.cos(pa) * w2, y2 - Math.sin(pa) * w2],
          [x2 + Math.cos(pa) * w2, y2 + Math.sin(pa) * w2],
        ].map(pt => pt.join(',')).join(' ');
        return <polygon key={i} points={pts} fill="#1a1a1a" />;
      })}
    </svg>
  );
}

function OOONOMockup() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '58%', height: '60%',
        background: 'linear-gradient(145deg,#2a2a2a,#1a1a1a)',
        borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '48%', height: '56%', borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#00cc55" strokeWidth="2.5"
              strokeDasharray="200 289.8" strokeDashoffset="72.4" strokeLinecap="round" />
          </svg>
          <span style={{
            fontSize: 'clamp(7px,1.2vw,14px)',
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'Helvetica, sans-serif',
            letterSpacing: '0.06em', zIndex: 1,
          }}>OOONO</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mode Indicator ───────────────────────────────────────────────────────────

function ModeIndicator({ isDark, textColor }: { isDark: boolean; textColor: string }) {
  return (
    <div style={{
      position: 'absolute',
      top: 'clamp(14px,3vw,30px)', right: 'clamp(18px,3vw,38px)',
      zIndex: 10,
      display: 'flex', alignItems: 'center', gap: '8px',
      color: textColor, opacity: 0.4,
      fontSize: 'clamp(9px,0.9vw,11px)',
      letterSpacing: '0.12em',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      transition: 'color 0.9s, opacity 0.5s',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 22, height: 11,
        borderRadius: 6,
        border: `1px solid ${textColor}`,
        position: 'relative',
        transition: 'border-color 0.7s',
      }}>
        <div style={{
          position: 'absolute',
          top: 2, left: isDark ? 'calc(100% - 9px)' : 2,
          width: 7, height: 7, borderRadius: '50%',
          background: textColor,
          transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1), background 0.7s',
        }} />
      </div>
      {isDark ? 'Dark' : 'Light'}
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor({ color }: { color: string }) {
  const mouse = useRef({ x: -200, y: -200 });
  const lrp = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const dotEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      setHov(!!(t.closest('a,button,[data-cur]')));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    const animate = () => {
      lrp.current.x = lerp(lrp.current.x, mouse.current.x, 0.12);
      lrp.current.y = lerp(lrp.current.y, mouse.current.y, 0.12);
      if (dotEl.current) {
        dotEl.current.style.transform = `translate(${mouse.current.x - 3}px,${mouse.current.y - 3}px)`;
      }
      if (ringEl.current) {
        const s = hov ? 24 : 18;
        ringEl.current.style.transform = `translate(${lrp.current.x - s}px,${lrp.current.y - s}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [hov]);

  return (
    <>
      <div ref={dotEl} style={{
        position: 'fixed', top: 0, left: 0,
        width: 5, height: 5, borderRadius: '50%',
        background: color, pointerEvents: 'none', zIndex: 9999,
        transition: 'background 0.5s', mixBlendMode: 'difference',
      }} />
      <div ref={ringEl} style={{
        position: 'fixed', top: 0, left: 0,
        width: hov ? 32 : 24, height: hov ? 32 : 24,
        borderRadius: '50%',
        border: `1px solid ${color}`,
        pointerEvents: 'none', zIndex: 9998,
        opacity: hov ? 0.8 : 0.35,
        transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s, border-color 0.5s',
      }} />
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const targetHour = useRef(0);
  const currentHour = useRef(0);
  const scrollAccum = useRef(0);

  const [display, setDisplay] = useState(0);
  const [fullscreen, setFullscreen] = useState<{
    project: typeof PROJECTS[0];
    bg: string;
    textColor: string;
  } | null>(null);
  const [hovHour, setHovHour] = useState<number | null>(null);
  const rafId = useRef<number>(0);

  const clockHour = ((display % 12) + 12) % 12;
  const handDeg = clockHour * 30;
  const floorH = Math.floor(clockHour);
  const frac = clockHour - floorH;
  const arcStart = floorH * 30;
  const arcEnd = arcStart + frac * 30;
  const projIdx = projectForClockHour(clockHour);
  const proj = PROJECTS[projIdx];

  // Odd hours = dark, even hours = light — flips at each whole-hour boundary
  const isDark = floorH % 2 === 1;
  const { bg, textColor } = isDark ? proj.dark : proj.light;

  // RAF lerp loop
  useEffect(() => {
    const tick = () => {
      const diff = targetHour.current - currentHour.current;
      if (Math.abs(diff) > 0.001) {
        currentHour.current += diff * 0.028;
        setDisplay(currentHour.current);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // Auto-advance every 6s clockwise
  useEffect(() => {
    if (fullscreen) return;
    const id = setInterval(() => {
      if (Math.abs(targetHour.current - currentHour.current) < 0.4) {
        targetHour.current += 1;
      }
    }, 6000);
    return () => clearInterval(id);
  }, [fullscreen]);

  // Scroll: UP = clockwise (+), DOWN = CCW (−)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (fullscreen) return;
      e.preventDefault();
      scrollAccum.current -= e.deltaY;
      while (scrollAccum.current >= SCROLL_THRESHOLD) {
        scrollAccum.current -= SCROLL_THRESHOLD;
        targetHour.current += 1;
      }
      while (scrollAccum.current <= -SCROLL_THRESHOLD) {
        scrollAccum.current += SCROLL_THRESHOLD;
        targetHour.current -= 1;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [fullscreen]);

  // Touch swipe
  useEffect(() => {
    let sy = 0;
    const onStart = (e: TouchEvent) => { sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      if (fullscreen) return;
      const dy = sy - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      if (dy > 0) targetHour.current += Math.round(Math.abs(dy) / 60);
      else targetHour.current -= Math.round(Math.abs(dy) / 60);
    };
    window.addEventListener('touchstart', onStart);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [fullscreen]);

  // Escape closes fullscreen
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const onHourClick = useCallback((h: number) => {
    const curr = targetHour.current;
    const mod = ((curr % 12) + 12) % 12;
    let delta = h - mod;
    if (delta > 6) delta -= 12;
    if (delta < -6) delta += 12;
    targetHour.current = curr + delta;
    const clickedProj = PROJECTS[projectForClockHour(h)];
    const clickedIsDark = h % 2 === 1;
    const clickedTheme = clickedIsDark ? clickedProj.dark : clickedProj.light;
    setFullscreen({ project: clickedProj, bg: clickedTheme.bg, textColor: clickedTheme.textColor });
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      position: 'relative',
      background: bg,
      transition: 'background 0.9s cubic-bezier(0.4,0,0.2,1)',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      userSelect: 'none',
      cursor: 'none',
    }}>
      <CustomCursor color={textColor} />

      {PROJECTS.map((p, i) => (
        <ProjectCard key={p.id} project={p} visible={i === projIdx} />
      ))}

      <ClockSVG
        handDeg={handDeg}
        textColor={textColor}
        arcStart={arcStart}
        arcEnd={arcEnd}
        onHourClick={onHourClick}
        hoveredHour={hovHour}
        setHoveredHour={setHovHour}
      />

      {/* Nav */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: 'clamp(20px,3.5vw,40px) 0',
        gap: 'clamp(48px,10vw,130px)',
      }}>
        {['Work', 'Studio'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`}
            onClick={e => e.preventDefault()}
            data-cur=""
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'none', textDecoration: 'none',
              color: textColor, transition: 'color 0.9s, opacity 0.25s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.45'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              border: `1.5px solid ${textColor}`,
              opacity: 0.7, flexShrink: 0,
              transition: 'border-color 0.9s',
            }} />
            <span style={{
              fontSize: 'clamp(12px,1.3vw,16px)',
              letterSpacing: '0.06em', fontWeight: 400,
            }}>{item}</span>
          </a>
        ))}
      </nav>

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: 'clamp(14px,3vw,30px)', left: 'clamp(18px,3vw,38px)',
        zIndex: 10, lineHeight: 0.85,
        color: textColor, transition: 'color 0.9s',
      }}>
        {['2', '8', 'k'].map((c, i) => (
          <div key={i} style={{
            fontSize: 'clamp(28px,4.8vw,62px)',
            fontWeight: 400, letterSpacing: '-0.03em',
          }}>{c}</div>
        ))}
      </div>

      {/* Mode indicator (top-right) */}
      <ModeIndicator isDark={isDark} textColor={textColor} />

      {/* Left project info */}
      <div style={{
        position: 'absolute',
        left: 'clamp(18px,3vw,38px)', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10, color: textColor,
        transition: 'color 0.9s, opacity 0.4s',
      }}>
        <div style={{
          fontSize: 'clamp(16px,2.2vw,30px)',
          fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1,
        }}>{proj.title}</div>
        <div style={{
          fontSize: 'clamp(13px,1.8vw,24px)',
          fontWeight: 300, opacity: 0.6, marginTop: '4px', lineHeight: 1,
        }}>{proj.subtitle}</div>
      </div>

      {/* Right project info */}
      <div style={{
        position: 'absolute',
        right: 'clamp(18px,3vw,38px)', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10, color: textColor,
        textAlign: 'right', transition: 'color 0.9s',
      }}>
        <div style={{
          fontSize: 'clamp(16px,2.2vw,30px)',
          fontWeight: 400, lineHeight: 1,
        }}>{proj.category}</div>
        <div style={{
          fontSize: 'clamp(13px,1.8vw,24px)',
          fontWeight: 300, opacity: 0.5, marginTop: '4px', lineHeight: 1,
        }}>{proj.year}</div>
      </div>

      {/* Bottom left */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(18px,3vw,34px)', left: 'clamp(18px,3vw,38px)',
        zIndex: 10, color: textColor,
        transition: 'color 0.9s',
        fontSize: 'clamp(9px,1vw,12px)',
        letterSpacing: '0.06em', lineHeight: 1.65, opacity: 0.55,
      }}>
        <div>FRI ©</div>
        <div>APR. 17</div>
        <div>DAY 1427</div>
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(18px,3vw,34px)', right: 'clamp(18px,3vw,38px)',
        zIndex: 10, color: textColor,
        transition: 'color 0.9s',
        fontSize: 'clamp(11px,1.2vw,15px)',
        letterSpacing: '0.05em', opacity: 0.65,
      }}>
        {String(projIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
      </div>

      {fullscreen && (
        <FullscreenProject
          project={fullscreen.project}
          bg={fullscreen.bg}
          textColor={fullscreen.textColor}
          onBack={() => setFullscreen(null)}
        />
      )}
    </div>
  );
}
