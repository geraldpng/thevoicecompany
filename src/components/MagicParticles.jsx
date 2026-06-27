import { useEffect, useRef } from 'react'

const NOTES = ['♪','♫','♩','♬','♭','𝄞']

// Deterministic layout — no Math.random() at module level
const FLOAT_NOTES = [
  { id:0,  note:'♪', x:8,   y:72, size:1.1, delay:0,    dur:9  },
  { id:1,  note:'♫', x:18,  y:38, size:0.9, delay:1.4,  dur:11 },
  { id:2,  note:'♩', x:28,  y:81, size:1.3, delay:2.8,  dur:8  },
  { id:3,  note:'♬', x:36,  y:25, size:0.8, delay:0.6,  dur:12 },
  { id:4,  note:'♭', x:47,  y:68, size:1.0, delay:3.5,  dur:10 },
  { id:5,  note:'𝄞', x:55,  y:45, size:1.4, delay:1.2,  dur:9  },
  { id:6,  note:'♪', x:63,  y:78, size:0.9, delay:4.1,  dur:11 },
  { id:7,  note:'♫', x:72,  y:32, size:1.1, delay:2.0,  dur:8  },
  { id:8,  note:'♩', x:82,  y:62, size:0.8, delay:0.9,  dur:13 },
  { id:9,  note:'♬', x:90,  y:18, size:1.2, delay:3.2,  dur:10 },
  { id:10, note:'♪', x:12,  y:52, size:0.7, delay:5.0,  dur:9  },
  { id:11, note:'♭', x:76,  y:85, size:1.0, delay:1.8,  dur:11 },
  { id:12, note:'♫', x:42,  y:88, size:0.9, delay:4.4,  dur:8  },
  { id:13, note:'♩', x:93,  y:50, size:1.1, delay:2.6,  dur:12 },
  { id:14, note:'♬', x:22,  y:15, size:0.8, delay:6.0,  dur:10 },
]

const SPARKLES = [
  { id:0,  x:5,   y:30, s:3, delay:0,   dur:3.5 },
  { id:1,  x:15,  y:60, s:2, delay:0.7, dur:4.2 },
  { id:2,  x:25,  y:20, s:4, delay:1.4, dur:3.0 },
  { id:3,  x:33,  y:75, s:2, delay:2.1, dur:5.0 },
  { id:4,  x:42,  y:42, s:3, delay:0.4, dur:3.8 },
  { id:5,  x:50,  y:15, s:2, delay:1.8, dur:4.5 },
  { id:6,  x:58,  y:68, s:4, delay:3.0, dur:3.2 },
  { id:7,  x:65,  y:35, s:2, delay:0.9, dur:4.8 },
  { id:8,  x:73,  y:80, s:3, delay:2.5, dur:3.5 },
  { id:9,  x:80,  y:22, s:2, delay:1.2, dur:4.0 },
  { id:10, x:88,  y:55, s:4, delay:3.8, dur:3.2 },
  { id:11, x:95,  y:40, s:2, delay:0.5, dur:5.2 },
  { id:12, x:10,  y:85, s:3, delay:4.2, dur:3.8 },
  { id:13, x:48,  y:92, s:2, delay:1.6, dur:4.2 },
  { id:14, x:70,  y:10, s:3, delay:2.8, dur:3.6 },
  { id:15, x:38,  y:55, s:2, delay:5.5, dur:4.0 },
  { id:16, x:82,  y:72, s:4, delay:3.3, dur:3.3 },
  { id:17, x:20,  y:45, s:2, delay:0.2, dur:5.0 },
  { id:18, x:60,  y:88, s:3, delay:4.8, dur:3.8 },
  { id:19, x:92,  y:78, s:2, delay:1.0, dur:4.4 },
]

const WISPS = [
  { id:0, x:20, y:40, dx:15,  dy:-25, delay:0,   dur:14 },
  { id:1, x:55, y:65, dx:-18, dy:-30, delay:3,   dur:16 },
  { id:2, x:78, y:30, dx:12,  dy:-20, delay:6,   dur:12 },
  { id:3, x:35, y:80, dx:-10, dy:-35, delay:9,   dur:15 },
  { id:4, x:88, y:55, dx:-14, dy:-28, delay:2,   dur:13 },
  { id:5, x:12, y:25, dx:16,  dy:-22, delay:7,   dur:14 },
]

export default function MagicParticles() {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:4, pointerEvents:'none', overflow:'hidden',
    }}>
      <style>{`
        @keyframes noteRise {
          0%   { opacity:0; transform:translate(0,0) rotate(-8deg) scale(0.7); }
          10%  { opacity:var(--nop); }
          80%  { opacity:var(--nop); }
          100% { opacity:0; transform:translate(var(--ndx),calc(var(--ndy) - 80px)) rotate(12deg) scale(1.1); }
        }
        @keyframes sparkle {
          0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
          25%     { opacity:0.9; transform:scale(1.3) rotate(45deg); }
          50%     { opacity:0.5; transform:scale(0.8) rotate(90deg); }
          75%     { opacity:0.8; transform:scale(1.1) rotate(135deg); }
        }
        @keyframes wispDrift {
          0%   { opacity:0; transform:translate(0,0) scale(1); }
          15%  { opacity:0.35; }
          70%  { opacity:0.2; }
          100% { opacity:0; transform:translate(var(--wdx),var(--wdy)) scale(1.6); }
        }
        @keyframes goldenPulse {
          0%,100% { box-shadow: 0 0 6px 2px rgba(212,175,55,0.35); }
          50%     { box-shadow: 0 0 14px 5px rgba(212,175,55,0.65); }
        }
      `}</style>

      {/* Floating musical notes */}
      {FLOAT_NOTES.map(n => (
        <div key={n.id} style={{
          position:'absolute',
          left:`${n.x}%`, top:`${n.y}%`,
          fontSize:`${n.size}rem`,
          color:'#D4AF37',
          '--nop': 0.45,
          '--ndx': `${(n.id % 2 === 0 ? 1 : -1) * (10 + n.id * 3)}px`,
          '--ndy': `${-60 - n.id * 4}px`,
          textShadow:'0 0 8px rgba(212,175,55,0.7), 0 0 20px rgba(212,175,55,0.3)',
          animation:`noteRise ${n.dur}s ${n.delay}s ease-in-out infinite`,
        }}>{n.note}</div>
      ))}

      {/* Sparkle stars */}
      {SPARKLES.map(s => (
        <div key={s.id} style={{
          position:'absolute',
          left:`${s.x}%`, top:`${s.y}%`,
          width:s.s, height:s.s,
          background:'radial-gradient(circle, #F5E6A3 0%, #D4AF37 50%, transparent 100%)',
          borderRadius:'50%',
          boxShadow:`0 0 ${s.s * 2}px ${s.s}px rgba(212,175,55,0.5)`,
          animation:`sparkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* Wisp orbs */}
      {WISPS.map(w => (
        <div key={w.id} style={{
          position:'absolute',
          left:`${w.x}%`, top:`${w.y}%`,
          width:12, height:12,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(180,220,255,0.6) 0%, rgba(140,180,255,0.2) 60%, transparent 100%)',
          '--wdx': `${w.dx}px`,
          '--wdy': `${w.dy}px`,
          filter:'blur(3px)',
          animation:`wispDrift ${w.dur}s ${w.delay}s ease-in-out infinite`,
        }} />
      ))}

      {/* Golden dust motes */}
      {SPARKLES.slice(0,10).map(s => (
        <div key={`d${s.id}`} style={{
          position:'absolute',
          left:`${(s.x + 7) % 100}%`, top:`${(s.y + 13) % 100}%`,
          width:2, height:2,
          borderRadius:'50%',
          background:'#D4AF37',
          animation:`sparkle ${s.dur + 1.5}s ${s.delay + 2}s ease-in-out infinite`,
          opacity:0.6,
        }} />
      ))}
    </div>
  )
}
