import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLYPHS } from './glyphs.js';
import { Choir, score } from './voice.js';
import { applyCopy, setLang, getLang, onLang, t } from './copy.js';

const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const rand = (a, b) => a + Math.random() * (b - a);

applyCopy();
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* ------------------------------------------------------------------ the company */
// range = lowest and highest MIDI note each singer will attempt
const CAST = [
  { id: 'P', uk: 'П', color: 0xf5b301, range: [36, 55], shift: 0.9, level: 1.2 },
  { id: 'E', uk: 'Е', color: 0xff4f9a, range: [50, 67], shift: 1.0, level: 1.1 },
  { id: 'L', uk: 'Л', color: 0x2fd3a6, range: [62, 79], shift: 1.16, level: 0.8 },
  { id: 'Y', uk: 'И', color: 0x4f7bff, range: [57, 72], shift: 1.1, level: 1.2 },
  { id: 'K', uk: null, color: 0xff7a1a, range: [45, 62], shift: 0.95, level: 1.5 },
  { id: 'H', uk: 'Х', color: 0xb79cff, range: [62, 79], shift: 1.18, level: 1.5 }
];
// where each letter keeps its eyes and mouth (x from the centre line, y from the floor, cap height = 2)
const FACE = {
  P: { eyes: [[-0.62, 1.62], [0.14, 1.62]], r: 0.2, mouth: [-0.62, 0.92], mw: 0.5 },
  E: { eyes: [[-0.6, 1.64], [0.2, 1.64]], r: 0.2, mouth: [-0.3, 1.0], mw: 0.52 },
  L: { eyes: [[-0.8, 1.62], [-0.36, 1.62]], r: 0.17, mouth: [-0.58, 1.08], mw: 0.46 },
  Y: { eyes: [[-0.62, 1.68], [0.62, 1.68]], r: 0.2, mouth: [0, 0.98], mw: 0.52 },
  K: { eyes: [[-0.7, 1.62], [0.4, 1.7]], r: 0.2, mouth: [-0.3, 1.0], mw: 0.5 },
  H: { eyes: [[-0.66, 1.6], [0.66, 1.6]], r: 0.2, mouth: [0, 1.0], mw: 0.52 },
  'П': { eyes: [[-0.64, 1.64], [0.64, 1.64]], r: 0.2, mouth: [0, 1.62], mw: 0.44 },
  'Е': { eyes: [[-0.6, 1.64], [0.2, 1.64]], r: 0.2, mouth: [-0.3, 1.0], mw: 0.52 },
  'Л': { eyes: [[-0.12, 1.66], [0.62, 1.66]], r: 0.19, mouth: [0.62, 1.02], mw: 0.46 },
  'И': { eyes: [[-0.64, 1.6], [0.64, 1.6]], r: 0.2, mouth: [0, 1.0], mw: 0.46 },
  'Х': { eyes: [[-0.56, 1.7], [0.56, 1.7]], r: 0.19, mouth: [0, 1.0], mw: 0.5 }
};
const MOUTH = { a: [0.7, 0.86], o: [0.5, 0.6], u: [0.36, 0.42], e: [0.9, 0.5], i: [0.86, 0.34] };
const PENTA = [7, 10, 0, 2, 5];                      // G minor pentatonic: any two letters agree
function snap(m) {
  let best = Math.round(m), bd = 99;
  for (let c = Math.floor(m) - 3; c <= Math.ceil(m) + 3; c++) if (PENTA.includes(((c % 12) + 12) % 12) && Math.abs(c - m) < bd) { bd = Math.abs(c - m); best = c; }
  return best;
}

const choir = new Choir();
const canvas = $('#stage');
let renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { document.documentElement.classList.add('no-webgl'); }

if (renderer) boot();
else wireAuditionsOnly();

function wireAuditionsOnly() {
  const voices = CAST.map((c, i) => choir.voice({ pan: lerp(-0.6, 0.6, i / 5), shift: c.shift, level: c.level }));
  document.querySelectorAll('[data-cast] button').forEach(b => b.addEventListener('click', () => {
    if (!choir.ensure()) return;
    const i = CAST.findIndex(c => c.id === b.closest('[data-cast]').dataset.cast), c = CAST[i];
    const base = snap(lerp(c.range[0], c.range[1], 0.4)), t0 = choir.ctx.currentTime + 0.05;
    [0, 3, 7, 12].forEach((s, k) => voices[i].note(snap(base + s), t0 + k * 0.2, k === 3 ? 0.7 : 0.2, 'aeia'[k], 0.6));
  }));
  for (const id of ['#startBtn', '#roseBtn', '#tomatoBtn']) $(id).disabled = true;
}

function boot() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x160826);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.16;
  const FOV = 30, TAN = Math.tan(FOV * Math.PI / 360);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 200);

  /* ---------------- lights ---------------- */
  scene.add(new THREE.HemisphereLight(0xc9b4ff, 0x2a0a20, 0.3));
  const key = new THREE.SpotLight(0xffe6c4, 900, 0, 0.62, 0.7, 2);
  key.position.set(-5, 13, 15); key.target.position.set(0, 1.5, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.radius = 4;
  key.shadow.camera.near = 6; key.shadow.camera.far = 50;
  scene.add(key, key.target);
  const fill = new THREE.SpotLight(0xff86c0, 420, 0, 0.7, 0.9, 2);
  fill.position.set(9, 7, 12); fill.target.position.set(0, 2, 0); scene.add(fill, fill.target);
  const rim = new THREE.DirectionalLight(0xff4fd0, 0.9); rim.position.set(0, 7, -8); scene.add(rim);
  const follow = new THREE.SpotLight(0xffffff, 0, 0, 0.11, 0.55, 2);
  follow.position.set(0, 12, 18); scene.add(follow, follow.target);

  /* ---------------- the room ---------------- */
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(300, 140), new THREE.ShaderMaterial({
    uniforms: { lo: { value: new THREE.Color(0xe8407c) }, mid: { value: new THREE.Color(0x4a1470) }, hi: { value: new THREE.Color(0x12062a) } },
    vertexShader: 'varying vec3 w; void main(){ vec4 p = modelMatrix * vec4(position,1.); w = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }',
    fragmentShader: 'uniform vec3 lo; uniform vec3 mid; uniform vec3 hi; varying vec3 w; void main(){ float k = smoothstep(-1., 7., w.y); float k2 = smoothstep(5., 20., w.y); vec3 c = mix(mix(lo, mid, k), hi, k2); c *= 1. - .25 * smoothstep(8., 40., abs(w.x)); gl_FragColor = vec4(c, 1.); \n#include <colorspace_fragment>\n }'
  }));
  backdrop.position.set(0, 20, -9); scene.add(backdrop);

  const fc = document.createElement('canvas'); fc.width = fc.height = 1024;
  { const c = fc.getContext('2d'); c.fillStyle = '#74406c'; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 16; i++) {
      c.fillStyle = `rgba(${i % 3 === 0 ? '255,190,160' : '20,0,30'},${0.03 + Math.random() * 0.09})`; c.fillRect(i * 64, 0, 64, 1024);
      c.fillStyle = 'rgba(15,0,20,.7)'; c.fillRect(i * 64, 0, 3, 1024);
      for (let k = 0; k < 14; k++) { c.fillStyle = `rgba(20,0,25,${Math.random() * 0.12})`; c.fillRect(i * 64 + Math.random() * 60, 0, 1 + Math.random() * 2, 1024); }
    } }
  const ftex = new THREE.CanvasTexture(fc); ftex.wrapS = ftex.wrapT = THREE.RepeatWrapping; ftex.repeat.set(10, 3);
  ftex.colorSpace = THREE.SRGBColorSpace; ftex.anisotropy = 8;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(160, 48), new THREE.MeshStandardMaterial({ map: ftex, roughness: 0.5, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = 14; floor.receiveShadow = true; scene.add(floor);

  // cardboard moon and stars, hung from the flies on string
  const hangers = [];
  const card = (shape, color) => new THREE.Mesh(new THREE.ShapeGeometry(shape, 24), new THREE.MeshBasicMaterial({ color, toneMapped: false, side: THREE.DoubleSide }));
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xd9c8ff, toneMapped: false, transparent: true, opacity: 0.55 });
  function hang(obj, drop, strings) {
    const g = new THREE.Group(); obj.position.y = -drop; g.add(obj);
    for (const sx of strings) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.03, drop), stringMat); s.position.set(sx, -drop / 2, -0.01); g.add(s); }
    g.userData = { len: drop, phase: rand(0, 6), speed: rand(0.5, 0.9), amp: rand(0.012, 0.03) };
    scene.add(g); hangers.push(g); return g;
  }
  const moonFull = new THREE.Shape(); moonFull.absarc(0, 0, 1.5, 0, Math.PI * 2);
  const moon = hang(card(moonFull, 0xfff0b8), 6, [-0.7, 0.7]);
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.2 : 0.5; starShape[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  const stars = [0xffd166, 0xff8fc0, 0x9fe8d0, 0xffd166, 0xc9b4ff].map(c => hang(card(starShape, c), rand(3, 8), [0]));

  /* ---------------- curtains ---------------- */
  const velvet = new THREE.MeshPhysicalMaterial({ color: 0x7d0a2c, roughness: 0.9, sheen: 0.7, sheenColor: new THREE.Color(0xff4f7a), sheenRoughness: 0.45, side: THREE.DoubleSide });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf5b301, roughness: 0.4, metalness: 0.5 });
  const drapes = new THREE.Group(); scene.add(drapes);
  let curtainL, curtainR, curtainOpen = reduced ? 1 : 0, curtainS = 0.2;
  function buildCurtains(hw, vh, cy, z) {
    for (const m of [...drapes.children]) { drapes.remove(m); m.geometry.dispose(); }
    const w = hw + 0.6, h = vh + 3;
    const mk = dir => {
      const g = new THREE.PlaneGeometry(w, h, 90, 1); g.translate(w / 2, 0, 0);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const u = p.getX(i) / w; p.setZ(i, Math.sin(u * Math.PI * 17) * 0.2 + Math.sin(u * Math.PI * 6.3 + 1) * 0.12); }
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, velvet); m.position.set(-dir * (hw + 0.3), cy, z); m.scale.x = dir; m.userData.dir = dir; m.receiveShadow = true;
      drapes.add(m); return m;
    };
    curtainL = mk(1); curtainR = mk(-1);
    const vhh = vh * 0.088, vg = new THREE.PlaneGeometry(hw * 2 + 2, vhh, 120, 8), vp = vg.attributes.position;
    const scallops = Math.max(4, Math.round(hw / 1.6));
    for (let i = 0; i < vp.count; i++) {
      const u = vp.getX(i) / (hw * 2 + 2) + 0.5, v = 0.5 - vp.getY(i) / vhh;
      vp.setY(i, vp.getY(i) - v * Math.abs(Math.sin(u * Math.PI * scallops)) * vhh * 0.55);
      vp.setZ(i, Math.sin(u * Math.PI * scallops * 2) * 0.12 * v);
    }
    vg.computeVertexNormals();
    const val = new THREE.Mesh(vg, velvet); val.position.set(0, cy + vh / 2 - vhh * 0.42, z + 0.3); drapes.add(val);
    const trim = new THREE.Mesh(new THREE.PlaneGeometry(hw * 2 + 2, vhh * 0.07), gold); trim.position.set(0, cy + vh / 2 - vhh * 0.02, z + 0.5); drapes.add(trim);
    curtainS = clamp(0.2, 0.12, 0.3);
  }

  /* ---------------- risers for narrow screens ---------------- */
  const riserMat = new THREE.MeshStandardMaterial({ color: 0x2330d8, roughness: 0.55 });
  const risers = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), riserMat); m.castShadow = m.receiveShadow = true; m.visible = false; scene.add(m); return m; });

  /* ---------------- performers ---------------- */
  const geoCache = {};
  function glyphGeo(ch) {
    if (geoCache[ch]) return geoCache[ch];
    const sp = new THREE.ShapePath(), c = GLYPHS[ch].c;
    for (let i = 0; i < c.length;) {
      const k = c[i++];
      if (k === 'M') { sp.moveTo(c[i], c[i + 1]); i += 2; }
      else if (k === 'L') { sp.lineTo(c[i], c[i + 1]); i += 2; }
      else if (k === 'Q') { sp.quadraticCurveTo(c[i], c[i + 1], c[i + 2], c[i + 3]); i += 4; }
      else if (k === 'C') { sp.bezierCurveTo(c[i], c[i + 1], c[i + 2], c[i + 3], c[i + 4], c[i + 5]); i += 6; }
    }
    const g = new THREE.ExtrudeGeometry(sp.toShapes(false), { depth: 0.52, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelOffset: -0.05, bevelSegments: 6, curveSegments: 10 });
    g.translate(0, 0, -0.26);
    return (geoCache[ch] = g);
  }
  const FRONT = 0.37;
  const eyeGeo = new THREE.SphereGeometry(1, 28, 20), discGeo = new THREE.CircleGeometry(0.5, 40);
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0e0714, roughness: 0.2 });
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x2a0616 }), tongueMat = new THREE.MeshBasicMaterial({ color: 0xff6f91 });
  const browGeo = new THREE.BoxGeometry(1, 1, 1);
  const smileGeo = new THREE.TorusGeometry(0.5, 0.075, 8, 24, Math.PI);

  class Performer {
    constructor(def, i) {
      Object.assign(this, def); this.i = i; this.glyph = def.id; this.present = true;
      this.root = new THREE.Group(); this.body = new THREE.Group(); this.root.add(this.body); scene.add(this.root);
      this.mat = new THREE.MeshPhysicalMaterial({ color: def.color, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.25 });
      this.mesh = new THREE.Mesh(glyphGeo(def.id), this.mat); this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.userData.perf = this;
      this.body.add(this.mesh);
      this.eyes = [0, 1].map(k => {
        const g = new THREE.Group(), w = new THREE.Mesh(eyeGeo, white), p = new THREE.Mesh(eyeGeo, black), b = new THREE.Mesh(browGeo, black);
        w.scale.set(1, 1, 0.55); g.add(w, p, b); b.visible = false; this.body.add(g);
        return { g, w, p, b, px: 0, py: 0, vx: 0, vy: 0, side: k ? 1 : -1 };
      });
      this.mouth = new THREE.Mesh(discGeo, mouthMat); this.tongue = new THREE.Mesh(discGeo, tongueMat);
      this.tongue.position.set(0, -0.2, 0.004); this.tongue.scale.set(0.62, 0.5, 1); this.mouth.add(this.tongue);
      this.smile = new THREE.Mesh(smileGeo, mouthMat); this.smile.rotation.z = Math.PI;
      this.body.add(this.mouth, this.smile);
      this.voice = choir.voice({ pan: lerp(-0.6, 0.6, i / 5), shift: def.shift, level: def.level });      // concert voice
      this.touchVoice = choir.voice({ pan: lerp(-0.6, 0.6, i / 5), shift: def.shift, level: def.level }); // the visitor's hand
      this.tx = 0; this.ty = 0; this.tz = 0;
      this.hopY = 0; this.hopV = 0; this.squash = 0; this.s = 0; this.sv = 0;
      this.open = 0; this.sing = 0; this.pitch = 0.4; this.vowel = 'a'; this.mw = 0; this.mh = 0;
      this.lean = 0; this.leanV = 0; this.leanT = 0; this.bow = 0; this.bowT = 0;
      this.anger = 0; this.joy = 0; this.spin = -1; this.nextGlyph = null;
      this.blink = rand(1, 5); this.phase = rand(0, 6); this.fidget = rand(3, 9); this.held = false; this.lastNote = null;
      this.place();
    }
    place() {
      const f = FACE[this.glyph];
      this.eyes.forEach((e, k) => { e.g.position.set(f.eyes[k][0], f.eyes[k][1], FRONT); e.r = f.r; e.w.scale.set(f.r, f.r, f.r * 0.55); e.p.scale.setScalar(f.r * 0.5);
        e.b.scale.set(f.r * 1.7, f.r * 0.36, 0.06); e.b.position.set(0, f.r * 1.25, f.r * 0.5); e.b.rotation.z = -e.side * 0.42; });
      this.mouth.position.set(f.mouth[0], f.mouth[1], FRONT + 0.005); this.smile.position.set(f.mouth[0], f.mouth[1] + f.mw * 0.12, FRONT + 0.005);
      this.smile.scale.setScalar(f.mw * 0.62);
    }
    setGlyph(ch) { this.glyph = ch; this.mesh.geometry = glyphGeo(ch); this.place(); }
    costume(ch, delay) { this.nextGlyph = ch; this.spin = -delay; }
    hop(v = 4.5) { if (this.hopY <= 0.001 && !reduced) this.hopV = v; }
    update(dt, time, gaze) {
      const r = this.root.position, k = Math.min(1, dt * (this.present ? 5 : 1.7));
      const far = Math.abs(this.tx - r.x) > 0.5;
      r.x += (this.tx - r.x) * k; r.y += (this.ty - r.y) * Math.min(1, dt * 6); r.z += (this.tz - r.z) * Math.min(1, dt * 6);
      if (far && started) this.hop(3.4);
      this.hopV -= 24 * dt; this.hopY += this.hopV * dt;
      if (this.hopY < 0) { if (this.hopV < -2) this.squash = Math.min(0.3, -this.hopV * 0.04); this.hopY = 0; this.hopV = 0; }
      this.squash *= Math.exp(-dt * 10);
      this.open += (this.sing - this.open) * Math.min(1, dt * 20);
      const sT = this.sing > 0.05 ? lerp(-0.14, 0.5, this.pitch) : 0;
      this.sv += ((sT - this.s) * 190 - this.sv * 13) * dt; this.s += this.sv * dt;
      const sy = Math.max(0.5, 1 + this.s + Math.sin(time * 1.7 + this.phase) * 0.012 - this.squash), sx = 1 / Math.sqrt(sy);
      this.body.scale.set(sx, sy, sx); this.body.position.y = this.hopY;
      const shake = this.anger > 0 ? Math.sin(time * 38) * 0.05 * Math.min(1, this.anger) : 0;
      this.leanV += ((this.leanT - this.lean) * 160 - this.leanV * 12) * dt; this.lean += this.leanV * dt;
      this.body.rotation.z = this.lean + shake + (this.sing > 0.05 ? Math.sin(time * 5 + this.phase) * 0.02 : 0);
      this.bow += (this.bowT - this.bow) * Math.min(1, dt * 5); this.body.rotation.x = this.bow * 0.75;
      if (this.spin > -90) {
        this.spin += dt / 0.75;
        if (this.spin > 0.5 && this.nextGlyph) { this.setGlyph(this.nextGlyph); this.nextGlyph = null; }
        if (this.spin >= 1) { this.spin = -99; this.body.rotation.y = 0; this.hop(3); }
        else this.body.rotation.y = this.spin > 0 ? ease(this.spin) * Math.PI * 2 : 0;
      }
      this.anger = Math.max(0, this.anger - dt); this.joy = Math.max(0, this.joy - dt);
      this.fidget -= dt;
      if (this.fidget < 0 && !this.held && this.sing < 0.05 && this.present) { this.fidget = rand(4, 11); Math.random() < 0.5 ? this.hop(rand(2, 3.4)) : (this.leanV += rand(-2.5, 2.5)); }

      // eyes: follow the visitor, wobble like the googly eyes they are
      this.blink -= dt; if (this.blink < -0.13) this.blink = rand(1.6, 6);
      const lid = this.blink < 0 ? 0.08 : (this.sing > 0.05 && this.pitch > 0.72 ? 0.55 : this.joy > 0 ? 0.6 : 1);
      for (const e of this.eyes) {
        const ex = r.x + e.g.position.x * sx, ey = r.y + this.hopY + e.g.position.y * sy;
        let dx = gaze.x - ex, dy = gaze.y - ey; const dz = gaze.z - r.z, n = Math.hypot(dx, dy, dz) || 1;
        dx = dx / n * 1.5; dy = dy / n * 1.5 - this.hopV * 0.03;
        const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
        e.vx += ((dx * e.r * 0.46 - e.px) * 260 - e.vx * 15) * dt; e.vy += ((dy * e.r * 0.46 - e.py) * 260 - e.vy * 15) * dt;
        e.px += e.vx * dt; e.py += e.vy * dt;
        e.p.position.set(e.px, e.py, e.r * 0.36);
        e.g.scale.set(1 / sx, lid / sy, 1);
        e.b.visible = this.anger > 0;
      }
      // mouth
      const f = FACE[this.glyph], shape = MOUTH[this.vowel] || MOUTH.a;
      this.mw += (shape[0] - this.mw) * Math.min(1, dt * 16); this.mh += (shape[1] - this.mh) * Math.min(1, dt * 16);
      const o = this.open, openNow = o > 0.12;
      this.mouth.visible = openNow; this.smile.visible = !openNow;
      if (openNow) this.mouth.scale.set(f.mw * this.mw * lerp(0.6, 1, o) / sx, f.mw * this.mh * o / sy, 1);
      this.smile.rotation.z = this.anger > 0 ? 0 : Math.PI;
      this.smile.position.y = f.mouth[1] + (this.anger > 0 ? -f.mw * 0.2 : f.mw * 0.12);
    }
  }
  const perfs = CAST.map((c, i) => new Performer(c, i));
  let started = false;

  /* ---------------- layout: one row on wide screens, choir risers on narrow ones ---------------- */
  const GAP = 2.5, RISE = 2.75, STEP = 1.5;
  const lightScale = { key: 400, fill: 300, follow: 400 };
  const view = { d: 20, cy: 2, hw: 10, vh: 10, cyAt: () => 2 };
  function layout(snapTo = false) {
    const W = canvas.clientWidth, H = canvas.clientHeight; if (!W || !H) return;
    renderer.setSize(W, H, false); camera.aspect = W / H;
    const active = perfs.filter(p => p.present), n = active.length, aspect = W / H;
    const rows = aspect > 1.3 ? 1 : aspect > 0.74 ? 2 : 3, per = Math.ceil(n / rows);
    active.forEach((p, k) => {
      const row = Math.floor(k / per), inRow = Math.min(per, n - row * per), col = k - row * per, level = rows - 1 - row;
      p.tx = (col - (inRow - 1) / 2) * GAP; p.ty = level * RISE; p.tz = -level * STEP;
    });
    risers.forEach((m, k) => {
      const level = k + 1; m.visible = level < rows;
      if (m.visible) { m.scale.set(per * GAP + 1.2, level * RISE, STEP); m.position.set(0, level * RISE / 2, -level * STEP); }
    });
    const topPad = Math.max(84, H * 0.145), bottom = $('.footlights').offsetHeight + 16;
    const safeH = Math.max(160, H - topPad - bottom);
    const boxW = per * GAP + 0.6, boxH = (rows - 1) * RISE + 3.1;
    const d = Math.max(boxW / (2 * TAN * aspect * 0.78), boxH / (2 * TAN * (safeH / H)));
    const vh = 2 * d * TAN, c = (topPad + safeH / 2) / H;
    // The camera sits above the cast so the floor shows; a lens shift then lifts the cast clear of the buttons.
    const contentCy = boxH / 2 - 0.15, eyeY = contentCy + vh * 0.17, shift = 0.5 + (eyeY - contentCy) / vh - c;
    const cyAt = z => eyeY - shift * vh * (d - z) / d;
    Object.assign(view, { d, cy: cyAt(0), vh, hw: d * TAN * aspect, cyAt });
    camera.position.set(0, eyeY, d); camera.lookAt(0, eyeY, 0);
    camera.setViewOffset(W, H, 0, shift * H, W, H); camera.updateProjectionMatrix();
    const cy = view.cy, cz = 3, k = (d - cz) / d;
    buildCurtains(view.hw * k, vh * k, cyAt(cz), cz);
    const bk = (d + 8.5) / d, bhw = view.hw * bk, btop = cyAt(-8.5) + vh * bk / 2;
    const drop = (g, len) => { g.children[0].position.y = -len; g.children.slice(1).forEach(s => { s.scale.y = len / g.userData.len; s.position.y = -len / 2; }); };
    moon.position.set(bhw * 0.6, btop + 1, -8.4); drop(moon, vh * bk * 0.27 + 1);
    stars.forEach((s, i) => { s.position.set(bhw * [-0.72, -0.44, -0.1, 0.22, 0.34][i], btop + 1, -8.5 + i * 0.02); drop(s, vh * bk * [0.2, 0.26, 0.19, 0.24, 0.17][i] + 1); });
    perfs.find(p => p.id === 'K').offX = view.hw + 4;
    for (const p of perfs) if (!p.present) { p.tx = p.offX; p.ty = 0; p.tz = 0; }
    if (snapTo) for (const p of perfs) p.root.position.set(p.tx, p.ty, p.tz);
    key.target.position.set(0, boxH * 0.3, 0); key.position.set(-view.hw * 0.3, boxH + vh * 0.75, d * 0.5);
    key.shadow.camera.far = d * 3; key.angle = Math.min(1.1, Math.atan((view.hw + 3) / key.position.distanceTo(key.target.position)) * 1.05);
    follow.position.set(0, cy + vh * 0.6, d * 0.95);
    lightScale.key = key.position.distanceToSquared(key.target.position); lightScale.fill = fill.position.distanceToSquared(fill.target.position); lightScale.follow = follow.position.lengthSq();
  }

  /* ---------------- language: costumes change, and K goes on leave ---------------- */
  function applyCast(lang, instant) {
    const uk = lang === 'uk';
    let n = 0;
    for (const p of perfs) {
      if (p.id === 'K') { p.present = !uk; continue; }
      const ch = uk ? p.uk : p.id;
      if (ch === p.glyph && instant) continue;
      if (instant || reduced) p.setGlyph(ch); else p.costume(ch, n++ * 0.12);
    }
    layout(instant);
    if (concert) stopConcert();
  }
  onLang(l => applyCast(l, false));

  /* ---------------- pointer: gaze, follow-spot, holding a letter ---------------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(0, 0.1), gaze = new THREE.Vector3(0, 2, 8), spotAt = new THREE.Vector3(0, 1, 0);
  let pointerSeen = false, hovered = null, lastTouched = null;
  const holds = new Map();
  const setNdc = e => { const b = canvas.getBoundingClientRect(); ndc.set((e.clientX - b.left) / b.width * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); };
  const pick = () => { ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(perfs.filter(p => p.present).map(p => p.mesh), false)[0]; return hit ? hit.object.userData.perf : null; };
  const midiFor = p => snap(lerp(p.range[0], p.range[1], p.pitch));

  canvas.addEventListener('touchstart', e => {          // stop the page scrolling only when a letter is under the finger
    const tch = e.changedTouches[0]; setNdc(tch); if (pick()) e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('pointerdown', e => {
    setNdc(e); pointerSeen = true;
    const p = pick(); if (!p) return;
    choir.ensure(); try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    p.held = true; p.pitch = 0.42; p.vowel = 'a'; p.sing = 1; lastTouched = p;
    holds.set(e.pointerId, { p, x: e.clientX, y: e.clientY, t: performance.now(), midi: midiFor(p), vowel: 'a' });
    p.touchVoice.on(midiFor(p), 'a', 0.62);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', e => {
    setNdc(e); pointerSeen = true;
    const h = holds.get(e.pointerId);
    if (!h) { hovered = pick(); canvas.style.cursor = hovered ? 'grab' : ''; return; }
    const p = h.p, dx = (e.clientX - h.x) / Math.max(120, innerWidth * 0.12);
    p.pitch = clamp(0.42 + (h.y - e.clientY) / Math.max(180, innerHeight * 0.34));
    p.leanT = clamp(-dx * 0.16, -0.4, 0.4);
    const v = dx < -1.3 ? 'u' : dx < -0.45 ? 'o' : dx > 1.3 ? 'i' : dx > 0.45 ? 'e' : 'a', m = midiFor(p);
    if (m !== h.midi || v !== h.vowel) {
      h.midi = m; h.vowel = v; p.vowel = v;
      if (choir.ctx) { const now = choir.ctx.currentTime; p.touchVoice.pitch(m, now, 0.035); p.touchVoice.vowel(v, now, 0.05); }
    }
  });
  const release = e => {
    const h = holds.get(e.pointerId); if (!h) return;
    holds.delete(e.pointerId);
    const p = h.p, wait = Math.max(0, 320 - (performance.now() - h.t));       // a quick tap still gets a proper note
    setTimeout(() => { if ([...holds.values()].some(o => o.p === p)) return; p.held = false; p.sing = 0; p.leanT = 0; p.touchVoice.off(); }, wait);
    canvas.style.cursor = '';
  };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);

  /* ---------------- the concert ---------------- */
  let concert = null;
  const startBtn = $('#startBtn');
  function startConcert() {
    const ctx = choir.ensure(); if (!ctx) return;
    const withK = perfs[4].present, sc = score(withK), t0 = ctx.currentTime + 0.25;
    for (const ev of sc.events) perfs[ev.v].voice.note(ev.m, t0 + ev.t, ev.d, ev.w, ev.vel);
    concert = { t0, events: sc.events, length: sc.length, done: false };
    for (const p of perfs) { p.bowT = 0; p.lastNote = null; }
    startBtn.textContent = t('stop'); startBtn.dataset.t = 'stop';
  }
  function stopConcert() {
    if (!concert) return;
    for (const p of perfs) { p.voice.hush(); if (!p.held) p.sing = 0; }
    concert = null; startBtn.textContent = t('start'); startBtn.dataset.t = 'start';
  }
  function finale() {
    concert = null; startBtn.textContent = t('start'); startBtn.dataset.t = 'start';
    choir.applause(0.1, 4.5);
    const cast = perfs.filter(p => p.present);
    cast.forEach((p, k) => { p.sing = 0; setTimeout(() => { p.bowT = 1; }, 250 + k * 90); setTimeout(() => { p.bowT = 0; p.joy = 2; }, 2300 + k * 90); });
    for (let k = 0; k < 9; k++) setTimeout(() => throwThing('rose', cast[Math.floor(Math.random() * cast.length)], true), 500 + k * 330);
  }
  startBtn.addEventListener('click', () => concert ? stopConcert() : startConcert());
  function conduct() {
    if (!concert || !choir.ctx) return;
    const now = choir.ctx.currentTime - concert.t0;
    if (now > concert.length) return finale();
    const active = new Array(perfs.length).fill(null);
    for (const ev of concert.events) if (now >= ev.t && now < ev.t + ev.d * 0.9) active[ev.v] = ev;
    perfs.forEach((p, i) => {
      if (p.held) return;
      const ev = active[i];
      if (ev) {
        p.sing = 1; p.vowel = ev.w; p.pitch = clamp((ev.m - p.range[0]) / (p.range[1] - p.range[0]));
        if (p.lastNote !== ev) { p.lastNote = ev; p.sv += 2.2; if (ev.d > 0.5) p.leanV += rand(-1.5, 1.5); }
      } else p.sing = 0;
    });
  }

  /* ---------------- roses and tomatoes ---------------- */
  const things = [], lying = [];
  const roseRed = new THREE.MeshStandardMaterial({ color: 0xff2f5f, roughness: 0.5 }), green = new THREE.MeshStandardMaterial({ color: 0x1f9d55, roughness: 0.6 });
  const tomatoRed = new THREE.MeshPhysicalMaterial({ color: 0xff3b2f, roughness: 0.25, clearcoat: 0.6 });
  function makeRose() {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 6), green); stem.position.y = -0.45;
    const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 1), roseRed); bloom.scale.y = 0.85;
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), roseRed); inner.position.y = 0.09; inner.rotation.y = 0.6;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), green); leaf.scale.set(1, 0.25, 0.5); leaf.position.set(0.1, -0.4, 0);
    g.add(stem, bloom, inner, leaf); g.traverse(o => { o.castShadow = true; }); return g;
  }
  function makeTomato() {
    const g = new THREE.Group(), body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 14), tomatoRed); body.scale.y = 0.88;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.07, 6), green); cap.position.y = 0.2;
    g.add(body, cap); g.traverse(o => { o.castShadow = true; }); return g;
  }
  function throwThing(kind, target, quiet = false) {
    const cast = perfs.filter(p => p.present);
    if (!target || !target.present) target = hovered && hovered.present ? hovered : cast[Math.floor(Math.random() * cast.length)];
    if (!quiet) choir.ensure();
    const obj = kind === 'rose' ? makeRose() : makeTomato(); scene.add(obj);
    const from = new THREE.Vector3(rand(-view.hw * 0.25, view.hw * 0.25), view.cyAt(view.d / 2) - view.vh / 4 - 0.6, view.d / 2);
    const to = kind === 'rose'
      ? new THREE.Vector3(target.tx + rand(-0.9, 0.9), target.ty + 0.08, target.tz + rand(0.55, 1.5))
      : new THREE.Vector3(target.tx + rand(-0.3, 0.3), target.ty + rand(0.7, 1.5), target.tz + 0.4);
    things.push({ kind, obj, from, to, target, k: 0, dur: kind === 'rose' ? 0.95 : 0.6, spin: rand(4, 9), quiet });
  }
  function landed(th) {
    const p = th.target;
    if (th.kind === 'rose') {
      th.obj.position.copy(th.to); th.obj.rotation.set(0, rand(0, 6), Math.PI / 2 + rand(-0.3, 0.3));
      lying.push(th.obj); if (lying.length > 40) scene.remove(lying.shift());
      if (!th.quiet) {
        p.joy = 1.6; p.hop(5); p.bowT = 0.55; setTimeout(() => { p.bowT = 0; }, 650);
        if (choir.ctx && !p.held) { const t0 = choir.ctx.currentTime, b = snap(lerp(p.range[0], p.range[1], 0.5)); p.touchVoice.note(b, t0, 0.14, 'o', 0.5); p.touchVoice.note(snap(b + 4), t0 + 0.16, 0.4, 'a', 0.55); p.sing = 1; p.vowel = 'a'; p.pitch = 0.6; setTimeout(() => { if (!p.held) p.sing = 0; }, 560); }
      }
    } else {
      scene.remove(th.obj);
      const splat = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 10), tomatoRed);
      splat.position.set(th.to.x - p.tx, th.to.y - p.ty, FRONT + 0.03); splat.scale.set(1.25, 1.05, 0.14); p.body.add(splat);
      splats.push({ m: splat, life: 7 });
      p.anger = 3.2; p.leanV += rand(-5, 5); p.squash = 0.18; choir.splat();
      if (choir.ctx && !p.held) { const t0 = choir.ctx.currentTime, b = lerp(p.range[0], p.range[1], 0.45); p.touchVoice.note(b, t0 + 0.05, 0.5, 'o', 0.55); p.touchVoice.pitch(b - 5, t0 + 0.12, 0.16); p.sing = 1; p.vowel = 'o'; p.pitch = 0.2; setTimeout(() => { if (!p.held) p.sing = 0; }, 600); }
    }
  }
  const splats = [];
  $('#roseBtn').addEventListener('click', () => throwThing('rose'));
  $('#tomatoBtn').addEventListener('click', () => throwThing('tomato'));

  /* ---------------- auditions from the playbill ---------------- */
  document.querySelectorAll('[data-cast] button').forEach(b => b.addEventListener('click', () => {
    if (!choir.ensure()) return;
    const p = perfs.find(q => q.id === b.closest('[data-cast]').dataset.cast);
    const base = snap(lerp(p.range[0], p.range[1], 0.4)), t0 = choir.ctx.currentTime + 0.05;
    [0, 3, 7, 12].forEach((s, k) => p.touchVoice.note(snap(base + s), t0 + k * 0.2, k === 3 ? 0.7 : 0.2, 'aeia'[k], 0.6));
    p.sing = 1; p.pitch = 0.7; p.hop(4); setTimeout(() => { if (!p.held) p.sing = 0; }, 1500);
    b.classList.remove('sung'); void b.offsetWidth; b.classList.add('sung');
  }));

  /* ---------------- run ---------------- */
  let visible = true, last = performance.now(), time = 0, introT = reduced ? 9 : 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => layout(false), 100); });
  perfs.find(p => p.id === 'K').offX = 30;
  applyCast(getLang(), true); layout(true);
  if (!reduced) for (const p of perfs) p.root.position.y = -0.001;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.4, (now - last) / 1000); last = now;
    conduct();
    if (!visible) return;
    time += dt; introT += dt;

    // curtain up
    if (curtainOpen < 1) {
      curtainOpen = clamp((introT - 0.5) / 2.3);
      if (curtainOpen > 0.25 && !started) { started = true; perfs.filter(p => p.present).forEach((p, k) => setTimeout(() => p.hop(5.2), 180 + k * 120)); }
    } else started = true;
    const s = lerp(1.03, curtainS, ease(curtainOpen)), sway = 1 + Math.sin(time * 0.8) * 0.006;
    if (curtainL) { curtainL.scale.x = s * sway; curtainR.scale.x = -s * sway; }

    // where the visitor is pointing
    if (!pointerSeen) ndc.set(Math.sin(time * 0.45) * 0.55, 0.05 + Math.sin(time * 0.9) * 0.12);
    ray.setFromCamera(ndc, camera);
    const o = ray.ray.origin, dir = ray.ray.direction;
    let k = (6 - o.z) / dir.z; gaze.set(o.x + dir.x * k, o.y + dir.y * k, 6);
    k = (0.4 - o.z) / dir.z; spotAt.lerp(new THREE.Vector3(o.x + dir.x * k, Math.max(0.2, o.y + dir.y * k), 0.4), Math.min(1, dt * 7));
    follow.target.position.copy(spotAt);
    follow.intensity = lerp(follow.intensity, started ? 1.25 * lightScale.follow : 0, Math.min(1, dt * 2));
    fill.intensity = 0.55 * lightScale.fill * (concert ? 1 + Math.sin(time * 5.8) * 0.25 : 1);
    key.intensity = 2.3 * lightScale.key;

    for (let n = Math.ceil(dt / 0.025), i = 0; i < n; i++) for (const p of perfs) p.update(dt / n, time, gaze);
    for (const h of hangers) h.rotation.z = Math.sin(time * h.userData.speed + h.userData.phase) * h.userData.amp;

    for (let i = things.length - 1; i >= 0; i--) {
      const th = things[i]; th.k += dt / th.dur;
      if (th.k >= 1) { things.splice(i, 1); landed(th); continue; }
      th.obj.position.lerpVectors(th.from, th.to, th.k); th.obj.position.y += Math.sin(th.k * Math.PI) * (th.kind === 'rose' ? 3.2 : 1.6);
      th.obj.rotation.x = th.k * th.spin; th.obj.rotation.z = th.k * th.spin * 0.6;
    }
    for (let i = splats.length - 1; i >= 0; i--) {
      const sp = splats[i]; sp.life -= dt; sp.m.position.y -= dt * 0.05; sp.m.scale.y += dt * 0.03;
      if (sp.life < 1) sp.m.scale.multiplyScalar(Math.max(0.01, 1 - dt * 3));
      if (sp.life <= 0) { sp.m.parent.remove(sp.m); splats.splice(i, 1); }
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  window.__theatre = { perfs, startConcert, throwThing, choir, score, CAST };
}
