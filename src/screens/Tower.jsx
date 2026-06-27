import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const MILESTONES = [
  { label:'Foundations of Voice',   pct:0.18, lit:true,  badge:'Mastered'      },
  { label:'Intermediate Vocalist',  pct:0.40, lit:true,  badge:'Current Level' },
  { label:'Advanced Resonance',     pct:0.60, lit:false, badge:'Score 90+'     },
  { label:'Performance Artist',     pct:0.78, lit:false, badge:'Score 95+'     },
  { label:'Tower Summit · Master',  pct:0.95, lit:false, badge:'Score 100'     },
]

function TowerCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if(!c) return
    const ctx = c.getContext('2d'); let raf, anim=0
    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0,0,c.width,c.height)
      anim = Math.min(anim+0.014,1)
      const t = Date.now()/1000
      const W=c.width, H=c.height, cx=W/2
      const FILL=0.84, BASE_W=130, TOP_W=40, MAX_H=H*0.82
      const tH = MAX_H*FILL*anim, tY=H-28

      // Ground glow
      const gg=ctx.createRadialGradient(cx,tY,0,cx,tY,180)
      gg.addColorStop(0,'rgba(212,175,55,0.2)'); gg.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=gg; ctx.fillRect(0,0,W,H)

      // Shadow
      ctx.save(); ctx.globalAlpha=0.25
      const sh=ctx.createRadialGradient(cx,tY+6,0,cx,tY+6,70)
      sh.addColorStop(0,'rgba(212,175,55,0.35)'); sh.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=sh; ctx.beginPath(); ctx.ellipse(cx,tY+8,65,14,0,0,Math.PI*2); ctx.fill()
      ctx.restore()

      // Body
      const tg=ctx.createLinearGradient(cx,tY,cx,tY-tH)
      tg.addColorStop(0,'rgba(55,32,3,0.95)'); tg.addColorStop(0.35,'rgba(130,88,14,0.88)'); tg.addColorStop(FILL,'rgba(200,158,28,0.9)'); tg.addColorStop(1,'rgba(232,213,139,0.96)')
      ctx.beginPath(); ctx.moveTo(cx-BASE_W/2,tY); ctx.lineTo(cx-TOP_W/2,tY-tH); ctx.lineTo(cx+TOP_W/2,tY-tH); ctx.lineTo(cx+BASE_W/2,tY); ctx.closePath()
      ctx.fillStyle=tg; ctx.fill(); ctx.strokeStyle='rgba(212,175,55,0.3)'; ctx.lineWidth=1; ctx.stroke()

      // Highlight edge
      ctx.beginPath(); ctx.moveTo(cx-BASE_W/2+5,tY); ctx.lineTo(cx-TOP_W/2+3,tY-tH)
      ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1.5; ctx.stroke()

      // Floor lines & windows
      MILESTONES.forEach((m,i)=>{
        const ly=tY-tH*m.pct; if(ly>tY||ly<tY-tH) return
        const fw=BASE_W-(BASE_W-TOP_W)*m.pct
        ctx.beginPath(); ctx.moveTo(cx-fw/2,ly); ctx.lineTo(cx+fw/2,ly)
        ctx.strokeStyle=m.lit?'rgba(212,175,55,0.4)':'rgba(255,255,255,0.05)'; ctx.lineWidth=1; ctx.stroke()
        if(m.lit){
          const flicker=0.6+0.4*Math.sin(t*1.8+i*1.3)
          for(let w=0;w<3;w++){
            const wx=cx-fw*0.28+w*fw*0.28
            ctx.beginPath(); ctx.arc(wx,ly-9,3.5,0,Math.PI*2)
            ctx.fillStyle=`rgba(232,213,139,${flicker*0.75})`; ctx.fill()
            const wg=ctx.createRadialGradient(wx,ly-9,0,wx,ly-9,14)
            wg.addColorStop(0,`rgba(232,213,139,${flicker*0.28})`); wg.addColorStop(1,'rgba(0,0,0,0)')
            ctx.beginPath(); ctx.arc(wx,ly-9,14,0,Math.PI*2); ctx.fillStyle=wg; ctx.fill()
          }
        }
      })

      // Spire
      if(tH>50){
        const spH=58*anim
        const sg=ctx.createLinearGradient(cx,tY-tH,cx,tY-tH-spH)
        sg.addColorStop(0,'rgba(212,175,55,0.95)'); sg.addColorStop(1,'rgba(248,246,240,1)')
        ctx.beginPath(); ctx.moveTo(cx-TOP_W/2,tY-tH); ctx.lineTo(cx,tY-tH-spH); ctx.lineTo(cx+TOP_W/2,tY-tH); ctx.closePath()
        ctx.fillStyle=sg; ctx.fill()
        // Flame
        const fy=tY-tH-spH-8, ff=0.7+0.3*Math.sin(t*4)
        for(let f=0;f<3;f++){
          const fr=(13-f*2)*(1+ff*0.15)
          const fl=ctx.createRadialGradient(cx,fy,0,cx,fy,fr)
          fl.addColorStop(0,'rgba(255,252,200,0.95)'); fl.addColorStop(0.4,'rgba(212,175,55,0.6)'); fl.addColorStop(1,'rgba(0,0,0,0)')
          ctx.fillStyle=fl; ctx.beginPath(); ctx.arc(cx,fy,fr,0,Math.PI*2); ctx.fill()
        }
      }

      // Orbiting particles
      for(let i=0;i<8;i++){
        const ang=t*0.4+i*Math.PI*2/8
        const dist=95+22*Math.sin(t*0.7+i)
        const px=cx+dist*Math.cos(ang), py=(tY-tH*0.5)+dist*0.28*Math.sin(ang)
        ctx.beginPath(); ctx.arc(px,py,1.3,0,Math.PI*2)
        ctx.fillStyle=`rgba(212,175,55,${0.18+0.18*Math.sin(t+i)})`; ctx.fill()
      }
    }
    draw(); return()=>cancelAnimationFrame(raf)
  },[])

  const resize=()=>{const c=ref.current;if(c){c.width=window.innerWidth;c.height=window.innerHeight}}
  useEffect(()=>{resize();window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[])
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:3,pointerEvents:'none'}}/>
}

export default function Tower({ navigate }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
      style={{position:'fixed',inset:0,zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',overflowY:'auto'}}>
      <TowerCanvas/>
      <div style={{position:'relative',zIndex:5,display:'flex',flexDirection:'column',alignItems:'center',padding:'5rem 2rem 3rem',gap:'2.5rem',width:'100%',minHeight:'100%'}}>

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{textAlign:'center'}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.45em',color:'#BFA46F',marginBottom:'0.8rem'}}>🏛 Tower of Mastery</div>
          <h1 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:700,
            background:'linear-gradient(150deg,#F8F6F0 20%,#E8D58B 55%,#D4AF37 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            The Tower Awaits Your Voice
          </h1>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:'#BFA46F',marginTop:'0.6rem',letterSpacing:'0.08em'}}>
            Each session raises a new spire. The summit is luminous.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
          style={{display:'flex',gap:'3rem',flexWrap:'wrap',justifyContent:'center'}}>
          {[['84','Vocal Score'],['12','Day Streak'],['47','Sessions'],['6wk','To Advanced']].map(([n,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'1.7rem',fontWeight:700,color:'#D4AF37',filter:'drop-shadow(0 0 20px rgba(212,175,55,0.4))'}}>{n}</div>
              <div style={{fontSize:'0.6rem',letterSpacing:'0.2em',color:'#BFA46F',marginTop:'0.2rem'}}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* Milestones — floating to right of tower, shown as vertical timeline */}
        <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.8,duration:0.9}}
          style={{display:'flex',flexDirection:'column',gap:'0.7rem',alignSelf:'flex-end',maxWidth:320,marginRight:'4vw',marginTop:'auto',paddingBottom:'2rem'}}>
          {MILESTONES.map((m,i)=>(
            <motion.div key={m.label} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.9+i*0.1}}
              style={{display:'flex',alignItems:'center',gap:'1rem',
                padding:'0.7rem 1.2rem',borderRadius:12,
                background: m.lit?'rgba(212,175,55,0.07)':'rgba(255,255,255,0.02)',
                border:`1px solid ${m.lit?'rgba(212,175,55,0.25)':'rgba(255,255,255,0.05)'}`,
                opacity: m.lit?1:0.45}}>
              <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,
                background:m.lit?'#D4AF37':'rgba(255,255,255,0.15)',
                boxShadow:m.lit?'0 0 10px rgba(212,175,55,0.6)':'none'}}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.72rem',color:m.lit?'#E8D58B':'rgba(248,246,240,0.4)',letterSpacing:'0.07em'}}>{m.label}</div>
              </div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.58rem',letterSpacing:'0.12em',
                color:m.lit?'#D4AF37':'rgba(191,164,111,0.4)',
                border:`1px solid ${m.lit?'rgba(212,175,55,0.3)':'rgba(255,255,255,0.06)'}`,
                borderRadius:20,padding:'0.2rem 0.6rem',whiteSpace:'nowrap'}}>
                {m.badge}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
