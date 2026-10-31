import { PROJECTS, PROJ_BY } from '../data/projects.js';
import { Ico, Follow } from '../components/bits.jsx';

export function Build({ s, a }) {
  const fk = s.assessment ? s.assessment.focus : 'balanced';
  const list = PROJECTS.slice().sort((x, y) => (y.focus.indexOf(fk) >= 0 && fk !== 'balanced' ? 1 : 0) - (x.focus.indexOf(fk) >= 0 && fk !== 'balanced' ? 1 : 0));
  return (
    <section className="wrap">
      <header className="vh">
        <h1 className="h1 sm reveal">Build</h1>
        <p className="lead reveal">Projects that prove judgement, not just tutorials.</p>
      </header>
      <div className="grid">
        {list.map((p) => {
          const d = a.critDone(p.slug), n = p.criteria.length, complete = !!s.progress.projects[p.slug];
          const focus = fk !== 'balanced' && p.focus.indexOf(fk) >= 0;
          return (
            <button className="card rescard pressable reveal" key={p.slug} onClick={() => a.go('project', p.slug)}>
              <span className="rc-top"><span className="pill p-gray"><span>{'Stage ' + (p.stage + 1)}</span></span>{focus && <span className="pill p-pink"><span>Your focus</span></span>}{complete && <span className="pill p-mint"><Ico n="i-check" /><span>Complete</span></span>}</span>
              <span className="rc-title">{p.title}</span>
              <span className="rc-line"><strong>Done when:</strong> <span>{p.done}</span></span>
              <span className="pbar" style={{ width: '100%' }} aria-hidden="true"><i style={{ width: Math.round((complete ? 1 : d / n) * 100) + '%' }}></i></span>
              <span className="rc-foot"><Ico n="i-clock" /><span>{p.hours}</span><span className="status" style={{ background: 'var(--bg2)', color: 'var(--ink2)' }}>{complete ? 'Done' : d + ' of ' + n + ' criteria'}</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function Project({ s, a }) {
  const p = PROJ_BY[s.param];
  if (!p) return null;
  const arr = s.progress.criteria[p.slug] || [], complete = !!s.progress.projects[p.slug], d = a.critDone(p.slug);
  return (
    <section className="wrap narrow" style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 8 }}>
      <div><button className="linkbtn pressable" onClick={() => a.go('build')}><Ico n="i-arrow-l" /><span>All projects</span></button></div>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }} className="reveal">
        <div className="rc-top"><span className="pill p-gray"><span>{'Stage ' + (p.stage + 1)}</span></span><span className="pill p-gray"><span>{p.hours}</span></span></div>
        <h1 className="h1 sm">{p.title}</h1>
      </header>
      <div className="card reveal"><h2 className="h3" style={{ marginBottom: 8 }}>What you will build</h2><p className="body2">{p.what}</p></div>
      <div className="card reveal">
        <h2 className="h3" style={{ marginBottom: 4 }}>Acceptance criteria</h2>
        <p className="micro" style={{ marginBottom: 8 }}>{d + ' of ' + p.criteria.length + ' criteria met. Tick them honestly; "done" means all of them.'}</p>
        {p.criteria.map((t, i) => (
          <label className="chk" key={i}><input type="checkbox" className="chk-in" checked={!!arr[i]} onChange={() => a.toggleCriterion(p.slug, i)} /><span className="chk-box"><Ico n="i-check" /></span><span className="chk-t">{t}</span></label>
        ))}
      </div>
      <div className="card reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="h3">Suggested stack</h2>
        <ul className="bul">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
        <h2 className="h3" style={{ marginTop: 6 }}>Common mistakes</h2>
        <ul className="bul">{p.mistakes.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div className="actions reveal"><button className="btn btn-lg pressable" onClick={() => a.toggleProject(p.slug)}><Ico n="i-check" /><span>{complete ? 'Marked complete. Undo' : 'Mark complete'}</span></button></div>
      {complete && s.justDone === p.slug && (
        <div className="card follow reveal"><div className="follow-body"><p className="follow-h">Shipped it. Nice.</p><p className="follow-s">Follow @aman.jsw for the next project brief and tool breakdowns.</p></div><Follow /></div>
      )}
    </section>
  );
}
