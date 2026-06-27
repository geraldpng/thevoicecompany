import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// ─── Atmospheric world canvas ────────────────────────────────────────────────

function WorldCanvas() {
  const ref = useRef()
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const motes = Array.from({ length: 100 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.4 + 0.2,
      s: Math.random() * 0.35 + 0.08,
      o: Math.random() * 0.5 + 0.15,
      drift: Math.random() * 0.4 - 0.2,
    }))

    function draw() {
      const W = (canvas.width = window.innerWidth)
      const H = (canvas.height = window.innerHeight)
      ctx.clearRect(0, 0, W, H)

      // Deep space bg
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.9)
      bg.addColorStop(0, '#0E0B1C')
      bg.addColorStop(0.5, '#080610')
      bg.addColorStop(1, '#040308')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Gold nebula pockets
      ;[
        [0.18, 0.28, 300, 0.05],
        [0.76, 0.55, 220, 0.04],
        [0.48, 0.12, 260, 0.04],
        [0.88, 0.35, 170, 0.035],
        [0.08, 0.72, 190, 0.03],
      ].forEach(([gx, gy, gr, alpha]) => {
        const g = ctx.createRadialGradient(W * gx, H * gy, 0, W * gx, H * gy, gr)
        g.addColorStop(0, `rgba(212,175,55,${alpha})`)
        g.addColorStop(0.6, `rgba(212,175,55,${alpha * 0.3})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })

      // Gold motes
      motes.forEach(p => {
        p.y -= p.s
        p.x += p.drift
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W }
        if (p.x < -5) p.x = W + 5
        if (p.x > W + 5) p.x = -5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,55,${p.o})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ─── Island SVG scenes ────────────────────────────────────────────────────────

const CaveIsland = ({ h }) => (
  <svg viewBox="0 0 170 150" width="170" height="150" overflow="visible">
    <defs>
      <radialGradient id="cave-body" cx="50%" cy="60%" r="70%">
        <stop offset="0%" stopColor="#2D1B55" />
        <stop offset="100%" stopColor="#100820" />
      </radialGradient>
      <radialGradient id="cave-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(139,92,246,0.6)" />
        <stop offset="100%" stopColor="rgba(139,92,246,0)" />
      </radialGradient>
      <filter id="cf"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
    </defs>
    {/* Island body */}
    <path d="M18,108 Q45,124 85,127 Q125,124 152,108 Q148,68 85,60 Q22,68 18,108Z" fill="url(#cave-body)" />
    <path d="M25,105 Q55,118 85,121 Q115,118 145,105 Q140,88 85,84 Q30,88 25,105Z" fill="#1A0A32" opacity="0.7" />
    {/* Gold rim */}
    <path d="M18,108 Q45,124 85,127 Q125,124 152,108" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
    {/* Cave mouth */}
    <path d="M48,108 Q85,82 122,108" fill="#06020F" />
    {/* Cave glow */}
    <ellipse cx="85" cy="100" rx="26" ry="13" fill="url(#cave-glow)" />
    {/* Crystal spires */}
    <g filter="url(#cf)">
      <polygon points="68,104 72,60 76,104" fill="#7C3AED" opacity={h ? 1 : 0.85} />
      <polygon points="78,105 84,46 90,105" fill="#A78BFA" opacity={h ? 1 : 0.9} />
      <polygon points="90,104 94,65 98,104" fill="#6D28D9" opacity={h ? 1 : 0.85} />
      <polygon points="58,105 61,78 64,105" fill="#8B5CF6" opacity="0.8" />
      <polygon points="101,105 104,74 107,105" fill="#9F7AEA" opacity="0.8" />
    </g>
    {/* Crystal tips glow */}
    <circle cx="72" cy="60" r={h ? 3.5 : 2.5} fill="#EDE9FE" opacity={h ? 1 : 0.7} />
    <circle cx="84" cy="46" r={h ? 4 : 3} fill="#F5F3FF" opacity={h ? 1 : 0.7} />
    <circle cx="94" cy="65" r={h ? 3.5 : 2.5} fill="#DDD6FE" opacity={h ? 1 : 0.7} />
    {/* Floating rocks */}
    <ellipse cx="28" cy="90" rx="9" ry="4" fill="#1E1040" opacity="0.7" />
    <ellipse cx="145" cy="86" rx="7" ry="3.5" fill="#1E1040" opacity="0.7" />
    <ellipse cx="38" cy="78" rx="5" ry="2.5" fill="#1E1040" opacity="0.5" />
  </svg>
)

const ForestIsland = ({ h }) => (
  <svg viewBox="0 0 170 150" width="170" height="150
