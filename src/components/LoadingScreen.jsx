import { useEffect, useState, useRef } from 'react'

const NOTES = ['♪','♫','♩','♬','♭','𝄞','♮']

const FLOAT_NOTES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  note: NOTES[i % NOTES.length],
  x: 8 + Math.random() * 84,
  startY: 30 + Math.random() * 60,
  size: 0.9 + Math.random() * 1.8,
  delay: 0.4 + Math.random() * 3.5,
  duration: 5 + Math.random() * 5,
  drift: (Math.random() - 0.5) * 120,
  rotate: (Math.random() - 0.5) * 540,
  opacity: 0.35 + Math.random() * 0.55,
}))

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 2,
  dur: 2 + Math.random() * 3,
}))

export default function LoadingScreen({ onComplete }) {
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const [phase, setPhase]       = useState(0)
  const [progress, setProgress] = useState(0)
  const [textIn, setTextIn]     = useState(false)
  const progressRef = useRef(null)

  /* ── Canvas star-stream ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(),
      z: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      color: Math.random() > 0.7 ? '#D4AF37' : '#ffffff',
    }))

    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.fillStyle = 'rgba(4,4,10,0.18)'
      ctx.fillRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2
      stars.forEach(s => {
        s.z -= s.speed
        if (s.z <= 0) { s.x = Math.random(); s.y = Math.random(); s.z = 1 }
        const sx = (s.x - 0.5) / s.z + 0.5
        const sy = (s.y - 0.5) / s.z + 0.5
        const r  = (1 - s.z) * 2.5
        const alpha = (1 - s.z) * 0.8
        if (sx < 0 || sx > 1 || sy < 0 || sy > 1) return
        const grad = ctx.createRadialGradient(sx*W, sy*H, 0, sx*W, sy*H, r*2)
        grad.addColorStop(0, s.color.replace(')', `,${alpha})`).replace('rgb','rgba').replace('#','rgba(').replace('ffffff','255,255,255,').replace('D4AF37','212,175,55,'))
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(sx * W, sy * H, r, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  /* ── Phase timeline ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 2600)
    const t4 = setTimeout(() => setTextIn(true), 3000)
    const t5 = setTimeout(() => setPhase(4), 4000)
    const t6 = setTimeout(() => onComplete(), 5000)

    let p = 0
    progressRef.current = setInterval(() => {
      p += Math.random() * 2.2 + 0.6
      if (p >= 100) { p = 100; clearInterval(progressRef.current) }
      setProgress(Math.min(p, 100))
    }, 45)

    return () => {
      [t1,t2,t3,t4,t5,t6].forEach(clearTimeout)
      clearInterval(progressRef.current)
    }
  }, [])

  const islandScale   = phase >= 2 ? (phase >= 3 ? 1.18 : 0.38) : 0.04
  const islandBlur    = phase >= 3 ? 0 : phase >= 2 ? 4 : 14
  const islandOpacity = phase >= 2 ? 1 : 0
  const islandTilt    = phase >= 3 ? 0 : 8

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, overflow:'hidden', background:'#04040a',
      opacity: phase === 4 ? 0 : 1,
      transition: phase === 4 ? 'opacity 1s cubic-bezier(0.4,0,0.2,1)' : 'none',
    }}>
      <style>{`
        @keyframes noteFloat {
          0%   { opacity:0; transform: translate(0,0) rotate(0deg) scale(0.6); }
          10%  { opacity: var(--op); }
          85%  { opacity: var(--op); }
          100% { opacity:0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1.1); }
        }
        @keyframes cloudPartL {
          0%  { transform: translateX(0); opacity:0.55; }
          100%{ transform: translateX(-58%); opacity:0; }
        }
        @keyframes cloudPartR {
          0%  { transform: translateX(0); opacity:0.55; }
          100%{ transform: translateX(58%); opacity:0; }
        }
        @keyframes glowPulse {
          0%,100%{ opacity:0.18; } 50%{ opacity:0.38; }
        }
        @keyframes shimmer {
          0%  { background-position:-200% center; }
          100%{ background-position:200% center; }
        }
        @keyframes fadeUp {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes scanLine {
          from{ transform: scaleX(0) translateX(-50%); }
          to  { transform: scaleX(1) translateX(0); }
        }
      `}</style>

      {/* Canvas starfield */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />

      {/* Ambient glow behind island */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 60% 50% at 50% 52%, rgba(212,175,55,0.12) 0%, transparent 70%)',
        opacity: phase >= 2 ? 1 : 0, transition:'opacity 1.5s ease',
        animation: phase >= 2 ? 'glowPulse 3s ease-in-out infinite' : 'none',
        pointerEvents:'none',
      }}/>

      {/* Island image — 3D fly-in */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        perspective:'900px',
      }}>
        <div style={{
          width:'100%', height:'100%',
          backgroundImage:'url(/background.png)',
          backgroundSize:'cover', backgroundPosition:'center',
          transform:`scale(${islandScale}) perspective(900px) rotateX(${islandTilt}deg)`,
          filter:`blur(${islandBlur}px)`,
          opacity: islandOpacity,
          transition: phase >= 3
            ? 'transform 1.4s cubic-bezier(0.2,0,0.1,1), filter 1.2s ease, opacity 0.8s ease'
            : 'transform 1.8s cubic-bezier(0.2,0,0.1,1), filter 1.6s ease, opacity 1s ease',
          transformOrigin:'center center',
        }}/>
      </div>

      {/* Dark vignette */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse at center, rgba(4,4,10,${phase>=3?0.45:0.72}) 0%, rgba(4,4,10,${phase>=3?0.78:0.92}) 100%)`,
        transition:'background 1.5s ease',
      }}/>

      {/* Cloud layers */}
      {phase >= 1 && phase < 3 && (<>
        <div style={{
          position:'absolute', top:'20%', left:0, width:'55%', height:'35%',
          background:'radial-gradient(ellipse at right, rgba(160,140,200,0.22) 0%, transparent 70%)',
          filter:'blur(28px)', pointerEvents:'none',
          animation:'cloudPartL 3.2s 0.8s ease-in-out forwards',
        }}/>
        <div style={{
          position:'absolute', top:'20%', right:0, width:'55%', height:'35%',
          background:'radial-gradient(ellipse at left, rgba(160,140,200,0.22) 0%, transparent 70%)',
          filter:'blur(28px)', pointerEvents:'none',
          animation:'cloudPartR 3.2s 0.8s ease-in-out forwards',
        }}/>
        <div style={{
          position:'absolute', top:'45%', left:0, width:'48%', height:'28%',
          background:'radial-gradient(ellipse at right, rgba(120,110,170,0.18) 0%, transparent 70%)',
          filter:'blur(36px)', pointerEvents:'none',
          animation:'cloudPartL 2.8s 1.2s ease-in-out forwards',
        }}/>
        <div style={{
          position:'absolute', top:'45%', right:0, width:'48%', height:'28%',
          background:'radial-gradient(ellipse at left, rgba(120,110,170,0.18) 0%, transparent 70%)',
          filter:'blur(36px)', pointerEvents:'none',
          animation:'cloudPartR 2.8s 1.2s ease-in-out forwards',
        }}/>
      </>)}

      {/* Musical notes */}
      {phase >= 2 && FLOAT_NOTES.map(n => (
        <div key={n.id} style={{
          position:'absolute',
          left:`${n.x}%`, top:`${n.startY}%`,
          fontSize:`${n.size}rem`,
          color:'#D4AF37',
          '--op': n.opacity,
          '--dx': `${n.drift}px`,
          '--dy': `${-80 - Math.random()*120}px`,
          '--rot': `${n.rotate}deg`,
          textShadow:'0 0 12px rgba(212,175,55,0.7), 0 0 28px rgba(212,175,55,0.3)',
          pointerEvents:'none',
          animation:`noteFloat ${n.duration}s ${n.delay}s ease-in-out infinite`,
          zIndex:5,
        }}>{n.note}</div>
      ))}

      {/* HUD text overlay */}
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none',
      }}>

        {/* Logo */}
        <div style={{
          opacity: textIn ? 1 : 0,
          transform: textIn ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.9)',
          transition:'all 0.9s cubic-bezier(0.2,0,0.1,1)',
          marginBottom:20,
          filter:'drop-shadow(0 0 20px rgba(212,175,55,0.6))',
        }}>
          <img
            src="https://static.wixstatic.com/media/38fefd_6918bd121bcf48d6a348508e22b4bb38~mv2.png/v1/crop/x_1482,y_1683,w_1234,h_801/fill/w_268,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/The%20Voice%20Company_gold-03-03.png"
            alt="The Voice Company"
            style={{ width:100, objectFit:'contain' }}
          />
        </div>

        {/* VOICEIQ */}
        <div style={{
          fontFamily:"'Cinzel', serif",
          fontSize:'clamp(2.6rem,5vw,4rem)',
          fontWeight:700,
          letterSpacing:'0.18em',
          background:'linear-gradient(90deg,#6B4F12,#D4AF37,#F5E6A3,#D4AF37,#6B4F12)',
          backgroundSize:'250% auto',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          animation:'shimmer 3s linear infinite',
          opacity: textIn ? 1 : 0,
          transform: textIn ? 'translateY(0)' : 'translateY(12px)',
          transition:'opacity 0.9s 0.1s ease, transform 0.9s 0.1s ease',
          marginBottom:12,
          filter:'drop-shadow(0 0 16px rgba(212,175,55,0.5))',
        }}>VOICEIQ</div>

        {/* Scan line */}
        <div style={{
          width: textIn ? 280 : 0, height:1,
          background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.7),transparent)',
          transition:'width 1s 0.3s ease',
          marginBottom:14,
        }}/>

        {/* Tagline */}
        <div style={{
          fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize:'clamp(0.82rem,1.2vw,1.05rem)',
          color:'rgba(248,246,240,0.7)',
          letterSpacing:'0.16em',
          opacity: textIn ? 1 : 0,
          animation: textIn ? 'fadeUp 0.8s 0.3s ease forwards' : 'none',
          marginBottom:44,
        }}>
          Enter your vocal world
        </div>

        {/* Progress */}
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', gap:8,
          opacity: phase >= 2 ? 1 : 0, transition:'opacity 0.8s ease',
        }}>
          <div style={{
            width:220, height:2, background:'rgba(212,175,55,0.1)', borderRadius:2, overflow:'hidden',
          }}>
            <div style={{
              height:'100%', width:`${progress}%`,
              background:'linear-gradient(90deg,#7A5C10,#D4AF37,#F5E6A3)',
              transition:'width 0.12s linear',
              boxShadow:'0 0 10px rgba(212,175,55,0.7)',
            }}/>
          </div>
          <div style={{
            fontFamily:"'Cinzel', serif", fontSize:'0.45rem',
            color:'rgba(212,175,55,0.45)', letterSpacing:'0.3em',
          }}>
            {progress < 100 ? 'ENTERING THE ISLAND' : 'WELCOME, VOCALIST'}
          </div>
        </div>
      </div>
    </div>
  )
}
