// Scroll / enter animations, ported 1:1 from the original runEnter / runHome / runAnime.
import { animate, stagger, inView, scroll } from 'motion';
import * as anime from 'animejs';
import { clamp } from '../data/helpers.js';

const $$ = (root, sel) => Array.prototype.slice.call(root.querySelectorAll(sel));

export function createFx(getScenes) {
  let stops = [];
  let scrollOff = null;
  const push = (f) => { if (typeof f === 'function') stops.push(f); };
  const state = { pathLit: 0 };

  function stop() {
    stops.forEach((f) => { try { f(); } catch (e) { /* noop */ } });
    stops = [];
    if (scrollOff) { try { scrollOff(); } catch (e) { /* noop */ } scrollOff = null; }
  }

  // Calm mode: undo any inline state left behind by a previous full-motion run.
  function resetStyles(view) {
    $$(view, '.reveal').forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
    $$(view, '.hw > span').forEach((w) => { w.style.transform = ''; });
    $$(view, '.sk').forEach((c) => { c.style.transform = ''; c.style.scale = ''; });
    $$(view, '.skl-i').forEach((li) => { li.style.removeProperty('--s'); });
    $$(view, '.wall-row').forEach((r) => { r.style.transform = ''; });
    $$(view, '.mq').forEach((m) => { m.style.opacity = ''; m.style.transform = ''; });
    $$(view, '[data-pop]').forEach((m) => { m.style.opacity = ''; m.style.transform = ''; m.style.scale = ''; });
    $$(view, '.tl-fill').forEach((m) => { m.style.transform = ''; });
    const sp = view.querySelector('.sp'); if (sp) { sp.style.display = ''; sp.style.transform = ''; }
    const seq = view.querySelector('.seq'); if (seq) seq.removeAttribute('data-on');
    $$(view, '.seq-l').forEach((l) => { l.style.opacity = ''; l.style.transform = ''; l.style.visibility = ''; });
  }

  function runHome(view) {
    try {
      const words = $$(view, '.hw > span');
      if (words.length) {
        words.forEach((w) => { w.style.transform = 'translateY(112%)'; });
        animate(words, { transform: ['translateY(112%)', 'translateY(0%)'] }, { duration: 0.95, delay: stagger(0.07, { startDelay: 0.1 }), ease: [0.22, 1, 0.36, 1] });
        setTimeout(() => { words.forEach((w) => { w.style.transform = ''; }); }, 2200);
      }
      const sp = view.querySelector('.sp');
      if (sp) { sp.style.display = 'block'; push(scroll(animate(sp, { scaleX: [0, 1] }, { ease: 'linear' }))); }
      const mq = view.querySelector('.marq');
      if (mq) {
        const pills = $$(mq, '.mq:not([aria-hidden])');
        pills.forEach((el) => { el.style.opacity = '0'; });
        push(inView(mq, () => { animate(pills, { opacity: [0, 1], y: [14, 0] }, { duration: 0.5, delay: stagger(0.04), ease: [0.22, 1, 0.36, 1] }); }, { margin: '0px 0px -8% 0px' }));
      }
      const seq = view.querySelector('.seq');
      if (seq) {
        seq.setAttribute('data-on', '1');
        const ls = $$(seq, '.seq-l'), dts = $$(seq, '.seq-dots i'), N = ls.length;
        const apply = (p) => {
          const q = clamp(p, 0, 0.9999);
          for (let i = 0; i < N; i++) {
            const d = q * N - (i + 0.5);
            let o = clamp(1 - (Math.abs(d) - 0.2) / 0.3, 0, 1);
            if ((i === 0 && d < 0) || (i === N - 1 && d > 0)) o = 1;
            const y = clamp(-d, -1, 1) * 44;
            ls[i].style.opacity = String(o);
            ls[i].style.transform = 'translateY(calc(-50% + ' + y.toFixed(1) + 'px))';
            ls[i].style.visibility = o < 0.01 ? 'hidden' : 'visible';
            if (dts[i]) dts[i].className = Math.floor(q * N) === i ? 'on' : '';
          }
        };
        apply(0);
        push(scroll(apply, { target: seq, offset: ['start start', 'end end'] }));
        push(() => { seq.removeAttribute('data-on'); });
      }
      const sks = $$(view, '.sk');
      sks.forEach((c, i) => { if (i < sks.length - 1) push(scroll(animate(c, { scale: [1, 0.94] }, { ease: 'linear' }), { target: sks[i + 1], offset: ['start end', 'start 25%'] })); });
      state.pathLit = 0;
      const arrived = sks.map(() => false);
      sks.forEach((c, i) => {
        push(scroll((p) => {
          arrived[i] = p >= 0.98;
          let n = 0; for (let k = 0; k < arrived.length; k++) { if (arrived[k]) n = k + 1; else break; }
          if (n !== state.pathLit) { state.pathLit = n; const sc = getScenes()['aios-path3d']; if (sc) sc.ctrl.setLit(n); }
        }, { target: c, offset: ['start end', 'start 45%'] }));
      });
      $$(view, '.skl-i').forEach((li) => {
        li.style.setProperty('--s', '0');
        push(scroll((p) => { li.style.setProperty('--s', String(p)); }, { target: li, offset: ['start 92%', 'start 62%'] }));
      });
      const wall = view.querySelector('.wall'), rows = wall ? wall.querySelectorAll('.wall-row') : [];
      if (rows.length === 2) {
        push(scroll(animate(rows[0], { x: [0, -140] }, { ease: 'linear' }), { target: wall, offset: ['start end', 'end start'] }));
        push(scroll(animate(rows[1], { x: [-140, 0] }, { ease: 'linear' }), { target: wall, offset: ['start end', 'end start'] }));
      }
    } catch (e) { /* noop */ }
  }

  function runAnimeStatic(view) { view.querySelectorAll('[data-count]').forEach((el) => { el.textContent = String(el.getAttribute('data-count') || '0'); }); }

  function runAnime(view) {
    const A = anime;
    view.querySelectorAll('[data-count]').forEach((el) => {
      const to = parseFloat(el.getAttribute('data-count')) || 0, o = { v: 0 }; el.__anim = true; el.textContent = '0';
      A.animate(o, { v: to, duration: 1200, delay: 150, ease: 'outExpo', onUpdate: () => { el.textContent = String(Math.round(o.v)); }, onComplete: () => { el.__anim = false; el.textContent = String(to); } });
    });
    view.querySelectorAll('[data-cv]').forEach((el) => {
      const to = parseFloat(el.getAttribute('data-cv')) || 0, o = { v: 0 }; el.textContent = '0';
      push(inView(el, () => { A.animate(o, { v: to, duration: 1400, ease: 'outExpo', onUpdate: () => { el.textContent = String(to % 1 ? Math.round(o.v * 10) / 10 : Math.round(o.v)); }, onComplete: () => { el.textContent = String(to); } }); }, { margin: '0px 0px -10% 0px' }));
    });
    view.querySelectorAll('[data-ring]').forEach((el) => {
      const fin = parseFloat(el.getAttribute('stroke-dashoffset')) || 0, C = parseFloat(el.getAttribute('stroke-dasharray')) || 326.7;
      A.animate(el, { strokeDashoffset: [C, fin], duration: 1400, delay: 150, ease: 'outExpo', onComplete: () => { el.style.removeProperty('stroke-dashoffset'); } });
    });
    view.querySelectorAll('[data-pop]').forEach((el) => {
      el.style.opacity = '0';
      push(inView(el, () => { A.animate(el, { scale: [0.5, 1], opacity: [0, 1], duration: 700, ease: 'outBack' }); }));
    });
    view.querySelectorAll('[data-draw]').forEach((el) => {
      try {
        const dr = A.svg.createDrawable(el); A.utils.set(dr, { draw: '0 0' });
        push(inView(el.ownerSVGElement || el, () => { A.animate(dr, { draw: ['0 0', '0 1'], duration: 1200, ease: 'inOutQuad' }); }));
      } catch (e) { /* noop */ }
    });
    const fill = document.getElementById('aios-tl-fill'), tl = document.getElementById('aios-tl');
    if (fill && tl) { try { scrollOff = scroll(animate(fill, { scaleY: [0, 1] }, { ease: 'linear' }), { target: tl, offset: ['start 75%', 'end 60%'] }); } catch (e) { /* noop */ } }
  }

  function enter(calm) {
    stop();
    const view = document.getElementById('aios-view'); if (!view) return;
    if (!calm) {
      animate(view, { opacity: [0, 1] }, { duration: 0.35, ease: 'easeOut' });
      const els = $$(view, '.reveal');
      els.forEach((el) => { el.style.opacity = '0'; });
      els.forEach((el, i) => {
        push(inView(el, () => { animate(el, { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }); }, { margin: '0px 0px -6% 0px' }));
      });
      runHome(view);
      runAnime(view);
    } else {
      resetStyles(view);
      runAnimeStatic(view);
    }
  }

  function burst() {
    const dots = document.querySelectorAll('.fx-dot');
    anime.animate(dots, { translateY: () => -(120 + Math.random() * 220), translateX: () => (Math.random() - 0.5) * 320, opacity: [{ to: 1, duration: 120 }, { to: 0, duration: 900 }], scale: [0.6, 1.2], duration: 1100, delay: anime.stagger(40), ease: 'outQuad' });
  }

  function press(el) { animate(el, { scale: 0.97 }, { duration: 0.12, ease: 'easeOut' }); }
  function release(el) { animate(el, { scale: 1 }, { type: 'spring', stiffness: 520, damping: 22 }); }

  return { enter, stop, burst, press, release, state };
}
