import { useEffect, useState, useRef } from 'react'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 2.5,
  duration: Math.random() * 3 + 3,
  opacity: Math.random() * 0.6 + 0.2,
}))

const LETTERS = ['V','O','I','C','E','I','Q']

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [letterVisible, setLetterVisible] = useState([])
  const progressRef = useRef(null)

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 2200)
    const t4 = setTimeout(() => setPhase(4), 3600)
    const t5 = setTimeout(() => onComplete(), 4500)

    // Reveal letters one by one
    LETTERS.forEach((_, i) => {
      setTimeout(() => setLetterVisible(prev => [...prev, i]), 1400 + i * 110)
    })

    // Progress bar
    let p = 0
    progressRef.current = setInterval(() => {
      p += Math.random() * 3 + 1
      if (p >= 100) { p = 100; clearInterval(progressRef.current) }
      setProgress(Math.min(p, 100))
    }, 40)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      clearTimeout(t4); clearTimeout(t5)
      clearInterval(progressRef.current)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#04040a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: phase === 4 ? 0 : 1,
      transition: phase === 4 ? 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
    }}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) scale(1);   opacity: var(--op); }
          50%  { transform: translateY(-22px) scale(1.2); opacity: calc(var(--op) * 1.4); }
          100% { transform: translateY(0px) scale(1);   opacity: var(--op); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 40px 10px rgba(212,175,55,0.15), 0 0 80px 20px rgba(212,175,55,0.06); }
          50%      { box-shadow: 0 0 80px 20px rgba(212,175,55,0.3),  0 0 140px 40px rgba(212,175,55,0.12); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateSlowR {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.04); }
        }
      `}</style>

      {/* Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: '#D4AF37',
          '--op': p.opacity,
          opacity: phase >= 1 ? p.opacity : 0,
          transition: 'opacity 1.2s ease',
          animation: phase >= 1 ? `floatUp ${p.duration}s ${p.delay}s ease-in-out infinite` : 'none',
        }} />
      ))}

      {/* Central glow orb */}
      <div style={{
        position: 'absolute',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 1s ease',
        animation: phase >= 1 ? 'pulseGlow 3s ease-in-out infinite' : 'none',
      }} />

      {/* Rotating ring outer */}
      <div style={{
        position: 'absolute',
        width: 280, height: 280, borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.15)',
        borderTopColor: 'rgba(212,175,55,0.5)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 1s ease',
        animation: phase >= 1 ? 'rotateSlow 6s linear infinite' : 'none',
      }} />

      {/* Rotating ring inner */}
      <div style={{
        position: 'absolute',
        width: 220, height: 220, borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.1)',
        borderBottomColor: 'rgba(212,175,55,0.4)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 1s ease',
        animation: phase >= 1 ? 'rotateSlowR 4s linear infinite' : 'none',
      }} />

      {/* Diamond ring */}
      <div style={{
        position: 'absolute',
        width: 170, height: 170, borderRadius: '50%',
        border: '1px dashed rgba(212,175,55,0.2)',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 1s ease',
        animation: phase >= 2 ? 'ringPulse 2.5s ease-in-out infinite' : 'none',
      }} />

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative', zIndex: 2 }}>

        {/* Logo */}
        <div style={{
          marginBottom: 28,
          opacity: phase >= 2 ? 1 : 0,
          animation: phase >= 2 ? 'scaleIn 0.7s ease forwards' : 'none',
        }}>
          <img
            src="https://static.wixstatic.com/media/38fefd_6918bd121bcf48d6a348508e22b4bb38~mv2.png/v1/crop/x_1482,y_1683,w_1234,h_801/fill/w_268,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/The%20Voice%20Company_gold-03-03.png"
            alt="The Voice Company"
            style={{ width: 110, objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.5))' }}
          />
        </div>

        {/* VOICEIQ letter-by-letter */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {LETTERS.map((letter, i) => (
            <span key={i} style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              background: letterVisible.includes(i)
                ? 'linear-gradient(90deg, #8B6914, #D4AF37, #F5E6A3, #D4AF37, #8B6914)'
                : 'transparent',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: letterVisible.includes(i) ? 'transparent' : 'transparent',
              color: 'transparent',
              opacity: letterVisible.includes(i) ? 1 : 0,
              transform: letterVisible.includes(i) ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              animation: letterVisible.includes(i) ? 'shimmer 3s linear infinite' : 'none',
              textShadow: 'none',
              filter: letterVisible.includes(i) ? 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' : 'none',
            }}>{letter}</span>
          ))}
        </div>

        {/* Divider line */}
        <div style={{
          width: phase >= 3 ? 240 : 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
          transition: 'width 0.8s ease',
          marginBottom: 14,
        }} />

        {/* Tagline */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)',
          color: 'rgba(248,246,240,0.65)',
          letterSpacing: '0.18em',
          opacity: phase >= 3 ? 1 : 0,
          animation: phase >= 3 ? 'fadeUp 0.8s ease forwards' : 'none',
          marginBottom: 40,
        }}>
          Your AI Vocal Practice Companion
        </div>

        {/* Progress bar */}
        <div style={{
          width: 200, height: 2,
          background: 'rgba(212,175,55,0.12)',
          borderRadius: 2, overflow: 'hidden',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
          marginBottom: 10,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B6914, #D4AF37, #F5E6A3)',
            borderRadius: 2,
            transition: 'width 0.1s linear',
            boxShadow: '0 0 8px rgba(212,175,55,0.6)',
          }} />
        </div>

        {/* Loading text */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.5rem',
          color: 'rgba(212,175,55,0.4)',
          letterSpacing: '0.3em',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          {progress < 100 ? 'AWAKENING YOUR VOCAL WORLD' : 'ENTER THE JOURNEY'}
        </div>
      </div>
    </div>
  )
}
