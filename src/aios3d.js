// AI Engineer OS — hero scene: five soft stones on a rising path (the five roadmap stages).
// Calm by design: slow float, no flashing, pauses off-screen / when the tab is hidden,
// renders a single still frame when motion is switched to "calm".
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, TubeGeometry,
  CatmullRomCurve3, Vector3, MeshStandardMaterial, MeshBasicMaterial, AmbientLight,
  DirectionalLight, HemisphereLight, Color, MathUtils
} from 'three';

const STAGE_HUES = [0x6FD9AE, 0xFDAE63, 0x977FEF, 0xFF8FC4, 0x7C93F6]; // mint, peach, lavender, pink, periwinkle
const THEMES = {
  light: { unlit: 0xF4F1FF, tube: 0xFFFFFF, tubeLit: 0x977FEF, sat: 1.0, lum: 1.0, sky: 0xFFFFFF, ground: 0xB7A9F5, key: 2.1, hemi: 1.15 },
  dark:  { unlit: 0x3A3752, tube: 0x4A4666, tubeLit: 0xB5A6F6, sat: 0.9, lum: 1.12, sky: 0xCFC8FF, ground: 0x2A2740, key: 1.7, hemi: 0.9 },
  calm:  { unlit: 0xDAD6D0, tube: 0xF6F4F1, tubeLit: 0xA79EC9, sat: 0.42, lum: 1.0, sky: 0xFFFFFF, ground: 0xCFC9C0, key: 1.9, hemi: 1.2 }
};
// Control points: lead-in, five stones, lead-out. The curve passes through every point.
const PTS = [[-3.9, -3.0, 0], [-2.3, -2.05, 0], [1.3, -1.2, 0.7], [-1.5, -0.05, 0], [1.6, 0.95, -0.5], [-0.5, 2.15, 0.3], [1.6, 3.2, 0]];
const RADII = [0.44, 0.48, 0.54, 0.6, 0.7];
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

function tone(hex, theme, mix, mixTo) {
  const c = new Color(hex);
  const hsl = {}; c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * theme.sat), Math.min(0.95, hsl.l * theme.lum));
  if (mix) c.lerp(new Color(mixTo), mix);
  return c;
}

function mount(canvas, opts) {
  opts = opts || {};
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return null; }
  if (!renderer.getContext()) return null;

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.dprCap || 1.75));

  let themeName = THEMES[opts.theme] ? opts.theme : 'light';
  let lit = Math.max(0, Math.min(5, opts.lit | 0));
  let motion = opts.motion !== false;
  const interactive = opts.interactive !== false;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  const hemi = new HemisphereLight(0xffffff, 0xb7a9f5, 1.15);
  const key = new DirectionalLight(0xffffff, 2.1); key.position.set(3, 5, 6);
  const fill = new AmbientLight(0xffffff, 0.25);
  scene.add(hemi, key, fill);

  const root = new Group(); scene.add(root);
  const curve = new CatmullRomCurve3(PTS.map((p) => new Vector3(p[0], p[1], p[2])), false, 'catmullrom', 0.5);

  const tubeMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
  const tube = new Mesh(new TubeGeometry(curve, 140, 0.04, 10, false), tubeMat);
  root.add(tube);
  const litMat = new MeshBasicMaterial({ color: 0x977fef });
  let litTube = null;

  const sphereGeo = new SphereGeometry(1, 48, 32);
  const stones = RADII.map((r, i) => {
    const mat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.58, metalness: 0.02 });
    const m = new Mesh(sphereGeo, mat);
    const p = PTS[i + 1];
    m.userData = { base: new Vector3(p[0], p[1], p[2]), r, i };
    m.position.copy(m.userData.base);
    root.add(m);
    return m;
  });
  const sats = stones.map((s, i) => {
    const mat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.02 });
    const m = new Mesh(sphereGeo, mat);
    m.userData = { host: s, orbit: s.userData.r * 1.65, phase: i * 1.7, tilt: 0.5 + i * 0.22, speed: 0.55 + i * 0.07 };
    root.add(m);
    return m;
  });

  function setLitTube() {
    if (litTube) { root.remove(litTube); litTube.geometry.dispose(); litTube = null; }
    if (lit < 1) return;
    const t1 = Math.min(1, lit / 6);
    const n = Math.max(6, Math.round(40 * lit));
    const pts = []; for (let k = 0; k <= n; k++) pts.push(curve.getPoint((t1 * k) / n));
    litTube = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), n * 3, 0.065, 10, false), litMat);
    root.add(litTube);
  }

  function applyTheme() {
    const th = THEMES[themeName];
    hemi.color.set(th.sky); hemi.groundColor.set(th.ground); hemi.intensity = th.hemi; key.intensity = th.key;
    tubeMat.color.set(th.tube); litMat.color.set(th.tubeLit);
    stones.forEach((s, i) => {
      const isLit = i < lit, isNext = i === lit;
      const c = isLit ? tone(STAGE_HUES[i], th, 0, 0) : tone(STAGE_HUES[i], th, isNext ? 0.4 : 0.72, th.unlit);
      s.material.color.copy(c);
      sats[i].material.color.copy(tone(STAGE_HUES[i], th, isLit ? 0.35 : 0.8, isLit ? 0xffffff : th.unlit));
    });
    setLitTube();
  }

  let W = 0, H = 0;
  function resize() {
    const w = canvas.clientWidth | 0, h = canvas.clientHeight | 0;
    if (!w || !h || (w === W && h === H)) return false;
    W = w; H = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = 12.6 * Math.max(1, 1 / camera.aspect);
    camera.position.set(0, 0.1, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    return true;
  }

  let time = 2.2, intro = motion ? 0 : 1, px = 0, py = 0, cx = 0, cy = 0;
  function update(dt) {
    time += dt;
    if (intro < 1) intro = Math.min(1, intro + dt / 1.5);
    cx += (px - cx) * 0.05; cy += (py - cy) * 0.05;
    root.rotation.y = Math.sin(time * 0.22) * 0.1 + cx * 0.22;
    root.rotation.x = -cy * 0.1;
    stones.forEach((s, i) => {
      const u = s.userData;
      const k = easeOut(Math.max(0, Math.min(1, intro * 1.7 - i * 0.2)));
      const pulse = i === lit ? 1 + 0.045 * Math.sin(time * 1.9) : 1;
      s.scale.setScalar(Math.max(0.001, u.r * k * pulse));
      s.position.set(u.base.x, u.base.y + Math.sin(time * 0.8 + i * 1.3) * 0.09 * k, u.base.z);
    });
    sats.forEach((m) => {
      const u = m.userData, h = u.host;
      const a = time * u.speed + u.phase;
      const k = h.scale.x / u.host.userData.r;
      m.position.set(
        h.position.x + Math.cos(a) * u.orbit * k,
        h.position.y + Math.sin(a) * Math.sin(u.tilt) * u.orbit * k,
        h.position.z + Math.sin(a) * Math.cos(u.tilt) * u.orbit * k
      );
      m.scale.setScalar(Math.max(0.001, 0.085 * k));
    });
  }

  function drawStill() { resize(); update(0); renderer.render(scene, camera); }

  let raf = 0, running = false, last = 0, visible = true;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 22) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    resize(); update(dt); renderer.render(scene, camera);
  }
  function start() {
    if (running || !motion || !visible || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }
  function sync() { if (motion && visible && !document.hidden) start(); else { stop(); drawStill(); } }

  const host = canvas.parentElement;
  function onMove(e) {
    if (!interactive || e.pointerType !== 'mouse' || !motion) return;
    const r = host.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  function onLeave() { px = 0; py = 0; }
  function onVis() { sync(); }
  function onLost(e) { e.preventDefault(); stop(); }
  host && host.addEventListener('pointermove', onMove);
  host && host.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVis);
  canvas.addEventListener('webglcontextlost', onLost);

  let ro = null, io = null;
  if (window.ResizeObserver) { ro = new ResizeObserver(() => { if (!motion) drawStill(); }); ro.observe(canvas); }
  if (window.IntersectionObserver) {
    io = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.01 });
    io.observe(canvas);
  }

  applyTheme();
  sync();

  return {
    setLit(n) { n = Math.max(0, Math.min(5, n | 0)); if (n !== lit) { lit = n; applyTheme(); if (!motion) drawStill(); } },
    setTheme(name) { if (THEMES[name] && name !== themeName) { themeName = name; applyTheme(); if (!motion) drawStill(); } },
    setMotion(on) { on = !!on; if (on === motion) return; motion = on; if (!on) { px = py = cx = cy = 0; } sync(); },
    destroy() {
      stop();
      host && host.removeEventListener('pointermove', onMove);
      host && host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      ro && ro.disconnect(); io && io.disconnect();
      sphereGeo.dispose(); tube.geometry.dispose(); litTube && litTube.geometry.dispose();
      stones.concat(sats).forEach((m) => m.material.dispose()); tubeMat.dispose(); litMat.dispose();
      renderer.dispose();
    }
  };
}

export { mount };
