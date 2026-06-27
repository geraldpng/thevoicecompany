import * as THREE from 'three'

const ENVS = [
  { x:  0, y:  0, z:    0 },
  { x: -3, y: -1, z: -150 },
  { x:  3, y:  1, z: -300 },
  { x: -2, y: -1, z: -450 },
  { x:  3, y:  2, z: -600 },
  { x:  0, y:  0, z: -750 },
  { x:  2, y: -1, z: -900 },
]

export const WAYPOINTS = ENVS.map(e => ({
  pos:  [e.x, e.y, e.z + 5],
  look: [e.x, e.y, e.z - 2],
}))

export class VoiceIQScene {
  constructor(canvas) {
    this.canvas  = canvas
    this.tickers = []
    this._init()
  }

  _init() {
    const W = window.innerWidth, H = window.innerHeight

    // ── Renderer ──────────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true })
    this.renderer.setSize(W, H)
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    // ── Scene + camera ────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x04040a)
    this.scene.fog = new THREE.FogExp2(0x04040a, 0.052)

    this.camera = new THREE.PerspectiveCamera(62, W / H, 0.1, 250)
    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(0, 0, 0)

    // ── Lights ────────────────────────────────────────────────────────────────
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dir = new THREE.DirectionalLight(0xfff0cc, 2.5)
    dir.position.set(5, 10, 5)
    this.scene.add(dir)
    ENVS.forEach((e, i) => {
      const cols = [0xD4AF37, 0x9F7AEA, 0x86EFAC, 0xFBBF24, 0xC4B5FD, 0x93C5FD, 0xD4AF37]
      const l = new THREE.PointLight(cols[i], 4.0, 30)
      l.position.set(e.x, e.y + 2, e.z)
      this.scene.add(l)
    })

    // ── Build environments ────────────────────────────────────────────────────
    this._hero()
    this._cave()
    this._forest()
    this._stage()
    this._constellation()
    this._aria()
    this._tower()
    this._dust()

    // ── Resize ────────────────────────────────────────────────────────────────
    this._onResize = () => {
      const w = window.innerWidth, h = window.innerHeight
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h)
    }
    window.addEventListener('resize', this._onResize)

    this.clock = new THREE.Clock()
    this._loop()
  }

  // ── helpers ─────────────────────────────────────────────────────────────────
  _grp(i) {
    const g = new THREE.Group()
    g.position.set(ENVS[i].x, ENVS[i].y, ENVS[i].z)
    this.scene.add(g)
    return g
  }
  _tk(fn) { this.tickers.push(fn) }
  _mat(col, opts = {}) { return new THREE.MeshStandardMaterial({ color: col, ...opts }) }

  // ── 0 · Hero ─────────────────────────────────────────────────────────────────
  _hero() {
    const g = this._grp(0)
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 4),
      this._mat(0xD4AF37, { emissive: 0xD4AF37, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.15 })
    )
    g.add(orb)
    this._tk(t => { orb.rotation.y = t * 0.2; orb.position.y = Math.sin(t * 0.4) * 0.2 })

    for (let i = 0; i < 2; i++) {
      const r = 2.5 + i * 0.9
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.025, 8, 80),
        this._mat(0xD4AF37, { emissive: 0xD4AF37, emissiveIntensity: 0.4 })
      )
      ring.rotation.x = Math.PI / 2.2 + i * 0.5
      g.add(ring)
      const dir = i === 0 ? 1 : -1
      this._tk(t => { ring.rotation.z = t * 0.15 * dir })
    }

    const pts = []
    for (let i = 0; i < 80; i++) pts.push((Math.random()-0.5)*10, (Math.random()-0.5)*7, (Math.random()-0.5)*7-1)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.04, transparent: true, opacity: 0.4 }))
    g.add(dust)
    this._tk(t => { dust.rotation.y = t * 0.02 })
  }

  // ── 1 · Crystal Cave ─────────────────────────────────────────────────────────
  _cave() {
    const g = this._grp(1)
    const spires = [
      [0, 0.28, 5.0, 0x7C3AED, 0xA78BFA],
      [0.7, 0.22, 5.8, 0x6D28D9, 0x8B5CF6],
      [-0.65, 0.20, 4.5, 0x9F7AEA, 0xC4B5FD],
      [1.1, 0.16, 3.8, 0x7C3AED, 0xA78BFA],
      [-1.1, 0.16, 4.2, 0x6D28D9, 0x9F7AEA],
      [0.3, 0.13, 3.0, 0x8B5CF6, 0xC4B5FD],
      [-0.35, 0.14, 3.5, 0x7C3AED, 0xA78BFA],
    ]
    spires.forEach(([x, r, h, col, em], idx) => {
      const sp = new THREE.Mesh(
        new THREE.ConeGeometry(r, h, 6, 1),
        this._mat(col, { emissive: em, emissiveIntensity: 0.9, flatShading: true })
      )
      sp.position.set(x, h / 2 - 1.8, idx * 0.15 - 0.5)
      const ph = idx * 0.9
      this._tk(t => { sp.material.emissiveIntensity = 0.7 + Math.sin(t * 1.6 + ph) * 0.3 })
      g.add(sp)
    })

    const fpts = []
    for (let i = 0; i < 60; i++) fpts.push((Math.random()-0.5)*5, Math.random()*4-1.5, (Math.random()-0.5)*4)
    const fgeo = new THREE.BufferGeometry()
    fgeo.setAttribute('position', new THREE.Float32BufferAttribute(fpts, 3))
    const motes = new THREE.Points(fgeo, new THREE.PointsMaterial({ color: 0xC4B5FD, size: 0.055, transparent: true, opacity: 0.7 }))
    g.add(motes)
    this._tk(t => { motes.rotation.y = t * 0.04 })
  }

  // ── 2 · Harmonic Forest ───────────────────────────────────────────────────────
  _forest() {
    const g = this._grp(2)
    const addTree = (x, z, h, r, ancient) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(ancient ? 0.12 : 0.08, ancient ? 0.18 : 0.12, h, 8),
        this._mat(0x3A2008, { roughness: 0.95 })
      )
      trunk.position.set(x, h / 2 - 1.6, z)
      g.add(trunk)
      for (let l = 0; l < (ancient ? 6 : 3); l++) {
        const s = 1 - l * 0.16
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(r * s, ancient ? 1.1 : 0.85, 8),
          this._mat(ancient ? 0x1A4208 : 0x112604, { emissive: ancient ? 0x4ADE80 : 0x1A3D08, emissiveIntensity: ancient ? 0.2 : 0.04, roughness: 0.85 })
        )
        cone.position.set(x, h - 1.6 + l * (ancient ? 0.7 : 0.55) + 0.3, z)
        g.add(cone)
      }
    }
    addTree(0, 0, 4.5, 0.85, true)
    const grove = [[2.2, 0.5], [-2.0, 0.4], [0.7, 2.0], [-0.8, -1.8], [2.4, -1.2], [-1.8, 1.6]]
    grove.forEach(([x, z]) => addTree(x, z, 2.0 + Math.random() * 1.2, 0.55, false))

    const lpts = []
    for (let i = 0; i < 120; i++) lpts.push((Math.random()-0.5)*8, Math.random()*6-1.5, (Math.random()-0.5)*7)
    const lgeo = new THREE.BufferGeometry()
    lgeo.setAttribute('position', new THREE.Float32BufferAttribute(lpts, 3))
    const leaves = new THREE.Points(lgeo, new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.07, transparent: true, opacity: 0.55 }))
    g.add(leaves)
    this._tk(t => {
      const p = lgeo.attributes.position.array
      for (let i = 1; i < p.length; i += 3) { p[i] -= 0.003; if (p[i] < -1.7) p[i] = 5 }
      lgeo.attributes.position.needsUpdate = true
    })
  }

  // ── 3 · Golden Amphitheatre ───────────────────────────────────────────────────
  _stage() {
    const g = this._grp(3)
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.15, 32),
      this._mat(0x2A1800, { emissive: 0xD4AF37, emissiveIntensity: 0.06, metalness: 0.4 })
    )
    floor.position.y = -1.5
    g.add(floor)

    const cols = [[-2.4, -0.3], [-1.4, -0.55], [1.4, -0.55], [2.4, -0.3], [-1.9, 1.1], [1.9, 1.1]]
    cols.forEach(([cx, cz]) => {
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.17, 4.0, 12),
        this._mat(0x4A3800, { emissive: 0xD4AF37, emissiveIntensity: 0.06, metalness: 0.55 })
      )
      shaft.position.set(cx, 0.5, cz)
      g.add(shaft)
    })

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.22, 0.28),
      this._mat(0x4A3800, { emissive: 0xD4AF37, emissiveIntensity: 0.1, metalness: 0.6 })
    )
    beam.position.set(0, 2.68, -0.4)
    g.add(beam)

    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(0.9, 24),
      this._mat(0xD4AF37, { emissive: 0xD4AF37, emissiveIntensity: 0.8, transparent: true, opacity: 0.45 })
    )
    glow.rotation.x = -Math.PI / 2
    glow.position.set(0, -1.42, 0)
    g.add(glow)
    this._tk(t => { glow.material.emissiveIntensity = 0.5 + Math.sin(t * 0.75) * 0.3 })
  }

  // ── 4 · Constellation ────────────────────────────────────────────────────────
  _constellation() {
    const g = this._grp(4)
    const spts = []
    for (let i = 0; i < 180; i++) spts.push((Math.random()-0.5)*18, (Math.random()-0.5)*12, (Math.random()-0.5)*7)
    const sgeo = new THREE.BufferGeometry()
    sgeo.setAttribute('position', new THREE.Float32BufferAttribute(spts, 3))
    const stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xF5E6A3, size: 0.08, transparent: true, opacity: 0.8 }))
    g.add(stars)
    this._tk(t => {
      const p = sgeo.attributes.position.array
      for (let i = 1; i < p.length; i += 3) p[i] += Math.sin(t * 0.4 + i) * 0.0003
      sgeo.attributes.position.needsUpdate = true
    })

    const heroStars = [[-4, 3, -1], [4, -2, 0], [-2, 5, 0.8], [4, 4, -1.2], [0.5, -4, 0.5], [-4.5, -1.5, 0.2]]
    heroStars.forEach(([x, y, z], i) => {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        this._mat(0xF5E6A3, { emissive: 0xF5E6A3, emissiveIntensity: 1.8 })
      )
      s.position.set(x, y, z)
      g.add(s)
      this._tk(t => { s.material.emissiveIntensity = 1.4 + Math.sin(t * 1.3 + i) * 0.5 })
    })

    const lpts = []
    heroStars.forEach((a, i) => { const b = heroStars[(i + 1) % heroStars.length]; lpts.push(...a, ...b) })
    const lgeo = new THREE.BufferGeometry()
    lgeo.setAttribute('position', new THREE.Float32BufferAttribute(lpts, 3))
    g.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.4 })))

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      this._mat(0x141432, { emissive: 0x63B3ED, emissiveIntensity: 0.25 })
    )
    dome.position.set(-0.3, -1.0, 0)
    g.add(dome)
  }

  // ── 5 · Aria / Celestial Conservatory ────────────────────────────────────────
  _aria() {
    const g = this._grp(5)
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 4),
      this._mat(0x93C5FD, { emissive: 0x60A5FA, emissiveIntensity: 0.9, roughness: 0.05 })
    )
    g.add(orb)
    this._tk(t => {
      orb.rotation.y = t * 0.38
      orb.rotation.x = t * 0.14
      const s = 1 + Math.sin(t * 0.9) * 0.07
      orb.scale.set(s, s, s)
    })

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.8, 2),
      new THREE.MeshBasicMaterial({ color: 0x60A5FA, wireframe: true, transparent: true, opacity: 0.2 })
    )
    g.add(wire)
    this._tk(t => { wire.rotation.y = -t * 0.25 })

    for (let i = 0; i < 2; i++) {
      const r = 2.8 + i * 1.4
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.028, 8, 80),
        this._mat(i === 0 ? 0x60A5FA : 0xA78BFA, { emissive: i === 0 ? 0x60A5FA : 0xA78BFA, emissiveIntensity: 0.8 })
      )
      ring.rotation.x = Math.PI / 2 + i * 0.6
      g.add(ring)
      const dir = i === 0 ? 1 : -1
      this._tk(t => { ring.rotation.z = t * 0.2 * dir })
    }

    const cpts = []
    for (let i = 0; i < 120; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI, r = 3.5 + Math.random() * 2.5
      cpts.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th))
    }
    const cgeo = new THREE.BufferGeometry()
    cgeo.setAttribute('position', new THREE.Float32BufferAttribute(cpts, 3))
    const cloud = new THREE.Points(cgeo, new THREE.PointsMaterial({ color: 0xA78BFA, size: 0.07, transparent: true, opacity: 0.5 }))
    g.add(cloud)
    this._tk(t => { cloud.rotation.y = t * 0.06 })
  }

  // ── 6 · Tower of Mastery ─────────────────────────────────────────────────────
  _tower() {
    const g = this._grp(6)
    const levels = [[1.2, 1.0, -0.5], [1.0, 1.0, 0.5], [0.82, 1.0, 1.5], [0.66, 1.0, 2.5], [0.50, 1.0, 3.5], [0.36, 0.9, 4.4], [0.22, 0.7, 5.3]]
    const tmat = this._mat(0x181200, { emissive: 0xD4AF37, emissiveIntensity: 0.025, metalness: 0.5, roughness: 0.75 })
    levels.forEach(([w, h, y]) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), tmat)
      box.position.y = y
      g.add(box)
    })

    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 2.0, 8),
      this._mat(0x221A00, { emissive: 0xD4AF37, emissiveIntensity: 0.2, metalness: 0.7 })
    )
    spire.position.y = 7.0
    g.add(spire)

    const fpts = []
    for (let i = 0; i < 60; i++) fpts.push((Math.random()-0.5)*0.4, Math.random()*0.9, (Math.random()-0.5)*0.4)
    const fgeo = new THREE.BufferGeometry()
    fgeo.setAttribute('position', new THREE.Float32BufferAttribute(fpts, 3))
    const flame = new THREE.Points(fgeo, new THREE.PointsMaterial({ color: 0xFBBF24, size: 0.12, transparent: true, opacity: 0.9 }))
    flame.position.y = 8.2
    g.add(flame)
    this._tk(t => {
      const p = fgeo.attributes.position.array
      for (let i = 1; i < p.length; i += 3) { p[i] += 0.018; if (p[i] > 0.9) p[i] = 0 }
      fgeo.attributes.position.needsUpdate = true
    })
  }

  // ── Global ambient dust ───────────────────────────────────────────────────────
  _dust() {
    const pts = []
    for (let i = 0; i < 600; i++) pts.push((Math.random()-0.5)*30, (Math.random()-0.5)*18, Math.random()*-940+10)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.025, transparent: true, opacity: 0.28 }))
    this.scene.add(dust)
    this._tk(t => { dust.rotation.y = t * 0.005 })
  }

  // ── Render loop ───────────────────────────────────────────────────────────────
  _loop() {
    this._raf = requestAnimationFrame(() => this._loop())
    const t = this.clock.getElapsedTime()
    this.tickers.forEach(fn => fn(t))
    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    cancelAnimationFrame(this._raf)
    window.removeEventListener('resize', this._onResize)
    this.renderer.dispose()
  }
}
