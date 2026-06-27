import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const PERF = [
  { name:'Confidence',   val:88 },
  { name:'Expression',   val:82 },
  { name:'Musicality',   val:90 },
  { name:'Stage Presence',val:79},
  { name:'Engagement',   val:85 },
]
const CIRC = 2*Math.PI*36

function StageCanvas() {
  const ref = useRef(null)
  useEffect(()=>{
    const c=ref.current; if(!c) return
    c.width=window.innerWidth; c.height=window.innerHeight
    const ctx=c.getContext('2d'); let raf
    const draw=()=>{
      raf=requestAnimationFrame(draw)
      ctx.clearRect(0,0,c.width,c.height)
      const t=Date.now()/1000, W=c.width, H=c.height
      // Stage floor
      const fl=ctx.createLinearGradient(0,H*0.52,0,H)
      fl.addColorStop(0,'rgba(0,0,0,0)'); fl.addColorStop(0.5,'rgba(40,25,3,0.4)'); fl.addColorStop(1,'rgba(15,8,0,0.75)')
      ctx.fillStyle=fl
      ctx.beginPath(); ctx.moveTo(W*0.22,H*0.52); ctx.lineTo(W*0.78,H*0.52); ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill()
      // Stage edge
      ctx.beginPath(); ctx.moveTo(W*0.2,H*0.52); ctx.lineTo(W*0.8,H*0.52)
      ctx.strokeStyle='rgba(212,175,55,0.3)'; ctx.lineWidth=1.5; ctx.stroke()
      // Perspective lines
      for(let i=0;i<=4;i++){const px=W*(0.2+(i/4)*0.6);ctx.beginPath();ctx.moveTo(px,H*0.52);ctx.lineTo(W*(i/4),H);ctx.strokeStyle='rgba(212,175,55,0.05)';ctx.lineWidth=1;ctx.stroke()}
      // Spotlights
      [W*0.3,W*0.5,W*0.7].forEach((sx,i)=>{
        const fl2=0.7+0.3*Math.sin(t*0.7+i*1.5)
        const sg=ctx.createRadialGradient(sx,H*0.52,0,sx,H*0.52,H*0.42)
        sg.addColorStop(0,`rgba(212,175,55,${0.15*fl2})`); sg.addColorStop(0.5,`rgba(212,175,55,${0.05*fl2})`); sg.addColorStop(1,'rgba(0,0,0,0)')
        ctx.fillStyle=sg
        ctx.beginPath(); ctx.moveTo(sx-8,0); ctx.lineTo(sx+8,0); ctx.lineTo(sx+85,H*0.52); ctx.lineTo(sx-85,H*0.52); ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.arc(sx,5,5,0,Math.PI*2); ctx.fillStyle=`rgba(232,213,139,${fl2*0.7})`; ctx.fill()
      })
      // Rising particles
      for(let i=0;i<15;i++){
        const px=W*0.22+((t*22+i*35)%(W*0.56)); const py=H*0.52-((t*28+i*20)%(H*0.46))
        ctx.beginPath(); ctx.arc(px,py,0.9,0,Math.PI*2); ctx.fillStyle=`rgba(212,175,55,${0.1+0.08*Math.sin(t+i)})`; ctx.fill()
      }
    }
    draw(); return()=>cancelAnimationFrame(raf)
  },[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:3,pointerEvents:'none'}}/>
}

function RadialOrb({d,i,active}){
  const [count,setCount]=useState(0)
  const end=-Math.PI/2+(count/100)*Math.PI*2
  const cx2=45,cy2=45,r2=36
  const dx=cx2+r2*Math.cos(end), dy=cy2+r2*Math.sin(end)
  useEffect(()=>{
    if(!active) return
    const iv=setInterval(()=>setCount(v=>{if(v>=d.val){clearInterval(iv);return v}return v+2}),22)
    return()=>clearInterval(iv)
  },[active,d.val])
  return(
    <motion.div initial={{opacity:0,y:30,scale:0.7}} animate={{opacity:1,y:0,scale:1}} transition={{delay:i*0.15+0.3,duration:0.8}}
      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.7rem'}}>
      <motion.div animate={{y:[0,-6,0]}} transition={{duration:3.5+i*0.4,repeat:Infinity,ease:'easeInOut'}}>
        <svg width="90" height="90">
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
          {count>0&&<circle cx="45" cy="45" r="36" fill="none" stroke="url(#rg)" strokeWidth="4"
            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-count/100)}/>}
          <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4AF37"/><stop offset="100%" stopColor="#E8D58B"/></linearGradient></defs>
          {count>0&&<circle cx={dx} cy={dy} r="3.5" fill="#E8D58B"/>}
          <text x="45" y="50" textAnchor="middle" fill="#D4AF37" fontFamily="'Cinzel',serif" fontWeight="700" fontSize="14">{count}%</text>
        </svg>
      </motion.div>
      <div style={{fontSize:'0.58rem',letterSpacing:'0.15em',color:'#BFA46F',textTransform:'uppercase',textAlign:'center'}}>{d.name}</div>
    </motion.div>
  )
}

export default function Stage({ navigate }) {
  const [evaluated, setEvaluated] = useState(false)
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
      style={{position:'fixed',inset:0,zIndex:10,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <StageCanvas/>
      <div style={{position:'relative',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',padding:'5rem 2rem 3rem',gap:'2rem',minHeight:'100%'}}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{textAlign:'center'}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.45em',color:'#BFA46F',marginBottom:'0.8rem'}}>🎭 Golden Amphitheatre</div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:700,
            background:'linear-gradient(150deg,#F8F6F0 20%,#E8D58B 55%,#D4AF37 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>The Stage is Yours</h1>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:'#BFA46F',marginTop:'0.6rem'}}>Your performance, evaluated with the precision of a master adjudicator</p>
        </motion.div>

        {!evaluated&&(
          <div style={{display:'flex',gap:'1.2rem',flexWrap:'wrap',justifyContent:'center'}}>
            {['Evaluate Performance','Upload Recording'].map(l=>(
              <GoldBtn key={l} onClick={()=>setEvaluated(true)}>{l}</GoldBtn>
            ))}
          </div>
        )}

        {evaluated&&(
          <>
            <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',justifyContent:'center'}}>
              {PERF.map((d,i)=><RadialOrb key={d.name} d={d} i={i} active={evaluated}/>)}
            </div>
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.5,duration:1}} style={{textAlign:'center',maxWidth:620}}>
              <div style={{fontSize:'1.1rem',color:'#D4AF37',letterSpacing:'0.3rem',marginBottom:'1.2rem'}}>★ ★ ★ ★ ☆</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1rem,1.8vw,1.2rem)',fontStyle:'italic',color:'#F8F6F0',lineHeight:1.9,letterSpacing:'0.05em'}}>
                "Sarah's performance radiates genuine emotion. Her connection to the lyric is visceral — the audience feels every word. With stronger breath management in extended phrases, she will be unstoppable on any stage."
              </p>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.6rem',letterSpacing:'0.25em',color:'#BFA46F',marginTop:'1rem'}}>— VoiceIQ AI Adjudicator</div>
            </motion.div>
          </>
        )}
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
