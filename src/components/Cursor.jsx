import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    const move = (e) => { pos.current.x = e.clientX; pos.current.y = e.clientY }
    window.addEventListener('mousemove', move)
    const dot = dotRef.current
    const ring = ringRef.current
    let raf
    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.1
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.1
      if (dot) { dot.style.left = pos.current.x + 'px'; dot.style.top = pos.current.y + 'px' }
      if (ring) { ring.style.left = pos.current.rx + 'px'; ring.style.top = pos.current.ry + 'px' }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  const base = { position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, transform: 'translate(-50%,-50%)' }

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 8, height: 8, background: '#D4AF37', boxShadow: '0 0 12px #D4AF37, 0 0 24px rgba(212,175,55,0.5)', transition: 'width 0.15s, height 0.15s' }} />
      <div ref={ringRef} style={{ ...base, width: 32, height: 32, border: '1px solid rgba(212,175,55,0.5)', transition: 'width 0.3s, height 0.3s' }} />
    </>
  )
}
