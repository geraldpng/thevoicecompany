import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const metrics = [
  { name:'Pitch Accuracy',  val:87, icon:'⭐', sz:110, col:'rgba(232,213,139,' },
  { name:'Breath Support',  val:78, icon:'🌊', sz:90,  col:'rgba(140,180,220,' },
  { name:'Articulation',    val:92, icon:'💎', sz:122, col:'rgba(212,175,55,'  },
  { name:'Expression',      val:85, icon:'🌌', sz:100, col:'rgba(191,164,111,' },
  { name:'Stage Presence',  val:80, icon:'✨', sz:96,  col:'rgba(210,190,100,' },
]

function CaveCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if(!c) return
    c.width = window.innerWidth; c.height = window.innerHeight
    const ctx = c.getContext('2d')
    let raf
    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0,0,c.width,c.height)
      const t = Date.now()/1000
      // Cave vignette
      const vg = ctx.createRadialGradient(c.width/2,c.height/2,0,c.width/2,c.height/2,c.width*.7)
      vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(.55,'rgba(2,1,0,.3)'); vg.addColorStop(1,'rgba(0,0,0,.75)')
      ctx.fillStyle=vg; ctx.fillRect(0,0,c.width,c.height)
      // Ceiling crystal glints
      for(let i=0;i<5;i++){
        const a=Math.sin(t*.8+i*1.4)*.25+.25
        const x=c.width*(.12+i*.18), y=c.height*.05+Math.sin(i+t*.3)*c.height*.03
        const g=ctx.createRadialGradient(x,y,0,x,y,70)
        g.addColorStop(0,`rgba(212,175,55,${a*.18})`); g.addColorStop(1,'rgba(0,0,0,0)')
        ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height)
      }
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:3,pointerEvents:'none' }} />
}

function MetricOrb({ m, i }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setCount(v => { if(v>=m.val){clearInterval(iv);return v} return v+2 }), 22)
    return () => clearInterval(iv)
  }, [m.val])
  return (
    <motion.div
      initial={{ opacity:0, y:40, scale:0.7 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ delay: i*0.15, duration:0.8, ease:[0.4,0,0.2,1] }}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.7rem' }}
    >
      <motion.div
        animate={{ y:[0,-8,0] }} transition={{ duration:3+i*0.5, repeat:Infinity, ease:'easeInOut' }}
        style={{ width:m.sz, height:m.sz, borderRadius:'50%',
          background:`radial-gradient(ellipse at 40% 35%,${m.col}.18),${m.col}.03))`,
          border:`1px solid ${m.col}.25)`,
          boxShadow:`0 0 40px ${m.col}.15),inset 0 0 25px ${m.col}.08)`,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.15rem' }}
      >
        <div style={{ fontSize:m.sz*0.22 }}>{m.icon}</div>
        <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:'#D4AF37', fontSize:m.sz*0.2 }}>{count}%</div>
      </motion.div>
      <div style={{ fontSize:'0.6rem', letterSpacing:'0.18em', color:'#BFA46F', textTransform:'uppercase', textAlign:'center' }}>{m.name}</div>
    </motion.div>
  )
}

export default function Cave({ navigate }) {
  const [phase, setPhase] = useState('idle') // idle | rec | analyzing | done
  const wfRef = useRef(null)
  const wfRaf = useRef(null)
  const streamRef = useRef(null)
  const analyserRef = useRef(null)

  const startRec = async () => {
    setPhase('rec')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true })
      streamRef.current = stream
      const ac = new AudioContext()
      analyserRef.current = ac.createAnalyser(); analyserRef.current.fftSize=512
      ac.createMediaStreamSource(stream).connect(analyserRef.current)
    } catch(e) {}
    drawWave()
    setTimeout(stopRec, 6000)
  }

  const drawWave = () => {
    const c = wfRef.current; if(!c) return
    c.width = c.offsetWidth; c.height = c.offsetHeight
    const ctx = c.getContext('2d')
    const loop = () => {
      wfRaf.current = requestAnimationFrame(loop)
      ctx.clearRect(0,0,c.width,c.height)
      ctx.strokeStyle='rgba(212,175,55,0.9)'; ctx.lineWidth=2
      ctx.shadowBlur=14; ctx.shadowColor='rgba(212,175,55,0.7)'
      ctx.beginPath()
      if (analyserRef.current) {
        const d=new Uint8Array(analyserRef.current.fftSize); analyserRef.current.getByteTimeDomainData(d)
        d.forEach((v,i) => { const x=i/d.length*c.width,y=(v/128-1)*26+c.height/2; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) })
      } else {
        const t=Date.now()/300
        for(let i=0;i<=c.width;i++){const y=c.height/2+Math.sin(i*.025+t)*20*Math.sin(t*.4)+Math.sin(i*.06+t*1.5)*8+(Math.random()*3-1.5);i===0?ctx.moveTo(i,y):ctx.lineTo(i,y)}
      }
      ctx.stroke()
    }
    loop()
  }

  const stopRec = () => {
    cancelAnimationFrame(wfRaf.current)
    if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
    setPhase('analyzing')
    setTimeout(() => setPhase('done'), 2800)
  }

  const reset = () => setPhase('idle')

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.8 }}
      style={{ position:'fixed', inset:0, zIndex:10, overflowY:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}
    >
      <CaveCanvas />
      <div style={{ position:'relative', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', padding:'5rem 2rem 3rem', gap:'2rem', minHeight:'100%' }}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.62rem', letterSpacing:'0.45em', color:'#BFA46F', textAlign:'center', marginBottom:'0.8rem' }}>💎 Crystal Resonance Cave</div>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(2rem,5vw,3.8rem)', fontWeight:700, textAlign:'center',
            background:'linear-gradient(150deg,#F8F6F0 20%,#E8D58B 55%,#D4AF37 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.15 }}>
            Speak. The Crystal Listens.
          </h1>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontStyle:'italic', color:'#BFA46F', textAlign:'center', marginTop:'0.6rem', letterSpacing:'0.08em', maxWidth:480 }}>
            Your voice awakens the ancient crystal and reveals your true vocal signature
          </p>
        </motion.div>

        {/* Crystal */}
        <motion.div
          animate={{ y:[0,-12,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'relative', cursor:'none' }}
          onClick={phase==='idle'?startRec:undefined}
        >
          {[0,1,2].map(i=>(
            <motion.div key={i}
              animate={{ scale:[0.75,1.35], opacity:[0.7,0] }}
              transition={{ duration:2.8, repeat:Infinity, delay:i*0.9, ease:'easeOut' }}
              style={{ position:'absolute', inset:-18-i*18, borderRadius:'50%', border:'1px solid rgba(212,175,55,0.2)', pointerEvents:'none' }}
            />
          ))}
          <svg width="180" height="200" viewBox="0 0 180 200" style={{ filter:'drop-shadow(0 0 40px rgba(212,175,55,0.65)) drop-shadow(0 0 80px rgba(212,175,55,0.3))' }}>
            <defs>
              <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E8D58B" stopOpacity=".9"/><stop offset="45%" stopColor="#D4AF37" stopOpacity=".75"/><stop offset="100%" stopColor="#BFA46F" stopOpacity=".5"/></linearGradient>
              <linearGradient id="cg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fff" stopOpacity=".4"/><stop offset="100%" stopColor="#D4AF37" stopOpacity=".1"/></linearGradient>
              <filter id="cf"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <polygon points="90,8 145,55 158,130 90,192 22,130 35,55" fill="url(#cg1)" filter="url(#cf)" opacity=".72"/>
            <polygon points="90,8 145,55 158,130 90,192 22,130 35,55" fill="none" stroke="url(#cg2)" strokeWidth="1.5"/>
            <polygon points="90,8 35,55 90,100" fill="rgba(255,255,255,0.12)"/>
            <polygon points="90,8 145,55 90,100" fill="rgba(232,213,139,0.16)"/>
            <polygon points="22,130 35,55 90,100" fill="rgba(212,175,55,0.1)"/>
            <line x1="90" y1="8" x2="90" y2="192" stroke="rgba(212,175,55,0.3)" strokeWidth=".8"/>
            <line x1="35" y1="55" x2="145" y2="130" stroke="rgba(212,175,55,0.2)" strokeWidth=".8"/>
            <circle cx="90" cy="100" r="10" fill="rgba(232,213,139,0.5)" filter="url(#cf)"/>
            <circle cx="90" cy="100" r="4" fill="rgba(255,255,255,0.9)"/>
          </svg>
        </motion.div>

        {/* Phase: idle */}
        <AnimatePresence mode="wait">
          {phase==='idle' && (
            <motion.div key="idle" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.4rem' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', fontStyle:'italic', color:'#BFA46F', textAlign:'center', maxWidth:420, lineHeight:1.8 }}>
                Touch the crystal to awaken it. Your voice will illuminate worlds unseen.
              </p>
              <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap', justifyContent:'center' }}>
                {[['Record Your Voice', startRec], ['Upload Audio', () => { setPhase('analyzing'); setTimeout(()=>setPhase('done'),2800) }]].map(([label, fn]) => (
                  <GoldBtn key={label} onClick={fn}>{label}</GoldBtn>
                ))}
              </div>
            </motion.div>
          )}

          {phase==='rec' && (
            <motion.div key="rec" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', fontFamily:"'Cinzel',serif", fontSize:'0.65rem', letterSpacing:'0.3em', color:'#e87a7a' }}>
                <motion.div animate={{opacity:[1,0.1,1]}} transition={{duration:1,repeat:Infinity}} style={{width:7,height:7,borderRadius:'50%',background:'#e87a7a'}}/>
                Recording — speak or sing
              </div>
              <canvas ref={wfRef} style={{ width:'min(580px,88vw)', height:64, borderRadius:8, background:'rgba(212,175,55,0.04)' }} />
              <GoldBtn onClick={stopRec}>Stop Recording</GoldBtn>
            </motion.div>
          )}

          {phase==='analyzing' && (
            <motion.div key="analyzing" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
              <motion.div
                animate={{ scale:[1,1.08,1], boxShadow:['0 0 20px rgba(212,175,55,0.3)','0 0 60px rgba(212,175,55,0.6)','0 0 20px rgba(212,175,55,0.3)'] }}
                transition={{ duration:1.5, repeat:Infinity }}
                style={{ width:90, height:90, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(212,175,55,0.2),rgba(212,175,55,0.04))',
                  border:'1px solid rgba(212,175,55,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}
              >✦</motion.div>
              <motion.p
                animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}
                style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontStyle:'italic', color:'#E8D58B', letterSpacing:'0.1em' }}
              >
                The crystal is reading your vocal essence…
              </motion.p>
            </motion.div>
          )}

          {phase==='done' && (
            <motion.div key="done" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3rem', width:'100%', maxWidth:880 }}>
              {/* Orbs */}
              <div style={{ display:'flex', gap:'1.8rem', flexWrap:'wrap', justifyContent:'center' }}>
                {metrics.map((m,i) => <MetricOrb key={m.name} m={m} i={i} />)}
              </div>
              {/* Big score */}
              <motion.div initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}} transition={{delay:0.9,duration:1}} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:'clamp(5rem,13vw,9.5rem)', fontWeight:900, lineHeight:1,
                  background:'linear-gradient(160deg,#fff,#E8D58B,#D4AF37)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                  filter:'drop-shadow(0 0 50px rgba(212,175,55,0.5))' }}>84</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', fontStyle:'italic', color:'#BFA46F', letterSpacing:'0.2em', marginTop:'0.4rem' }}>Your Vocal Score · This Moment</div>
              </motion.div>
              {/* Feedback */}
              <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.5}} style={{ display:'flex', gap:'4rem', flexWrap:'wrap', justifyContent:'center', maxWidth:760 }}>
                {[
                  { head:'Crystallised Strengths', dot:'◆', col:'#D4AF37', items:['Articulation lands with precision — every consonant a jewel','Rhythmic instinct is innate — the pulse lives in your body','Vocal confidence fills the space like warm, golden light'] },
                  { head:'Pathways of Growth', dot:'◇', col:'#BFA46F', items:['Breath dissolves in longer phrases — cultivate deeper reserves','Dynamic expression awaits — let the music breathe and fall','Upper register holds tension — soften the jaw, trust the note'] },
                ].map(({ head, dot, col, items }) => (
                  <div key={head}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.68rem', letterSpacing:'0.3em', color:'#E8D58B', textTransform:'uppercase', marginBottom:'1rem' }}>{head}</div>
                    {items.map(item => (
                      <div key={item} style={{ display:'flex', gap:'0.8rem', fontFamily:"'Cormorant Garamond',serif", fontSize:'1rem', color:'#F8F6F0', lineHeight:1.9, marginBottom:'0.2rem' }}>
                        <span style={{color:col,flexShrink:0,marginTop:'0.15rem'}}>{dot}</span><span>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
              <GoldBtn onClick={reset}>Analyse Again</GoldBtn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function GoldBtn({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick} whileHover={{ letterSpacing:'0.38em', color:'#F8F6F0' }}
      style={{ fontFamily:"'Cinzel',serif", fontSize:'0.72rem', letterSpacing:'0.3em', color:'#BFA46F',
        border:'1px solid rgba(212,175,55,0.3)', background:'none', padding:'0.9rem 2.6rem',
        borderRadius:60, textTransform:'uppercase', transition:'color 0.3s, border-color 0.3s' }}
    >
      {children}
    </motion.button>
  )
}
