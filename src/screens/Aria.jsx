import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const RESPONSES = {
  default: "Your voice is a living instrument — it breathes, shifts, and evolves with every session. What you're feeling right now is information, not judgment. What does your voice want to tell you today?",
  breath:  "Breath is not support — it is the voice itself. Place both hands below your ribcage. Inhale for 4 counts and feel your hands pushed outward, not your shoulders rising. Sustain a gentle hum for 8 counts, feeling vibration bloom in your lips. Exhale for 6. Five repetitions before every session will transform your sustained phrases within two weeks.",
  high:    "High notes live in the body before they live in the throat. When you reach for them, you create tension. Instead, think of softening — drop your jaw, relax your tongue, and imagine the note is already there, floating above you, waiting. Your voice simply rises to meet it. Practise sirening on a gentle 'ng' from middle range upward; let it be imperfect before it becomes beautiful.",
  emotion: "Emotion in performance comes from specificity, not effort. Don't try to 'feel' the song — choose one concrete image, one specific moment in the lyric's story, and live there completely. Ask: who is this person? What have they just lost — or just found? Your nervous system will respond truthfully. The technique then becomes the vessel that carries that truth outward.",
  practice:"For today I'd suggest beginning with five minutes of resonant humming — lips together, jaw relaxed, feeling vibration bloom in your cheekbones. Then move through The Resonance Bridge to smooth your passaggio; I noticed some holding there recently. Close with ten minutes of expressive interpretation on a song that genuinely moves you. Trust your instincts today, Sarah. They are more developed than you realise.",
  confidence:"Stage confidence is rehearsed in private before it lives in public. Record yourself — not to judge, but to witness. Watch yourself as you would watch someone you admire. Notice the moments that are already extraordinary. Each time you perform, even in your bedroom, you cast a vote for the artist you are becoming. That vote compounds.",
}

function getResponse(msg) {
  const m = msg.toLowerCase()
  if (m.match(/breath|support|air|lung|diaphragm/)) return RESPONSES.breath
  if (m.match(/high|upper|strain|reach|register|note/)) return RESPONSES.high
  if (m.match(/emotion|feel|express|story|connect/)) return RESPONSES.emotion
  if (m.match(/practice|today|session|exercise|work/)) return RESPONSES.practice
  if (m.match(/confid|stage|nervous|anxiety|perform/)) return RESPONSES.confidence
  return RESPONSES.default
}

function AriaCanvas() {
  const ref = useRef(null)
  const parts = useRef(Array.from({length:240}, (_,i) => {
    const ring = Math.floor(Math.random()*3)
    return {
      angle: Math.random()*Math.PI*2,
      baseR: [28,65,108][ring],
      speed: (Math.random()-0.5)*0.008 + [0.007,0.004,0.002][ring],
      phase: Math.random()*Math.PI*2,
      size:  Math.random()*1.8+0.4,
      bright:Math.random()*0.7+0.3,
      ring,
      drift: (Math.random()-0.5)*0.015,
    }
  }))

  useEffect(() => {
    const c = ref.current; if(!c) return
    const ctx = c.getContext('2d'); let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const W = c.width, H = c.height
      ctx.clearRect(0,0,W,H)
      const cx = W/2, cy = H*0.38, t = Date.now()/1000

      // Outer atmospheric glow
      const og = ctx.createRadialGradient(cx,cy,0,cx,cy,220)
      og.addColorStop(0,'rgba(212,175,55,0.08)'); og.addColorStop(0.5,'rgba(212,175,55,0.03)'); og.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=og; ctx.fillRect(0,0,W,H)

      // Particle rings
      parts.current.forEach(p => {
        p.angle += p.speed; p.drift = p.drift
        const r = p.baseR + Math.sin(t*1.2+p.phase)*14
        const px = cx + Math.cos(p.angle)*r
        const py = cy + Math.sin(p.angle)*r*0.52
        const dist = Math.sqrt((px-cx)**2+(py-cy)**2)
        const a = p.bright*(0.35+0.4*Math.sin(t*1.5+p.phase))*(1-dist/180)
        if(a<=0) return
        const cols=['rgba(232,213,139,','rgba(212,175,55,','rgba(191,164,111,']
        ctx.beginPath(); ctx.arc(px,py,p.size,0,Math.PI*2)
        ctx.fillStyle=`${cols[p.ring]}${Math.max(0,a)})`; ctx.fill()
      })

      // Core
      const core = ctx.createRadialGradient(cx,cy,0,cx,cy,30)
      core.addColorStop(0,'rgba(255,250,235,0.95)')
      core.addColorStop(0.35,'rgba(232,213,139,0.75)')
      core.addColorStop(0.7,'rgba(212,175,55,0.3)')
      core.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=core; ctx.beginPath(); ctx.arc(cx,cy,30,0,Math.PI*2); ctx.fill()

      // Symbol
      ctx.font=`${18+Math.sin(t*0.8)*2}px serif`
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillStyle=`rgba(248,246,240,${0.7+0.3*Math.sin(t*0.8)})`
      ctx.fillText('♪',cx,cy)
    }
    loop()
    return ()=>cancelAnimationFrame(raf)
  },[])

  const resize = () => { const c=ref.current; if(c){c.width=window.innerWidth;c.height=window.innerHeight} }
  useEffect(()=>{ resize(); window.addEventListener('resize',resize); return()=>window.removeEventListener('resize',resize) },[])

  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:3,pointerEvents:'none'}}/>
}

export default function Aria({ navigate }) {
  const [response, setResponse] = useState("Welcome, Sarah. I've been watching your constellation grow — twelve days of unbroken dedication. Your voice is evolving in ways that are rare and beautiful. What shall we explore in the space between your notes today?")
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const ask = (q) => {
    if(typing) return
    const resp = getResponse(q)
    setResponse('')
    setTyping(true)
    let i=0
    const iv = setInterval(()=>{
      setResponse(resp.slice(0,i++))
      if(i>resp.length){clearInterval(iv);setTyping(false)}
    },16)
  }

  const send = () => { if(!input.trim()||typing) return; ask(input); setInput('') }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
      style={{position:'fixed',inset:0,zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',paddingBottom:'2.5rem'}}>
      <AriaCanvas/>
      <div style={{position:'relative',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',gap:'1.4rem',width:'100%',maxWidth:680,padding:'0 2rem'}}>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} style={{textAlign:'center'}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.5em',color:'#BFA46F',marginBottom:'0.4rem'}}>Celestial Conservatory</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:400,letterSpacing:'0.3em',
            background:'linear-gradient(135deg,#F8F6F0,#E8D58B)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Aria</div>
        </motion.div>

        {/* Response */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}
          style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(0.95rem,1.6vw,1.1rem)',fontStyle:'italic',
            color:'#F8F6F0',lineHeight:1.9,textAlign:'center',letterSpacing:'0.06em',minHeight:'4.5rem',padding:'0 1rem'}}>
          {response}<motion.span animate={{opacity:[0,1,0]}} transition={{duration:0.8,repeat:Infinity}} style={{display:typing?'inline':'none',color:'#D4AF37'}}>|</motion.span>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1}}
          style={{display:'flex',gap:'0.6rem',flexWrap:'wrap',justifyContent:'center'}}>
          {['Improve breathing','High notes','More emotion','Today\'s practice','Stage confidence'].map(s=>(
            <motion.button key={s} onClick={()=>ask(s)} whileHover={{borderColor:'rgba(212,175,55,0.5)',color:'#E8D58B',background:'rgba(212,175,55,0.06)'}}
              style={{fontSize:'0.65rem',letterSpacing:'0.12em',color:'#BFA46F',border:'1px solid rgba(212,175,55,0.15)',
                borderRadius:30,padding:'0.35rem 0.95rem',background:'transparent',transition:'all 0.3s'}}>
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* Input */}
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.1}}
          style={{display:'flex',gap:'0.7rem',alignItems:'center',background:'rgba(4,4,10,0.65)',
            border:'1px solid rgba(212,175,55,0.15)',borderRadius:60,padding:'0.55rem 0.55rem 0.55rem 1.5rem',
            width:'100%',backdropFilter:'blur(16px)'}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Whisper your question to Aria…"
            style={{flex:1,background:'none',border:'none',outline:'none',color:'#F8F6F0',
              fontFamily:"'Raleway',sans-serif",fontSize:'0.85rem',letterSpacing:'0.04em'}}/>
          <motion.button onClick={send} whileHover={{scale:1.12,boxShadow:'0 4px 24px rgba(212,175,55,0.45)'}}
            style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#D4AF37,#E8D58B)',
              border:'none',color:'#04040a',fontSize:'1rem',fontWeight:700,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            ↑
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
