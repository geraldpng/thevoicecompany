import { useEffect, useState, useRef } from 'react'

const NOTES = ['♪','♫','♩','♬','♭','𝄞','♮']

const FLOAT_NOTES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  note: NOTES[i % NOTES.length],
  x: 5 + (i / 20) * 90,
  startY: 20 + (i * 37) % 60,
  size: 0.9 + (i % 4) * 0.45,
  delay: i * 0.22,
  duration: 5 + (i % 5),
  drift: (i % 2 === 0 ? 1 : -1) * (20 + i * 4),
  rotate: (i % 2 === 0 ? 1 : -1) * (90 + i * 18),
  opacity: 0.4 + (i % 3) * 0.15,
}))

export default function LoadingScreen({ onComplete }) {
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const [phase, setPhase]       = useState(0)
  const [progress, setProgress] = useState(0)
  const [textIn, setTextIn]     = useState(false)
  const [uiOut, setUiOut]       = useState(false)
  const progressRef = useRef(null)

  /* canvas starfield */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 140 }, (_, i) => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      speed: 0.0015 + (i % 10) * 0.0004,
      gold: i % 4 === 0,
    }))

    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.fillStyle = 'rgba(4,4,10,0.25)'
      ctx.fillRect(0, 0, W, H)
      stars.forEach(s => {
        s.z -= s.speed
        if (s.z <= 0.01) { s.x = Math.random(); s.y = Math.random(); s.z = 1 }
        const px = (s.x - 0.5) / s.z + 0.5
        const py = (s.y - 0.5) / s.z + 0.5
        if (px < 0 || px > 1 || py < 0 || py > 1) return
        const r = Math.max((1 - s.z) * 2.2, 0.3)
        const a = (1 - s.z) * 0.85
        ctx.beginPath()
        ctx.arc(px * W, py * H, r, 0, Math.PI * 2)
        ctx.fillStyle = s.gold ? `rgba(212,175,55,${a})` : `rgba(255,255,255,${a * 0.7})`
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  /* phase timeline */
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setTextIn(true), 1400),
      // Hold text for 2.5s, then zoom island in
      setTimeout(() => setPhase(3), 3900),
      // Exit: fade UI first, then whole screen
      setTimeout(() => setUiOut(true),  4400),
      setTimeout(() => setPhase(4),     4800),
      setTimeout(() => onComplete(),    6200),
    ]
    let p = 0
    progressRef.current = setInterval(() => {
      p += p < 60 ? 3 : 0.8
      if (p >= 100) { p = 100; clearInterval(progressRef.current) }
      setProgress(Math.min(p, 100))
    }, 45)
    return () => { timers.forEach(clearTimeout); clearInterval(progressRef.current) }
  }, [])

  const islandScale   = phase >= 3 ? 1.0 : phase >= 2 ? 0.28 : 0.04
  const islandBlur    = phase >= 3 ? 0   : phase >= 2 ? 6    : 18
  const islandOpacity = phase >= 1 ? 1   : 0
  const tiltX         = phase >= 3 ? 0   : 12

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000, overflow:'hidden', background:'#04040a',
      // Phase 4: fade entire screen, but slowly — so hub appears through it
      opacity:    phase >= 4 ? 0 : 1,
      transition: phase >= 4 ? 'opacity 1.4s cubic-bezier(0.4,0,0.2,1)' : 'none',
    }}>
      <style>{`
        @keyframes noteFloat {
          0%  { opacity:0; transform:translate(0,0) rotate(0deg) scale(0.5); }
          12% { opacity:var(--nop); }
          80% { opacity:var(--nop); }
          100%{ opacity:0; transform:translate(var(--ndx),var(--ndy)) rotate(var(--nrot)) scale(1.1); }
        }
        @keyframes cloudL { 0%{transform:translateX(0);opacity:0.5} 100%{transform:translateX(-65%);opacity:0} }
        @keyframes cloudR { 0%{transform:translateX(0);opacity:0.5} 100%{transform:translateX(65%);opacity:0} }
        @keyframes ambientPulse { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
        @keyframes shimmerText  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes riseIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes particleUp {
          0%  { opacity:0; transform:translateY(0) scale(0.8); }
          20% { opacity:0.7; }
          100%{ opacity:0; transform:translateY(-120px) scale(1.2); }
        }
      `}</style>

      {/* Starfield — fades out early */}
      <canvas ref={canvasRef} style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        opacity: uiOut ? 0 : 1, transition:'opacity 0.8s ease',
      }} />

      {/* Ambient glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(212,175,55,0.14) 0%, transparent 70%)',
        opacity: phase >= 2 ? 1 : 0, transition:'opacity 1.5s ease',
        animation: phase >= 2 ? 'ambientPulse 3s ease-in-out infinite' : 'none',
      }} />

      {/* Island — scales to 1.0 exactly so it matches hub background seamlessly */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'url(/background.png)', backgroundSize:'cover', backgroundPosition:'center',
        transform:`scale(${islandScale}) perspective(900px) rotateX(${tiltX}deg)`,
        filter:`blur(${islandBlur}px)`,
        opacity:islandOpacity, transformOrigin:'center center',
        transition: phase >= 3
          ? 'transform 1.8s cubic-bezier(0.16,1,0.3,1), filter 1.6s ease, opacity 1s ease'
          : 'transform 2.2s cubic-bezier(0.16,1,0.3,1), filter 2s ease, opacity 1.2s ease',
      }} />

      {/* Vignette — lifts as you arrive */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse at center,
          rgba(4,4,10,${phase >= 3 ? 0.3 : 0.68}) 0%,
          rgba(4,4,10,${phase >= 3 ? 0.65 : 0.9}) 100%)`,
        transition:'background 2s ease',
        opacity: uiOut ? 0 : 1,
      }} />

      {/* Clouds parting */}
      {phase >= 1 && phase < 3 && (<>
        <div style={{ position:'absolute', top:'15%', left:0, width:'52%', height:'40%', background:'radial-gradient(ellipse at right, rgba(140,120,190,0.28) 0%, transparent 70%)', filter:'blur(32px)', pointerEvents:'none', animation:'cloudL 3s 0.6s ease-in forwards' }} />
        <div style={{ position:'absolute', top:'15%', right:0, width:'52%', height:'40%', background:'radial-gradient(ellipse at left, rgba(140,120,190,0.28) 0%, transparent 70%)', filter:'blur(32px)', pointerEvents:'none', animation:'cloudR 3s 0.6s ease-in forwards' }} />
        <div style={{ position:'absolute', top:'42%', left:0, width:'45%', height:'30%', background:'radial-gradient(ellipse at right, rgba(100,90,150,0.2) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none', animation:'cloudL 2.6s 1s ease-in forwards' }} />
        <div style={{ position:'absolute', top:'42%', right:0, width:'45%', height:'30%', background:'radial-gradient(ellipse at left, rgba(100,90,150,0.2) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none', animation:'cloudR 2.6s 1s ease-in forwards' }} />
      </>)}

      {/* Musical notes — fade with UI */}
      {phase >= 2 && FLOAT_NOTES.map(n => (
        <div key={n.id} style={{
          position:'absolute', left:`${n.x}%`, top:`${n.startY}%`,
          fontSize:`${n.size}rem`, color:'#D4AF37',
          '--nop': n.opacity, '--ndx':`${n.drift}px`, '--ndy':'-140px', '--nrot':`${n.rotate}deg`,
          textShadow:'0 0 10px rgba(212,175,55,0.8), 0 0 24px rgba(212,175,55,0.35)',
          pointerEvents:'none',
          animation:`noteFloat ${n.duration}s ${n.delay}s ease-in-out infinite`,
          opacity: uiOut ? 0 : 1, transition:'opacity 0.6s ease',
          zIndex:5,
        }}>{n.note}</div>
      ))}

      {/* Text HUD */}
      <div style={{
        position:'absolute', inset:0, zIndex:10, pointerEvents:'none',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        opacity: uiOut ? 0 : 1, transition:'opacity 0.7s ease',
      }}>
        <div style={{
          marginBottom:22, opacity:textIn?1:0,
          transform:textIn?'translateY(0) scale(1)':'translateY(14px) scale(0.92)',
          transition:'all 0.9s cubic-bezier(0.2,0,0.1,1)',
          filter:'drop-shadow(0 0 22px rgba(212,175,55,0.65))',
        }}>
          <img src="https://static.wixstatic.com/media/38fefd_6918bd121bcf48d6a348508e22b4bb38~mv2.png/v1/crop/x_1482,y_1683,w_1234,h_801/fill/w_268,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/The%20Voice%20Company_gold-03-03.png"
            alt="The Voice Company" style={{ width:100, objectFit:'contain' }} />
        </div>
        <div style={{
          fontFamily:"'Cinzel', serif", fontSize:'clamp(2.6rem,5vw,4rem)', fontWeight:700, letterSpacing:'0.18em',
          background:'linear-gradient(90deg,#5C3D0A,#D4AF37,#FBF0C0,#D4AF37,#5C3D0A)',
          backgroundSize:'250% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          animation:'shimmerText 3s linear infinite',
          opacity:textIn?1:0, transform:textIn?'translateY(0)':'translateY(12px)',
          transition:'opacity 0.9s 0.08s ease, transform 0.9s 0.08s ease',
          marginBottom:14, filter:'drop-shadow(0 0 18px rgba(212,175,55,0.45))',
        }}>VOICEIQ</div>
        <div style={{ height:1, marginBottom:14, width:textIn?260:0, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.7),transparent)', transition:'width 1s 0.2s ease' }} />
        <div style={{
          fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize:'clamp(0.82rem,1.2vw,1.05rem)', color:'rgba(248,246,240,0.72)',
          letterSpacing:'0.16em', marginBottom:44,
          opacity:textIn?1:0, animation:textIn?'riseIn 0.8s 0.3s ease forwards':'none',
        }}>Enter your vocal world</div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:9, opacity:phase>=2?1:0, transition:'opacity 0.8s ease' }}>
          <div style={{ width:220, height:2, background:'rgba(212,175,55,0.1)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#7A5C10,#D4AF37,#FBF0C0)', transition:'width 0.12s linear', boxShadow:'0 0 10px rgba(212,175,55,0.75)' }} />
          </div>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.46rem', color:'rgba(212,175,55,0.5)', letterSpacing:'0.28em' }}>
            {progress < 100 ? 'ENTERING THE ISLAND' : 'WELCOME, VOCALIST'}
          </div>
        </div>
      </div>
    </div>
  )
}
