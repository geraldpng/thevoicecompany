import { useState } from 'react'
import Cursor from './components/Cursor'
import Cave from './screens/Cave'
import Forest from './screens/Forest'
import Constellation from './screens/Constellation'
import Stage from './screens/Stage'
import Aria from './screens/Aria'
import Tower from './screens/Tower'

const MODAL_SCREENS = { cave: Cave, forest: Forest, constellation: Constellation, stage: Stage, aria: Aria, tower: Tower }

const LOCATIONS = [
  { id: 'cave',          number: 1, title: ['Crystal','Resonance Cave'],    desc: 'Discover the power of your voice within.',     x: '15%', y: '22%' },
  { id: 'forest',        number: 2, title: ['Harmonic','Forest'],           desc: 'Breathe. Connect. Find your natural tone.',    x: '43%', y: '14%' },
  { id: 'stage',         number: 3, title: ['Golden','Amphitheatre'],       desc: 'Perform. Inspire. Be heard.',                  x: '72%', y: '19%' },
  { id: 'constellation', number: 4, title: ['Constellation','Pathway'],     desc: 'Follow the stars. Unlock your potential.',     x: '13%', y: '56%' },
  { id: 'aria',          number: 5, title: ['Celestial','Conservatory'],    desc: 'Nurture your voice. Refine your artistry.',    x: '44%', y: '60%' },
  { id: 'tower',         number: 6, title: ['Tower of','Mastery'],          desc: 'Elevate your voice. Master your craft.',       x: '80%', y: '58%' },
]

const NAV_ITEMS = [
  { icon: '⌂', label: 'HOME'         },
  { icon: '✦', label: 'MY JOURNEY'   },
  { icon: '♪', label: 'PRACTICE'     },
  { icon: '◈', label: 'VOICEIQ'      },
  { icon: '▲', label: 'PROGRESS'     },
  { icon: '◉', label: 'ACHIEVEMENTS' },
  { icon: '◎', label: 'PROFILE'      },
]

const INSPIRATIONS = [
  { quote: 'Your voice is the mirror of your soul. Polish it daily.', author: '— The Voice Company' },
  { quote: 'Every great singer was once a beginner who refused to give up.', author: '— Ancient Wisdom' },
  { quote: 'Breath is the foundation. Master the breath, master the voice.', author: '— Vocal Tradition' },
  { quote: 'Sing not to be heard, but because the song must be released.', author: '— The Voice Company' },
  { quote: 'Resonance is not found. It is uncovered.', author: '— Vocal Teaching' },
]

const NAV_PANELS = {
  'MY JOURNEY': {
    title: 'My Vocal Journey', icon: '✦',
    content: [
      { label: 'Week 1', detail: 'Foundations — Breath & Posture', done: true },
      { label: 'Week 2', detail: 'Resonance & Placement',          done: true },
      { label: 'Week 3', detail: 'Pitch Control & Ear Training',   done: true },
      { label: 'Week 4', detail: 'Dynamics & Expression',          done: false },
      { label: 'Week 5', detail: 'Performance & Stage Presence',   done: false },
      { label: 'Week 6', detail: 'Mastery & Artistry',             done: false },
    ],
  },
  'PRACTICE': {
    title: 'Practice Sessions', icon: '♪',
    content: [
      { label: 'Morning Warm-Up',     detail: '10 min · Breath + Sirens',      done: false },
      { label: 'Pitch Drills',        detail: '15 min · Scales & Intervals',   done: false },
      { label: 'Resonance Mapping',   detail: '20 min · Chest & Head Voice',   done: false },
      { label: 'Power Builder',       detail: '25 min · Projection & Support', done: false },
      { label: 'Song Interpretation', detail: '30 min · Phrasing & Dynamics',  done: false },
    ],
  },
  'VOICEIQ': {
    title: 'VoiceIQ AI Features', icon: '◈',
    content: [
      { label: 'Real-time Pitch Analysis', detail: 'Instant feedback as you sing',    done: true  },
      { label: 'Tone Profiling',           detail: 'Map your unique voice signature', done: true  },
      { label: 'AI Vocal Coach',           detail: 'Personalised exercise plans',     done: false },
      { label: 'Emotion Mapping',          detail: 'Track expressiveness over time',  done: false },
      { label: 'Performance Prediction',   detail: 'AI readiness score before shows', done: false },
    ],
  },
  'PROGRESS': {
    title: 'Your Progress', icon: '▲',
    content: [
      { label: 'Sessions Completed', detail: '24 sessions · 18.5 hours total', done: true },
      { label: 'Pitch Accuracy',     detail: '87% — up 12% this month',        done: true },
      { label: 'Range Expanded',     detail: '+4 semitones since Day 1',       done: true },
      { label: 'Consistency Streak', detail: '11 days in a row',               done: true },
      { label: 'Next Milestone',     detail: 'Level 13 — 200 XP remaining',   done: false },
    ],
  },
  'ACHIEVEMENTS': {
    title: 'Achievements', icon: '◉',
    content: [
      { label: '🥇 First Note',      detail: 'Completed your first session', done: true  },
      { label: '🔥 On Fire',         detail: '7-day practice streak',        done: true  },
      { label: '🎯 Pitch Perfect',   detail: '90%+ accuracy in a session',   done: true  },
      { label: '🌟 Rising Star',     detail: 'Reach Level 10',               done: true  },
      { label: '⚡ Consistent',      detail: '30-day practice streak',       done: false },
      { label: '👑 Master Vocalist', detail: 'Complete all 6 locations',     done: false },
    ],
  },
  'PROFILE': {
    title: 'My Profile', icon: '◎',
    content: [
      { label: 'Name',         detail: 'Vocalist',                    done: true },
      { label: 'Level',        detail: '12 — Resonant Apprentice',    done: true },
      { label: 'Voice Type',   detail: 'Lyric Tenor',                 done: true },
      { label: 'Member Since', detail: 'June 2026',                   done: true },
      { label: 'Total XP',     detail: '2,840 experience points',     done: true },
    ],
  },
}

const GoldBtn = ({ style, children, ...props }) => (
  <button {...props} style={{
    background: 'none', border: '1px solid rgba(212,175,55,0.35)',
    borderRadius: 3, padding: '8px 20px', cursor: 'none',
    fontFamily: "'Cinzel', serif", fontSize: '0.72rem',
    color: 'rgba(212,175,55,0.85)', letterSpacing: '0.15em',
    transition: 'all 0.3s', ...style,
  }}
  onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor='#D4AF37' }}
  onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='rgba(212,175,55,0.35)' }}
  >{children}</button>
)

export default function App() {
  const [modal, setModal]             = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeNav, setActiveNav]     = useState(0)
  const [hoveredLoc, setHoveredLoc]   = useState(null)
  const [sidePanel, setSidePanel]     = useState(null)
  const [inspModal, setInspModal]     = useState(false)
  const [inspIdx]                     = useState(() => Math.floor(Math.random() * INSPIRATIONS.length))
  const [analysisModal, setAnalysisModal] = useState(false)

  const openModal = (id) => {
    document.body.style.overflow = 'hidden'
    setModal(id)
    setTimeout(() => setModalVisible(true), 30)
  }
  const closeModal = () => {
    setModalVisible(false)
    setTimeout(() => { setModal(null); document.body.style.overflow = '' }, 500)
  }
  const handleNav = (i) => {
    setActiveNav(i)
    const label = NAV_ITEMS[i].label
    if (label === 'HOME') { setSidePanel(null); return }
    setSidePanel(label)
  }

  const ModalScreen = modal ? MODAL_SCREENS[modal] : null

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', background:'#04040a', overflow:'hidden', fontFamily:"'Raleway', sans-serif" }}>
      <Cursor />

      {/* ── Left Sidebar ── */}
      <div style={{
        width: 88, height: '100%', background: 'rgba(4,4,10,0.92)',
        borderRight: '1px solid rgba(212,175,55,0.18)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 0', zIndex: 30, flexShrink: 0,
      }}>
        <div style={{ marginBottom: 24, textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 24, color: '#D4AF37', lineHeight: 1 }}>✦</div>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize: '0.55rem', color: '#D4AF37', letterSpacing: '0.12em', marginTop: 5, lineHeight: 1.5 }}>
            THE<br/>VOICE<br/>COMPANY
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {NAV_ITEMS.map((item, i) => (
            <button key={i} onClick={() => handleNav(i)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '11px 4px',
              background: activeNav === i ? 'rgba(212,175,55,0.12)' : 'transparent',
              borderLeft: activeNav === i ? '2px solid #D4AF37' : '2px solid transparent',
              border: 'none', cursor: 'none', width: '100%', transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 16, color: activeNav===i ? '#D4AF37' : 'rgba(248,246,240,0.45)', marginBottom: 4 }}>{item.icon}</span>
              <span style={{ fontFamily:"'Cinzel', serif", fontSize: '0.48rem', color: activeNav===i ? '#D4AF37' : 'rgba(248,246,240,0.35)', letterSpacing: '0.1em', lineHeight: 1.3, textAlign: 'center' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Side Panel ── */}
      {sidePanel && NAV_PANELS[sidePanel] && (
        <div style={{
          position: 'fixed', left: 88, top: 0, bottom: 0, width: 320,
          background: 'rgba(6,5,12,0.97)',
          borderRight: '1px solid rgba(212,175,55,0.2)',
          zIndex: 25, display: 'flex', flexDirection: 'column',
          animation: 'slideIn 0.28s ease',
          boxShadow: '4px 0 32px rgba(0,0,0,0.6)',
        }}>
          <style>{`@keyframes slideIn { from { transform:translateX(-100%); opacity:0 } to { transform:translateX(0); opacity:1 } }`}</style>
          <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
            <div style={{ fontSize: 24, color: '#D4AF37', marginBottom: 8 }}>{NAV_PANELS[sidePanel].icon}</div>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize: '1rem', color: '#F8F6F0', letterSpacing: '0.1em' }}>
              {NAV_PANELS[sidePanel].title}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
            {NAV_PANELS[sidePanel].content.map((item, i) => (
              <div key={i} style={{
                padding: '14px 24px', borderBottom: '1px solid rgba(212,175,55,0.07)',
                display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(212,175,55,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${item.done ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`,
                  background: item.done ? 'rgba(212,175,55,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#D4AF37', marginTop: 1,
                }}>{item.done ? '✓' : ''}</div>
                <div>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize: '0.7rem', color: item.done ? '#D4AF37' : 'rgba(248,246,240,0.6)', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontFamily:"'Raleway', sans-serif", fontSize: '0.6rem', color: 'rgba(248,246,240,0.4)', letterSpacing: '0.03em' }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setSidePanel(null); setActiveNav(0) }} style={{
            margin: '16px 24px', padding: '10px', background: 'none',
            border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3,
            color: 'rgba(212,175,55,0.6)', fontFamily:"'Cinzel', serif",
            fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#D4AF37'; e.currentTarget.style.color='#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.25)'; e.currentTarget.style.color='rgba(212,175,55,0.6)' }}
          >← BACK TO MAP</button>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{
          height: 62, background: 'rgba(4,4,10,0.88)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', flexShrink: 0, zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily:"'Cinzel', serif", fontSize: 'clamp(1.3rem,2.2vw,1.9rem)', color: '#D4AF37', letterSpacing: '0.15em', fontWeight: 700 }}>VOICEIQ</span>
            <span style={{ fontFamily:"'Raleway', sans-serif", fontSize: 'clamp(0.55rem,0.9vw,0.75rem)', color: 'rgba(248,246,240,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Your AI Vocal Practice Companion</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily:"'Raleway', sans-serif", fontSize: '0.65rem', color: 'rgba(248,246,240,0.5)', letterSpacing: '0.12em' }}>Welcome back,</div>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize: '0.78rem', color: '#F8F6F0', letterSpacing: '0.08em' }}>Vocalist</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1a0f00,#3a2400)', border: '1.5px solid rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#D4AF37' }}>♪</div>
            <div style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 3, padding: '4px 12px', fontFamily:"'Cinzel', serif", fontSize: '0.6rem', color: '#D4AF37', letterSpacing: '0.1em' }}>⭐ LEVEL 12</div>
          </div>
        </div>

        {/* ── Map Area ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <img src="/background.png" alt="VoiceIQ World Map" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 40%, rgba(4,4,10,0.45) 100%)' }} />

          {LOCATIONS.map(loc => (
            <LocationMarker key={loc.id} loc={loc}
              hovered={hoveredLoc === loc.id}
              onEnter={() => setHoveredLoc(loc.id)}
              onLeave={() => setHoveredLoc(null)}
              onClick={() => openModal(loc.id)} />
          ))}

          <div style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:8 }}>
            {['⋮','✦','▲'].map((icon,i) => (
              <div key={i} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(4,4,10,0.75)', border:'1px solid rgba(212,175,55,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(212,175,55,0.7)', fontSize:14, cursor:'none' }}>{icon}</div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{ height: 72, background:'rgba(4,4,10,0.9)', borderTop:'1px solid rgba(212,175,55,0.18)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0, zIndex:20 }}>
          <GoldBtn onClick={() => setInspModal(true)}>✦ DAILY INSPIRATION</GoldBtn>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'clamp(0.85rem,1.2vw,1.05rem)', color:'rgba(248,246,240,0.75)', letterSpacing:'0.04em' }}>Welcome to your vocal journey.</div>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.65rem', color:'#D4AF37', letterSpacing:'0.22em', marginTop:3 }}>EXPLORE · PRACTICE · EVOLVE</div>
          </div>
          <GoldBtn onClick={() => setAnalysisModal(true)}>◈ VOICE ANALYSIS</GoldBtn>
        </div>
      </div>

      {/* ── Daily Inspiration Modal ── */}
      {inspModal && (
        <div onClick={() => setInspModal(false)} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(4,4,10,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.3s ease' }}>
          <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
          <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(160deg,#0c0b14,#08070f)', border:'1px solid rgba(212,175,55,0.35)', borderRadius:6, padding:'48px 56px', maxWidth:540, width:'90%', textAlign:'center', boxShadow:'0 0 60px rgba(212,175,55,0.12)' }}>
            <div style={{ fontSize:36, color:'#D4AF37', marginBottom:20 }}>✦</div>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.68rem', color:'rgba(212,175,55,0.6)', letterSpacing:'0.25em', marginBottom:28 }}>DAILY INSPIRATION</div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'clamp(1.2rem,2vw,1.6rem)', color:'#F8F6F0', lineHeight:1.6, marginBottom:24 }}>
              "{INSPIRATIONS[inspIdx].quote}"
            </div>
            <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:'0.65rem', color:'rgba(212,175,55,0.6)', letterSpacing:'0.1em' }}>{INSPIRATIONS[inspIdx].author}</div>
            <div style={{ width:'60%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)', margin:'32px auto' }} />
            <GoldBtn onClick={() => setInspModal(false)}>CLOSE</GoldBtn>
          </div>
        </div>
      )}

      {/* ── Voice Analysis Modal ── */}
      {analysisModal && (
        <div onClick={() => setAnalysisModal(false)} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(4,4,10,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.3s ease' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(160deg,#0c0b14,#08070f)', border:'1px solid rgba(212,175,55,0.35)', borderRadius:6, padding:'40px 48px', maxWidth:580, width:'90%', boxShadow:'0 0 60px rgba(212,175,55,0.12)' }}>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.68rem', color:'rgba(212,175,55,0.6)', letterSpacing:'0.25em', marginBottom:6 }}>VOICE ANALYSIS</div>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(1.1rem,1.8vw,1.5rem)', color:'#F8F6F0', letterSpacing:'0.1em', marginBottom:32 }}>Your Vocal Profile</div>
            {[
              { label:'Pitch Accuracy',  value:87, color:'#D4AF37' },
              { label:'Tonal Resonance', value:74, color:'#C5A028' },
              { label:'Breath Control',  value:91, color:'#D4AF37' },
              { label:'Dynamic Range',   value:63, color:'#B8922A' },
              { label:'Consistency',     value:79, color:'#C5A028' },
            ].map((stat,i) => (
              <div key={i} style={{ marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontFamily:"'Raleway', sans-serif", fontSize:'0.68rem', color:'rgba(248,246,240,0.7)', letterSpacing:'0.08em' }}>{stat.label}</span>
                  <span style={{ fontFamily:"'Cinzel', serif", fontSize:'0.7rem', color:stat.color }}>{stat.value}%</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${stat.value}%`, background:`linear-gradient(90deg,${stat.color}88,${stat.color})`, borderRadius:2 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop:28, padding:'16px 20px', background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.15)', borderRadius:4 }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'0.9rem', color:'rgba(248,246,240,0.65)', lineHeight:1.6 }}>
                Your breath control is exceptional. Focus on dynamic range this week to unlock new expressive depths.
              </div>
            </div>
            <div style={{ marginTop:24, display:'flex', gap:12, justifyContent:'flex-end' }}>
              <GoldBtn onClick={() => { setAnalysisModal(false); openModal('aria') }}>ENTER CONSERVATORY →</GoldBtn>
              <GoldBtn onClick={() => setAnalysisModal(false)}>CLOSE</GoldBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── Location Modal ── */}
      {ModalScreen && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'#04040a', opacity:modalVisible?1:0, transition:'opacity 0.5s cubic-bezier(0.4,0,0.2,1)', pointerEvents:modalVisible?'all':'none' }}>
          <button onClick={closeModal} style={{ position:'absolute', top:24, left:32, zIndex:210, background:'none', border:'1px solid rgba(212,175,55,0.4)', color:'#D4AF37', fontFamily:"'Cinzel', serif", fontSize:'0.75rem', letterSpacing:'0.2em', padding:'8px 22px', cursor:'none', transition:'all 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor='#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='rgba(212,175,55,0.4)' }}>
            ← RETURN TO MAP
          </button>
          <ModalScreen navigate={(id) => { closeModal(); setTimeout(() => openModal(id), 600) }} />
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
      {/* Circle */}
      <div style={{
        width:46, height:46, borderRadius:'50%',
        background: hovered ? 'rgba(212,175,55,0.3)' : 'rgba(4,4,10,0.8)',
        border: `2px solid ${hovered ? '#D4AF37' : 'rgba(212,175,55,0.6)'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow: hovered ? '0 0 24px rgba(212,175,55,0.55),0 0 48px rgba(212,175,55,0.2)' : '0 0 14px rgba(212,175,55,0.25)',
        transition:'all 0.3s', marginBottom:7,
      }}>
        <span style={{ fontFamily:"'Cinzel', serif", fontSize:'0.95rem', color:'#D4AF37', fontWeight:700 }}>{loc.number}</span>
      </div>
      {/* Card */}
      <div style={{
        background: hovered ? 'rgba(4,4,10,0.95)' : 'rgba(4,4,10,0.82)',
        border: `1px solid ${hovered ? 'rgba(212,175,55,0.55)' : 'rgba(212,175,55,0.25)'}`,
        borderRadius:5, padding:'10px 14px', textAlign:'center',
        minWidth:120, maxWidth:160, transition:'all 0.3s',
        boxShadow: hovered ? '0 6px 28px rgba(0,0,0,0.65)' : '0 2px 14px rgba(0,0,0,0.45)',
      }}>
        <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.65rem', color: hovered ? '#F5E6A3' : '#D4AF37', letterSpacing:'0.06em', fontWeight:700, lineHeight:1.4, textTransform:'uppercase', marginBottom:5 }}>
          {loc.title[0]}<br/>{loc.title[1]}
        </div>
        <div style={{ fontFamily:"'Raleway', sans-serif", fontSize:'0.55rem', color:'rgba(248,246,240,0.65)', letterSpacing:'0.04em', lineHeight:1.5 }}>{loc.desc}</div>
        {hovered && (
          <div style={{ marginTop:9, fontFamily:"'Cinzel', serif", fontSize:'0.55rem', color:'#D4AF37', letterSpacing:'0.18em', borderTop:'1px solid rgba(212,175,55,0.25)', paddingTop:7 }}>ENTER →</div>
        )}
      </div>
    </div>
  )
}
