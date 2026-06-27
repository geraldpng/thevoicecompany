import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const WEEKS = [
  { label:'Week 1', score:72, cx:0.12, cy:0.75, n:8,  col:[191,164,111] },
  { label:'Week 2', score:75, cx:0.36, cy:0.52, n:12, col:[212,175,55]  },
  { label:'Week 3', score:80, cx:0.62, cy:0.30, n:16, col:[228,200,80]  },
  { label:'Week 4', score:84, cx:0.87, cy:0.13, n:20, col:[240,220,130] },
]

export default function Constellation({ navigate }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if(!c) return
    const W = c.offsetWidth, H = c.offsetHeight
    c.width = W; c.height = H
    const ctx = c.getContext('2d')

    const clusters = WEEKS.map(w => ({
      ...w,
      px: w.cx * W, py: w.cy * H,
      stars: Array.from({length:w.n}, () => ({
        x: w.cx*W + (Math.random()-0.5)*W*0.16,
        y: w.cy*H + (Math.random()-0.5)*H*0.18,
        r: Math.random()*2.2+0.6, phase: Math.random()*Math.PI*2
      }))
    }))

    let prog = 0, raf
    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      prog = Math.min(prog + 0.006, 1)
      const t = Date.now()/1000

      // Background
      const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.6)
      bg.addColorStop(0,'rgba(10,6,2,0.85)'); bg.addColorStop(1,'rgba(0,0,0,0.95)')
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)

      // Field stars
      for(let i=0;i<90;i++){
        const sx=((i*137)%W), sy=((i*97)%H)
        const ta=0.15+0.12*Math.sin(t*0.6+i)
        ctx.beginPath(); ctx.arc(sx,sy,0.7,0,Math.PI*2)
        ctx.fillStyle=`rgba(220,230,255,${ta})`; ctx.fill()
      }

      // Path line
      clusters.forEach((cl,i) => {
        if(i===0) return
        const prev = clusters[i-1]
        const p2 = Math.min((prog-i*0.22)/0.3, 1); if(p2<=0) return
        ctx.beginPath(); ctx.moveTo(prev.px, prev.py)
        ctx.lineTo(prev.px+(cl.px-prev.px)*p2, prev.py+(cl.py-prev.py)*p2)
        ctx.strokeStyle='rgba(212,175,55,0.22)'; ctx.lineWidth=1
        ctx.setLineDash([5,8]); ctx.stroke(); ctx.setLineDash([])
      })

      // Clusters
      clusters.forEach((cl, ci) => {
        const p = Math.min((prog - ci*0.22)/0.3, 1); if(p<=0) return
        const [r,g,b] = cl.col

        cl.stars.forEach((s,si) => {
          if(si%3===0){ const next=cl.stars[(si+2)%cl.n]; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(next.x,next.y); ctx.strokeStyle=`rgba(${r},${g},${b},0.1)`; ctx.lineWidth=0.7; ctx.stroke() }
          const tw=0.5+0.5*Math.sin(t*1.4+s.phase)
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r*p, 0, Math.PI*2)
          ctx.fillStyle=`rgba(${r},${g},${b},${tw*p})`; ctx.fill()
          const gl=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*6)
          gl.addColorStop(0,`rgba(${r},${g},${b},${0.25*tw*p})`); gl.addColorStop(1,'rgba(0,0,0,0)')
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*6,0,Math.PI*2); ctx.fillStyle=gl; ctx.fill()
        })

        const cgl=ctx.createRadialGradient(cl.px,cl.py,0,cl.px,cl.py,32)
        cgl.addColorStop(0,`rgba(${r},${g},${b},${0.3*p})`); cgl.addColorStop(1,'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(cl.px,cl.py,32,0,Math.PI*2); ctx.fillStyle=cgl; ctx.fill()

        if(p>0.65){
          ctx.textAlign='center'
          ctx.font='300 10px Raleway,sans-serif'; ctx.fillStyle=`rgba(${r},${g},${b},${p*0.7})`; ctx.fillText(cl.label,cl.px,cl.py+50)
          ctx.font='700 16px Cinzel,serif'; ctx.fillStyle=`rgba(${r},${g},${b},${p})`; ctx.fillText(cl.score,cl.px,cl.py+70)
        }
      })
    }
    draw()
    return ()=>cancelAnimationFrame(raf)
  },[])

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
      style={{position:'fixed',inset:0,zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',padding:'4.5rem 2rem 2rem'}}>

      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{textAlign:'center',marginBottom:'1.5rem'}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.62rem',letterSpacing:'0.45em',color:'#BFA46F',marginBottom:'0.8rem'}}>✨ Constellation Pathway</div>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:'clamp(1.8rem,4vw,3.2rem)',fontWeight:700,
          background:'linear-gradient(150deg,#F8F6F0 20%,#E8D58B 55%,#D4AF37 100%)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          Your Progress Among the Stars
        </h1>
      </motion.div>

      <canvas ref={ref} style={{width:'min(900px,95vw)',height:'min(460px,58vh)',borderRadius:16,display:'block'}}/>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8}} style={{textAlign:'center',marginTop:'1.8rem',maxWidth:560}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem',fontStyle:'italic',color:'#BFA46F',lineHeight:1.9}}>
          At this trajectory, Sarah will reach{' '}
          <em style={{color:'#E8D58B',fontStyle:'normal',fontWeight:600}}>Advanced Vocalist</em>{' '}
          within 6 weeks. The stars are aligning. The universe is listening.
        </p>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:'0.58rem',letterSpacing:'0.3em',color:'rgba(191,164,111,0.6)',marginTop:'0.9rem'}}>
          AI PROJECTION · 47 SESSIONS ANALYSED
        </div>
      </motion.div>
    </motion.div>
  )
}
