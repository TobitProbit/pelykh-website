// A very small opera house: sawtooth "vocal cords" pushed through three formant filters per singer.

const VOWELS = {
  a: [800, 1150, 2900],
  e: [420, 1900, 2650],
  i: [290, 2250, 3000],
  o: [450, 800, 2830],
  u: [325, 700, 2700]
};
const FORMANT_GAIN = [1, 0.55, 0.22];
const FORMANT_Q = [6, 9, 10];
export const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

export class Choir {
  constructor() { this.ctx = null; this.voices = []; }

  // Browsers only allow sound after a tap or click, so the hall is built on first use.
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
      this.build(new AC());
    }
    if (this.ctx.state !== 'running') { const p = this.ctx.resume(); if (p && p.catch) p.catch(() => {}); }
    return this.ctx;
  }

  // iPhones only start audio from a finished tap (touchend / click), and by default they mute
  // web audio when the ring/silent switch is on silent. Called on every tap anywhere on the page.
  unlock() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    const ctx = this.ensure(); if (!ctx || this.unlocked) return;
    try {
      const src = ctx.createBufferSource(); src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      src.connect(ctx.destination); src.start(0);
    } catch (e) {}
    if (ctx.state === 'running') this.unlocked = true;
  }

  build(ctx) {
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 5; comp.attack.value = 0.005; comp.release.value = 0.25;
    this.master = ctx.createGain(); this.master.gain.value = 0.72;
    this.master.connect(comp); comp.connect(ctx.destination);

    // the room: two and a half seconds of decaying noise
    const len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    this.reverb = ctx.createConvolver(); this.reverb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    this.reverb.connect(wet); wet.connect(this.master);

    const n = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), nd = n.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noise = n;
    for (const v of this.voices) v.build();
  }

  voice(opts) { const v = new Voice(this, opts); this.voices.push(v); if (this.ctx) v.build(); return v; }

  burst(t, freq, q, dur, gain, pan = 0) {
    const ctx = this.ctx, src = ctx.createBufferSource(); src.buffer = this.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = ctx.createStereoPanner(); p.pan.value = pan;
    src.connect(f); f.connect(g); g.connect(p); p.connect(this.master); p.connect(this.reverb);
    src.start(t, Math.random() * 0.9, dur + 0.02);
  }

  applause(delay = 0, dur = 4) {
    const ctx = this.ensure(); if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    for (let i = 0; i < 260; i++) {
      const u = Math.random(), t = t0 + dur * Math.pow(u, 1.5) + Math.random() * 0.05;
      const fade = 1 - Math.pow(u, 1.5) * 0.8;
      this.burst(t, 900 + Math.random() * 1900, 1.2, 0.03 + Math.random() * 0.03, 0.16 * fade, Math.random() * 1.6 - 0.8);
    }
  }

  splat() {
    const ctx = this.ensure(); if (!ctx) return;
    const t = ctx.currentTime;
    this.burst(t, 320, 0.8, 0.22, 0.9); this.burst(t + 0.02, 1400, 1.5, 0.08, 0.3);
  }

  hush() { for (const v of this.voices) v.hush(); }
}

class Voice {
  constructor(choir, { pan = 0, shift = 1, level = 1 } = {}) {
    this.choir = choir; this.pan = pan; this.shift = shift; this.level = level; this.ready = false;
  }

  build() {
    const ctx = this.choir.ctx;
    this.o1 = ctx.createOscillator(); this.o1.type = 'sawtooth';
    this.o2 = ctx.createOscillator(); this.o2.type = 'sawtooth'; this.o2.detune.value = 9;
    const pre = ctx.createGain(); pre.gain.value = 0.5;
    this.o1.connect(pre); this.o2.connect(pre);
    this.amp = ctx.createGain(); this.amp.gain.value = 0;
    this.filters = VOWELS.a.map((f, i) => {
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * this.shift; bp.Q.value = FORMANT_Q[i];
      const g = ctx.createGain(); g.gain.value = FORMANT_GAIN[i] * 2.4 * this.level;
      pre.connect(bp); bp.connect(g); g.connect(this.amp);
      return bp;
    });
    const pan = ctx.createStereoPanner(); pan.pan.value = this.pan;
    this.amp.connect(pan); pan.connect(this.choir.master); pan.connect(this.choir.reverb);
    this.lfo = ctx.createOscillator(); this.lfo.frequency.value = 5.2 + Math.random() * 0.6;
    this.vib = ctx.createGain(); this.vib.gain.value = 0;
    this.lfo.connect(this.vib); this.vib.connect(this.o1.frequency); this.vib.connect(this.o2.frequency);
    this.o1.start(); this.o2.start(); this.lfo.start();
    this.ready = true;
  }

  vowel(v, t, glide = 0.035) {
    // Like a real soprano, lift the first formant up to the note when the note climbs above it.
    const f = VOWELS[v] || VOWELS.a, hz = this.hz || 0;
    const f1 = Math.max(f[0] * this.shift, hz * 1.03), f2 = Math.max(f[1] * this.shift, f1 * 1.35);
    [f1, f2, f[2] * this.shift].forEach((hzF, i) => this.filters[i].frequency.setTargetAtTime(hzF, t, glide));
  }

  pitch(midi, t, glide = 0.03) {
    const hz = this.hz = mtof(midi);
    this.o1.frequency.setTargetAtTime(hz, t, glide); this.o2.frequency.setTargetAtTime(hz, t, glide);
    return hz;
  }

  // scheduled: used by the concert, which writes the whole score onto the clock in advance
  note(midi, t, dur, vowel = 'a', vel = 0.6) {
    if (!this.ready) return;
    const hz = this.pitch(midi, t, 0.012);
    this.vowel(vowel, t, 0.02);
    this.amp.gain.setTargetAtTime(vel, t, 0.022);
    this.amp.gain.setTargetAtTime(0, t + dur * 0.86, 0.035);
    this.vib.gain.setTargetAtTime(dur > 0.6 ? hz * 0.011 : 0, t + 0.12, 0.15);
  }

  // live: used while a visitor is holding a letter
  on(midi, vowel = 'a', vel = 0.6) {
    if (!this.ready) return;
    const t = this.choir.ctx.currentTime;
    this.amp.gain.cancelScheduledValues(t);
    const hz = this.pitch(midi, t, 0.02); this.vowel(vowel, t);
    this.amp.gain.setTargetAtTime(vel, t, 0.03);
    this.vib.gain.setTargetAtTime(hz * 0.012, t + 0.2, 0.25);
  }

  off(release = 0.07) {
    if (!this.ready) return;
    const t = this.choir.ctx.currentTime;
    this.amp.gain.cancelScheduledValues(t); this.amp.gain.setTargetAtTime(0, t, release);
    this.vib.gain.cancelScheduledValues(t); this.vib.gain.setTargetAtTime(0, t, 0.05);
  }

  hush() {
    if (!this.ready) return;
    const t = this.choir.ctx.currentTime;
    for (const p of [this.amp.gain, this.vib.gain, this.o1.frequency, this.o2.frequency, ...this.filters.map(f => f.frequency)]) p.cancelScheduledValues(t);
    this.amp.gain.setTargetAtTime(0, t, 0.05); this.vib.gain.setTargetAtTime(0, t, 0.05);
  }
}

/* ---------- the score ----------
   "Shchedryk" by Mykola Leontovych (1916), in the public domain; this small arrangement is ours.
   Singers are numbered in stage order: 0 P, 1 E, 2 L, 3 Y, 4 K, 5 H. */
export const BEAT = 0.36;
export function score(withK = true) {
  const ev = [], bar = 3 * BEAT;
  const add = (v, t, d, m, w, vel) => { if (v !== 4 || withK) ev.push({ v, t, d, m, w, vel }); };
  const ostinato = (v, t, notes, vel, slow = 1) => {
    const b = BEAT * slow;
    add(v, t, b, notes[0], 'e', vel); add(v, t + b, b / 2, notes[1], 'i', vel * 0.85);
    add(v, t + 1.5 * b, b / 2, notes[2], 'e', vel * 0.9); add(v, t + 2 * b, b, notes[3], 'i', vel);
  };
  const HI = [70, 69, 70, 67], LO = [67, 65, 67, 63];
  const bass = [43, 41, 39, 38], tenor = [58, 57, 55, 57], descant = [74, 72, 70, 69];
  let t = 0;
  for (let b = 0; b < 20; b++, t += bar) {
    const sect = Math.floor(b / 4), k = b % 4, loud = [0.42, 0.48, 0.54, 0.62, 0.7][sect];
    ostinato(5, t, HI, loud);
    if (sect >= 1) add(0, t, bar, bass[k], 'o', loud * 0.9);
    if (sect >= 2) {
      ostinato(3, t, LO, loud * 0.8);
      add(1, t, bar, tenor[k], 'a', loud * 0.6);
      for (let q = 0; q < 3; q++) add(4, t + q * BEAT, BEAT * 0.7, bass[k] + 12, 'o', loud * (q ? 0.55 : 0.8));
    }
    if (sect >= 3) add(2, t, bar, descant[k], 'a', loud * 0.55);
  }
  ostinato(5, t, HI, 0.5, 1.3); ostinato(3, t, LO, 0.4, 1.3);
  add(0, t, bar * 1.3, 38, 'o', 0.6); add(1, t, bar * 1.3, 57, 'a', 0.4);
  t += bar * 1.3;
  const hold = bar * 2.4;
  [[0, 43, 'o'], [4, 50, 'o'], [1, 55, 'a'], [3, 62, 'a'], [5, 70, 'a'], [2, 74, 'a']].forEach(([v, m, w]) => add(v, t, hold, m, w, 0.55));
  return { events: ev, length: t + hold };
}
