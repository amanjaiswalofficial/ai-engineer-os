import { RESOURCES, RES_BY, VERDICTS } from '../data/resources.js';
import { PROJ_BY, FILTERS, FEATURED } from '../data/projects.js';
import { favOf } from '../data/helpers.js';
import { AGREE, DIFFER, SOURCES } from '../data/learn.js';
import { Ico, Fav, AltLink, FollowCard } from '../components/bits.jsx';

const ResCard = ({ r, s, a, withStatus }) => {
  const vd = VERDICTS[r.verdict], fv = favOf(r.url || '', r.title);
  const x = s.progress.resources[r.slug], status = x === 'done' ? 'Done' : x === 'learning' ? 'In progress' : '';
  return (
    <button className="card rescard pressable reveal" onClick={() => a.go('topic', r.slug)}>
      <span className="rc-top"><span className={'pill ' + vd.cls}><Ico n={vd.icon} /><span>{vd.label}</span></span><span className="pill p-gray"><span>{r.price}</span></span></span>
      <span className="rc-title"><Fav a={{ letter: fv.letter, icon: fv.icon }} /><span>{r.title}</span></span><span className="rc-prov">{r.provider}</span><span className="rc-line">{r.line}</span>
      <span className="rc-foot"><Ico n="i-clock" /><span>{r.time}</span>{withStatus && !!status && <span className="status">{status}</span>}</span>
    </button>
  );
};

export function Learn({ s, a }) {
  const f = s.filter;
  const list = RESOURCES.filter((r) => f === 'all' || r.stage === f);
  const srcs = SOURCES.map((x) => { const fv = favOf(x[1], x[0]); return { title: x[0], url: x[1], meta: fv.host, note: x[2], aria: x[0] + ', opens in a new tab', icon: fv.icon, letter: fv.letter, tag: 'Source', tagCls: 'pill p-gray' }; });
  return (
    <section className="wrap">
      <header className="vh">
        <h1 className="h1 sm reveal">Learn</h1>
        <p className="lead reveal">Resources reviewed by an engineer. Not a scraped list.</p>
      </header>
      <div className="chips" role="group" aria-label="Filter by stage">
        {FILTERS.map((x) => <button key={String(x[0])} className="chip pressable" aria-pressed={f === x[0]} onClick={() => a.set({ filter: x[0] })}><span>{x[1]}</span></button>)}
      </div>
      {f === 'all' && (<>
        <h2 className="h3 sec-h" style={{ marginTop: 12 }}>Featured reviews</h2>
        <div className="feat">{FEATURED.map((k) => <ResCard key={k} r={RES_BY[k]} s={s} a={a} />)}</div>
        <h2 className="h3 sec-h" style={{ marginTop: 24 }}>All resources</h2>
      </>)}
      <div className="grid">{list.map((r) => <ResCard key={r.slug} r={r} s={s} a={a} withStatus />)}</div>
      <h2 className="h2 sec-h" style={{ marginTop: 56 }}>How this list was built</h2>
      <div className="card how reveal">
        <p className="body2">I read the 2026 AI engineer roadmaps below, pulled out what they recommend, and kept what they agree on. Free and paid options are listed side by side with prices as the sources state them. Several roadmaps are written by people who sell courses, so I mark the source of each pick.</p>
        <h3 className="blk-h">Where they agree</h3>
        <ul className="bul">{AGREE.map((x) => <li key={x.t}>{x.t}</li>)}</ul>
        <h3 className="blk-h">Where they disagree</h3>
        <ul className="bul">{DIFFER.map((x) => <li key={x.t}>{x.t}</li>)}</ul>
      </div>
      <h3 className="blk-h" style={{ marginTop: 20 }}>Roadmaps and guides I read</h3>
      <div className="srcs">{srcs.map((x) => <AltLink a={x} key={x.url + x.title} />)}</div>
      <FollowCard style={{ marginTop: 28 }} title="New reviews and what to skip next" text="I review new tools and patterns on Instagram. Follow to get them." />
    </section>
  );
}

export function Topic({ s, a }) {
  const r = RES_BY[s.param];
  if (!r) return null;
  const vd = VERDICTS[r.verdict], st = s.progress.resources[r.slug], b = r.build ? PROJ_BY[r.build] : null, n = r.next ? RES_BY[r.next] : null;
  return (
    <section className="wrap narrow" style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 8 }}>
      <div><button className="linkbtn pressable" onClick={() => a.go('learn')}><Ico n="i-arrow-l" /><span>All resources</span></button></div>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }} className="reveal">
        <div className="rc-top"><span className={'pill ' + vd.cls}><Ico n={vd.icon} /><span>{vd.label}</span></span><span className="pill p-gray"><span>{r.price}</span></span><span className="pill p-gray"><span>{'Stage ' + (r.stage + 1)}</span></span></div>
        <h1 className="h1 sm">{r.title}</h1>
        <p className="lead">{r.provider}. {r.line}</p>
        {!!r.url && <a className="btn pressable" href={r.url} target="_blank" rel="noopener"><span>Open the resource</span><Ico n="i-ext" /></a>}
      </header>
      <div className="card reveal" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 className="blk-h">Your status</h2>
        <div className="seg" role="group" aria-label="Your status">
          <button aria-pressed={st === 'learning'} onClick={() => a.setRes(r.slug, 'learning')}><span>In progress</span></button>
          <button aria-pressed={st === 'done'} onClick={() => a.setRes(r.slug, 'done')}><span>Done</span></button>
        </div>
      </div>
      <div className="card reveal">
        <h2 className="h3" style={{ marginBottom: 14 }}>Quick facts</h2>
        <div className="facts">
          <div className="blk"><h3 className="blk-h">Time</h3><p className="body2">{r.time}</p></div>
          <div className="blk"><h3 className="blk-h">Prerequisites</h3><p className="body2">{r.prereq}</p></div>
          <div className="blk"><h3 className="blk-h">Covers well</h3><ul className="bul">{r.covers.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div className="blk"><h3 className="blk-h">Does not cover</h3><ul className="bul">{r.not.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </div>
      </div>
      <div className="card reveal">
        <h2 className="h3" style={{ marginBottom: 14 }}>The review</h2>
        {r.review.map((x) => <div className="qa" key={x[0]}><h3 className="qa-q">{x[0]}</h3><p className="body2">{x[1]}</p></div>)}
      </div>
      <div className="card reveal" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 className="h3">Related</h2>
        {b && <button className="reslink pressable" onClick={() => a.go('project', b.slug)}><small>What to build after this</small><b>{b.title}</b></button>}
        {n && <button className="reslink pressable" onClick={() => a.go('topic', n.slug)}><small>Next recommended resource</small><b>{n.title}</b></button>}
      </div>
    </section>
  );
}
