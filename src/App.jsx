import { useState } from 'react'
import Cursor from './components/Cursor'
import LoadingScreen from './components/LoadingScreen'
import Cave from './screens/Cave'
import Forest from './screens/Forest'
import Constellation from './screens/Constellation'
import Stage from './screens/Stage'
import Aria from './screens/Aria'
import Tower from './screens/Tower'

const MODAL_SCREENS = { cave: Cave, forest: Forest, constellation: Constellation, stage: Stage, aria: Aria, tower: Tower }

const LOCATIONS = [
  { id: 'cave',          number: 1, title: ['Crystal','Resonance Cave'],  desc: 'Discover the power of your voice within.',    x: '15%', y: '22%' },
  { id: 'forest',        number: 2, title: ['Harmonic','Forest'],         desc: 'Breathe. Connect. Find your natural tone.',   x: '43%', y: '20%' },
  { id: 'stage',         number: 3, title: ['Golden','Amphitheatre'],     desc: 'Perform. Inspire. Be heard.',                 x: '72%', y: '19%' },
  { id: 'constellation', number: 4, title: ['Constellation','Pathway'],   desc: 'Follow the stars. Unlock your potential.',    x: '13%', y: '56%' },
  { id: 'aria',          number: 5, title: ['Celestial','Conservatory'],  desc: 'Nurture your voice. Refine your artistry.',   x: '44%', y: '60%' },
  { id: 'tower',         number: 6, title: ['Tower of','Mastery'],        desc: 'Elevate your voice. Master your craft.',      x: '80%', y: '58%' },
]

const NAV_ITEMS = [
  { icon: '\u2302', label: 'HOME'         },
  { icon: '\u2726', label: 'MY JOURNEY'   },
  { icon: '\u266a', label: 'PRACTICE'     },
  { icon: '\u25c8', label: 'VOICEIQ'      },
  { icon: '\u25b2', label: 'PROGRESS'     },
  { icon: '\u25c9', label: 'ACHIEVEMENTS' },
  { icon: '\u25ce', label: 'PROFILE'      },
]

const INSPIRATIONS = [
  { quote: 'Your voice is the mirror of your soul. Polish it daily.',               author: '\u2014 The Voice Company' },
  { quote: 'Every great singer was once a beginner who refused to give up.',        author: '\u2014 Ancient Wisdom'    },
  { quote: 'Breath is the foundation. Master the breath, master the voice.',        author: '\u2014 Vocal Tradition'   },
  { quote: 'Sing not to be heard, but because the song must be released.',          author: '\u2014 The Voice Company' },
  { quote: 'Resonance is not found. It is uncovered.',                             author: '\u2014 Vocal Teaching'    },
]

const NAV_PANELS = {
  'MY JOURNEY': { title: 'My Vocal Journey', icon: '\u2726', content: [
    { label: 'Week 1', detail: 'Foundations \u2014 Breath & Posture', done: true  },
    { label: 'Week 2', detail: 'Resonance & Placement',                done: true  },
    { label: 'Week 3', detail: 'Pitch Control & Ear Training',         done: true  },
    { label: 'Week 4', detail: 'Dynamics & Expression',                done: false },
    { label: 'Week 5', detail: 'Performance & Stage Presence',         done: false },
    { label: 'Week 6', detail: 'Mastery & Artistry',                   done: false },
  ]},
  'PRACTICE': { title: 'Practice Sessions', icon: '\u266a', content: [
    { label: 'Morning Warm-Up',     detail: '10 min \u00b7 Breath + Sirens',      done: false },
    { label: 'Pitch Drills',        detail: '15 min \u00b7 Scales & Intervals',   done: false },
    { label: 'Resonance Mapping',   detail: '20 min \u00b7 Chest & Head Voice',   done: false },
    { label: 'Power Builder',       detail: '25 min \u00b7 Projection & Support', done: false },
    { label: 'Song Interpretation', detail: '30 min \u00b7 Phrasing & Dynamics',  done: false },
  ]},
  'VOICEIQ': { title: 'VoiceIQ AI Features', icon: '\u25c8', content: [
    { label: 'Real-time Pitch Analysis', detail: 'Instant feedback as you sing',    done: true  },
    { label: 'Tone Profiling',           detail: 'Map your unique voice signature', done: true  },
    { label: 'AI Vocal Coach',           detail: 'Personalised exercise plans',     done: false },
    { label: 'Emotion Mapping',          detail: 'Track expressiveness over time',  done: false },
    { label: 'Performance Prediction',   detail: 'AI readiness score before shows', done: false },
  ]},
  'PROGRESS': { title: 'Your Progress', icon: '\u25b2', content: [
    { label: 'Sessions Completed', detail: '24 sessions \u00b7 18.5 hours total', done: true },
    { label: 'Pitch Accuracy',     detail: '87% \u2014 up 12% this month',        done: true },
    { label: 'Range Expanded',     detail: '+4 semitones since Day 1',             done: true },
    { label: 'Consistency Streak', detail: '11 days in a row',                    done: true },
    { label: 'Next Milestone',     detail: 'Level 13 \u2014 200 XP remaining',   done: false },
  ]},
  'ACHIEVEMENTS': { title: 'Achievements', icon: '\u25c9', content: [
    { label: '\U0001f947 First Note',      detail: 'Completed your first session', done: true  },
    { label: '\U0001f525 On Fire',         detail: '7-day practice streak',        done: true  },
    { label: '\U0001f3af Pitch Perfect',   detail: '90%+ accuracy in a session',   done: true  },
    { label: '\U0001f31f Rising Star',     detail: 'Reach Level 10',               done: true  },
    { label: '\u26a1 Consistent',          detail: '30-day practice streak',       done: false },
    { label: '\U0001f451 Master Vocalist', detail: 'Complete all 6 locations',     done: false },
  ]},
  'PROFILE': { title: 'My Profile', icon: '\u25ce', content: [
    { label: 'Name',         detail: 'Vocalist',                 done: true },
    { label: 'Level',        detail: '12 \u2014 Resonant Apprentice', done: true },
    { label: 'Voice Type',   detail: 'Lyric Tenor',              done: true },
    { label: 'Member Since', detail: 'June 2026',                done: true },
    { label: 'Total XP',     detail: '2,840 experience points',  done: true },
  ]},
}

const LOGO = 'https://static.wixstatic.com/media/38fefd_6918bd121bcf48d6a348508e22b4bb38~mv2.png/v1/crop/x_1482,y_1683,w_1234,h_801/fill/w_268,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/The%20Voice%20Company_gold-03-03.png'

const GoldBtn = ({ style, children, ...props }) => (
  <button {...props} style={{
    background: 'none', border: '1px solid rgba(212,175,55,0.35)',
    borderRadius: 3, padding: '8px 20px', cursor: 'none',
    fontFamily: "\'Cinzel\', serif", fontSize: '0.72rem',
    color: 'rgba(212,175,55,0.85)', letterSpacing: '0.15em',
    transition: 'all 0.3s', ...style,
  }}
  onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.12)'; e.currentTarget.style.borderColor='#D4AF37' }}
  onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='rgba(212,175,55,0.35)' }}
  >{children}</button>
)

const SW = 82

export default function App() {
  const [loading, setLoading]           = useState(true)
  const [hubReady, setHubReady]         = useState(false)
  const [modal, setModal]               = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeNav, setActiveNav]       = useState(0)
  const [hoveredLoc, setHoveredLoc]     = useState(null)
  const [sidePanel, setSidePanel]       = useState(null)
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const [inspModal, setInspModal]       = useState(false)
  const [inspIdx]                       = useState(() => Math.floor(Math.random() * INSPIRATIONS.length))
  const [analysisModal, setAnalysisModal] = useState(false)

  const openModal = id => {
    document.body.style.overflow = 'hidden'
    setModal(id)
    setTimeout(() => setModalVisible(true), 30)
  }
  const closeModal = () => {
    setModalVisible(false)
    setTimeout(() => { setModal(null); document.body.style.overflow = '' }, 500)
  }
  const handleNav = i => {
    setActiveNav(i)
    const label = NAV_ITEMS[i].label
    if (label === 'HOME') { setSidePanel(null); return }
    setSidePanel(label)
  }
  const toggleSidebar = () => {
    setSidebarOpen(o => !o)
    setSidePanel(null)
    if (sidebarOpen) setActiveNav(0)
  }

  const ModalScreen = modal ? MODAL_SCREENS[modal] : null
  const offset = hubReady && sidebarOpen ? SW : 0

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', background:'#04040a', fontFamily:"\'Raleway\', sans-serif" }}>
      <style>{`
        @keyframes hubFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn   { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
      `}</style>

      {loading && <LoadingScreen onComplete={() => { setLoading(false); setTimeout(() => setHubReady(true), 100) }} />}
      <Cursor />

      {/* Full-screen map */}
      <img src="/background.png" alt="map" style={{
        position:'fixed', inset:0, width:'100%', height:'100%',
        objectFit:'cover', objectPosition:'center', zIndex:0,
      }} />

      {/* Vignette */}
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 30%, rgba(4,4,10,0.5) 100%)',
      }} />

      {/* Markers */}
      <div style={{
        position:'fixed', inset:0, zIndex:5,
        opacity: hubReady ? 1 : 0,
        transition: 'opacity 1.2s 0.8s ease',
      }}>
        {LOCATIONS.map(loc => (
          <LocationMarker key={loc.id} loc={loc}
            hovered={hoveredLoc === loc.id}
            onEnter={() => setHoveredLoc(loc.id)}
            onLeave={() => setHoveredLoc(null)}
            onClick={() => openModal(loc.id)} />
        ))}
      </div>

      {/* Sidebar */}
      <div style={{
        position:'fixed', top:0, bottom:0, width:SW, zIndex:30,
        left: sidebarOpen ? 0 : -SW,
        opacity: hubReady ? 1 : 0,
        background:'rgba(4,4,10,0.78)',
        backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        borderRight:'1px solid rgba(212,175,55,0.18)',
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'20px 0',
        transition:'left 0.38s cubic-bezier(0.4,0,0.2,1), opacity 1s 0.3s ease',
      }}>
        <div style={{ marginBottom:20, textAlign:'center', padding:'0 10px' }}>
          <img src={LOGO} alt="The Voice Company" style={{ width:'100%', maxWidth:58, objectFit:'contain' }} />
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2, width:'100%' }}>
          {NAV_ITEMS.map((item, i) => (
            <button key={i} onClick={() => handleNav(i)} style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              padding:'10px 4px',
              background: activeNav===i ? 'rgba(212,175,55,0.12)' : 'transparent',
              borderLeft: activeNav===i ? '2px solid #D4AF37' : '2px solid transparent',
              border:'none', cursor:'none', width:'100%', transition:'all 0.2s',
            }}>
              <span style={{ fontSize:16, color:activeNav===i?'#D4AF37':'rgba(248,246,240,0.5)', marginBottom:3 }}>{item.icon}</span>
              <span style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.46rem', color:activeNav===i?'#D4AF37':'rgba(248,246,240,0.38)', letterSpacing:'0.1em', lineHeight:1.3, textAlign:'center' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar toggle */}
      <button onClick={toggleSidebar} style={{
        position:'fixed', top:'50%',
        left: sidebarOpen ? SW : 0,
        transform:'translateY(-50%)',
        zIndex:31, cursor:'none', width:20, height:56,
        background:'rgba(4,4,10,0.78)',
        backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        border:'1px solid rgba(212,175,55,0.25)',
        borderLeft: sidebarOpen ? 'none' : '1px solid rgba(212,175,55,0.25)',
        borderRadius:'0 8px 8px 0',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'rgba(212,175,55,0.65)', fontSize:11,
        transition:'left 0.38s cubic-bezier(0.4,0,0.2,1), background 0.2s, color 0.2s',
        opacity: hubReady ? 1 : 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.15)'; e.currentTarget.style.color='#D4AF37' }}
      onMouseLeave={e => { e.currentTarget.style.background='rgba(4,4,10,0.78)'; e.currentTarget.style.color='rgba(212,175,55,0.65)' }}
      >{sidebarOpen ? '\u2039' : '\u203a'}</button>

      {/* Side content panel */}
      {sidePanel && NAV_PANELS[sidePanel] && (
        <div style={{
          position:'fixed', top:0, bottom:0, width:300, zIndex:29,
          left: sidebarOpen ? SW : 20,
          background:'rgba(5,4,12,0.94)',
          backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          borderRight:'1px solid rgba(212,175,55,0.16)',
          display:'flex', flexDirection:'column',
          animation:'slideIn 0.28s ease',
          transition:'left 0.38s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ padding:'26px 22px 16px', borderBottom:'1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ fontSize:22, color:'#D4AF37', marginBottom:8 }}>{NAV_PANELS[sidePanel].icon}</div>
            <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.95rem', color:'#F8F6F0', letterSpacing:'0.1em' }}>{NAV_PANELS[sidePanel].title}</div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'10px 0' }}>
            {NAV_PANELS[sidePanel].content.map((item, i) => (
              <div key={i} style={{ padding:'13px 22px', borderBottom:'1px solid rgba(212,175,55,0.07)', display:'flex', alignItems:'flex-start', gap:11, transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(212,175,55,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, border:`1.5px solid ${item.done?'#D4AF37':'rgba(212,175,55,0.28)'}`, background:item.done?'rgba(212,175,55,0.14)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#D4AF37', marginTop:1 }}>{item.done?'\u2713':''}</div>
                <div>
                  <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.65rem', color:item.done?'#D4AF37':'rgba(248,246,240,0.55)', letterSpacing:'0.06em', marginBottom:3 }}>{item.label}</div>
                  <div style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'0.58rem', color:'rgba(248,246,240,0.38)', letterSpacing:'0.03em' }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setSidePanel(null); setActiveNav(0) }} style={{ margin:'14px 22px', padding:'10px', background:'none', border:'1px solid rgba(212,175,55,0.22)', borderRadius:3, color:'rgba(212,175,55,0.55)', fontFamily:"\'Cinzel\', serif", fontSize:'0.58rem', letterSpacing:'0.15em', cursor:'none', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#D4AF37'; e.currentTarget.style.color='#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.22)'; e.currentTarget.style.color='rgba(212,175,55,0.55)' }}>\u2190 BACK TO MAP</button>
        </div>
      )}

      {/* Floating header */}
      <div style={{
        position:'fixed', top:0, right:0, height:80, zIndex:20,
        left: offset,
        opacity: hubReady ? 1 : 0,
        background:'linear-gradient(180deg, rgba(4,4,10,0.72) 0%, rgba(4,4,10,0.35) 60%, transparent 100%)',
        borderBottom:'none',
        display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        padding:'14px 24px 0',
        transition:'left 0.38s cubic-bezier(0.4,0,0.2,1), opacity 1s 0.15s ease',
      }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
          <span style={{ fontFamily:"\'Cinzel\', serif", fontSize:'clamp(1.2rem,2vw,1.75rem)', color:'#D4AF37', letterSpacing:'0.15em', fontWeight:700 }}>VOICEIQ</span>
          <span style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'clamp(0.48rem,0.75vw,0.65rem)', color:'rgba(248,246,240,0.38)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Your AI Vocal Practice Companion</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'0.58rem', color:'rgba(248,246,240,0.45)', letterSpacing:'0.12em' }}>Welcome back,</div>
            <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.72rem', color:'#F8F6F0', letterSpacing:'0.08em' }}>Vocalist</div>
          </div>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1a0f00,#3a2400)', border:'1.5px solid rgba(212,175,55,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'#D4AF37' }}>\u266a</div>
          <div style={{ background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.3)', borderRadius:3, padding:'3px 11px', fontFamily:"\'Cinzel\', serif", fontSize:'0.58rem', color:'#D4AF37', letterSpacing:'0.1em' }}>\u2b50 LEVEL 12</div>
        </div>
      </div>

      {/* Floating bottom bar */}
      <div style={{
        position:'fixed', bottom:0, right:0, height:80, zIndex:20,
        left: offset,
        opacity: hubReady ? 1 : 0,
        background:'linear-gradient(0deg, rgba(4,4,10,0.72) 0%, rgba(4,4,10,0.35) 60%, transparent 100%)',
        borderTop:'none',
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        padding:'0 24px 14px',
        transition:'left 0.38s cubic-bezier(0.4,0,0.2,1), opacity 1s 0.4s ease',
      }}>
        <GoldBtn onClick={() => setInspModal(true)}>\u2726 DAILY INSPIRATION</GoldBtn>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"\'Cormorant Garamond\', serif", fontStyle:'italic', fontSize:'clamp(0.8rem,1.1vw,1rem)', color:'rgba(248,246,240,0.72)', letterSpacing:'0.04em' }}>Welcome to your vocal journey.</div>
          <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.6rem', color:'#D4AF37', letterSpacing:'0.22em', marginTop:2 }}>EXPLORE \u00b7 PRACTICE \u00b7 EVOLVE</div>
        </div>
        <GoldBtn onClick={() => setAnalysisModal(true)}>\u25c8 VOICE ANALYSIS</GoldBtn>
      </div>

      {/* Daily Inspiration Modal */}
      {inspModal && (
        <div onClick={() => setInspModal(false)} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(4,4,10,0.8)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(160deg,#0c0b14,#08070f)', border:'1px solid rgba(212,175,55,0.35)', borderRadius:6, padding:'48px 52px', maxWidth:520, width:'90%', textAlign:'center', boxShadow:'0 0 60px rgba(212,175,55,0.12)' }}>
            <div style={{ fontSize:32, color:'#D4AF37', marginBottom:16 }}>\u2726</div>
            <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.62rem', color:'rgba(212,175,55,0.55)', letterSpacing:'0.25em', marginBottom:24 }}>DAILY INSPIRATION</div>
            <div style={{ fontFamily:"\'Cormorant Garamond\', serif", fontStyle:'italic', fontSize:'clamp(1.1rem,2vw,1.5rem)', color:'#F8F6F0', lineHeight:1.65, marginBottom:20 }}>"{INSPIRATIONS[inspIdx].quote}"</div>
            <div style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'0.6rem', color:'rgba(212,175,55,0.55)', letterSpacing:'0.1em' }}>{INSPIRATIONS[inspIdx].author}</div>
            <div style={{ width:'60%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)', margin:'28px auto' }} />
            <GoldBtn onClick={() => setInspModal(false)}>CLOSE</GoldBtn>
          </div>
        </div>
      )}

      {/* Voice Analysis Modal */}
      {analysisModal && (
        <div onClick={() => setAnalysisModal(false)} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(4,4,10,0.8)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(160deg,#0c0b14,#08070f)', border:'1px solid rgba(212,175,55,0.35)', borderRadius:6, padding:'38px 46px', maxWidth:560, width:'90%', boxShadow:'0 0 60px rgba(212,175,55,0.12)' }}>
            <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.62rem', color:'rgba(212,175,55,0.55)', letterSpacing:'0.25em', marginBottom:6 }}>VOICE ANALYSIS</div>
            <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'clamp(1rem,1.7vw,1.4rem)', color:'#F8F6F0', letterSpacing:'0.1em', marginBottom:28 }}>Your Vocal Profile</div>
            {[
              { label:'Pitch Accuracy',  value:87, color:'#D4AF37' },
              { label:'Tonal Resonance', value:74, color:'#C5A028' },
              { label:'Breath Control',  value:91, color:'#D4AF37' },
              { label:'Dynamic Range',   value:63, color:'#B8922A' },
              { label:'Consistency',     value:79, color:'#C5A028' },
            ].map((stat,i) => (
              <div key={i} style={{ marginBottom:15 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'0.63rem', color:'rgba(248,246,240,0.7)', letterSpacing:'0.07em' }}>{stat.label}</span>
                  <span style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.65rem', color:stat.color }}>{stat.value}%</span>
                </div>
                <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${stat.value}%`, background:`linear-gradient(90deg,${stat.color}88,${stat.color})`, borderRadius:2 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop:22, padding:'14px 18px', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.13)', borderRadius:4 }}>
              <div style={{ fontFamily:"\'Cormorant Garamond\', serif", fontStyle:'italic', fontSize:'0.86rem', color:'rgba(248,246,240,0.62)', lineHeight:1.6 }}>Your breath control is exceptional. Focus on dynamic range this week to unlock new expressive depths.</div>
            </div>
            <div style={{ marginTop:20, display:'flex', gap:12, justifyContent:'flex-end' }}>
              <GoldBtn onClick={() => { setAnalysisModal(false); openModal('aria') }}>ENTER CONSERVATORY \u2192</GoldBtn>
              <GoldBtn onClick={() => setAnalysisModal(false)}>CLOSE</GoldBtn>
            </div>
          </div>
        </div>
      )}

      {/* Location screen */}
      {ModalScreen && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'#04040a', opacity:modalVisible?1:0, transition:'opacity 0.5s cubic-bezier(0.4,0,0.2,1)', pointerEvents:modalVisible?'all':'none' }}>
          <button onClick={closeModal} style={{ position:'absolute', top:24, left:32, zIndex:210, background:'none', border:'1px solid rgba(212,175,55,0.4)', color:'#D4AF37', fontFamily:"\'Cinzel\', serif", fontSize:'0.7rem', letterSpacing:'0.2em', padding:'8px 20px', cursor:'none', transition:'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor='#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='rgba(212,175,55,0.4)' }}>
            \u2190 RETURN TO MAP
          </button>
          <ModalScreen navigate={id => { closeModal(); setTimeout(() => openModal(id), 600) }} />
        </div>
      )}
    </div>
  )
}

function LocationMarker({ loc, hovered, onEnter, onLeave, onClick }) {
  return (
    <div onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
      position:'absolute', left:loc.x, top:loc.y,
      transform: hovered ? 'translate(-50%,-50%) scale(1.08)' : 'translate(-50%,-50%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      cursor:'none', zIndex:10, transition:'transform 0.2s ease',
    }}>
      <div style={{
        width:46, height:46, borderRadius:'50%',
        background: hovered ? 'rgba(212,175,55,0.28)' : 'rgba(4,4,10,0.75)',
        border:`2px solid ${hovered?'#D4AF37':'rgba(212,175,55,0.6)'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow: hovered ? '0 0 24px rgba(212,175,55,0.55),0 0 48px rgba(212,175,55,0.18)' : '0 0 14px rgba(212,175,55,0.22)',
        transition:'all 0.3s', marginBottom:7,
      }}>
        <span style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.95rem', color:'#D4AF37', fontWeight:700 }}>{loc.number}</span>
      </div>
      <div style={{
        background: hovered ? 'rgba(4,4,10,0.94)' : 'rgba(4,4,10,0.78)',
        border:`1px solid ${hovered?'rgba(212,175,55,0.55)':'rgba(212,175,55,0.22)'}`,
        borderRadius:5, padding:'10px 14px', textAlign:'center',
        minWidth:118, maxWidth:155, transition:'all 0.3s',
        boxShadow: hovered ? '0 6px 28px rgba(0,0,0,0.65)' : '0 2px 14px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontFamily:"\'Cinzel\', serif", fontSize:'0.63rem', color:hovered?'#F5E6A3':'#D4AF37', letterSpacing:'0.06em', fontWeight:700, lineHeight:1.45, textTransform:'uppercase', marginBottom:5 }}>{loc.title[0]}<br/>{loc.title[1]}</div>
        <div style={{ fontFamily:"\'Raleway\', sans-serif", fontSize:'0.53rem', color:'rgba(248,246,240,0.62)', letterSpacing:'0.04em', lineHeight:1.5 }}>{loc.desc}</div>
        {hovered && <div style={{ marginTop:9, fontFamily:"\'Cinzel\', serif", fontSize:'0.53rem', color:'#D4AF37', letterSpacing:'0.18em', borderTop:'1px solid rgba(212,175,55,0.22)', paddingTop:7 }}>ENTER \u2192</div>}
      </div>
    </div>
  )
}
