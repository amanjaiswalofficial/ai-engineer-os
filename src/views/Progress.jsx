import { STAGES } from '../data/stages.js';
import { makePlan } from '../data/assessment.js';
import { Ico, FollowCard } from '../components/bits.jsx';

const TONES = ['t-lav', 't-mint', 't-peach', 't-pink', 't-blue'];
const TONE_ORDER = [1, 2, 0, 3, 4];

export default function Progress({ s, a }) {
  const plan = makePlan(s.assessment), p = s.progress;
  let done = 0, total = 0, next = null;
  const pstages = plan.stages.map((ps) => {
    const st = STAGES[ps.i], skip = ps.mode === 'skip', items = skip ? [] : a.stageItems(ps.i);
    const d = items.filter((x) => x.done).length; done += d; total += items.length;
    if (!next) { const nx = items.find((x) => !x.done); if (nx) next = nx; }
    const open = s.open['p-' + st.id] === undefined ? false : s.open['p-' + st.id];
    return { st, ps, skip, items, d, open };
  });
  const pct = total ? Math.round(done / total * 100) : 0, started = !!p.startedAt;
  const weeksIn = started ? Math.max(1, Math.floor((Date.now() - p.startedAt) / 604800000) + 1) : 0;
  const line = started ? 'You are ' + weeksIn + (weeksIn === 1 ? ' week' : ' weeks') + ' in. Small steps count.' : 'Nothing started yet. Open a resource or a project and mark it as you go.';
  const nextLine = next ? 'Next milestone: ' + next.label : (total ? 'Every milestone is done. Ship something and tell people.' : '');
  const goNext = () => next && a.go(next.type === 'res' ? 'topic' : next.type === 'proj' ? 'project' : 'roadmap', next.type === 'check' ? null : next.id);
  const ringOffset = Math.round(326.7 * (1 - pct / 100) * 10) / 10;
  return (
    <section className="wrap">
      <header className="vh">
        <h1 className="h1 sm reveal">Progress</h1>
        <p className="lead reveal">{line}</p>
      </header>
      <div className="rm-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card reveal" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
            <div className="ring-wrap" style={{ width: 140, height: 140 }}><svg className="ring" viewBox="0 0 120 120" aria-hidden="true"><circle className="ring-bg" cx="60" cy="60" r="52"></circle><circle className="ring-fg" data-ring="1" cx="60" cy="60" r="52" strokeDasharray="326.7" strokeDashoffset={ringOffset} transform="rotate(-90 60 60)"></circle></svg>
              <div className="ring-c"><span className="ring-num" style={{ fontSize: 36 }} data-count={pct}></span><span className="ring-unit">percent</span></div></div>
            <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 6 }}><p className="h3">{done + ' of ' + total + ' milestones complete'}</p><p className="body2">{nextLine}</p>
              {!!next && <button className="linkbtn pressable" onClick={goNext}><span>Go to next milestone</span><Ico n="i-arrow-r" /></button>}</div>
          </div>
          {pstages.map(({ st, ps, skip, items, d, open }) => (
            <div className="card stage-card reveal" key={st.id}>
              <button className="stage-head pressable" onClick={() => a.set({ open: Object.assign({}, s.open, { ['p-' + st.id]: !open }) })} aria-expanded={open ? 'true' : 'false'}>
                <span className={'ic deco ' + TONES[TONE_ORDER[ps.i]]}><Ico n={st.icon} /></span>
                <span className="sh-t"><strong className="sh-title">{st.title}</strong><span className="sh-sub">{skip ? 'Skipped for you' : d + ' of ' + items.length + ' done'}</span><span className="pbar" aria-hidden="true"><i style={{ width: (items.length ? Math.round(d / items.length * 100) : 100) + '%' }}></i></span></span>
                <span className="chev"><Ico n="i-chev" /></span>
              </button>
              <div className={'fold' + (open ? ' open' : '')}><div><div className="fold-in" style={{ gap: 0 }}>
                {skip && <p className="body2">Skipped in your plan. Nothing to track here.</p>}
                <ul>
                  {items.map((it) => (
                    <li className={'irow' + (it.done ? ' done' : '')} key={it.type + it.id}>
                      {it.type === 'check' ? (
                        <label className="chk" style={{ flex: 1, padding: 0 }}><input type="checkbox" className="chk-in" checked={it.done} onChange={() => a.toggleCheck(it.id)} /><span className="chk-box"><Ico n="i-check" /></span><span className="irow-t">{it.label}</span></label>
                      ) : (<>
                        <span className={'chk-box' + (it.done ? ' on' : '')} aria-hidden="true"><Ico n="i-check" /></span><span className="irow-t">{it.label}</span>
                        <button className="linkbtn pressable" onClick={() => a.go(it.type === 'res' ? 'topic' : 'project', it.id)}><span>{it.kind}</span></button>
                      </>)}
                    </li>
                  ))}
                </ul>
              </div></div></div>
            </div>
          ))}
          <div className="card reveal" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 className="h3">Notes</h2>
            <textarea className="notes" aria-label="Your notes" placeholder="What clicked, what is stuck, what to try next." value={p.notes || ''} onChange={a.onNotes}></textarea>
          </div>
        </div>
        <aside className="rm-side">
          <div className="stage deco reveal" style={{ aspectRatio: '1/.8' }} aria-hidden="true"><canvas id="aios-progress3d" className="stage-canvas"></canvas></div>
          <FollowCard col title="Keep going." text="New breakdowns of what is worth learning land on @aman.jsw." />
        </aside>
      </div>
    </section>
  );
}
