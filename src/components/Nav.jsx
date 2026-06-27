export default function Nav({ screen, navigate }) {
  const isRoot = screen === 'intro' || screen === 'hub'
  const pill = { position:'fixed', zIndex:300, fontFamily:"'Cinzel',serif", fontSize:'0.6rem',
    letterSpacing:'0.2em', background:'rgba(4,4,10,0.75)', backdropFilter:'blur(14px)',
    padding:'0.55rem 1.2rem', borderRadius:40, border:'1px solid rgba(212,175,55,0.15)',
    transition:'all 0.5s', opacity: isRoot ? 0 : 1, pointerEvents: isRoot ? 'none' : 'all' }

  return (
    <>
      <button onClick={() => navigate('hub')} style={{ ...pill, top:'1.5rem', left:'1.8rem', color:'#BFA46F' }}>
        ← Navigate
      </button>
      <div style={{ ...pill, top:'1.5rem', right:'1.8rem', color:'#E8D58B', textAlign:'right', lineHeight:1.7 }}>
        <strong>Sarah Lim</strong>
        <span style={{ display:'block', fontSize:'0.55rem', color:'#BFA46F', letterSpacing:'0.08em' }}>
          Intermediate · Score 84 · 🔥 12 days
        </span>
      </div>
    </>
  )
}
