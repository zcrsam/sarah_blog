import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profile1 from "./assets/3.png";
import image1 from "./assets/1.png";
import image2 from "./assets/2.JPG";
import profile2 from "./assets/profile2.jpeg";
import week1 from "./assets/week1.png";
import week2 from "./assets/week2.png";
import week3 from "./assets/week3.jpg";

gsap.registerPlugin(ScrollTrigger);

// ─── CLOCK COMPONENT (mainoage.tsx inline) ───────────────────────────────────
const WeeklyClock = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const weeks = [
    { label: 'W1', title: 'Research & Flowchart', color: '#4ade80' },
    { label: 'W2', title: 'Frontend Dev', color: '#60a5fa' },
    { label: 'W3', title: 'Auth & Backend', color: '#f472b6' },
    { label: 'W4', title: 'Real-time & UI', color: '#fb923c' },
    { label: 'W5', title: 'Notif & Optimization', color: '#a78bfa' },
    { label: 'W6', title: 'Email & Booking', color: '#34d399' },
    { label: 'W7', title: 'Debugging & UX', color: '#fbbf24' },
    { label: 'W8', title: 'Room Config & Sync', color: '#f87171' },
    { label: 'W9', title: 'UI Refinements & Docs', color: '#38bdf8' },
    { label: 'W10', title: 'Presentation & Turnover', color: '#e879f9' },
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

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      // Outer glow ring
      const grd = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.2);
      grd.addColorStop(0, 'rgba(255,255,255,0.03)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      const total = weeks.length;
      const sliceAngle = (Math.PI * 2) / total;

      weeks.forEach((week, i) => {
        const startAngle = -Math.PI / 2 + i * sliceAngle + 0.015;
        const endAngle = startAngle + sliceAngle - 0.03;
        const midAngle = (startAngle + endAngle) / 2;

        // Pulse offset per segment
        const pulse = Math.sin(tick * 0.04 + i * 0.7) * 0.012;

        // Arc segment
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R * (0.52 + pulse), startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = week.color + '22';
        ctx.fill();

        // Outer arc stroke
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.92 + pulse * 0.5), startAngle, endAngle);
        ctx.strokeStyle = week.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner arc stroke
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.54 + pulse), startAngle, endAngle);
        ctx.strokeStyle = week.color + '55';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Week label on arc
        const labelR = R * 0.73;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = week.color;
        ctx.font = `bold ${Math.max(10, R * 0.11)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(week.label, 0, 0);
        ctx.restore();

        // Dot at midpoint on outer ring
        const dotR = R * 0.95;
        const dx = cx + Math.cos(midAngle) * dotR;
        const dy = cy + Math.sin(midAngle) * dotR;
        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = week.color;
        ctx.fill();
      });

      // Center circle
      const centerGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
      centerGrd.addColorStop(0, '#1a1a1a');
      centerGrd.addColorStop(1, '#0d0d0d');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.46, 0, Math.PI * 2);
      ctx.fillStyle = centerGrd;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center text
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `900 ${Math.max(13, R * 0.14)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('10 WEEKS', cx, cy - R * 0.06);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = `${Math.max(9, R * 0.08)}px monospace`;
      ctx.fillText('OJT JOURNEY', cx, cy + R * 0.12);

      // Rotating hand
      const handAngle = -Math.PI / 2 + (tick * 0.008) % (Math.PI * 2);
      const handLen = R * 0.88;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(handAngle) * handLen, cy + Math.sin(handAngle) * handLen);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      tick++;
      animRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      const size = Math.min(canvas.parentElement.clientWidth, 520);
      canvas.width = size;
      canvas.height = size;
    };
    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '40px 20px' }}>
      <canvas ref={canvasRef} style={{ borderRadius: '50%', display: 'block' }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        maxWidth: '520px',
        width: '100%'
      }}>
        {[
          { w: 'W1', title: 'Research & Flowchart', dates: 'Feb 24–27' },
          { w: 'W2', title: 'Frontend Dev', dates: 'Mar 2–6' },
          { w: 'W3', title: 'Auth & Backend', dates: 'Mar 9–13' },
          { w: 'W4', title: 'Real-time & UI', dates: 'Mar 16–20' },
          { w: 'W5', title: 'Notif & Optimization', dates: 'Mar 25–31' },
          { w: 'W6', title: 'Email & Booking', dates: 'Apr 1–9' },
          { w: 'W7', title: 'Debugging & UX', dates: 'Apr 13–18' },
          { w: 'W8', title: 'Room Config & Sync', dates: 'Apr 20–24' },
          { w: 'W9', title: 'UI Refinements & Docs', dates: 'Apr 27–30' },
          { w: 'W10', title: 'Presentation & Turnover', dates: 'May 1–4' },
        ].map((item, i) => {
          const colors = ['#4ade80','#60a5fa','#f472b6','#fb923c','#a78bfa','#34d399','#fbbf24','#f87171','#38bdf8','#e879f9'];
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${colors[i]}33`
            }}>
              <span style={{ color: colors[i], fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', minWidth: '28px' }}>{item.w}</span>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600' }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>{item.dates}</div>
              </div>
            </div>
          );
        })}
      </div>
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
  const worksSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [showClock, setShowClock] = useState(false);


  const weeksData = [
    {
      id: '01',
      name: 'WEEK ONE',
      dates: 'February 24–27, 2026',
      category: 'RESEARCH & SYSTEM ANALYSIS',
      description: 'Focused on research and development related to seat and table management systems used in hotels, restaurants, and event venues. Analyzed existing reservation platforms and studied their workflows, functionalities, and user interfaces.',
      topics: 'System Research, Competitor Analysis, Flowchart Design, UI/UX Wireframing',
      duration: '4 days',
      outcomes: 'Created comparison tables, designed initial system flowcharts for client and admin sides, and produced initial UI/UX layout concepts for the landing page, reservation pages, and dashboard interfaces.',
      images: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '02',
      name: 'WEEK TWO',
      dates: 'March 2–6, 2026',
      category: 'FRONTEND DEVELOPMENT',
      description: 'Officially started the development phase with a focus on front-end development for both client and admin sides of the Seat and Table Reservation Management System.',
      topics: 'Client Landing Page, All Venues Page, Seat Map Layout, Admin Dashboard, Login Page',
      duration: '5 days',
      outcomes: 'Developed the client-side landing page, "All Venues" page, seat/table layouts, admin login page, admin dashboard, and seat map editor. Implemented table/seat add-delete functions and improved UI consistency.',
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '03',
      name: 'WEEK THREE',
      dates: 'March 9–13, 2026',
      category: 'AUTHENTICATION & BACKEND',
      description: 'Focused on authentication, backend integration, and real-time reservation synchronization between the client and admin systems.',
      topics: 'Authentication, Postman API Testing, Database Integration, Role-Based Access, Notifications',
      duration: '5 days',
      outcomes: 'Implemented login authentication, connected backend with Postman for API testing, displayed reservation data in admin panels, configured Main Wing and Tower Wing seat maps, and added navigation notification icon.',
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '04',
      name: 'WEEK FOUR',
      dates: 'March 16–20, 2026',
      category: 'REAL-TIME FEATURES & UI',
      description: 'Focused on fixing system issues, improving user experience, and implementing real-time functionalities including WebSocket integration.',
      topics: 'WebSocket Integration, Notification Dashboard, Real-time Sync, Pagination, Responsiveness',
      duration: '5 days',
      outcomes: 'Fixed connection errors, corrected seat status color legends, built and connected Notification Dashboard to database, implemented WebSocket for live updates, improved dashboard responsiveness and time formatting.',
      images: [
        'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '05',
      name: 'WEEK FIVE',
      dates: 'March 25–31, 2026',
      category: 'NOTIFICATION & OPTIMIZATION',
      description: 'Enhanced notification management and implemented booking management functionalities with code optimization.',
      topics: 'Manage Booking, Edit/Delete Notifications, Pagination, Mobile Responsiveness, Code Splitting',
      duration: '5 days',
      outcomes: 'Added edit/delete for notifications with pagination, implemented auto-deletion for removed seats/tables, developed Manage Booking (cancel/edit/reschedule/rebook), added sorting by most recent, and optimized code structure.',
      images: [
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '06',
      name: 'WEEK SIX',
      dates: 'April 1–9, 2026',
      category: 'EMAIL & BOOKING INTEGRATION',
      description: 'Improved the Manage Booking module with database integration and implemented a complete email notification system using Gmail SMTP.',
      topics: 'Gmail SMTP, Email Templates, Booking Search, Forgot Reference Code, Dynamic Venue Creation',
      duration: '7 days',
      outcomes: 'Integrated Manage Booking with database, added search/validation/cancellation features, implemented email notifications for pending/approved/rejected/cancelled statuses, added Forgot Reference Code feature, and improved UI across multiple pages.',
      images: [
        'https://images.unsplash.com/photo-1596526131083-e8c633064f28?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '07',
      name: 'WEEK SEVEN',
      dates: 'April 13–18, 2026',
      category: 'DEBUGGING & UX ENHANCEMENTS',
      description: 'Focused on debugging reservation logic, improving validations, and enhancing user experience across multiple system components.',
      topics: 'Booking Cancellation Fix, Seat Validation, Mobile UX, Email Template Redesign, Dark/Light Mode',
      duration: '5 days',
      outcomes: 'Fixed booking cancellation errors, seat limits, and invalid statuses. Improved Notifications mobile layout, added Select All bulk delete, redesigned email templates, fixed homepage animations and carousel, and implemented email subscription flow.',
      images: [
        'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '08',
      name: 'WEEK EIGHT',
      dates: 'April 20–24, 2026',
      category: 'ROOM CONFIG & SYNC FIXES',
      description: 'Completed room configurations for Main Wing, Tower Wing, and Dining areas, and resolved critical reservation synchronization issues.',
      topics: 'Room Configuration, Subroom Setup, Seat Color States, Approval Workflow, Reservation Persistence',
      duration: '5 days',
      outcomes: 'Added 20/20 Function Rooms and Laguna Ballroom configurations. Fixed seat color states, modal handling, reservation persistence bugs, and ensured approved reservations reflected correct reserved status in real time.',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '09',
      name: 'WEEK NINE',
      dates: 'April 27–30, 2026',
      category: 'UI REFINEMENTS & DOCUMENTATION',
      description: 'Final UI refinements, synchronization fixes across Tower Wing, and thorough system documentation for future maintainers.',
      topics: 'Modal Standardization, Sync Fixes, API Documentation, ReservationPass Design, Notification Cleanup',
      duration: '4 days',
      outcomes: 'Fixed invisible modal pop-ups and inconsistent designs in Main Wing rooms. Standardized modal interfaces, fixed Tower Wing seat sync, documented APIs and database seeders, and developed ReservationPass design using Inter font.',
      images: [
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=600&q=80&fit=crop'
      ]
    },
    {
      id: '10',
      name: 'WEEK TEN',
      dates: 'May 1–4, 2026',
      category: 'PRESENTATION & PROJECT TURNOVER',
      description: 'Final week dedicated to preparing the system for presentation to the Chief Information Officer and executing a complete project turnover.',
      topics: 'System Review, CIO Presentation, Documentation, Project Endorsement, Recommendations',
      duration: '4 days',
      outcomes: 'Reviewed all modules end-to-end, presented to Sir Mark Jerome Castillo (CIO), finalized presentation materials and documentation, documented revisions and pending improvements, and endorsed the system to the next OJT trainee.',
      images: [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop'
      ]
    }
  ];

  const openModal = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
    document.body.style.overflow = 'unset';
  };

  const openWeekModal = (week) => {
    setSelectedWeek(week);
    setIsWeekModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeWeekModal = () => {
    setIsWeekModalOpen(false);
    setSelectedWeek(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const heroScene = heroSceneRef.current;
      const heroAfter = heroAfterRef.current;
      const heroSection = document.querySelector('#hero');

      if (heroScene && heroAfter && heroSection) {
        gsap.to(heroScene, {
          scale: 20,
          transformOrigin: '50% 50%',
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
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
        gsap.from(heroImgs, { opacity: 0, y: 50, scale: 0.92, stagger: 0.1, duration: 1, delay: 0.2, ease: 'power3.out' });
      }

      const creativeSection = creativeSectionRef.current;
      if (creativeSection) {
        const words = creativeSection.querySelectorAll('.creative__word');
        if (words.length > 0) {
          gsap.to(words, {
            y: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: creativeSection, start: 'top 65%', toggleActions: 'play none none reverse' }
          });
        }
      }

      const wordText = wordTextRef.current;
      if (wordText) {
        const wordSpans = wordText.querySelectorAll('span');
        const total = wordSpans.length;
        wordSpans.forEach((span, i) => {
          const startPct = (i / total) * 70;
          const endPct = ((i + 1) / total) * 70 + 8;
          gsap.to(span, {
            opacity: 1, y: 0, ease: 'none',
            scrollTrigger: {
              trigger: wordsSectionRef.current,
              start: `top+=${startPct}% top`,
              end: `top+=${endPct}% top`,
              scrub: 0.5
            }
          });
        });
      }

      const statsSection = statsSectionRef.current;
      if (statsSection) {
        const stats = statsSection.querySelectorAll('.stat');
        if (stats.length > 0) {
          gsap.to(stats, {
            opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: statsSection, start: 'top 75%', toggleActions: 'play none none reverse' }
          });
        }
      }

      const expertiseSection = expertiseSectionRef.current;
      if (expertiseSection) {
        const services = expertiseSection.querySelectorAll('.service');
        services.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          });
        });
      }

      const worksSection = worksSectionRef.current;
      if (worksSection) {
        const workItems = worksSection.querySelectorAll('.work-item');
        if (workItems.length > 0) {
          gsap.from(workItems, {
            opacity: 0, y: 70, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: worksSection, start: 'top 85%', toggleActions: 'play none none none' }
          });
        }
      }

      const contactInner = contactInnerRef.current;
      const contactSection = contactSectionRef.current;
      if (contactInner && contactSection) {
        gsap.to(contactInner, {
          opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: contactSection, start: 'top 70%', toggleActions: 'play none none reverse' }
        });
      }

      const track = marqueeTrackRef.current;
      if (track) {
        track.innerHTML += track.innerHTML;
        const trackWidth = track.scrollWidth / 2;
        gsap.to(track, { x: -trackWidth, duration: 22, ease: 'none', repeat: -1 });
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--black:#0a0a0a;--white:#ffffff;--gray:#f5f5f5}
        html{scroll-behavior:smooth}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:var(--white);color:var(--black);overflow-x:hidden}
        img{display:block;width:100%;height:100%;object-fit:cover}

        .nav{position:fixed;top:0;left:0;width:100%;z-index:200;pointer-events:none}
        .nav__inner{max-width:1280px;margin:0 auto;padding:24px 40px;display:flex;align-items:center;justify-content:space-between}
        .nav a,.nav button,.nav span{pointer-events:auto;color:var(--black);text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.05em}
        .nav__logo{font-size:20px;font-weight:800;color:var(--black)}
        .nav__links{display:flex;gap:40px}
        .nav__cta{border:1px solid var(--black);padding:10px 22px;background:transparent;cursor:pointer;font-size:11px;letter-spacing:0.12em;font-weight:700}

        .hero{position:relative;height:380vh;background:var(--white)}
        .hero__sticky{position:sticky;top:0;height:100vh;overflow:hidden}
        .hero__scene{position:absolute;inset:0;transform-origin:50% 50%;will-change:transform}
        .hero__wordmark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;user-select:none;z-index:2}
        .hero__wordmark span{font-size:12vw;font-weight:900;line-height:1;letter-spacing:-0.04em;color:var(--black)}
        .hero__img{position:absolute;overflow:hidden;z-index:1}
        .hero__after{position:absolute;inset:0;background:var(--black);display:flex;align-items:center;justify-content:center;flex-direction:column;opacity:0;pointer-events:none;z-index:10}
        .hero__after h1{font-size:13vw;font-weight:900;color:var(--white);line-height:0.85;letter-spacing:-0.04em;text-align:center}
        .hero__after h1.dim{color:rgba(255,255,255,0.15)}

        .creative{background:var(--black);padding:140px 40px;text-align:center;overflow:hidden;position:relative}
        .creative h1{font-size:clamp(60px,11vw,160px);font-weight:900;color:var(--white);line-height:0.85;letter-spacing:-0.04em}
        .creative h1.dim{color:rgba(255,255,255,0.12)}
        .creative__line{overflow:hidden}
        .creative__word{display:inline-block;transform:translateY(110%)}
        .creative p{margin-top:56px;color:rgba(255,255,255,0.35);font-size:12px;letter-spacing:0.3em;text-transform:uppercase}

        .words{position:relative;height:250vh;background:var(--white)}
        .words__sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;padding:0 40px}
        .words__text{max-width:900px;text-align:center;font-size:clamp(28px,5vw,68px);font-weight:900;line-height:1.15}
        .words__text span{display:inline-block;margin:0 12px 8px 0;color:var(--black);opacity:0.07;transform:translateY(20px)}

        .stats{background:var(--white);padding:80px 40px;border-top:1px solid rgba(0,0,0,0.06)}
        .stats__grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:48px}
        .stat{text-align:center;opacity:0;transform:translateY(40px)}
        .stat__val{font-size:clamp(28px,5vw,72px);font-weight:900;letter-spacing:-0.04em;line-height:1.1}
        .stat__label{margin-top:8px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(0,0,0,0.4)}

        .expertise{background:var(--black);padding:80px 40px 100px}
        .expertise__tag{font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:16px}
        .expertise__title{font-size:clamp(40px,7vw,96px);font-weight:900;color:var(--white);letter-spacing:-0.04em;margin-bottom:16px}
        .expertise__header{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:40px}

        .clock-toggle-btn{
          display:inline-flex;align-items:center;gap:8px;
          border:1px solid rgba(255,255,255,0.25);
          background:transparent;
          color:rgba(255,255,255,0.6);
          font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
          padding:12px 20px;cursor:pointer;
          transition:all 0.25s;font-family:inherit;
        }
        .clock-toggle-btn:hover{border-color:var(--white);color:var(--white)}
        .clock-toggle-btn.active{border-color:#a78bfa;color:#a78bfa;background:rgba(167,139,250,0.08)}

        .clock-panel{
          overflow:hidden;
          max-height:0;
          transition:max-height 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
          opacity:0;
        }
        .clock-panel.open{
          max-height:900px;
          opacity:1;
        }
        .clock-panel-inner{
          border:1px solid rgba(255,255,255,0.07);
          border-radius:8px;
          margin-bottom:48px;
          background:rgba(255,255,255,0.02);
          overflow:hidden;
        }

        .service{border-top:1px solid rgba(255,255,255,0.08);padding:48px 0;display:flex;gap:40px;opacity:0;transform:translateX(-60px);cursor:pointer;transition:transform 0.3s ease}
        .service:hover{transform:translateX(10px)!important}
        .service__num{font-size:12px;font-family:monospace;color:rgba(255,255,255,0.2);width:48px;flex-shrink:0;padding-top:4px}
        .service__body{flex:1}
        .service__name{font-size:clamp(20px,3.5vw,48px);font-weight:900;color:var(--white);letter-spacing:-0.03em;margin-bottom:8px}
        .service__dates{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.1em;margin-bottom:10px}
        .service__desc{font-size:13px;color:rgba(255,255,255,0.38);line-height:1.7;max-width:480px}
        .service__more{display:inline-block;margin-top:16px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.4);text-decoration:none;background:none;border:none;cursor:pointer;font-family:inherit;padding:0}
        .service__more:hover{color:var(--white)}
        .service__tag{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.18);padding-top:4px;white-space:nowrap}

        .marquee{background:var(--black);border-top:1px solid rgba(255,255,255,0.05);overflow:hidden;padding:28px 0}
        .marquee__track{display:flex;gap:48px;white-space:nowrap;will-change:transform}
        .marquee__track span{font-size:clamp(40px,7vw,80px);font-weight:900;color:rgba(255,255,255,0.07);letter-spacing:-0.03em;flex-shrink:0}

        .works{background:var(--black);padding:60px 40px 80px;border-top:1px solid rgba(255,255,255,0.05)}
        .works__header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:56px;flex-wrap:wrap;gap:20px}
        .works__title{font-size:clamp(36px,7vw,96px);font-weight:900;color:var(--white);letter-spacing:-0.04em}
        .works__title span{color:rgba(255,255,255,0.15)}
        .work-item{border-top:1px solid rgba(255,255,255,0.07);padding:28px 0;display:flex;align-items:center;gap:20px;cursor:pointer;position:relative;overflow:hidden;transition:transform 0.25s ease}
        .work-item:hover{transform:translateX(14px)!important}
        .work-item::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,0.02);transform:scaleX(0);transform-origin:left;transition:transform 0.3s ease}
        .work-item:hover::before{transform:scaleX(1)}
        .work__num{font-size:11px;font-family:monospace;color:rgba(255,255,255,0.18);width:36px;flex-shrink:0}
        .work__name{font-size:clamp(20px,3.5vw,48px);font-weight:900;color:var(--white);letter-spacing:-0.03em;flex:1}
        .work__cat{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25)}
        .work__arrow{color:rgba(255,255,255,0.35);font-size:18px;margin-left:12px}

        .contact{background:var(--black);padding:120px 24px 100px;text-align:center;position:relative;overflow:hidden}
        .contact::before,.contact::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,255,255,0.04);pointer-events:none}
        .contact::before{width:80vw;height:80vw}
        .contact::after{width:50vw;height:50vw;border-color:rgba(255,255,255,0.06)}
        .contact__inner{position:relative;z-index:2;opacity:0;transform:scale(0.85)}
        .contact__eyebrow{font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:28px}
        .contact__cta{font-size:clamp(36px,8vw,110px);font-weight:900;color:var(--white);letter-spacing:-0.04em;line-height:0.9;margin-bottom:52px}
        .contact__btn{display:inline-block;border:1px solid var(--white);color:var(--white);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;padding:18px 48px;text-decoration:none;transition:background 0.3s,color 0.3s}
        .contact__btn:hover{background:var(--white);color:var(--black)}

        .footer{background:var(--black);border-top:1px solid rgba(255,255,255,0.05);padding:36px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px}
        .footer__logo{font-size:22px;font-weight:900;color:var(--white)}
        .footer__links{display:flex;gap:32px}
        .footer__links a{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);text-decoration:none;transition:color 0.2s}
        .footer__links a:hover{color:var(--white)}
        .footer__copy{font-size:10px;color:rgba(255,255,255,0.18)}

        .modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s}
        .modal.active{opacity:1;visibility:visible}
        .modal__content{background:var(--white);max-width:800px;width:90%;max-height:80vh;overflow-y:auto;border-radius:8px;transform:scale(0.9);transition:transform 0.3s;position:relative}
        .modal.active .modal__content{transform:scale(1)}
        .modal__header{padding:40px;border-bottom:1px solid rgba(0,0,0,0.1)}
        .modal__title{font-size:clamp(24px,4vw,40px);font-weight:900;color:var(--black);letter-spacing:-0.03em;margin-bottom:8px}
        .modal__dates{font-size:12px;color:rgba(0,0,0,0.4);letter-spacing:0.1em;margin-bottom:8px}
        .modal__category{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.4)}
        .modal__body{padding:40px}
        .modal__description{font-size:15px;line-height:1.7;color:rgba(0,0,0,0.8);margin-bottom:28px}
        .modal__details{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-bottom:32px}
        .modal__detail h4{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.4);margin-bottom:6px}
        .modal__detail p{font-size:13px;color:var(--black);line-height:1.5}
        .modal__close{position:absolute;top:16px;right:16px;width:40px;height:40px;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--black);border-radius:4px}
        .modal__close:hover{background:rgba(0,0,0,0.06)}
        .modal__footer{padding:20px 40px;border-top:1px solid rgba(0,0,0,0.08);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
        .modal__link{display:inline-block;border:1px solid var(--black);color:var(--black);font-size:10px;letter-spacing:0.25em;text-transform:uppercase;padding:11px 22px;text-decoration:none;transition:all 0.3s;background:transparent;cursor:pointer;font-family:inherit}
        .modal__link:hover{background:var(--black);color:var(--white)}
        .modal__images{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}
        .modal__image{width:100%;height:160px;object-fit:cover;border-radius:6px}
        .modal__topics{margin-bottom:20px}
        .modal__topics h4{font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.4);margin-bottom:8px}
        .modal__topics p{font-size:13px;color:var(--black);line-height:1.6}
      `}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav__inner">
          <span className="nav__logo">sarah abane</span>
          <div className="nav__links">
            <a href="#expertise">About</a>
            <a href="#works">Works</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="nav__cta">abane's blog</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero__sticky">
          <div className="hero__scene" ref={heroSceneRef}>
            <div className="hero__img" style={{top:'8vh', left:'32%', width:'34vw', height:'28vh'}}>
              <img src={image2} alt="Profile 1" />
            </div>
            <div className="hero__img" style={{top:'12vh', left:'4%', width:'24vw', height:'48vh'}}>
              <img src={image1} alt="Image 1" />
            </div>
            <div className="hero__img" style={{top:'24vh', left:'73%', width:'23vw', height:'64vh'}}>
              <img src={profile1} alt="Profile 2" />
            </div>
            <div className="hero__img" style={{top:'62vh', left:'4%', width:'31vw', height:'30vh'}}>
              <img src={week1} alt="Week 1" />
            </div>
            <div className="hero__img" style={{top:'62vh', left:'38%', width:'26vw', height:'30vh'}}>
              <img src={week2} alt="Week 2" />
            </div>
            
            <div className="hero__wordmark"><span>ojt-blog</span></div>
          </div>
          <div className="hero__after" ref={heroAfterRef}>
            <h1 style={{ fontSize: "7rem" }}>The Bellevue Manila</h1>
            <h1 className="dim" style={{ fontSize: "5.5rem" }}>Bellesoft Department</h1>
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

      {/* WORD REVEAL */}
      <section className="words" id="words" ref={wordsSectionRef}>
        <div className="words__sticky">
          <p className="words__text" ref={wordTextRef}>
            <span>Built</span> <span>a</span> <span>reservation</span> <span>system</span> <span>from</span> <span>research</span> <span>to</span> <span>full</span> <span>development,</span> <span>featuring</span> <span>interactive</span> <span>seat</span> <span>mapping,</span> <span>real-time</span> <span>updates,</span> <span>and</span> <span>a</span> <span>seamless</span> <span>user</span> <span>experience</span> <span>for</span> <span>both</span> <span>clients</span> <span>and</span> <span>admins.</span>
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" id="stats" ref={statsSectionRef}>
        <div className="stats__grid">
          <div className="stat">
            <div className="stat__val">February<br/>23, 2026</div>
            <div className="stat__label">Start Date</div>
          </div>
          <div className="stat">
            <div className="stat__val">May<br/>04, 2026</div>
            <div className="stat__label">End Date</div>
          </div>
        </div>
      </section>

      {/* EXPERTISE / WEEKS */}
      <section className="expertise" id="expertise" ref={expertiseSectionRef}>
        <p className="expertise__tag">OJT Journal</p>

        <div className="expertise__header">
          <h2 className="expertise__title">WEEKLY LOG</h2>
          <button
            className={`clock-toggle-btn ${showClock ? 'active' : ''}`}
            onClick={() => setShowClock(v => !v)}
          >
            <span style={{fontSize:'16px'}}>{showClock ? '⏹' : '🕐'}</span>
            {showClock ? 'HIDE CLOCK' : 'VIEW CLOCK DESIGN'}
          </button>
        </div>

        {/* CLOCK PANEL */}
        <div className={`clock-panel ${showClock ? 'open' : ''}`}>
          <div className="clock-panel-inner">
            <WeeklyClock />
          </div>
        </div>

        {weeksData.map((week) => (
          <div
            className="service"
            key={week.id}
            onClick={() => openWeekModal(week)}
          >
            <div className="service__num">{week.id}</div>
            <div className="service__body">
              <div className="service__name">{week.name}</div>
              <div className="service__dates">{week.dates}</div>
              <div className="service__desc">{week.description}</div>
              <button className="service__more" onClick={(e) => { e.stopPropagation(); openWeekModal(week); }}>
                View details ↗
              </button>
            </div>
            <div className="service__tag">{week.category}</div>
          </div>
        ))}
      </section>

      {/* MARQUEE */}
      <section className="marquee" id="marquee">
        <div className="marquee__track" ref={marqueeTrackRef}>
          <span>RESEARCH</span><span>•</span>
          <span>FRONTEND</span><span>•</span>
          <span>BACKEND</span><span>•</span>
          <span>REALTIME</span><span>•</span>
          <span>FULLSTACK</span><span>•</span>
          <span>INTERNSHIP</span><span>•</span>
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

      {/* WORKS MODAL */}
      {isModalOpen && selectedWork && (
        <div className={`modal ${isModalOpen ? 'active' : ''}`} onClick={closeModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeModal}>×</button>
            <div className="modal__header">
              <h2 className="modal__title">{selectedWork.name}</h2>
              <p className="modal__category">{selectedWork.category}</p>
            </div>
            <div className="modal__body">
              <p className="modal__description">{selectedWork.description}</p>
              <div className="modal__details">
                <div className="modal__detail">
                  <h4>Client</h4>
                  <p>{selectedWork.client}</p>
                </div>
                <div className="modal__detail">
                  <h4>Duration</h4>
                  <p>{selectedWork.duration}</p>
                </div>
                <div className="modal__detail">
                  <h4>Technologies</h4>
                  <p>{selectedWork.technologies}</p>
                </div>
                <div className="modal__detail">
                  <h4>Role</h4>
                  <p>{selectedWork.role}</p>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__link" onClick={closeModal}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* WEEK MODAL */}
      {isWeekModalOpen && selectedWeek && (
        <div className={`modal ${isWeekModalOpen ? 'active' : ''}`} onClick={closeWeekModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeWeekModal}>×</button>
            <div className="modal__header">
              <h2 className="modal__title">{selectedWeek.name}</h2>
              <p className="modal__dates">{selectedWeek.dates}</p>
              <p className="modal__category">{selectedWeek.category}</p>
            </div>
            <div className="modal__body">
              <p className="modal__description">{selectedWeek.description}</p>
              <div className="modal__images">
                {selectedWeek.images.map((image, index) => (
                  <img key={index} src={image} alt={`${selectedWeek.name} - ${index + 1}`} className="modal__image" />
                ))}
              </div>
              <div className="modal__topics">
                <h4>Topics & Focus Areas</h4>
                <p>{selectedWeek.topics}</p>
              </div>
              <div className="modal__details">
                <div className="modal__detail">
                  <h4>Duration</h4>
                  <p>{selectedWeek.duration}</p>
                </div>
                <div className="modal__detail">
                  <h4>Dates</h4>
                  <p>{selectedWeek.dates}</p>
                </div>
                <div className="modal__detail" style={{gridColumn:'1 / -1'}}>
                  <h4>Outcomes & Deliverables</h4>
                  <p>{selectedWeek.outcomes}</p>
                </div>
              </div>
            </div>
            <div className="modal__footer">
              <button className="modal__link" onClick={closeWeekModal}>CLOSE</button>
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