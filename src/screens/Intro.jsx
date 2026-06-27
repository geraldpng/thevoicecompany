import { motion } from 'framer-motion'

const f = { fontFamily:"'Cinzel',serif" }

export default function Intro({ navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position:'fixed', inset:0, zIndex:10, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:'1.2rem' }}
    >
      {/* Radial glow */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(212,175,55,0.06), transparent 70%)', pointerEvents:'none' }} />

      <motion.img
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:1 }}
        src="https://static.wixstatic.com/media/38fefd_6918bd121bcf48d6a348508e22b4bb38~mv2.png/v1/crop/x_1482,y_1683,w_1234,h_801/fill/w_268,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/The%20Voice%20Company_gold-03-03.png"
        alt="The Voice Company" style={{ width:180, opacity:0.9 }}
        onError={e => e.target.style.display='none'}
      />

      <motion.h1
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:1.2 }}
        style={{ ...f, fontSize:'clamp(3.5rem,8vw,7.5rem)', fontWeight:900, letterSpacing:'0.18em',
          background:'linear-gradient(160deg,#fff 0%,#E8D58B 40%,#D4AF37 70%,#BFA46F 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          filter:'drop-shadow(0 0 60px rgba(212,175,55,0.4))', lineHeight:1 }}
      >
        VoiceIQ
      </motion.h1>

      <motion.p
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2, duration:1 }}
        style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1rem,2vw,1.3rem)',
          letterSpacing:'0.35em', color:'#E8D58B', fontWeight:300 }}
      >
        Your AI Vocal Practice Companion
      </motion.p>

      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.7, duration:1.2, ease:[0.4,0,0.2,1] }}
        style={{ width:1, height:80, background:'linear-gradient(180deg,transparent,#D4AF37,transparent)', margin:'0.5rem 0' }}
      />

      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.2, duration:0.8 }}
        onClick={() => navigate('hub')}
        whileHover={{ letterSpacing:'0.45em', color:'#F8F6F0' }}
        style={{ ...f, fontSize:'0.72rem', letterSpacing:'0.35em', color:'#BFA46F',
          border:'none', background:'none', padding:'0.9rem 2.8rem', position:'relative',
          textTransform:'uppercase', transition:'color 0.3s' }}
      >
        <motion.span
          style={{ position:'absolute', inset:0, borderRadius:60, border:'1px solid rgba(212,175,55,0.3)' }}
          animate={{ boxShadow:['0 0 0px rgba(212,175,55,0)','0 0 30px rgba(212,175,55,0.18)','0 0 0px rgba(212,175,55,0)'] }}
          transition={{ duration:3, repeat:Infinity, delay:2.5 }}
        />
        Enter the Universe
      </motion.button>
    </motion.div>
  )
}
