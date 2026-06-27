import { useEffect, useRef } from 'react'

const GOLD = 'rgba(212,175,55,'
const WHITE = 'rgba(220,230,255,'
const NOTES = ['♩','♪','♫','♬','𝄞']

export default function Universe({ warp }) {
  const canvasRef = useRef(null)
  const bloomRef = useRef(null)
  const stateRef = useRef({
    stars: [], particles: [], notes: [],
    mouse: { x: 0, y: 0 },
    warpF: 0, tick: 0, raf: null, bloomRaf: null
  })

  useEffect(() => {
    const s = stateRef.current
    const W = window.innerWidth, H = window.innerHeight

    s.stars = Array.from({ length: 400 }, () => ({
      x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2,
      z: Math.random() * 1000 + 100, px: 0, py: 0, pz: 0,
      r: Math.random() * 1.5 + 0.3, bright: Math.random() * 0.7 + 0.3,
      gold: Math.random() < 0.12
    }))

    s.particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H + H,
      vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.5 + 0.15),
      r: Math.random() * 1.8 + 0.4, a: Math.random() * 0.5 + 0.15, life: Math.random()
    }))

    s.notes = Array.from({ length: 12 }, () => ({
      x: Math.random() * W, y: Math.random() * H * 2 + H,
      sym: NOTES[Math.floor(Math.random() * 5)],
      sz: Math.random() * 14 + 8, sp: Math.random() * 0.35 + 0.15,
      a: Math.random() * 0.2 + 0.04, drift: (Math.random() - 0.5) * 0.25
    }))

    const onMouse = (e) => { s.mouse.x = e.clientX; s.mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouse)

    let bloomTick = 0
    const loop = () => {
      s.raf = requestAnimationFrame(loop)
      s.tick++
      const c = canvasRef.current
      if (!c) return
      const W2 = c.width, H2 = c.height
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, W2, H2)

      // Nebula
      const nb = ctx.createRadialGradient(W2 * 0.5, H2 * 0.55, 0, W2 * 0.5, H2 * 0.55, W2 * 0.65)
      nb.addColorStop(0, 'rgba(30,16,2,0.22)'); nb.addColorStop(0.5, 'rgba(8,4,0,0.08)'); nb.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = nb; ctx.fillRect(0, 0, W2, H2)

      const speed = 0.3 + s.warpF * 22
      const px = (s.mouse.x / W2 - 0.5) * 0.5
      const py = (s.mouse.y / H2 - 0.5) * 0.5

      s.stars.forEach(st => {
        st.pz = st.z
        st.px = st.x / (st.z / 500) + W2 / 2 + px * (1000 - st.z) * 0.003
        st.py = st.y / (st.z / 500) + H2 / 2 + py * (1000 - st.z) * 0.003
        st.z -= speed
        if (st.z <= 1) { st.z = 900 + Math.random() * 100; st.x = (Math.random() - 0.5) * 2; st.y = (Math.random() - 0.5) * 2 }
        const nx = st.x / (st.z / 500) + W2 / 2 + px * (1000 - st.z) * 0.003
        const ny = st.y / (st.z / 500) + H2 / 2 + py * (1000 - st.z) * 0.003
        const sz = (1 - st.z / 1000) * 3.5 * st.r
        if (sz <= 0 || nx < -10 || nx > W2 + 10 || ny < -10 || ny > H2 + 10) return
        const a = st.bright * (1 - st.z / 1000) * (0.5 + 0.5 * Math.sin(s.tick * 0.03 + st.z))
        if (s.warpF > 0.05) {
          ctx.beginPath(); ctx.moveTo(st.px, st.py); ctx.lineTo(nx, ny)
          ctx.strokeStyle = st.gold ? `${GOLD}${a * s.warpF})` : `${WHITE}${a * 0.6 * s.warpF})`
          ctx.lineWidth = sz * 0.6; ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(nx, ny, Math.max(0.3, sz), 0, Math.PI * 2)
        ctx.fillStyle = st.gold ? `rgba(232,213,139,${a})` : `${WHITE}${a})`
        ctx.fill()
      })

      s.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.002
        if (p.life <= 0 || p.y < -20) { p.x = Math.random() * W2; p.y = H2 + 20; p.life = 1; p.vx = (Math.random() - 0.5) * 0.3; p.vy = -(Math.random() * 0.5 + 0.15) }
        const a = p.a * p.life * (1 - s.warpF * 0.6)
        if (a <= 0) return
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${GOLD}${a})`; ctx.fill()
      })

      s.notes.forEach(n => {
        n.y -= n.sp; n.x += n.drift
        if (n.y < -40) { n.y = H2 + 60; n.x = Math.random() * W2 }
        ctx.save(); ctx.font = `${n.sz}px serif`
        ctx.fillStyle = `${GOLD}${n.a * (1 - s.warpF * 0.5)})`; ctx.fillText(n.sym, n.x, n.y)
        ctx.restore()
      })

      // Bloom every 4 frames
      bloomTick++
      if (bloomTick % 4 === 0) {
        const bc = bloomRef.current
        if (bc) {
          const bctx = bc.getContext('2d')
          bctx.clearRect(0, 0, W2, H2)
          bctx.filter = 'blur(28px)'
          bctx.drawImage(c, 0, 0)
          bctx.filter = 'none'
        }
      }
    }
    loop()
    return () => { cancelAnimationFrame(s.raf); window.removeEventListener('mousemove', onMouse) }
  }, [])

  useEffect(() => {
    const s = stateRef.current
    if (warp) s.warpF = Math.min(s.warpF + 0.8, 1)
    else { const iv = setInterval(() => { s.warpF = Math.max(0, s.warpF - 0.08); if (s.warpF === 0) clearInterval(iv) }, 30); return () => clearInterval(iv) }
  }, [warp])

  const resize = () => {
    [canvasRef, bloomRef].forEach(r => { if (r.current) { r.current.width = window.innerWidth; r.current.height = window.innerHeight } })
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const c = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }
  return (
    <>
      <canvas ref={canvasRef} style={{ ...c, zIndex: 1 }} />
      <canvas ref={bloomRef} style={{ ...c, zIndex: 2, opacity: 0.5, mixBlendMode: 'screen' }} />
    </>
  )
}
