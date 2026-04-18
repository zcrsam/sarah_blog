import { useState, useEffect, useRef, useCallback } from 'react';

import week1 from './assets/week1.png';
import week2 from './assets/week2.png';
import week3 from './assets/week3.jpg';
import week4 from './assets/week4.png';
import week5 from './assets/week5.jpg';
import week6 from './assets/week6.png';
import week7 from './assets/week7.jpg';
import week8 from './assets/week8.jpg';
import week9 from './assets/week9.jpg';
import week10 from './assets/week10.jpg';

const WEEK_IMAGES = [week1, week2, week3, week4, week5, week6, week7, week8, week9, week10];

const PROJECTS = [
  {
    id: 1,
    title: 'Laying the Foundation',
    subtitle: 'Research, System Analysis & Flowchart Design',
    category: "sarah's",
    year: 'blog',
    bg: '#e5e1db',
    textColor: '#111111',
    gradient: 'linear-gradient(135deg, #111 0%, #1e1e1e 40%, #0a0a0a 70%, #181818 100%)',
  },
  {
    id: 2,
    title: 'System Development\nPhase',
    subtitle: 'Frontend Development for\nAdmin & Client Side',
    category: "sarah's",
    year: 'blog',
    bg: '#0e0e0e',
    textColor: '#ede9e2',
    gradient: 'linear-gradient(130deg, #b2afa9 0%, #ccc9c3 50%, #d5d1cb 100%)',
  },
  {
    id: 3,
    title: 'Authentication &\nDatabase Integration',
    subtitle: 'Backend Development with\nReal-time Reservation System',
    category: "sarah's",
    year: 'blog',
    bg: '#d6d2cc',
    textColor: '#1a1a1a',
    gradient: 'linear-gradient(150deg, #161616 0%, #222 35%, #111 70%, #1c1c1c 100%)',
  },
  {
    id: 4,
    title: 'Real-time Features &\nUI Improvements',
    subtitle: 'WebSocket Integration,\nNotification System &\nDashboard Enhancements',
    category: "sarah's",
    year: 'blog',
    bg: '#e5e1db',
    textColor: '#111111',
    gradient: 'linear-gradient(135deg, #111 0%, #1e1e1e 40%, #0a0a0a 70%, #181818 100%)',
  },
  {
    id: 5,
    title: 'Notification Management &\nCode Optimization',
    subtitle: 'Dashboard Features,\nPagination &\nPerformance Improvements',
    category: "sarah's",
    year: 'blog',
    bg: '#0e0e0e',
    textColor: '#ede9e2',
    gradient: 'linear-gradient(130deg, #b2afa9 0%, #ccc9c3 50%, #d5d1cb 100%)',
  },
  {
    id: 6,
    title: 'Deployment & Handoff',
    subtitle: 'Deployment,\nDocumentation & Presentation',
    category: "sarah's",
    year: 'blog',
    bg: '#d6d2cc',
    textColor: '#1a1a1a',
    gradient: 'linear-gradient(150deg, #161616 0%, #222 35%, #111 70%, #1c1c1c 100%)',
  },
  {
    id: 7,
    title: 'Week 7',
    subtitle: 'Coming soon',
    category: "sarah's",
    year: 'blog',
    bg: '#e5e1db',
    textColor: '#111111',
    gradient: 'linear-gradient(135deg, #111 0%, #1e1e1e 40%, #0a0a0a 70%, #181818 100%)',
  },
  {
    id: 8,
    title: 'Week 8',
    subtitle: 'Coming soon...',
    category: "sarah's",
    year: 'blog',
    bg: '#0e0e0e',
    textColor: '#ede9e2',
    gradient: 'linear-gradient(130deg, #b2afa9 0%, #ccc9c3 50%, #d5d1cb 100%)',
  },
  {
    id: 9,
    title: 'Week 9',
    subtitle: 'Coming soon...',
    category: "sarah's",
    year: 'blog',
    bg: '#d6d2cc',
    textColor: '#1a1a1a',
    gradient: 'linear-gradient(150deg, #161616 0%, #222 35%, #111 70%, #1c1c1c 100%)',
  },
  {
    id: 10,
    title: 'Week 10',
    subtitle: 'Coming soon...',
    category: "sarah's",
    year: 'blog',
    bg: '#e5e1db',
    textColor: '#111111',
    gradient: 'linear-gradient(135deg, #111 0%, #1e1e1e 40%, #0a0a0a 70%, #181818 100%)',
  },
];

const TOTAL = 10; // Total number of weeks
const HOURS_PER_PROJECT = 10 / TOTAL; // ~3.33 hours each
const SCROLL_THRESHOLD = 100; // accumulated px to step one hour


function projectForClockHour(clockHour: number): number {
  return Math.floor((((clockHour % 10) + 10) % 10) / HOURS_PER_PROJECT) % PROJECTS.length;
}


function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// SVG arc path (always sweeps positive / clockwise)
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string | null {
  const span = endDeg - startDeg;
  if (span < 0.5) return null;
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
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
  isDark: boolean;
}
function ClockSVG({ handDeg, textColor, arcStart, arcEnd, onHourClick, hoveredHour, setHoveredHour, isDark }: ClockSVGProps) {
  const R = 44;
  const TICK = 100;
  const col = isDark ? '#bfbfbf' : '#444444';

  const ticks = [];
for (let i = 0; i < TICK; i++) {
  const deg = (i / TICK) * 360;
  const rad = (deg * Math.PI) / 180;
  const major = i % 10 === 0; // 80 ticks / 10 hours = 8 ticks per hour

  if (major) {
    const iR = 35, oR = 43.5;
const cx = Math.sin(rad) * ((iR + oR) / 2);
const cy = -Math.cos(rad) * ((iR + oR) / 2);
const len = oR - iR;
const hourIndex = i / 10;
const isHovCapsule = hoveredHour === hourIndex;
ticks.push(
  <g key={i}
    transform={`translate(${cx},${cy}) rotate(${deg}) scale(${isHovCapsule ? 1.35 : 1})`}
    style={{ pointerEvents: 'all', cursor: 'pointer', transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)' }}
    onClick={() => onHourClick(hourIndex)}
    onMouseEnter={() => setHoveredHour(hourIndex)}
    onMouseLeave={() => setHoveredHour(null)}>
    {/* Wide invisible hit area */}
    <rect x={-3} y={-len / 2 - 2} width={6} height={len + 4} rx={0} fill="transparent" />
    <rect x={-0.75} y={-len / 2} width={1.5} height={len} rx={0.75}
          fill={'rgba(180,180,180,0.2)'}
          stroke={'#999999'} strokeWidth={0.25} opacity={0.7}/>
    <rect x={-0.12} y={-len * 0.35} width={0.24} height={len * 0.70} rx={0.12}
          fill={'#666666'} opacity={0.8} />
  </g>
);
  } else {
    // More minor ticks, thinner
    const iR = 40.5, oR = 43;
    const cx = Math.sin(rad) * ((iR + oR) / 2);
    const cy = -Math.cos(rad) * ((iR + oR) / 2);
    const len = oR - iR;
    ticks.push(
      <rect key={i}
        x={-0.18} y={-len / 2} width={0.36} height={len} rx={0.18}
        fill={col} opacity={0.22}
        transform={`translate(${cx},${cy}) rotate(${deg})`}
      />
    );
  }
}

  const hourMarkers = Array.from({ length: 10 }, (_, h) => {
    const deg = h * 36;
    const rad = (deg * Math.PI) / 180;
    const lR = 31;
    const lx = Math.sin(rad) * lR;
    const ly = -Math.cos(rad) * lR;
    const isHov = hoveredHour === h;
    return (
      <g key={h} onClick={() => onHourClick(h)}
        onMouseEnter={() => setHoveredHour(h)}
        onMouseLeave={() => setHoveredHour(null)}
        style={{ cursor: 'pointer' }}>
        <circle cx={lx} cy={ly} r={6} fill="transparent" />
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
          fontSize={isHov ? 5.0 : 3.6} fill={col}
          opacity={isHov ? 0.9 : 0.25}
          fontFamily="Helvetica, sans-serif" fontWeight="300"
          style={{ transition: 'opacity 0.3s, font-size 0.2s', userSelect: 'none', pointerEvents: 'none' }}>
          {h + 1}
        </text>
      </g>
    );
  });

  // Primary hand only
  const hr = (handDeg * Math.PI) / 180;
  const tipR = R * 0.90;
  const tipX = Math.sin(hr) * tipR;
  const tipY = -Math.cos(hr) * tipR;
  const baseX = -Math.sin(hr) * 10;
  const baseY = Math.cos(hr) * 10;

  // Progress block at tip — solid filled rectangle like image 2
  const blockW = 3.5, blockH = 5.5;
  const bx = tipX - blockW / 2;
  const by = tipY - blockH / 2;

  // Plus button position — on the hand, 2/3 out
  const plusR = R * 0.65;
  const plusX = Math.sin(hr) * plusR;
  const plusY = -Math.cos(hr) * plusR;
  const pvR = 4.5;
  const arc = arcPath(0, 0, R - 1.5, arcStart, arcEnd);
  

  return (
    <svg viewBox="-50 -50 100 100" style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(100vw, 100vh)', height: 'min(100vw, 100vh)' , // 80% of viewport
      pointerEvents: 'none', zIndex: 4,
    }}>
      {/* Outer ring */}
      <circle cx={0} cy={0} r={R} fill="none" stroke={col} strokeWidth={0.15} opacity={0.15} />

      {ticks}
      <g style={{ pointerEvents: 'all' }}>{hourMarkers}</g>

      {/* Primary hairline hand */}
      {/* Arc progress */}
{arc && (
  <path d={arc} fill="none" stroke={isDark ? '#bfbfbf' : '#444444'} strokeWidth={2.5} opacity={1} strokeLinecap="butt"/>
)}

{/* Primary hairline hand */}
<g style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={() => onHourClick(Math.round(handDeg / 36) % 10)}>
  {/* Visible hand */}
  <line x1={baseX} y1={baseY} x2={tipX} y2={tipY}
    stroke={isDark ? '#bfbfbf' : '#444444'} strokeWidth={0.35} opacity={1} strokeLinecap="butt" />
  {/* Wide invisible hit area */}
  <line x1={baseX} y1={baseY} x2={tipX} y2={tipY}
    stroke="transparent" strokeWidth={4} strokeLinecap="butt" />
</g>
      
      {/* Center dot */}
      <circle cx={0} cy={0} r={0.7} fill={col} opacity={0.5} />
    </svg>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ imageUrl, visible, onClick }: { imageUrl: string; visible: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={visible ? onClick : undefined}
      onMouseEnter={() => visible && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${visible ? (hov ? 1.05 : 1) : 0.97})`,
        width: 'clamp(200px, 35vw, 400px)', height: 'clamp(200px, 35vw, 400px)',
        borderRadius: '50%',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 2, overflow: 'hidden',
        opacity: visible ? 0.85 : 0,
        transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: visible ? 'all' : 'none',
        cursor: visible ? 'none' : 'default',
      }} />
  );
}

// ─── Fullscreen ────────────────────────────────────────────────────────────────
function FullscreenProject({ project, onBack, weekImage }: { 
  project: typeof PROJECTS[0]; 
  onBack: () => void;
  weekImage: string;
}) {
  const [in_, setIn] = useState(false);
  const [slide, setSlide] = useState(0);

  // Each project's content — add your real data here
  const WEEK_CONTENT: Record<number, { date: string; entries: string[] }[]> = {
    1: [
      { date: 'Feb 23, 2026 (Monday)', entries: ['Started research and system analysis', 'Reviewed existing reservation systems', 'Outlined project scope and objectives'] },
      { date: 'Feb 24, 2026 (Tuesday)', entries: ['Created initial flowcharts', 'Mapped user journeys for client and admin', 'Identified key database entities'] },
      { date: 'Feb 25, 2026 (Wednesday)', entries: ['Finalized flowchart design', 'Presented system flow to supervisor', 'Received feedback and applied revisions'] },
    ],
    2: [
      { date: 'March 02, 2026 (Monday)', entries: ['Started project development', 'Building the client-side landing page'] },
      { date: 'March 03, 2026 (Tuesday)', entries: ['Polished the landing page on the client side', 'Coded the All Venues page', 'Started coding one of the seat and table layouts'] },
      { date: 'March 04, 2026 (Wednesday)', entries: ['Focused on front-end development', 'Developed the admin side including: Admin login page, Admin dashboard, Seat map layout'] },
      { date: 'March 05, 2026 (Thursday)', entries: ['Fixed color and font consistency', 'Adjusted text elements that were not clearly visible', 'Tested the functionality for adding tables and seats', 'Fixed buttons that were not working properly'] },
      { date: 'March 06, 2026 (Friday)', entries: ['Fixed adding and deleting of seats and tables', 'Synced seat layout changes between admin and client sides, including seat reservations'] },
    ],
    6: [
      { date: 'Deployment Day', entries: ['Deployed application to production', 'Finalized documentation', 'Presented to stakeholders'] },
    ],
  };

  const DELIVERABLES: Record<number, string[]> = {
    1: ['System Flowchart', 'Research Documentation', 'Project Scope'],
    2: ['Landing Page', 'All Venues Page', 'Reservation Page', 'Admin Login Page', 'Admin Dashboard', 'Seat Map Layout'],
    6: ['Deployed App', 'Documentation', 'Presentation'],
  };

  const content = WEEK_CONTENT[project.id] || [];
  const deliverables = DELIVERABLES[project.id] || [];

  // slides: image first, then one slide per day, then deliverables
  const totalSlides = 1 + content.length + (deliverables.length > 0 ? 1 : 0);

  useEffect(() => { const t = setTimeout(() => setIn(true), 20); return () => clearTimeout(t); }, []);

  const textCol = project.bg === '#0e0e0e' ? '#ede9e2' : '#1a1a1a';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: project.bg,
      opacity: in_ ? 1 : 0,
      transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(16px,2.5vw,32px) clamp(18px,3vw,38px)', zIndex: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: textCol, fontSize: 'clamp(11px,1.2vw,14px)',
          letterSpacing: '0.12em', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: 0, opacity: 0.7, transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <line x1="20" y1="6" x2="1" y2="6" stroke={textCol} strokeWidth="0.8" />
            <polyline points="7,1 1,6 7,11" stroke={textCol} strokeWidth="0.8" fill="none" />
          </svg>
          Back
        </button>
        <div style={{ color: textCol, textAlign: 'right', opacity: 0.55, fontSize: 'clamp(10px,1.1vw,13px)', letterSpacing: '0.08em' }}>
          <div>{project.category}</div><div>{project.year}</div>
        </div>
      </div>

      {/* Carousel area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 clamp(18px,3vw,38px)', gap: 16 }}>

        {/* Slide viewport */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {/* Slide 0: image */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: slide === 0 ? 1 : 0,
            transform: `translateX(${(0 - slide) * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
            backgroundImage: `url(${weekImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />

          {/* Day slides */}
          {content.map((day, di) => (
            <div key={di} style={{
              position: 'absolute', inset: 0,
              opacity: slide === di + 1 ? 1 : 0,
              transform: `translateX(${(di + 1 - slide) * 100}%)`,
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(24px,4vw,56px)',
              overflowY: 'auto',
            }}>
              <div style={{ color: textCol, opacity: 0.45, fontSize: 'clamp(10px,1vw,13px)', letterSpacing: '0.1em', marginBottom: 16 }}>{day.date}</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {day.entries.map((entry, ei) => (
                  <li key={ei} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: textCol }}>
                    <span style={{ opacity: 0.3, marginTop: 2, flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: 'clamp(13px,1.4vw,18px)', fontWeight: 300, lineHeight: 1.6, opacity: 0.85 }}>{entry}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Deliverables slide */}
          {deliverables.length > 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              opacity: slide === totalSlides - 1 ? 1 : 0,
              transform: `translateX(${(totalSlides - 1 - slide) * 100}%)`,
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(24px,4vw,56px)',
            }}>
              <div style={{ color: textCol, opacity: 0.45, fontSize: 'clamp(10px,1vw,13px)', letterSpacing: '0.15em', marginBottom: 20 }}>DELIVERABLES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {deliverables.map((d, di) => (
                  <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 12, color: textCol }}>
                    <span style={{ fontSize: 11, opacity: 0.5 }}>✓</span>
                    <span style={{ fontSize: 'clamp(13px,1.4vw,18px)', fontWeight: 300, opacity: 0.85 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: title + nav */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 'clamp(18px,3vw,34px)' }}>
          <div style={{ color: textCol }}>
            <div style={{ fontSize: 'clamp(20px,3.5vw,52px)', fontWeight: 400, lineHeight: 1 }}>{project.title}</div>
            <div style={{ fontSize: 'clamp(11px,1.2vw,16px)', fontWeight: 300, opacity: 0.45, marginTop: 6 }}>{project.subtitle}</div>
          </div>

          {/* Slide dots + arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div key={i} onClick={() => setSlide(i)} style={{
                  width: i === slide ? 20 : 6, height: 6, borderRadius: 3,
                  background: textCol, opacity: i === slide ? 0.8 : 0.2,
                  cursor: 'pointer', transition: 'width 0.3s, opacity 0.3s',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSlide(s => Math.max(0, s - 1))} style={{
                background: 'none', border: `1px solid ${textCol}`, borderRadius: '50%',
                width: 36, height: 36, cursor: 'pointer', color: textCol,
                opacity: slide === 0 ? 0.2 : 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}>‹</button>
              <button onClick={() => setSlide(s => Math.min(totalSlides - 1, s + 1))} style={{
                background: 'none', border: `1px solid ${textCol}`, borderRadius: '50%',
                width: 36, height: 36, cursor: 'pointer', color: textCol,
                opacity: slide === totalSlides - 1 ? 0.2 : 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mockups ──────────────────────────────────────────────────────────────────

function WRKMockup() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '3%' }}>
      <div style={{ width: '78%', height: '65%', background: '#f4f4f4', borderRadius: '5px 5px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -12px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ height: '9%', background: '#ddd', display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px' }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#bbb' }} />)}
        </div>
        <div style={{ flex: 1, background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 'clamp(14px,2.5vw,36px)', letterSpacing: '0.2em', fontFamily: 'Helvetica, sans-serif', textTransform: 'uppercase', fontWeight: 700 }}>WRK</div>
          <div style={{ color: 'rgba(255,255,255,0.07)', fontSize: 'clamp(6px,0.9vw,12px)', letterSpacing: '0.25em', fontFamily: 'Helvetica, sans-serif' }}>Introducing ACF-01</div>
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
        <span style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSize: 'clamp(20px,4vw,60px)', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Hut 8</span>
      </div>
    </div>
  );
}

function SunIcon() {
  const rays = 18;
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" style={{ width: 'clamp(36px,5.5vw,80px)', height: 'clamp(36px,5.5vw,80px)' }}>
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const x1 = 30+Math.cos(a)*11, y1 = 30+Math.sin(a)*11;
        const x2 = 30+Math.cos(a)*27, y2 = 30+Math.sin(a)*27;
        const pa = a + Math.PI/2, w1=2.4, w2=0.5;
        const pts = [
          [x1+Math.cos(pa)*w1, y1+Math.sin(pa)*w1],[x1-Math.cos(pa)*w1, y1-Math.sin(pa)*w1],
          [x2-Math.cos(pa)*w2, y2-Math.sin(pa)*w2],[x2+Math.cos(pa)*w2, y2+Math.sin(pa)*w2],
        ].map(p => p.join(',')).join(' ');
        return <polygon key={i} points={pts} fill="#1a1a1a" />;
      })}
    </svg>
  );
}

function OOONOMockup() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '58%', height: '60%', background: 'linear-gradient(145deg,#2a2a2a,#1a1a1a)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '48%', height: '56%', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#00cc55" strokeWidth="2.5" strokeDasharray="200 289.8" strokeDashoffset="72.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 'clamp(7px,1.2vw,14px)', color: 'rgba(255,255,255,0.45)', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.06em', zIndex: 1 }}>OOONO</span>
        </div>
      </div>
    </div>
  );
}

// ─── Time Background ───────────────────────────────────────────────────────────

function TimeBackground({ isDark }: { isDark: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: isDark 
        ? '#000000' 
        : 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 70%, #f5f5dc 100%)',
      zIndex: 1,
    }} />
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor({ color }: { color: string }) {
  const mouse = useRef({ x: -200, y: -200 });
  const lrp = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);
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
      if (dotEl.current) dotEl.current.style.transform = `translate(${mouse.current.x-3}px,${mouse.current.y-3}px)`;
      if (ringEl.current) {
        const s = hov ? 24 : 18;
        ringEl.current.style.transform = `translate(${lrp.current.x-s}px,${lrp.current.y-s}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); cancelAnimationFrame(raf.current); };
  }, [hov]);

  return (
    <>
      <div ref={dotEl} style={{ position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: '50%', background: color, pointerEvents: 'none', zIndex: 9999, transition: 'background 0.5s', mixBlendMode: 'difference' }} />
      <div ref={ringEl} style={{ position: 'fixed', top: 0, left: 0, width: hov ? 48 : 36, height: hov ? 48 : 36, borderRadius: '50%', border: `1px solid ${color}`, pointerEvents: 'none', zIndex: 9998, opacity: hov ? 0.8 : 0.35, transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1),height 0.35s cubic-bezier(0.4,0,0.2,1),opacity 0.35s,border-color 0.5s' }} />
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Blogq() {
  // Raw float hour — drives everything.
  // Scroll UP   (deltaY < 0) → clockwise    → targetHour increases
  // Scroll DOWN (deltaY > 0) → CCW          → targetHour decreases
  const targetHour = useRef(0);
  const currentHour = useRef(0);   // smoothly lerped
  const scrollAccum = useRef(0);

  const [display, setDisplay] = useState(0);   // triggers re-render
  const [fullscreen, setFullscreen] = useState<typeof PROJECTS[0] | null>(null);
  const [hovHour, setHovHour] = useState<number | null>(null);
  const rafId = useRef<number>(0);

  // ── clock math from live float ──────────────────────────────────────────
  // Clamp clockHour to 0-10 cyclically
  const clockHour = ((display % 10) + 10) % 10;
  const handDeg = clockHour * 36; // 360° / 10 hours = 36° per hour

  // Arc: fills from the last whole-hour tick toward the current position
  // Always represents progress within the current hour cell (0°–36° span)
  const floorH = Math.floor(clockHour);
  const frac = clockHour - floorH;          // 0..1 within this hour
  const arcStart = floorH * 36;             // start of current hour cell
  const arcEnd   = arcStart + frac * 36;    // current hand position in degrees

  const projIdx = projectForClockHour(clockHour);
  const proj = PROJECTS[projIdx];
  
  
  // Odd hours = dark, even hours = light — flips at each whole-hour boundary
  const isDark = floorH % 2 === 1;

  // ── RAF lerp loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const diff = targetHour.current - currentHour.current;
      if (Math.abs(diff) > 0.001) {
        currentHour.current += diff * 0.008;   // slow eased lerp
        setDisplay(currentHour.current);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // ── Auto-advance every 6s ────────────────────────────────────────────────
  useEffect(() => {
    if (fullscreen) return;
    const id = setInterval(() => {
      if (Math.abs(targetHour.current - currentHour.current) < 0.4) {
        targetHour.current += 1;   // clockwise auto-advance
      }
    }, 6000);
    return () => clearInterval(id);
  }, [fullscreen]);

  // ── Scroll: UP = clockwise (+), DOWN = CCW (−) ──────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (fullscreen) return;
      e.preventDefault();

      // deltaY < 0  → scroll up   → clockwise  → targetHour++
      // deltaY > 0  → scroll down → CCW        → targetHour--
      scrollAccum.current -= e.deltaY;   // negate so up = positive

      while (scrollAccum.current >= SCROLL_THRESHOLD) {
        scrollAccum.current -= SCROLL_THRESHOLD;
        targetHour.current += 1;   // clockwise
      }
      while (scrollAccum.current <= -SCROLL_THRESHOLD) {
        scrollAccum.current += SCROLL_THRESHOLD;
        targetHour.current -= 1;   // counter-clockwise
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [fullscreen]);

  // ── Touch swipe ──────────────────────────────────────────────────────────
  useEffect(() => {
    let sy = 0;
    const onStart = (e: TouchEvent) => { sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      if (fullscreen) return;
      const dy = sy - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      // swipe up → clockwise, swipe down → CCW
      if (dy > 0) targetHour.current += Math.round(Math.abs(dy) / 60);
      else        targetHour.current -= Math.round(Math.abs(dy) / 60);
    };
    window.addEventListener('touchstart', onStart);
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [fullscreen]);

  // Escape closes fullscreen
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreen(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // ── Hour marker click ────────────────────────────────────────────────────
  const onHourClick = useCallback((h: number) => {
    // shortest-path jump to that hour
    const curr = targetHour.current;
    const mod = ((curr % 10) + 10) % 10;
    let delta = h - mod;
    if (delta > 5) delta -= 10;
    if (delta < -5) delta += 10;
    targetHour.current = curr + delta;
    setFullscreen(PROJECTS[projectForClockHour(h)]);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      userSelect: 'none',
      cursor: 'none',
    }}>
      {/* Time-based background */}
      <TimeBackground isDark={isDark} />
      
      <CustomCursor color={isDark ? '#bfbfbf' : '#444444'} />


      {/* Project images — behind clock */}
      {WEEK_IMAGES.map((img, i) => (
  <ProjectCard key={i} imageUrl={img} visible={i === floorH}
    onClick={() => setFullscreen(PROJECTS[i])} />
))}

      {/* Clock on top */}
      <ClockSVG
      handDeg={handDeg}
      textColor={isDark ? '#ffffff' : '#111111'}
      arcStart={arcStart}
      arcEnd={arcEnd}
      onHourClick={onHourClick}
      hoveredHour={hovHour}
      setHoveredHour={setHovHour}
      isDark={isDark}
      />

      {/* Nav */}
      <nav style={{
        position: 'absolute', top: 'clamp(20px,3.5vw,40px)', right: 'clamp(18px,3vw,38px)', zIndex: 10,
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
      }}>
        {['WEEK'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={e => e.preventDefault()}
            data-cur="" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'none', textDecoration: 'none',
              color: isDark ? '#fff' : '#000', transition: 'color 0.9s, opacity 0.25s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.45'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', border: `1.5px solid ${isDark ? '#fff' : '#000'}`, opacity: 0.7, flexShrink: 0, transition: 'border-color 0.9s' }} ></div>
            <span style={{ fontSize: 'clamp(12px,1.3vw,16px)', letterSpacing: '0.06em', fontWeight: 400 }}>{item}</span>
          </a>
        ))}
      </nav>

      {/* Logo */}
      <div style={{ position: 'absolute', top: 'clamp(10px,2vw,25px)', left: 'clamp(18px,3vw,38px)', zIndex: 10, lineHeight: 0.85, color: isDark ? '#bfbfbf' : '#444444', transition: 'color 0.7s' }}>
       {['sarah','abane'].map((c, i) => (
          <div key={i} style={{ fontSize: 'clamp(20px,3.5vw,45px)', fontWeight: 400, letterSpacing: '-0.03em' }}>{c}</div>
        ))}
      </div>

      {/* Left info */}
      <div style={{ position: 'absolute', left: 'clamp(18px,3vw,38px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: isDark ? '#fff' : '#000', transition: 'color 0.7s, opacity 0.4s' }}>
        <div style={{ fontSize: 'clamp(18px,1.8vw,30px)', fontWeight: 400, lineHeight: 1 }}>
          {proj.title.split('\n').map((part, index) => (
            <div key={index}>{part}</div>
          ))}
        </div>
        <div style={{ fontSize: 'clamp(8px,1.2vw,16px)', fontWeight: 300, opacity: 0.6, marginTop: 4, lineHeight: 1.2 }}>
          {(() => {
            // First check if subtitle contains newlines
            if (proj.subtitle.includes('\n')) {
              // Handle newline-based subtitles
              return proj.subtitle.split('\n').map((part, index) => (
                <div key={index}>{part.trim()}</div>
              ));
            }
            
            const parts = proj.subtitle.split(',');
            if (parts.length === 2 && parts[1].includes('&')) {
              // Handle "Research, System Analysis & Flowchart Design" format
              const firstPart = parts[0].trim();
              const secondPart = parts[1].trim();
              const [systemAnalysis, flowchartDesign] = secondPart.split('&').map(s => s.trim());
              return (
                <>
                  <div>{firstPart}, {systemAnalysis}</div>
                  <div>{flowchartDesign}</div>
                </>
              );
            }
            // Default behavior for other formats
            return parts.map((part, index) => (
              <div key={index}>{part.trim()}</div>
            ));
          })()}
        </div>
      </div>

      {/* Right info */}
      <div style={{ position: 'absolute', right: 'clamp(18px,3vw,38px)', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: isDark ? '#fff' : '#000', textAlign: 'right', transition: 'color 0.7s' }}>
        <div style={{ fontSize: 'clamp(16px,2.2vw,30px)', fontWeight: 400, lineHeight: 1 }}>{proj.category}</div>
        <div style={{ fontSize: 'clamp(13px,1.8vw,24px)', fontWeight: 300, opacity: 0.5, marginTop: 4, lineHeight: 1 }}>{proj.year}</div>
      </div>

      {/* Bottom left */}
      <div style={{ position: 'absolute', bottom: 'clamp(18px,3vw,34px)', left: 'clamp(18px,3vw,38px)', zIndex: 10, color: isDark ? '#fff' : '#000', transition: 'color 0.7s', fontSize: 'clamp(9px,1vw,12px)', letterSpacing: '0.06em', lineHeight: 1.65, opacity: 0.55 }}>
        <div>period</div><div>Feb. 23 - May 1</div>
      </div>

      {/* Counter */}
      <div style={{ position: 'absolute', bottom: 'clamp(18px,3vw,34px)', right: 'clamp(18px,3vw,38px)', zIndex: 10, color: isDark ? '#fff' : '#000', transition: 'color 0.7s', fontSize: 'clamp(11px,1.2vw,15px)', letterSpacing: '0.05em', opacity: 0.65 }}>
        {String(floorH + 1).padStart(2,'0')} / {String(TOTAL).padStart(2,'0')}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
          <FullscreenProject
          project={fullscreen}
          onBack={() => setFullscreen(null)}
          weekImage={WEEK_IMAGES[fullscreen.id - 1]}
          />
          )}
    </div>
  );
}
