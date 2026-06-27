import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const EXERCISES = [
  { icon:'🌬', name:'The Breath Garden',    dur:10, col:'rgba(150,200,130,', desc:'Increase phrase endurance · Build diaphragmatic depth',
    instruction:'Inhale for 4 counts, letting your ribcage expand like wings. Sustain on a gentle hum for 8 counts. Exhale for 6. Your breath is the river — the voice flows where the river flows.' },
  { icon:'🔮', name:'The Echo Chamber',     dur:10, col:'rgba(140,130,200,', desc:'Sharpen pitch accuracy · Deepen ear-to-voice connection',
    instruction:"Sing a 5-note scale. Close your eyes and listen for the echo still alive in the air. Match it exactly. Your ears know more than your mind does — trust them." },
  { icon:'✨', name:'The Aurora Stage',     dur:10, col:'rgba(200,160,90,',  desc:'Develop emotional storytelling · Discover your vocal colours',
    instruction:"Choose a lyric that moves you. Sing it four times: as a whisper, a question, a memory, a declaration. Each version is a different truth. Let all four live in your body." },
  { icon:'🌉', name:'The Resonance Bridge', dur:5,  col:'rgba(200,180,100,', desc:'Smooth the passaggio · Develop vocal flexibility and range',
    instruction:"Glide from your lowest comfortable note to your highest on a single open vowel. Notice where your voice wants to shift — that is your bridge. Cross it gently, again and again." },
]

const CIRC = 2 * Math.PI * 54

function ForestCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if(!c) return
    c.width=window.innerWidth; c.height=window.innerHeight
    const ctx=c.getContext('2d')
    let raf
    const draw=()=>{
      raf=requestAnimationFrame(draw)
      ctx.clearRect(0,0,c.width,c.height)
      const t=Date.now()/1000
      // Light pillars
      for(let i=0;i<8;i++){
        const x=(i/(7))*c.width
        const flicker=0.55+0.45*Math.sin(t*1.6+i*2.1)
        const h=c.height*0.75+Math.sin(t*0.5+i)*c.height*0.08
        const g=ctx.createLinearGradient(x,c.height,x,c.height-h)
        g.addColorStop(0,`rgba(90,180,60,${0.1*flicker})`)
        g.addColorStop(0.4,`rgba(212,175,55,${0.06*flicker})`)
        g.addColorStop(1,'rgba(0,0,0,0)')
        ctx.fillStyle=g; ctx.fillRect(x-16,c.height-h,32,h)
      }
      // Bio particles
      for(let i=0;i<18;i++){
        const bx=(Math.sin(t*0.25+i*1.7)*0.5+0.5)*c.width
        const by=c.height-((t*28+i*c.height/18)%c.height)
        const ba=0.2+0.15*Math.sin(t*2+i)
        ctx.beginPath(); ctx.arc(bx,by,1.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(130,220,100,${ba})`; ctx.fill()
      }
      // Ground mist
      const mist=ctx.createLinearGradient(0,c.height,0,c.height-100)
      mist.addColorStop(0,'rgba(30,70,20,0.3)'); mist.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=mist; ctx.fillRect(0,c.height-100,c.width,100)
      // Top vignette
      const tv=ctx.createLinearGradient(0,0,0,c.height*0.3)
      tv.addColorStop(0,'rgba(0,20,4,0.5)'); tv.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=tv; ctx.fillRect(0,0,c.width,c.height*0.3)
    }
    draw()
    return ()=>cancelAnimationFrame(raf)
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:3,pointerEvents:'none'}}/>
}

export default function Forest({ navigate }) {
  const [active, setActive] = useState(null)
  const [done, setDone] = useState(false)
  const [paused, setPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const total = useRef(0)
  const ivRef = useRef(null)

  const start = (ex) => {
    setActive(ex); setDone(false); setPaused(false)
    total.current = ex.dur * 60; setTimeLeft(ex.dur * 60)
    clearInterval(ivRef.current)
    ivRef.current = setInterval(() => {
      if (!paused) setTimeLeft(t => { if(t<=1){clearInterval(ivRef.current);setDone(true);return 0} return t-1 })
    },1000)
  }

  useEffect(()=>()=>clearInterval(ivRef.current),[])

  const pct = active ? ((total.current - timeLeft) / total.current) : 0
  const offset = CIRC * (1 - pct)
  const mins = Math.floor(timeLeft/60), secs = timeLeft%60

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
      style={{position:'fixed',inset:0,zIndex:10,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <ForestCanvas/>
      <div style={{position:'relative',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',padding:'5rem 2rem 3rem',gap:'2.5rem',minHeight:'100%'}}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{textAlign:'center'}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.45em',color:'#BFA46F',marginBottom:'0.8rem'}}>🌿 Harmonic Forest</div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:700,
            background:'linear-gradient(150deg,#F8F6F0 20%,#E8D58B 55%,#D4AF37 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            Your Daily Practice Journey
          </h1>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:'#BFA46F',marginTop:'0.6rem',letterSpacing:'0.08em'}}>
            AI-crafted pathways through the living forest, shaped for your voice today
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!active && !done && (
            <motion.div key="orbs" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{display:'flex',gap:'2rem',flexWrap:'wrap',justifyContent:'center',marginTop:'1rem'}}>
              {EXERCISES.map((ex,i)=>(
                <motion.div key={ex.name}
                  initial={{opacity:0,y:40,scale:0.75}} animate={{opacity:1,y:0,scale:1}} transition={{delay:0.3+i*0.12,duration:0.7}}
                  whileHover={{y:-10,scale:1.06}} onClick={()=>start(ex)}
                  style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.9rem',cursor:'none',maxWidth:150}}>
                  <motion.div
                    animate={{y:[0,-8,0]}} transition={{duration:3+i*0.5,repeat:Infinity,ease:'easeInOut'}}
                    style={{width:100,height:100,borderRadius:'50%',
                      background:`radial-gradient(ellipse at 40% 35%,${ex.col}.18),${ex.col}.04))`,
                      border:`1px solid ${ex.col}.25)`,
                      boxShadow:`0 0 30px ${ex.col}.12)`,
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',
                      transition:'box-shadow 0.4s'}}>
                    {ex.icon}
                  </motion.div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.72rem',letterSpacing:'0.1em',color:'#E8D58B',textAlign:'center'}}>{ex.name}</div>
                  <div style={{fontSize:'0.7rem',color:'#BFA46F',textAlign:'center',lineHeight:1.6}}>{ex.desc}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.15em',color:'#D4AF37'}}>{ex.dur} min</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {active && !done && (
            <motion.div key="active" initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2rem',textAlign:'center',maxWidth:560}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.3em',color:'#BFA46F'}}>Now Practising</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:600,color:'#E8D58B'}}>{active.name}</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:'#F8F6F0',lineHeight:1.85,letterSpacing:'0.06em'}}>{active.instruction}</p>

              {/* Ring timer */}
              <div style={{position:'relative',width:130,height:130}}>
                <svg width="130" height="130" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="4"/>
                  <circle cx="65" cy="65" r="54" fill="none" stroke="url(#fg)" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
                    style={{transition:'stroke-dashoffset 0.8s linear'}}/>
                  <defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#E8D58B"/></linearGradient></defs>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
                  fontFamily:"'Cinzel',serif",fontSize:'1.5rem',fontWeight:700,color:'#D4AF37'}}>
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </div>
              </div>

              <div style={{display:'flex',gap:'1rem'}}>
                <GoldBtn onClick={()=>setPaused(p=>!p)}>{paused?'Resume':'Pause'}</GoldBtn>
                <GoldBtn onClick={()=>{clearInterval(ivRef.current);setDone(true)}}>Complete ✓</GoldBtn>
              </div>
            </motion.div>
          )}

          {done && (
            <motion.div key="done" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem',textAlign:'center'}}>
              <motion.div animate={{y:[0,-12,0]}} transition={{duration:2.5,repeat:Infinity}} style={{fontSize:'3.5rem'}}>🌟</motion.div>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:'2rem',color:'#E8D58B',letterSpacing:'0.12em'}}>Journey Complete</h2>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.1rem',fontStyle:'italic',color:'#BFA46F',maxWidth:440,lineHeight:1.8}}>
                A new star has ignited in your constellation. The forest remembers your voice.
              </p>
              <GoldBtn onClick={()=>{setActive(null);setDone(false)}}>Begin Another Journey</GoldBtn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function GoldBtn({children,onClick}){
  return(
    <motion.button onClick={onClick} whileHover={{letterSpacing:'0.38em',color:'#F8F6F0'}}
      style={{fontFamily:"'Cinzel',serif",fontSize:'0.7rem',letterSpacing:'0.28em',color:'#BFA46F',
        border:'1px solid rgba(212,175,55,0.28)',background:'none',padding:'0.85rem 2.4rem',
        borderRadius:60,textTransform:'uppercase',transition:'color 0.3s'}}>
      {children}
    </motion.button>
  )
}
