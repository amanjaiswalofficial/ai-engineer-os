import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { STAGES } from './data/stages.js';
import { makePlan } from './data/assessment.js';
import { RESOURCES } from './data/resources.js';
import { PROJECTS, PROJ_BY } from './data/projects.js';
import { DEFAULTS } from './data/assessment.js';
import { fromHash, toHash } from './lib/route.js';
import { IG_URL, KEYS, readJSON, writeJSON, mm } from './lib/storage.js';
import { createFx } from './lib/fx.js';
import Sprite from './components/Sprite.jsx';
import { Ico } from './components/bits.jsx';
import Home from './views/Home.jsx';
import { Assess, Result } from './views/Assess.jsx';
import Roadmap from './views/Roadmap.jsx';
import { Learn, Topic } from './views/Learn.jsx';
import { Build, Project } from './views/Build.jsx';
import Progress from './views/Progress.jsx';
import About from './views/About.jsx';

const EMPTY_PROGRESS = () => ({ resources: {}, projects: {}, criteria: {}, checks: {}, notes: '', startedAt: null });

function initState() {
  const saved = readJSON(KEYS.s, null);
  const settings = Object.assign({ motion: mm('(prefers-reduced-motion: reduce)') ? 'calm' : 'full', theme: mm('(prefers-color-scheme: dark)') ? 'dark' : 'light', font: 'default', simple: 'off' }, saved || {});
  const assessment = readJSON(KEYS.a, null);
  const progress = Object.assign(EMPTY_PROGRESS(), readJSON(KEYS.p, {}));
  const st = { view: 'home', param: null, step: 0, answers: {}, assessment, progress, filter: 'all', open: {}, settingsOpen: false, toast: '', justDone: null, settings, webgl: 'unknown' };
  const route = fromHash();
  if (route) {
    st.view = route.view; st.param = route.param;
    if (route.view === 'result' && !assessment) st.view = 'assess';
    if (st.view === 'assess' && assessment) st.answers = Object.assign({}, assessment);
  }
  return st;
}

const NAV = [['roadmap', 'Roadmap', '#i-map'], ['learn', 'Learn', '#i-book'], ['build', 'Build', '#i-hammer'], ['progress', 'Progress', '#i-chart']];
const GROUP = { roadmap: 'roadmap', result: 'roadmap', learn: 'learn', topic: 'learn', build: 'build', project: 'build', progress: 'progress', about: 'about' };

export default function App() {
  const [s, setS] = useState(initState);
  const set = useCallback((patch) => setS((prev) => Object.assign({}, prev, typeof patch === 'function' ? patch(prev) : patch)), []);

  const scenes = useRef({});
  const fx = useRef(null);
  if (!fx.current) fx.current = createFx(() => scenes.current);
  const aios3d = useRef(null);
  const r = useRef({ enterKey: null, entered: false, sheetWas: false, opener: null, tt: 0, pressed: null });
  const sRef = useRef(s); sRef.current = s;
  const isCalm = () => sRef.current.settings.motion === 'calm';

  /* ---------- helpers ---------- */
  const scrollTop = useCallback(() => { try { window.scrollTo(0, 0); const se = document.scrollingElement; if (se) se.scrollTop = 0; } catch (e) { /* noop */ } }, []);
  const go = useCallback((view, param, extra) => {
    const st = Object.assign({ view, param: param || null, settingsOpen: false }, extra || {});
    set(st);
    try { history.pushState({ view, param: param || null, step: st.step || 0 }, '', toHash(view, param)); } catch (e) { try { history.pushState({ view, param: param || null }, ''); } catch (e2) { /* noop */ } }
    scrollTop();
  }, [set, scrollTop]);
  const toast = (msg) => { set({ toast: msg }); clearTimeout(r.current.tt); r.current.tt = setTimeout(() => set({ toast: '' }), 2200); };
  const setSetting = (k, v) => { const settings = Object.assign({}, s.settings, { [k]: v }); set({ settings }); writeJSON(KEYS.s, settings); };
  const saveProgress = (p) => { if (!p.startedAt) p.startedAt = Date.now(); set({ progress: p }); writeJSON(KEYS.p, p); };

  const a = {
    set, go, scrollTop,
    goLearn: () => go('learn'), goAbout: () => go('about'),
    startAssessment: () => go('assess', null, { step: 0, answers: Object.assign({}, s.assessment || {}) }),
    scrollSample: () => { try { const el = document.getElementById('aios-sample'); if (el) el.scrollIntoView({ behavior: isCalm() ? 'auto' : 'smooth', block: 'start' }); } catch (e) { /* noop */ } },
    scrollNext: () => { try { const el = document.querySelector('.seq'); if (el) el.scrollIntoView({ behavior: isCalm() ? 'auto' : 'smooth', block: 'start' }); } catch (e) { /* noop */ } },
    finishAssessment: () => {
      const ans = Object.assign({}, DEFAULTS, s.answers);
      writeJSON(KEYS.a, ans);
      go('result', null, { assessment: ans });
    },
    setRes: (slug, status) => {
      const p = Object.assign({}, s.progress), res = Object.assign({}, p.resources);
      if (res[slug] === status) delete res[slug]; else res[slug] = status;
      p.resources = res; saveProgress(p);
      toast(res[slug] === 'done' ? 'Marked as done' : res[slug] === 'learning' ? 'Marked in progress' : 'Status cleared');
    },
    critDone: (slug) => { const c = s.progress.criteria[slug] || [], n = PROJ_BY[slug].criteria.length; let k = 0; for (let i = 0; i < n; i++) if (c[i]) k++; return k; },
    toggleCriterion: (slug, i) => {
      const p = Object.assign({}, s.progress), all = Object.assign({}, p.criteria), arr = (all[slug] || []).slice();
      arr[i] = !arr[i]; all[slug] = arr; p.criteria = all; saveProgress(p);
    },
    toggleProject: (slug) => {
      const p = Object.assign({}, s.progress), pr = Object.assign({}, p.projects), on = !pr[slug];
      if (on) pr[slug] = true; else delete pr[slug];
      p.projects = pr; saveProgress(p);
      set({ justDone: on ? slug : null });
      toast(on ? 'Project marked complete' : 'Marked as not complete');
      if (on) setTimeout(() => { if (!isCalm()) fx.current.burst(); }, 60);
    },
    toggleCheck: (id) => {
      const p = Object.assign({}, s.progress), c = Object.assign({}, p.checks);
      if (c[id]) delete c[id]; else c[id] = true;
      p.checks = c; saveProgress(p);
    },
    stageItems: (i) => {
      const p = s.progress, items = [];
      RESOURCES.filter((x) => x.stage === i && x.core).forEach((x) => items.push({ kind: 'Review', type: 'res', id: x.slug, label: x.title, done: p.resources[x.slug] === 'done' }));
      PROJECTS.filter((x) => x.stage === i).forEach((x) => items.push({ kind: 'Project', type: 'proj', id: x.slug, label: x.title, done: !!p.projects[x.slug] }));
      STAGES[i].checks.forEach((c) => items.push({ kind: 'Check', type: 'check', id: c.id, label: c.text, done: !!p.checks[c.id] }));
      return items;
    },
    onNotes: (e) => { const q = Object.assign({}, s.progress, { notes: e && e.target ? e.target.value : '' }); set({ progress: q }); writeJSON(KEYS.p, q); }
  };
  const litCount = () => {
    const plan = makePlan(s.assessment); let n = 0;
    for (let i = 0; i < 5; i++) {
      if (plan.stages[i].mode === 'skip') { n++; continue; }
      if (a.stageItems(i).every((x) => x.done)) n++; else break;
    }
    return n;
  };

  /* ---------- 3D ---------- */
  const sync3D = (id, want, lit) => {
    const canvas = document.getElementById(id), cur = scenes.current[id], calm = isCalm();
    if (cur && (!canvas || cur.canvas !== canvas || !want)) { try { cur.ctrl.destroy(); } catch (e) { /* noop */ } delete scenes.current[id]; }
    if (!want || !canvas) return;
    if (!scenes.current[id]) {
      if (!aios3d.current) {
        if (!r.current.loading) { r.current.loading = import('./aios3d.js').then((m) => { aios3d.current = m; set({}); }).catch(() => { r.current.loading = null; }); }
        return;
      }
      const ctrl = aios3d.current.mount(canvas, { lit, motion: !calm, theme: sRef.current.settings.theme });
      if (ctrl) { scenes.current[id] = { ctrl, canvas }; if (sRef.current.webgl !== 'ok') set({ webgl: 'ok' }); }
      else if (sRef.current.webgl !== 'fail') set({ webgl: 'fail' });
    }
    const sc = scenes.current[id];
    if (sc) { sc.ctrl.setLit(lit); sc.ctrl.setMotion(!calm); sc.ctrl.setTheme(sRef.current.settings.theme); }
  };

  const [wide, setWide] = useState(() => !!window.matchMedia && window.matchMedia('(min-width:1000px)').matches);
  useEffect(() => {
    const q = window.matchMedia('(min-width:1000px)'), f = () => setWide(q.matches);
    q.addEventListener ? q.addEventListener('change', f) : q.addListener(f);
    return () => { q.removeEventListener ? q.removeEventListener('change', f) : q.removeListener(f); };
  }, []);

  /* ---------- effects after every render ---------- */
  useLayoutEffect(() => {
    const simple = s.settings.simple === 'on', calm = s.settings.motion === 'calm', ref = r.current;
    sync3D('aios-path3d', s.view === 'home' && !simple && wide, calm ? 5 : fx.current.state.pathLit);
    sync3D('aios-progress3d', s.view === 'progress' && !simple, s.view === 'progress' ? litCount() : 0);
    document.querySelectorAll('[data-count]').forEach((el) => {
      if (el.__anim) return;
      const v = String(el.getAttribute('data-count') || '0');
      if (el.textContent !== v) el.textContent = v;
    });
    const key = s.view + '|' + (s.param || '') + '|' + (s.view === 'assess' ? s.step : '') + '|' + s.settings.motion;
    if (key !== ref.enterKey) {
      ref.enterKey = key; fx.current.enter(calm);
      if (ref.entered && !ref.firstKeyMotionOnly) { try { const m = document.getElementById('aios-main'); if (m && ref.lastNav !== key.replace(/\|[^|]*$/, '')) m.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
      ref.lastNav = key.replace(/\|[^|]*$/, ''); ref.entered = true;
    }
    if (s.settingsOpen && !ref.sheetWas) { try { const c = document.getElementById('aios-sheet-close'); if (c) c.focus(); } catch (e) { /* noop */ } }
    if (!s.settingsOpen && ref.sheetWas && ref.opener) { try { ref.opener.focus(); } catch (e) { /* noop */ } ref.opener = null; }
    ref.sheetWas = s.settingsOpen;
  });

  /* ---------- popstate + press feedback ---------- */
  useEffect(() => {
    const pop = (e) => {
      const st = e && e.state;
      if (st && st.view) set((prev) => ({ view: st.view, param: st.param || null, step: st.view === 'assess' ? (st.step || 0) : prev.step, settingsOpen: false }));
      else { const rt = fromHash(); set({ view: rt ? rt.view : 'home', param: rt ? rt.param : null, settingsOpen: false }); }
      scrollTop();
    };
    window.addEventListener('popstate', pop);
    const root = document.getElementById('aios');
    const pd = (e) => {
      if (isCalm()) return;
      const el = e.target && e.target.closest ? e.target.closest('.pressable') : null;
      if (!el || el.disabled) return;
      r.current.pressed = el; fx.current.press(el);
    };
    const pu = () => { const el = r.current.pressed; if (!el) return; r.current.pressed = null; fx.current.release(el); };
    root.addEventListener('pointerdown', pd, { passive: true });
    document.addEventListener('pointerup', pu); document.addEventListener('pointercancel', pu);
    return () => {
      window.removeEventListener('popstate', pop);
      document.removeEventListener('pointerup', pu); document.removeEventListener('pointercancel', pu);
      root.removeEventListener('pointerdown', pd);
      Object.keys(scenes.current).forEach((k) => { try { scenes.current[k].ctrl.destroy(); } catch (e) { /* noop */ } });
      scenes.current = {}; fx.current.stop(); clearTimeout(r.current.tt);
    };
  }, []);

  /* ---------- render ---------- */
  const v = s.view, st = s.settings, p = s.progress;
  const group = GROUP[v] || '';
  const hasProgress = Object.keys(p.resources).length + Object.keys(p.projects).length + Object.keys(p.checks).length > 0;
  const seg = (key, opts) => opts.map((o) => <button key={String(o[0])} aria-pressed={st[key] === o[0]} onClick={() => setSetting(key, o[0])}><span>{o[1]}</span></button>);

  return (
    <div id="aios" className="aios" data-theme={st.theme} data-font={st.font} data-simple={st.simple} data-motion={st.motion} data-view={v}>
      <Sprite />
      <a className="skip" href="#aios-main">Skip to content</a>
      <header className="top">
        <div className="wrap top-in">
          <button className="brand pressable" onClick={() => go('home')} aria-label="AI Engineer OS, home">
            <span className="logo deco" aria-hidden="true"><svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 24c6 0 7-8 12-8s4-8 10-8" /><circle cx="6" cy="24" r="2" fill="currentColor" /><circle cx="17" cy="16" r="2" fill="currentColor" /><circle cx="27" cy="8" r="2" fill="currentColor" /></svg></span>
            <span className="brand-t">AI Engineer OS</span>
          </button>
          <nav className="topnav" aria-label="Main">
            {NAV.concat([['about', 'About', '#i-user']]).map((x) => <button key={x[0]} className={group === x[0] ? 'navbtn on' : 'navbtn'} onClick={() => go(x[0])} aria-current={group === x[0] ? 'page' : 'false'}><span>{x[1]}</span></button>)}
          </nav>
          <div className="top-r">
            <a className="btn btn-pink btn-sm top-follow pressable" href={IG_URL} target="_blank" rel="noopener" aria-label="Follow @aman.jsw on Instagram, opens in a new tab"><Ico n="i-ig" /><span>Follow @aman.jsw</span></a>
            <button className="iconbtn top-about pressable" onClick={() => go('about')} aria-label="About"><Ico n="i-user" /></button>
            <button className="iconbtn pressable" onClick={() => { r.current.opener = document.activeElement; set({ settingsOpen: true }); }} aria-label="Sensory settings"><Ico n="i-sliders" /></button>
          </div>
        </div>
      </header>
      <main id="aios-main" className="main" tabIndex={-1}>
        <div id="aios-view">
          {v === 'home' && <Home a={a} webglFailed={s.webgl === 'fail'} />}
          {v === 'assess' && <Assess s={s} a={a} />}
          {v === 'result' && <Result s={s} a={a} />}
          {v === 'roadmap' && <Roadmap s={s} a={a} />}
          {v === 'learn' && <Learn s={s} a={a} />}
          {v === 'topic' && <Topic s={s} a={a} />}
          {v === 'build' && <Build s={s} a={a} />}
          {v === 'project' && <Project s={s} a={a} />}
          {v === 'progress' && <Progress s={s} a={a} />}
          {v === 'about' && <About />}
        </div>
      </main>

      <footer className="wrap foot">
        <div className="foot-in">
          <p className="foot-t">AI Engineer OS · by Aman</p>
          <nav className="foot-nav" aria-label="Footer">
            <button className="linkbtn" onClick={() => go('about')}><span>About</span></button>
            <button className="linkbtn" onClick={() => go('learn')}><span>Learn</span></button>
            {hasProgress && <button className="linkbtn" onClick={() => go('progress')}><span>Your progress</span></button>}
          </nav>
          <p className="micro">Everything you do here is saved on this device only.</p>
        </div>
      </footer>

      {v !== 'home' && v !== 'assess' && v !== 'result' && (
        <nav className="tabbar" aria-label="Sections">
          {NAV.map((x) => <button key={x[0]} className={(group === x[0] ? 'tab on' : 'tab') + ' pressable'} onClick={() => go(x[0])} aria-current={group === x[0] ? 'page' : 'false'}><Ico n={x[2]} /><span>{x[1]}</span></button>)}
        </nav>
      )}
      {v === 'home' && <div className="dock"><button className="btn btn-lg pressable" onClick={a.startAssessment}><span>Start assessment</span><Ico n="i-arrow-r" /></button></div>}

      {s.settingsOpen && (<>
        <button className="sheet-bg" onClick={() => set({ settingsOpen: false })} aria-label="Close settings" tabIndex={-1}></button>
        <div id="aios-sheet" className="sheet" role="dialog" aria-modal="true" aria-labelledby="aios-sheet-h" onKeyDown={(e) => { if (e && e.key === 'Escape') set({ settingsOpen: false }); }}>
          <div className="sheet-top"><h2 className="h3" id="aios-sheet-h">Sensory settings</h2><button id="aios-sheet-close" className="iconbtn" onClick={() => set({ settingsOpen: false })} aria-label="Close settings"><Ico n="i-x" /></button></div>
          <p className="body2">Make the site feel right for you. Saved on this device.</p>
          <div className="set-row"><div><p className="set-l">Motion</p><p className="set-d">Calm turns off the 3D animation and most movement.</p></div>
            <div className="seg" role="group" aria-label="Motion">{seg('motion', [['full', 'Full'], ['calm', 'Calm']])}</div></div>
          <div className="set-row"><div><p className="set-l">Theme</p><p className="set-d">Low-stim is muted and soft, with no bright colours.</p></div>
            <div className="seg" role="group" aria-label="Theme">{seg('theme', [['light', 'Light'], ['dark', 'Dark'], ['calm', 'Low-stim']])}</div></div>
          <div className="set-row"><div><p className="set-l">Font</p><p className="set-d">Readable uses Atkinson Hyperlegible, built for clear letter shapes.</p></div>
            <div className="seg" role="group" aria-label="Font">{seg('font', [['default', 'Default'], ['readable', 'Readable']])}</div></div>
          <div className="set-row"><div><p className="set-l">Decorations</p><p className="set-d">Simple hides icons, the 3D scene and extra visuals.</p></div>
            <div className="seg" role="group" aria-label="Decorations">{seg('simple', [['off', 'Show'], ['on', 'Simple']])}</div></div>
          <button className="btn pressable" onClick={() => set({ settingsOpen: false })}><span>Done</span></button>
        </div>
      </>)}

      <div className="toast" role="status" aria-live="polite">{!!s.toast && <span className="toast-in">{s.toast}</span>}</div>
      <div className="fx" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <span className="fx-dot" key={i}></span>)}</div>
    </div>
  );
}
