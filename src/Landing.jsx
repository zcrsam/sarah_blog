import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroSec from "./assets/template/heroSec.png";
import heroSecLeft from "./assets/template/heroSecLeft.png";
import heroSecRight from "./assets/template/heroSecRight.png";
import decorLeft from "./assets/template/2Left.png";
import decorRight from "./assets/template/2Right.png";

gsap.registerPlugin(ScrollTrigger);

// ─── WEEKLY CLOCK ─────────────────────────────────────────────────────────────
const WeeklyClock = ({ activeWeek, onWeekClick }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const activeRef = useRef(activeWeek);

  useEffect(() => { activeRef.current = activeWeek; }, [activeWeek]);

  const weeks = [
    { label: 'W1',  title: 'Research & Flowchart',       color: '#1a1a1a' },
    { label: 'W2',  title: 'Frontend Dev',                color: '#2d2d2d' },
    { label: 'W3',  title: 'Auth & Backend',              color: '#1a1a1a' },
    { label: 'W4',  title: 'Real-time & UI',              color: '#2d2d2d' },
    { label: 'W5',  title: 'Notif & Optimization',        color: '#1a1a1a' },
    { label: 'W6',  title: 'Email & Booking',             color: '#2d2d2d' },
    { label: 'W7',  title: 'Debugging & UX',              color: '#1a1a1a' },
    { label: 'W8',  title: 'Room Config & Sync',          color: '#2d2d2d' },
    { label: 'W9',  title: 'UI Refinements & Docs',       color: '#1a1a1a' },
    { label: 'W10', title: 'Presentation & Turnover',     color: '#2d2d2d' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let tick = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.38;
      const active = activeRef.current;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#faf9f6';
      ctx.fillRect(0, 0, W, H);

      const total = weeks.length;
      const sliceAngle = (Math.PI * 2) / total;

      weeks.forEach((week, i) => {
        const isActive = active === null || active === i;
        const startAngle = -Math.PI / 2 + i * sliceAngle + 0.02;
        const endAngle = startAngle + sliceAngle - 0.04;
        const midAngle = (startAngle + endAngle) / 2;
        const pulse = isActive ? Math.sin(tick * 0.04 + i * 0.7) * 0.008 : 0;
        const alpha = isActive ? 1 : 0.25;

        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.92 + pulse), startAngle, endAngle);
        ctx.strokeStyle = isActive ? `rgba(10,10,10,${alpha})` : `rgba(10,10,10,0.15)`;
        ctx.lineWidth = isActive ? 2.5 : 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R * (0.52 + pulse), startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = isActive ? `rgba(10,10,10,0.06)` : `rgba(10,10,10,0.02)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.54 + pulse), startAngle, endAngle);
        ctx.strokeStyle = isActive ? `rgba(10,10,10,0.2)` : `rgba(10,10,10,0.07)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const labelR = R * 0.73;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = isActive ? `rgba(10,10,10,0.85)` : `rgba(10,10,10,0.2)`;
        ctx.font = `700 ${Math.max(9, R * 0.1)}px 'Georgia', serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(week.label, 0, 0);
        ctx.restore();

        const dotR = R * 0.96;
        const dx = cx + Math.cos(midAngle) * dotR;
        const dy = cy + Math.sin(midAngle) * dotR;
        ctx.beginPath();
        ctx.arc(dx, dy, isActive ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? `rgba(10,10,10,0.7)` : `rgba(10,10,10,0.15)`;
        ctx.fill();
      });

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
      cg.addColorStop(0, '#fff');
      cg.addColorStop(1, '#f0ede8');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.46, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(10,10,10,0.85)';
      ctx.font = `900 ${Math.max(11, R * 0.12)}px 'Georgia', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('10 WEEKS', cx, cy - R * 0.07);
      ctx.fillStyle = 'rgba(10,10,10,0.35)';
      ctx.font = `${Math.max(8, R * 0.07)}px 'Georgia', serif`;
      ctx.fillText('OJT JOURNEY', cx, cy + R * 0.1);

      const handAngle = -Math.PI / 2 + (tick * 0.008) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(handAngle) * R * 0.88, cy + Math.sin(handAngle) * R * 0.88);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();

      tick++;
      animRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      const size = Math.min(canvas.parentElement?.clientWidth || 380, 380);
      canvas.width = size;
      canvas.height = size;
    };
    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.width; const H = canvas.height;
    const cx = W / 2; const cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    const dx = mx - cx; const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < R * 0.48 || dist > R * 1.05) return;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const total = weeks.length;
    const idx = Math.floor((angle / (Math.PI * 2)) * total);
    onWeekClick(idx === activeWeek ? null : idx);
  };

  const weekData = [
    { w: 'W1',  title: 'Research & Flowchart',       dates: 'Feb 24–27' },
    { w: 'W2',  title: 'Frontend Dev',                dates: 'Mar 2–6'  },
    { w: 'W3',  title: 'Auth & Backend',              dates: 'Mar 9–13' },
    { w: 'W4',  title: 'Real-time & UI',              dates: 'Mar 16–20'},
    { w: 'W5',  title: 'Notif & Optimization',        dates: 'Mar 25–31'},
    { w: 'W6',  title: 'Email & Booking',             dates: 'Apr 1–9'  },
    { w: 'W7',  title: 'Debugging & UX',              dates: 'Apr 13–18'},
    { w: 'W8',  title: 'Room Config & Sync',          dates: 'Apr 20–24'},
    { w: 'W9',  title: 'UI Refinements & Docs',       dates: 'Apr 27–30'},
    { w: 'W10', title: 'Presentation & Turnover',     dates: 'May 1–4'  },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', padding:'24px 16px', background:'#faf9f6' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ borderRadius:'50%', display:'block', cursor:'pointer', border:'1px solid rgba(0,0,0,0.08)' }}
      />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'6px', maxWidth:'380px', width:'100%' }}>
        {weekData.map((item, i) => (
          <button
            key={i}
            onClick={() => onWeekClick(i === activeWeek ? null : i)}
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'6px 10px', borderRadius:'4px',
              background: activeWeek === i ? 'rgba(0,0,0,0.06)' : 'transparent',
              border: activeWeek === i ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.08)',
              cursor:'pointer', textAlign:'left', transition:'all 0.2s',
              opacity: activeWeek !== null && activeWeek !== i ? 0.4 : 1,
            }}
          >
            <span style={{ color:'#1a1a1a', fontSize:'10px', fontWeight:'700', fontFamily:'Georgia, serif', minWidth:'26px' }}>{item.w}</span>
            <div>
              <div style={{ color:'rgba(0,0,0,0.75)', fontSize:'10px', fontWeight:'600', fontFamily:'Georgia, serif' }}>{item.title}</div>
              <div style={{ color:'rgba(0,0,0,0.35)', fontSize:'9px', fontFamily:'Georgia, serif' }}>{item.dates}</div>
            </div>
          </button>
        ))}
      </div>
      {activeWeek !== null && (
        <button
          onClick={() => onWeekClick(null)}
          style={{
            border:'1px solid rgba(0,0,0,0.2)', background:'transparent',
            color:'rgba(0,0,0,0.5)', fontSize:'10px', letterSpacing:'0.15em',
            fontFamily:'Georgia, serif', padding:'6px 18px', borderRadius:'4px',
            cursor:'pointer', textTransform:'uppercase'
          }}
        >Show All Weeks</button>
      )}
    </div>
  );
};

// ─── INLINE IMAGE CAROUSEL (shown directly in the feed post) ─────────────────
const InlineImageCarousel = ({ images, weekId }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const allImages = images || [];
  const total = allImages.length;

  if (total === 0) return null;

  const prev = (e) => { e.stopPropagation(); setCurrentIdx(i => (i - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setCurrentIdx(i => (i + 1) % total); };

  return (
    <div style={{ width:'100%' }}>
      {/* Main image — square Instagram ratio */}
      <div style={{
        width:'100%', aspectRatio:'1/1',
        overflow:'hidden', position:'relative',
        background:'rgba(0,0,0,0.04)',
        borderTop:'1px solid rgba(0,0,0,0.06)',
        borderBottom:'1px solid rgba(0,0,0,0.06)',
      }}>
        <img
          src={allImages[currentIdx]}
          alt={`Week image ${currentIdx + 1}`}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          onError={(e) => {
            if (images && images[currentIdx % images.length]) {
              e.target.src = images[currentIdx % images.length];
            }
          }}
        />

        {/* Prev / Next buttons */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              style={{
                position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)',
                background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
                width:'28px', height:'28px', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:'16px',
                boxShadow:'0 1px 6px rgba(0,0,0,0.2)', fontFamily:'Georgia,serif',
                color:'#1a1a1a', lineHeight:1,
              }}
            >‹</button>
            <button
              onClick={next}
              style={{
                position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
                background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
                width:'28px', height:'28px', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:'16px',
                boxShadow:'0 1px 6px rgba(0,0,0,0.2)', fontFamily:'Georgia,serif',
                color:'#1a1a1a', lineHeight:1,
              }}
            >›</button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div style={{
            position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)',
            display:'flex', gap:'5px', alignItems:'center',
          }}>
            {allImages.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                style={{
                  width: i === currentIdx ? '16px' : '6px',
                  height:'6px', borderRadius:'3px',
                  background: i === currentIdx ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition:'all 0.25s', cursor:'pointer',
                  boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>
        )}

        {/* Counter badge */}
        <div style={{
          position:'absolute', top:'10px', right:'12px',
          background:'rgba(0,0,0,0.45)', color:'#fff',
          fontSize:'10px', fontFamily:"'Georgia', serif",
          padding:'3px 8px', borderRadius:'10px', letterSpacing:'0.08em',
        }}>{currentIdx + 1} / {total}</div>
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div style={{
          display:'flex', gap:'2px', background:'rgba(0,0,0,0.03)',
          borderBottom:'1px solid rgba(0,0,0,0.06)',
        }}>
          {allImages.map((src, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
              style={{
                flex:1, height:'48px', overflow:'hidden', cursor:'pointer',
                opacity: i === currentIdx ? 1 : 0.45,
                outline: i === currentIdx ? '2px solid #1a1a1a' : '2px solid transparent',
                outlineOffset:'-2px', transition:'all 0.2s',
              }}
            >
              <img
                src={src}
                alt={`thumb ${i+1}`}
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={(e) => {
                  if (images && images[i % images.length]) {
                    e.target.src = images[i % images.length];
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── INSTAGRAM FEED ───────────────────────────────────────────────────────────
const IGFeed = ({ weeksData }) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showClock, setShowClock] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);

  const bgPatterns = [
    'repeating-linear-gradient(45deg,#f5f2ed,#f5f2ed 2px,#faf9f6 2px,#faf9f6 12px)',
    'repeating-linear-gradient(0deg,#f0ede8,#f0ede8 1px,#faf9f6 1px,#faf9f6 14px)',
    'radial-gradient(circle at 30% 70%,#ede9e3 0%,#faf9f6 60%)',
    'repeating-linear-gradient(-45deg,#f5f2ed,#f5f2ed 2px,#faf9f6 2px,#faf9f6 12px)',
    'repeating-linear-gradient(90deg,#f0ede8,#f0ede8 1px,#faf9f6 1px,#faf9f6 18px)',
    'radial-gradient(circle at 70% 30%,#ede9e3 0%,#faf9f6 60%)',
    'repeating-linear-gradient(45deg,#f5f2ed,#f5f2ed 1px,#faf9f6 1px,#faf9f6 10px)',
    'radial-gradient(ellipse at center,#f0ede8 0%,#faf9f6 70%)',
    'repeating-linear-gradient(0deg,#f5f2ed,#f5f2ed 2px,#faf9f6 2px,#faf9f6 16px)',
    'radial-gradient(circle at 50% 50%,#ede9e3 0%,#faf9f6 65%)',
  ];
  const icons = ['🔬','💻','🔐','⚡','🔔','📧','🐛','🏠','✨','🎤'];
  const likeCounts = [142,287,198,341,176,523,209,164,247,891];
  const commentCounts = [3,9,14,21,6,32,18,7,15,104];
  const times = ['10 WEEKS AGO','9 WEEKS AGO','8 WEEKS AGO','7 WEEKS AGO','6 WEEKS AGO','5 WEEKS AGO','4 WEEKS AGO','3 WEEKS AGO','2 WEEKS AGO','1 WEEK AGO'];
  const captions = [
    "Started the OJT journey with deep-dive research into hotel reservation systems. Flowcharts, wireframes, and competitor analysis — week one was all about laying the foundation. 📋",
    "First lines of production code. Built the entire client landing page, seat map editor, and admin dashboard from scratch. React components flying everywhere 🚀",
    "Locked in authentication, connected APIs via Postman, set up role-based access control. The backend is alive 🔐 Both Main Wing and Tower Wing seat maps are wired up.",
    "WebSocket is the coolest thing ever. Live seat availability updates, notification dashboard connected to DB. The system feels ALIVE now ⚡",
    "Cleaned up the notification system — edit, delete, bulk delete, pagination. Added reschedule/rebook flows. The bundle size thanks me 😌",
    "Gmail SMTP finally working 🎉 Users now get emails for pending, approved, rejected, and cancelled bookings. Hotel guests will love the Forgot Reference Code feature.",
    "Bug week 😤 Fixed booking cancellation errors, seat limits, dark/light mode, mobile layouts, email template redesigns. Every bug is a lesson. Every fix is a win. 🔧",
    "All rooms configured — 20/20 Function Rooms, Laguna Ballroom, Tower Wing, Dining. Fixed seat color states and reservation persistence. The sync bugs are finally GONE 🏠",
    "Final polish mode activated ✨ Standardized all modals, documented APIs, designed the ReservationPass. Documentation is love.",
    "Presented the full system to the CIO Sir Mark Jerome Castillo. System endorsed and turned over. 10 weeks. 1 full system. Grateful for everything 🎤❤️",
  ];
  const hashtags = [
    "#OJT #ResearchPhase #ThebellevueManila #SystemDesign",
    "#Frontend #ReactJS #SeatMap #AdminDashboard #BellesoftSystems",
    "#Backend #Auth #API #Postman #FullStack",
    "#WebSocket #Realtime #LiveUpdates #Notifications",
    "#Optimization #BulkDelete #ManageBooking #CleanCode",
    "#Email #SMTP #Gmail #BookingSystem #HotelTech",
    "#Debugging #UX #MobileFirst #DarkMode #BugFixes",
    "#RoomConfig #LagunaballRoom #TowerWing #Sync #HotelSystem",
    "#Documentation #UIDesign #ReservationPass #API #FinalStretch",
    "#OJTComplete #Presentation #Turnover #Grateful #ThebellevueManila #FullStack",
  ];
  const comment1 = [
    {user:"sir_castillo", text:"Great initiative on the flowcharts! 💪"},
    {user:"bellesoft_cio", text:"Clean UI — loving the seat editor!"},
    {user:"bellesoft_cio", text:"JWT or sessions? 👀"},
    {user:"sir_castillo", text:"Real-time is a game changer for the hotel 🔥"},
    {user:"ojt_diary_ph", text:"Code splitting is so satisfying 💜"},
    {user:"bellesoft_cio", text:"This is EXACTLY what we needed 👏"},
    {user:"batchmate_cs", text:"The dark mode toggle is so clean!"},
    {user:"sir_castillo", text:"Laguna Ballroom config looks great 🔴"},
    {user:"bellesoft_cio", text:"The ReservationPass design is beautiful!"},
    {user:"sir_castillo", text:"Outstanding work Devian! Proud of you 🎊"},
  ];
  const comment2 = [
    {user:"devian_codes", text:"The wireframes took forever but worth it 😅"},
    {user:"ojt_diary_ph", text:"React dev arc going brrr 💙"},
    {user:"devian_codes", text:"JWT all the way haha 🔑"},
    {user:"batchmate_cs", text:"WebSocket arc unlocked 🎮"},
    {user:"devian_codes", text:"The bundle was a monster before this 😭"},
    {user:"sir_castillo", text:"The email templates look so professional!"},
    {user:"techbro_mnl", text:"Debugging arc is real 😂🐛"},
    {user:"ojt_diary_ph", text:"The sync fix must've been brutal 😅"},
    {user:"devian_codes", text:"Documenting while tired is a vibe 😴📝"},
    {user:"bellesoft_cio", text:"Welcome to the Bellesoft alumni! 💜"},
  ];

  const [counts, setCounts] = useState(likeCounts.slice());

  const toggleLike = (i) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });
    setCounts(prev => {
      const next = [...prev];
      next[i] = likedPosts.has(i) ? next[i] - 1 : next[i] + 1;
      return next;
    });
  };

  const toggleSave = (i) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });
  };

  const weekLabels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'];
  const storyWeeks = [
    {label:'Your story', icon:'🏨', seen:false},
    ...weekLabels.map((w, i) => ({ label: w, icon: icons[i], seen: i >= 4, idx: i }))
  ];

  const visiblePosts = activeWeek !== null ? weeksData.filter((_, i) => i === activeWeek) : weeksData;

  return (
    <div style={{ background:'#faf9f6', fontFamily:"'Georgia', 'Times New Roman', serif", maxWidth:'600px', margin:'0 auto', width:'100%' }}>

      {/* ── NAV ── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'10px 16px', borderBottom:'1px solid rgba(0,0,0,0.1)',
        position:'sticky', top:0, background:'rgba(250,249,246,0.95)',
        backdropFilter:'blur(8px)', zIndex:100
      }}>
        <span style={{
          fontSize:'18px', fontWeight:700, letterSpacing:'0.05em',
          fontFamily:"'Georgia', serif", color:'#1a1a1a',
          fontStyle:'italic'
        }}>ojtblog</span>
        <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
          <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{cursor:'pointer'}}>
            <rect x="3" y="3" width="14" height="14" rx="3"/><line x1="10" y1="7" x2="10" y2="13"/><line x1="7" y1="10" x2="13" y2="10"/>
          </svg>
          <div style={{position:'relative'}}>
            <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{cursor:'pointer'}}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" transform="scale(0.83) translate(1.2,1.2)"/>
            </svg>
            <span style={{position:'absolute',top:'-2px',right:'-2px',width:'7px',height:'7px',background:'#1a1a1a',borderRadius:'50%',border:'1.5px solid #faf9f6'}}/>
          </div>
          <div style={{position:'relative'}}>
            <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{cursor:'pointer'}}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" transform="scale(0.83) translate(1.2,1.2)"/>
            </svg>
            <span style={{position:'absolute',top:'-2px',right:'-2px',width:'7px',height:'7px',background:'#1a1a1a',borderRadius:'50%',border:'1.5px solid #faf9f6'}}/>
          </div>
        </div>
      </div>

      {/* ── STORIES ── */}
      <div style={{
        display:'flex', gap:'10px', padding:'10px 14px',
        overflowX:'auto', borderBottom:'1px solid rgba(0,0,0,0.08)',
        scrollbarWidth:'none'
      }}>
        {storyWeeks.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              if (i === 0) return;
              const idx = s.idx;
              setActiveWeek(prev => prev === idx ? null : idx);
            }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', flexShrink:0, cursor: i === 0 ? 'default' : 'pointer' }}
          >
            <div style={{
              width:'50px', height:'50px', borderRadius:'50%', padding:'2px',
              background: i > 0 && activeWeek === s.idx
                ? '#1a1a1a'
                : s.seen
                  ? 'rgba(0,0,0,0.1)'
                  : 'conic-gradient(#1a1a1a 0deg, #555 120deg, #999 240deg, #1a1a1a 360deg)',
              transition:'all 0.2s'
            }}>
              <div style={{
                width:'100%', height:'100%', borderRadius:'50%',
                background:'#faf9f6', border:'2px solid #faf9f6',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'
              }}>{s.icon}</div>
            </div>
            <span style={{
              fontSize:'10px', color: i > 0 && activeWeek === s.idx ? '#1a1a1a' : 'rgba(0,0,0,0.55)',
              fontFamily:"'Georgia', serif", fontWeight: i > 0 && activeWeek === s.idx ? '700' : '400',
              maxWidth:'50px', textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── ACTIVE WEEK LABEL ── */}
      {activeWeek !== null && (
        <div style={{
          padding:'8px 14px', background:'rgba(0,0,0,0.03)',
          borderBottom:'1px solid rgba(0,0,0,0.08)',
          display:'flex', alignItems:'center', justifyContent:'space-between'
        }}>
          <span style={{ fontSize:'11px', fontFamily:"'Georgia', serif", color:'rgba(0,0,0,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            Showing: <strong style={{color:'#1a1a1a'}}>{weekLabels[activeWeek]}</strong>
          </span>
          <button
            onClick={() => setActiveWeek(null)}
            style={{ background:'transparent', border:'none', fontSize:'11px', color:'rgba(0,0,0,0.4)', cursor:'pointer', fontFamily:"'Georgia', serif", textDecoration:'underline' }}
          >Show all</button>
        </div>
      )}

      {/* ── CLOCK TOGGLE ── */}
      <div style={{ background:'#faf9f6', borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🕐</div>
            <div>
              <div style={{ fontSize:'12px', fontWeight:700, color:'#1a1a1a', fontFamily:"'Georgia', serif" }}>sarah_abane</div>
              <div style={{ fontSize:'10px', color:'rgba(0,0,0,0.4)', fontFamily:"'Georgia', serif" }}>OJT Clock · Weekly Overview</div>
            </div>
          </div>
          <button onClick={() => setShowClock(v => !v)} style={{
            background:'transparent', border:'1px solid rgba(0,0,0,0.2)',
            color:'#1a1a1a', fontSize:'10px', padding:'5px 12px', borderRadius:'3px',
            cursor:'pointer', fontWeight:700, fontFamily:"'Georgia', serif", letterSpacing:'0.08em',
            textTransform:'uppercase'
          }}>{showClock ? 'Hide' : 'View Clock'}</button>
        </div>
        {showClock && (
          <div style={{ borderTop:'1px solid rgba(0,0,0,0.06)', background:'#faf9f6' }}>
            <WeeklyClock activeWeek={activeWeek} onWeekClick={setActiveWeek} />
          </div>
        )}
      </div>

      {/* ── POSTS ── */}
      {visiblePosts.map((week, _) => {
        const i = weeksData.indexOf(week);
        return (
          <div key={week.id} style={{ background:'#faf9f6', borderBottom:'1px solid rgba(0,0,0,0.08)' }}>

            {/* Post Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{
                  width:'30px', height:'30px', borderRadius:'50%',
                  background:'rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0
                }}>{icons[i]}</div>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#1a1a1a', fontFamily:"'Georgia', serif" }}>sarah_abane</div>
                  <div style={{ fontSize:'10px', color:'rgba(0,0,0,0.4)', fontFamily:"'Georgia', serif" }}>OJT @ The Bellevue Manila</div>
                </div>
              </div>
              <span style={{ fontSize:'18px', color:'rgba(0,0,0,0.35)', cursor:'pointer', letterSpacing:'0.1em' }}>···</span>
            </div>

            {/* ── Week title card (decorative, above images) ── */}
            <div style={{
              width:'100%', aspectRatio:'4/1.2',
              background: bgPatterns[i],
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              position:'relative', overflow:'hidden',
              borderTop:'1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{ position:'absolute', inset:'10px', border:'1px solid rgba(0,0,0,0.08)', pointerEvents:'none' }} />
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', padding:'12px 32px', zIndex:1, textAlign:'center' }}>
                <span style={{ fontSize:'8px', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(0,0,0,0.3)', fontFamily:"'Georgia', serif" }}>
                  — Week {week.id} —
                </span>
                <span style={{
                  fontSize:'clamp(16px,3.5vw,22px)', fontWeight:900,
                  letterSpacing:'-0.02em', textAlign:'center', lineHeight:1.2,
                  color:'#1a1a1a', fontFamily:"'Georgia', serif"
                }}>{week.name}</span>
                <span style={{ fontSize:'10px', color:'rgba(0,0,0,0.4)', fontFamily:"'Georgia', serif", fontStyle:'italic' }}>{week.dates}</span>
              </div>
              <span style={{
                position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)',
                fontSize:'clamp(40px,8vw,60px)', fontWeight:900,
                lineHeight:1, color:'rgba(0,0,0,0.05)', letterSpacing:'-3px',
                userSelect:'none', pointerEvents:'none', fontFamily:"'Georgia', serif"
              }}>{week.id}</span>
              <span style={{
                position:'absolute', top:'10px', left:'12px',
                fontSize:'8px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                color:'rgba(0,0,0,0.25)', fontFamily:"'Georgia', serif"
              }}>{week.category}</span>
            </div>

            {/* ── INLINE IMAGE CAROUSEL ── */}
            <InlineImageCarousel images={week.images} weekId={week.id} />

            {/* Actions */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 12px' }}>
              <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                <button onClick={() => toggleLike(i)} style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
                  <svg width="20" height="20" fill={likedPosts.has(i) ? '#1a1a1a' : 'none'} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" transform="scale(0.83) translate(1.2,1.2)"/>
                  </svg>
                </button>
                <button style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
                  <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" transform="scale(0.83) translate(1.2,1.2)"/>
                  </svg>
                </button>
                <button style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
                  <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18.5" y1="1.7" x2="9.2" y2="10.8" transform="scale(0.83) translate(1.2,1.2)"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2" transform="scale(0.83) translate(1.2,1.2)"/>
                  </svg>
                </button>
              </div>
              <button onClick={() => toggleSave(i)} style={{ background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
                <svg width="20" height="20" fill={savedPosts.has(i) ? '#1a1a1a' : 'none'} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" transform="scale(0.83) translate(1.2,1.2)"/>
                </svg>
              </button>
            </div>

            <div style={{ padding:'0 12px 3px', fontSize:'12px', fontWeight:700, color:'#1a1a1a', fontFamily:"'Georgia', serif" }}>
              {counts[i].toLocaleString()} likes
            </div>

            {/* Caption */}
            <div style={{ padding:'0 12px 3px', fontSize:'12px', lineHeight:1.5, color:'#1a1a1a', fontFamily:"'Georgia', serif" }}>
              <strong style={{ fontWeight:700 }}>sarah_abane</strong>{' '}
              <span style={{ color:'rgba(0,0,0,0.7)' }}>{captions[i]}</span>{' '}
              <span style={{ color:'rgba(0,0,0,0.4)', fontSize:'11px' }}>{hashtags[i]}</span>
            </div>

            {/* Week details as expandable caption */}
            <div style={{ padding:'0 12px 4px' }}>
              <details style={{ fontFamily:"'Georgia', serif" }}>
                <summary style={{ fontSize:'11px', color:'rgba(0,0,0,0.4)', cursor:'pointer', listStyle:'none', fontStyle:'italic' }}>
                  View week details ▾
                </summary>
                <div style={{ marginTop:'6px', padding:'10px', background:'rgba(0,0,0,0.02)', borderRadius:'3px', border:'1px solid rgba(0,0,0,0.06)' }}>
                  <p style={{ fontSize:'11px', color:'rgba(0,0,0,0.65)', lineHeight:1.6, marginBottom:'6px', fontFamily:"'Georgia', serif" }}>
                    {week.description}
                  </p>
                  <p style={{ fontSize:'10px', color:'rgba(0,0,0,0.4)', fontFamily:"'Georgia', serif", marginBottom:'4px' }}>
                    <strong>Topics:</strong> {week.topics}
                  </p>
                  <p style={{ fontSize:'10px', color:'rgba(0,0,0,0.4)', fontFamily:"'Georgia', serif" }}>
                    <strong>Outcomes:</strong> {week.outcomes}
                  </p>
                </div>
              </details>
            </div>

            <div style={{ padding:'0 12px 2px', fontSize:'11px', color:'rgba(0,0,0,0.4)', cursor:'pointer', fontFamily:"'Georgia', serif", fontStyle:'italic' }}>
              View all {commentCounts[i]} comments
            </div>

            {/* Comments */}
            <div style={{ padding:'0 12px 2px', fontSize:'12px', color:'#1a1a1a', lineHeight:1.5, fontFamily:"'Georgia', serif" }}>
              <strong style={{ fontWeight:700 }}>{comment1[i].user}</strong>{' '}{comment1[i].text}
            </div>
            <div style={{ padding:'0 12px 2px', fontSize:'12px', color:'#1a1a1a', lineHeight:1.5, fontFamily:"'Georgia', serif" }}>
              <strong style={{ fontWeight:700 }}>{comment2[i].user}</strong>{' '}{comment2[i].text}
            </div>

            <div style={{ padding:'2px 12px 6px', fontSize:'9px', color:'rgba(0,0,0,0.3)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'Georgia', serif" }}>
              {times[i]}
            </div>

            <div style={{ display:'flex', alignItems:'center', padding:'6px 12px', borderTop:'0.5px solid rgba(0,0,0,0.07)', gap:'8px' }}>
              <div style={{
                width:'22px', height:'22px', borderRadius:'50%',
                background:'#1a1a1a',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'9px', fontWeight:700, color:'#faf9f6', flexShrink:0,
                fontFamily:"'Georgia', serif"
              }}>DA</div>
              <input
                type="text"
                placeholder="Add a comment..."
                style={{ flex:1, background:'none', border:'none', color:'rgba(0,0,0,0.5)', fontSize:'12px', outline:'none', fontFamily:"'Georgia', serif" }}
              />
              <button style={{ fontSize:'12px', fontWeight:700, color:'rgba(0,0,0,0.5)', cursor:'pointer', background:'none', border:'none', fontFamily:"'Georgia', serif" }}>
                Post
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN PORTFOLIO ───────────────────────────────────────────────────────────
const DevianPortfolio = () => {
  const heroSceneRef = useRef(null);
  const heroAfterRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const contactInnerRef = useRef(null);
  const creativeSectionRef = useRef(null);
  const wordsSectionRef = useRef(null);
  const wordTextRef = useRef(null);
  const statsSectionRef = useRef(null);
  const expertiseSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weeksData = [
    { id:'01', name:'WEEK ONE',   dates:'February 24–27, 2026', category:'RESEARCH & SYSTEM ANALYSIS',
      description:'Focused on research and development related to seat and table management systems used in hotels, restaurants, and event venues. Analyzed existing reservation platforms and studied their workflows, functionalities, and user interfaces.',
      topics:'System Research, Competitor Analysis, Flowchart Design, UI/UX Wireframing', duration:'4 days',
      outcomes:'Created comparison tables, designed initial system flowcharts for client and admin sides, and produced initial UI/UX layout concepts for the landing page, reservation pages, and dashboard interfaces.',
      images:['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80&fit=crop'] },
    { id:'02', name:'WEEK TWO',   dates:'March 2–6, 2026',      category:'FRONTEND DEVELOPMENT',
      description:'Officially started the development phase with a focus on front-end development for both client and admin sides of the Seat and Table Reservation Management System.',
      topics:'Client Landing Page, All Venues Page, Seat Map Layout, Admin Dashboard, Login Page', duration:'5 days',
      outcomes:'Developed the client-side landing page, "All Venues" page, seat/table layouts, admin login page, admin dashboard, and seat map editor. Implemented table/seat add-delete functions and improved UI consistency.',
      images:['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&fit=crop'] },
    { id:'03', name:'WEEK THREE', dates:'March 9–13, 2026',     category:'AUTHENTICATION & BACKEND',
      description:'Focused on authentication, backend integration, and real-time reservation synchronization between the client and admin systems.',
      topics:'Authentication, Postman API Testing, Database Integration, Role-Based Access, Notifications', duration:'5 days',
      outcomes:'Implemented login authentication, connected backend with Postman for API testing, displayed reservation data in admin panels, configured Main Wing and Tower Wing seat maps, and added navigation notification icon.',
      images:['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80&fit=crop'] },
    { id:'04', name:'WEEK FOUR',  dates:'March 16–20, 2026',    category:'REAL-TIME FEATURES & UI',
      description:'Focused on fixing system issues, improving user experience, and implementing real-time functionalities including WebSocket integration.',
      topics:'WebSocket Integration, Notification Dashboard, Real-time Sync, Pagination, Responsiveness', duration:'5 days',
      outcomes:'Fixed connection errors, corrected seat status color legends, built and connected Notification Dashboard to database, implemented WebSocket for live updates, improved dashboard responsiveness and time formatting.',
      images:['https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop'] },
    { id:'05', name:'WEEK FIVE',  dates:'March 25–31, 2026',    category:'NOTIFICATION & OPTIMIZATION',
      description:'Enhanced notification management and implemented booking management functionalities with code optimization.',
      topics:'Manage Booking, Edit/Delete Notifications, Pagination, Mobile Responsiveness, Code Splitting', duration:'5 days',
      outcomes:'Added edit/delete for notifications with pagination, implemented auto-deletion for removed seats/tables, developed Manage Booking (cancel/edit/reschedule/rebook), added sorting by most recent, and optimized code structure.',
      images:['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80&fit=crop'] },
    { id:'06', name:'WEEK SIX',   dates:'April 1–9, 2026',      category:'EMAIL & BOOKING INTEGRATION',
      description:'Improved the Manage Booking module with database integration and implemented a complete email notification system using Gmail SMTP.',
      topics:'Gmail SMTP, Email Templates, Booking Search, Forgot Reference Code, Dynamic Venue Creation', duration:'7 days',
      outcomes:'Integrated Manage Booking with database, added search/validation/cancellation features, implemented email notifications for pending/approved/rejected/cancelled statuses, added Forgot Reference Code feature, and improved UI across multiple pages.',
      images:['https://images.unsplash.com/photo-1596526131083-e8c633064f28?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80&fit=crop'] },
    { id:'07', name:'WEEK SEVEN', dates:'April 13–18, 2026',    category:'DEBUGGING & UX ENHANCEMENTS',
      description:'Focused on debugging reservation logic, improving validations, and enhancing user experience across multiple system components.',
      topics:'Booking Cancellation Fix, Seat Validation, Mobile UX, Email Template Redesign, Dark/Light Mode', duration:'5 days',
      outcomes:'Fixed booking cancellation errors, seat limits, and invalid statuses. Improved Notifications mobile layout, added Select All bulk delete, redesigned email templates, fixed homepage animations and carousel, and implemented email subscription flow.',
      images:['https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&q=80&fit=crop'] },
    { id:'08', name:'WEEK EIGHT', dates:'April 20–24, 2026',    category:'ROOM CONFIG & SYNC FIXES',
      description:'Completed room configurations for Main Wing, Tower Wing, and Dining areas, and resolved critical reservation synchronization issues.',
      topics:'Room Configuration, Subroom Setup, Seat Color States, Approval Workflow, Reservation Persistence', duration:'5 days',
      outcomes:'Added 20/20 Function Rooms and Laguna Ballroom configurations. Fixed seat color states, modal handling, reservation persistence bugs, and ensured approved reservations reflected correct reserved status in real time.',
      images:['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80&fit=crop'] },
    { id:'09', name:'WEEK NINE',  dates:'April 27–30, 2026',    category:'UI REFINEMENTS & DOCUMENTATION',
      description:'Final UI refinements, synchronization fixes across Tower Wing, and thorough system documentation for future maintainers.',
      topics:'Modal Standardization, Sync Fixes, API Documentation, ReservationPass Design, Notification Cleanup', duration:'4 days',
      outcomes:'Fixed invisible modal pop-ups and inconsistent designs in Main Wing rooms. Standardized modal interfaces, fixed Tower Wing seat sync, documented APIs and database seeders, and developed ReservationPass design using Inter font.',
      images:['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=600&q=80&fit=crop'] },
    { id:'10', name:'WEEK TEN',   dates:'May 1–4, 2026',        category:'PRESENTATION & PROJECT TURNOVER',
      description:'Final week dedicated to preparing the system for presentation to the Chief Information Officer and executing a complete project turnover.',
      topics:'System Review, CIO Presentation, Documentation, Project Endorsement, Recommendations', duration:'4 days',
      outcomes:'Reviewed all modules end-to-end, presented to Sir Mark Jerome Castillo (CIO), finalized presentation materials and documentation, documented revisions and pending improvements, and endorsed the system to the next OJT trainee.',
      images:['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop'] },
  ];

  const openModal = (work) => { setSelectedWork(work); setIsModalOpen(true); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { setIsModalOpen(false); setSelectedWork(null); document.body.style.overflow = 'unset'; };

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const heroScene = heroSceneRef.current;
      const heroAfter = heroAfterRef.current;
      const heroSection = document.querySelector('#hero');

      if (heroScene && heroAfter && heroSection) {
        gsap.to(heroScene, {
          scale: 20, transformOrigin: '50% 50%', ease: 'none',
          scrollTrigger: {
            trigger: heroSection, start: 'top top', end: 'bottom bottom', scrub: 1.2,
            onUpdate(self) {
              const p = self.progress;
              const sceneAlpha = p < 0.55 ? 1 : gsap.utils.mapRange(0.55, 0.72, 1, 0, p);
              const afterAlpha = p < 0.60 ? 0 : gsap.utils.mapRange(0.60, 0.78, 0, 1, p);
              heroScene.style.opacity = Math.max(0, sceneAlpha);
              heroAfter.style.opacity = Math.min(1, Math.max(0, afterAlpha));
            }
          }
        });
      }

      const heroImgs = document.querySelectorAll('.hero__img');
      if (heroImgs.length > 0) {
        gsap.from(heroImgs, { opacity:0, y:50, scale:0.92, stagger:0.1, duration:1, delay:0.2, ease:'power3.out' });
      }

      const creativeSection = creativeSectionRef.current;
      if (creativeSection) {
        const words = creativeSection.querySelectorAll('.creative__word');
        if (words.length > 0) {
          gsap.to(words, { y:0, stagger:0.18, duration:0.9, ease:'power3.out',
            scrollTrigger: { trigger:creativeSection, start:'top 65%', toggleActions:'play none none reverse' } });
        }
      }

      const wordText = wordTextRef.current;
      if (wordText) {
        const wordSpans = wordText.querySelectorAll('span');
        const total = wordSpans.length;
        wordSpans.forEach((span, i) => {
          const startPct = (i / total) * 70;
          const endPct = ((i + 1) / total) * 70 + 8;
          gsap.to(span, { opacity:1, y:0, ease:'none',
            scrollTrigger: { trigger:wordsSectionRef.current, start:`top+=${startPct}% top`, end:`top+=${endPct}% top`, scrub:0.5 } });
        });
      }

      // Animate the decorative side images in the words section
      const decorLeftEl = document.querySelector('.words__decor-left');
      const decorRightEl = document.querySelector('.words__decor-right');
      if (decorLeftEl && decorRightEl && wordsSectionRef.current) {
        gsap.fromTo(decorLeftEl,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: wordsSectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } }
        );
        gsap.fromTo(decorRightEl,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: wordsSectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } }
        );
      }

      const statsSection = statsSectionRef.current;
      if (statsSection) {
        const stats = statsSection.querySelectorAll('.stat');
        if (stats.length > 0) {
          gsap.to(stats, { opacity:1, y:0, stagger:0.12, duration:0.8, ease:'power3.out',
            scrollTrigger: { trigger:statsSection, start:'top 75%', toggleActions:'play none none reverse' } });
        }
      }

      const contactInner = contactInnerRef.current;
      const contactSection = contactSectionRef.current;
      if (contactInner && contactSection) {
        gsap.to(contactInner, { opacity:1, scale:1, duration:1, ease:'back.out(1.2)',
          scrollTrigger: { trigger:contactSection, start:'top 70%', toggleActions:'play none none reverse' } });
      }

      const track = marqueeTrackRef.current;
      if (track) {
        track.innerHTML += track.innerHTML;
        const trackWidth = track.scrollWidth / 2;
        gsap.to(track, { x:-trackWidth, duration:22, ease:'none', repeat:-1 });
      }
    }, 200);

    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--black:#1a1a1a;--white:#faf9f6;--cream:#f0ede8;--gray:#e8e4df}
        html{scroll-behavior:smooth}
        body{font-family:'Georgia','Times New Roman',serif;background:var(--white);color:var(--black);overflow-x:hidden}
        img{display:block;width:100%;height:100%;object-fit:cover}

        .nav{position:fixed;top:0;left:0;width:100%;z-index:200;pointer-events:none}
        .nav__inner{max-width:1280px;margin:0 auto;padding:20px 40px;display:flex;align-items:center;justify-content:space-between}
        .nav a,.nav button,.nav span{pointer-events:auto;color:var(--black);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.08em;font-family:'Georgia',serif}
        .nav__logo{font-size:18px;font-weight:800;color:var(--black);font-style:italic}
        .nav__links{display:flex;gap:40px}
        .nav__cta{border:1px solid var(--black);padding:8px 20px;background:transparent;cursor:pointer;font-size:10px;letter-spacing:0.15em;font-weight:700;text-transform:uppercase}

        .hero{position:relative;height:380vh;background:#ffffff}
        .hero__sticky{position:sticky;top:0;height:100vh;overflow:hidden;background:#ffffff}
        .hero__scene{position:absolute;inset:0;transform-origin:50% 50%;will-change:transform;background:#ffffff}
        .hero__wordmark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;user-select:none;z-index:2}
        .hero__wordmark span{font-size:12vw;font-weight:900;line-height:1;letter-spacing:-0.04em;color:var(--black);font-family:'Georgia',serif}
        .hero__img{position:absolute;overflow:hidden;z-index:1}
        .hero__after{position:absolute;inset:0;background:var(--black);display:flex;align-items:center;justify-content:center;flex-direction:column;opacity:0;pointer-events:none;z-index:10}

        .creative{background:var(--black);padding:120px 40px;text-align:center;overflow:hidden;position:relative}
        .creative h1{font-size:clamp(52px,9vw,130px);font-weight:900;color:var(--white);line-height:0.85;letter-spacing:-0.04em;font-family:'Georgia',serif}
        .creative h1.dim{color:rgba(255,255,255,0.1)}
        .creative__line{overflow:hidden}
        .creative__word{display:inline-block;transform:translateY(110%)}
        .creative p{margin-top:48px;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-family:'Georgia',serif}

        /* WORDS section — bigger side decoratives */
        .words{position:relative;height:250vh;background:var(--white)}
        .words__sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;padding:0 40px;overflow:hidden}
        .words__text{max-width:480px;text-align:center;font-size:clamp(14px,1.8vw,24px);font-weight:700;line-height:1.5;font-family:'Georgia',serif;position:relative;z-index:2}
        .words__text span{display:inline-block;margin:0 4px 4px 0;color:var(--black);opacity:0.07;transform:translateY(16px)}

        /* ── BIGGER decorative side images ── */
        .words__decor-left{
          position:absolute;
          left:-2vw;
          top:50%;
          transform:translateY(-50%);
          width:clamp(200px,26vw,380px);
          pointer-events:none;
          opacity:0;
          z-index:1;
        }
        .words__decor-right{
          position:absolute;
          right:-2vw;
          top:50%;
          transform:translateY(-50%);
          width:clamp(200px,26vw,380px);
          pointer-events:none;
          opacity:0;
          z-index:1;
        }
        .words__decor-left img,.words__decor-right img{
          width:100%;height:auto;object-fit:contain;
        }

        .stats{background:var(--white);padding:72px 40px;border-top:1px solid rgba(0,0,0,0.07)}
        .stats__grid{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:40px}
        .stat{text-align:center;opacity:0;transform:translateY(36px)}
        .stat__val{font-size:clamp(24px,4vw,60px);font-weight:900;letter-spacing:-0.04em;line-height:1.1;font-family:'Georgia',serif}
        .stat__label{margin-top:6px;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(0,0,0,0.35);font-family:'Georgia',serif}

        .marquee{background:var(--black);border-top:1px solid rgba(255,255,255,0.04);overflow:hidden;padding:24px 0}
        .marquee__track{display:flex;gap:40px;white-space:nowrap;will-change:transform}
        .marquee__track span{font-size:clamp(32px,6vw,64px);font-weight:900;color:rgba(255,255,255,0.06);letter-spacing:-0.03em;flex-shrink:0;font-family:'Georgia',serif}

        .contact{background:var(--cream);padding:100px 24px 80px;text-align:center;position:relative;overflow:hidden;border-top:1px solid rgba(0,0,0,0.08)}
        .contact::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(0,0,0,0.05);pointer-events:none;width:70vw;height:70vw}
        .contact__inner{position:relative;z-index:2;opacity:0;transform:scale(0.88)}
        .contact__eyebrow{font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(0,0,0,0.3);margin-bottom:24px;font-family:'Georgia',serif}
        .contact__cta{font-size:clamp(28px,6vw,88px);font-weight:900;color:var(--black);letter-spacing:-0.04em;line-height:0.9;margin-bottom:44px;font-family:'Georgia',serif;font-style:italic}
        .contact__btn{display:inline-block;border:1px solid var(--black);color:var(--black);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;padding:14px 40px;text-decoration:none;transition:background 0.3s,color 0.3s;font-family:'Georgia',serif}
        .contact__btn:hover{background:var(--black);color:var(--white)}

        .footer{background:var(--black);border-top:1px solid rgba(255,255,255,0.04);padding:28px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        .footer__logo{font-size:18px;font-weight:900;color:var(--white);font-family:'Georgia',serif;font-style:italic}
        .footer__links{display:flex;gap:28px}
        .footer__links a{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);text-decoration:none;transition:color 0.2s;font-family:'Georgia',serif}
        .footer__links a:hover{color:var(--white)}
        .footer__copy{font-size:9px;color:rgba(255,255,255,0.15);font-family:'Georgia',serif}

        .modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,9,7,0.88);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s}
        .modal.active{opacity:1;visibility:visible}
        .modal__content{background:var(--white);max-width:720px;width:90%;max-height:82vh;overflow-y:auto;border-radius:2px;transform:scale(0.92);transition:transform 0.3s;position:relative;border:1px solid rgba(0,0,0,0.1)}
        .modal.active .modal__content{transform:scale(1)}
        .modal__header{padding:32px 32px 24px;border-bottom:1px solid rgba(0,0,0,0.08)}
        .modal__title{font-size:clamp(20px,3.5vw,34px);font-weight:900;color:var(--black);letter-spacing:-0.03em;margin-bottom:6px;font-family:'Georgia',serif;font-style:italic}
        .modal__close{position:absolute;top:12px;right:12px;width:36px;height:36px;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--black)}
        .modal__close:hover{background:rgba(0,0,0,0.05)}
        .modal__footer{padding:16px 32px;border-top:1px solid rgba(0,0,0,0.07);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
        .modal__link{display:inline-block;border:1px solid var(--black);color:var(--black);font-size:9px;letter-spacing:0.25em;text-transform:uppercase;padding:9px 20px;text-decoration:none;transition:all 0.3s;background:transparent;cursor:pointer;font-family:'Georgia',serif}
        .modal__link:hover{background:var(--black);color:var(--white)}

        details summary::-webkit-details-marker { display: none; }
        details summary { user-select: none; }

        #expertise{display:flex;justify-content:center;background:var(--white);border-top:1px solid rgba(0,0,0,0.06)}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav__inner">
          <span className="nav__logo">abane</span>
          <div className="nav__links">
            <a href="#creative">Work</a>
            <a href="#expertise">Journal</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="nav__cta">Portfolio</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero__sticky">
          <div className="hero__scene" ref={heroSceneRef}>
            <div className="hero__img" style={{ top:'5%', left:'2%', width:'22%', height:'85%', zIndex:0 }}>
              <img src={heroSecLeft} alt="Hero Left" style={{ objectFit:'contain', objectPosition:'center' }} />
            </div>
            <div className="hero__img" style={{ top:-30, left:'50%', transform:'translateX(-50%)', width:'38%', height:'100%', zIndex:10 }}>
              <img src={heroImage} alt="Hero" style={{ objectFit:'contain', objectPosition:'center' }} />
            </div>
            <div className="hero__img" style={{ top:'5%', right:'2%', width:'22%', height:'85%', zIndex:0 }}>
              <img src={heroSecRight} alt="Hero Right" style={{ objectFit:'contain', objectPosition:'center' }} />
            </div>
            <div className="hero__wordmark"><span>x</span></div>
            <p style={{
              position:'absolute', bottom:'10vh', left:'50%', transform:'translateX(-50%)',
              fontSize:'10px', letterSpacing:'0.25em', textTransform:'uppercase',
              color:'rgba(0,0,0,0.3)', whiteSpace:'nowrap', zIndex:3, fontFamily:"'Georgia',serif"
            }}>OJT Blog</p>
          </div>

          <div className="hero__after" ref={heroAfterRef}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
              <h1 style={{
                fontSize:'clamp(36px,6vw,84px)', fontWeight:'900', color:'var(--white)',
                lineHeight:'0.9', letterSpacing:'-0.04em', textAlign:'center',
                marginBottom:'20px', fontFamily:"'Georgia',serif", fontStyle:'italic'
              }}>The Bellevue<br />Manila</h1>
              <div style={{ position:'relative', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 28px' }}>
                {[0,1,2,3].map((i) => (
                  <span key={i} style={{
                    position:'absolute', width:'4px', height:'4px', borderRadius:'50%',
                    background:'rgba(255,255,255,0.18)',
                    top: i<2 ? -2 : 'auto', bottom: i>=2 ? -2 : 'auto',
                    left: i%2===0 ? -2 : 'auto', right: i%2===1 ? -2 : 'auto',
                  }} />
                ))}
                <h2 style={{
                  fontSize:'clamp(11px,1.5vw,18px)', fontWeight:'600',
                  color:'rgba(255,255,255,0.28)', letterSpacing:'0.28em',
                  textTransform:'uppercase', fontFamily:"'Georgia',serif", textAlign:'center',
                }}>Bellesoft Systems Inc.</h2>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'16px' }}>
                <svg width="10" height="12" viewBox="0 0 12 14" fill="none" style={{ flexShrink:0, opacity:0.3 }}>
                  <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 6 3.5a1.5 1.5 0 0 1 0 3z" fill="white" />
                </svg>
                <p style={{
                  fontSize:'clamp(9px,1vw,11px)', fontWeight:'500',
                  color:'rgba(255,255,255,0.28)', letterSpacing:'0.18em',
                  textTransform:'uppercase', fontFamily:"'Georgia',serif", margin:0,
                }}>Filinvest City, Alabang, Muntinlupa, Metro Manila</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATIVE */}
      <section className="creative" id="creative" ref={creativeSectionRef}>
        <div className="creative__line">
          <h1><span className="creative__word">Full Stack Developer</span></h1>
        </div>
        <div className="creative__line">
          <h1 className="dim"><span className="creative__word">Intern</span></h1>
        </div>
        <p>Seat & Table Reservation Management System · The Bellevue Manila</p>
      </section>

      {/* WORD REVEAL — bigger decorative side images */}
      <section className="words" id="words" ref={wordsSectionRef}>
        <div className="words__sticky">

          {/* Left decorative image — bigger, pushed slightly out */}
          <div className="words__decor-left">
            <img src={decorLeft} alt="" aria-hidden="true" />
          </div>

          <p className="words__text" ref={wordTextRef}>
            <span>Built</span> <span>a</span> <span>reservation</span> <span>system</span> <span>from</span> <span>research</span> <span>to</span> <span>full</span> <span>development,</span> <span>featuring</span> <span>interactive</span> <span>seat</span> <span>mapping,</span> <span>real-time</span> <span>updates,</span> <span>and</span> <span>a</span> <span>seamless</span> <span>user</span> <span>experience</span> <span>for</span> <span>both</span> <span>clients</span> <span>and</span> <span>admins.</span>
          </p>

          {/* Right decorative image — bigger, pushed slightly out */}
          <div className="words__decor-right">
            <img src={decorRight} alt="" aria-hidden="true" />
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="stats" id="stats" ref={statsSectionRef}>
        <div className="stats__grid">
          <div className="stat">
            <div className="stat__val">February<br />23, 2026</div>
            <div className="stat__label">Start Date</div>
          </div>
          <div className="stat">
            <div className="stat__val">May<br />04, 2026</div>
            <div className="stat__label">End Date</div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM FEED — no modal, inline carousel */}
      <section id="expertise" ref={expertiseSectionRef}>
        <IGFeed weeksData={weeksData} />
      </section>

      {/* MARQUEE */}
      <section className="marquee" id="marquee">
        <div className="marquee__track" ref={marqueeTrackRef}>
          <span>RESEARCH</span><span>·</span>
          <span>FRONTEND</span><span>·</span>
          <span>BACKEND</span><span>·</span>
          <span>REALTIME</span><span>·</span>
          <span>FULLSTACK</span><span>·</span>
          <span>INTERNSHIP</span><span>·</span>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact" ref={contactSectionRef}>
        <div className="contact__inner" ref={contactInnerRef}>
          <p className="contact__eyebrow">Let's work together</p>
          <h2 className="contact__cta">VIEW MY PORTFOLIO</h2>
          <a href="#" className="contact__btn">Portfolio</a>
        </div>
      </section>

      {/* WORKS MODAL (kept for openModal if needed elsewhere) */}
      {isModalOpen && selectedWork && (
        <div className={`modal ${isModalOpen ? 'active' : ''}`} onClick={closeModal}>
          <div className="modal__content" onClick={e => e.stopPropagation()}>
            <button className="modal__close" onClick={closeModal}>×</button>
            <div className="modal__header">
              <h2 className="modal__title">{selectedWork.name}</h2>
            </div>
            <div className="modal__footer">
              <button className="modal__link" onClick={closeModal}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer__logo">abane</span>
        <div className="footer__links">
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
        </div>
        <span className="footer__copy">© 2026 abane. All rights reserved.</span>
      </footer>
    </>
  );
};

export default DevianPortfolio;