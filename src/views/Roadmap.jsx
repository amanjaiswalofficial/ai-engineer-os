import { STAGES, MODE_NOTES } from '../data/stages.js';
import { makePlan, HPW_LABEL } from '../data/assessment.js';
import { RES_BY, VERDICTS } from '../data/resources.js';
import { PROJECTS } from '../data/projects.js';
import { altVal } from '../data/helpers.js';
import { Ico, AltLink, FollowCard } from '../components/bits.jsx';

const TONES = ['t-lav', 't-mint', 't-peach', 't-pink', 't-blue'];
const TONE_ORDER = [1, 2, 0, 3, 4];

export default function Roadmap({ s, a }) {
  const has = !!s.assessment, plan = makePlan(s.assessment);
  const firstActive = plan.stages.findIndex((x) => x.mode !== 'skip');
  const seen = {}, skills = [];
  plan.stages.slice().sort((x, y) => (y.i === plan.focusStage ? 1 : 0) - (x.i === plan.focusStage ? 1 : 0)).forEach((ps) => { if (ps.mode !== 'skip') STAGES[ps.i].skills.forEach((k) => { if (!seen[k]) { seen[k] = 1; skills.push(k); } }); });
  const fk = s.assessment ? s.assessment.focus : 'balanced';
  const projs = PROJECTS.slice().sort((x, y) => (y.focus.indexOf(fk) >= 0 ? 1 : 0) - (x.focus.indexOf(fk) >= 0 ? 1 : 0)).map((p) => p.title);
  const subtitle = has ? plan.subtitle : 'The base path: five stages, about ' + plan.hours + ' hours. Personalise it to trim what you already know.';
  const sumTime = has ? '≈ ' + plan.hours + ' hours over ' + plan.weeks + ' weeks at ' + (HPW_LABEL[plan.a.time] || '') : '≈ ' + plan.hours + ' hours across five stages';
  return (
    <section className="wrap">
      <header className="vh">
        <p className="eyebrow reveal">Your plan</p>
        <h1 className="h1 sm reveal">Your AI Engineer Roadmap</h1>
        <p className="lead reveal">{subtitle}</p>
        <button className="linkbtn pressable reveal" onClick={a.startAssessment}><span>{has ? 'Retake assessment' : 'Personalise this roadmap'}</span></button>
      </header>
      {!has && (
        <div className="card callout reveal" style={{ marginBottom: 20, background: 'var(--lav-wash)' }}>
          <h2 className="h3">Take two minutes to personalise this</h2>
          <p className="body2">Below is the base path. Answer five quick questions and it gets trimmed to what you do not already know, with weeks that match your time.</p>
          <button className="btn pressable" onClick={a.startAssessment}><span>Find your path</span><Ico n="i-arrow-r" /></button>
        </div>
      )}
      <div className="rm-grid">
        <ol className="timeline" id="aios-tl" aria-label="Roadmap stages">
          <span className="tl-line deco" aria-hidden="true"></span><span className="tl-fill deco" id="aios-tl-fill" aria-hidden="true"></span>
          {plan.stages.map((ps) => {
            const st = STAGES[ps.i];
            const open = s.open[st.id] === undefined ? ps.i === firstActive : s.open[st.id];
            const free = RES_BY[st.free], paid = st.paid ? RES_BY[st.paid] : null, note = MODE_NOTES[ps.i][ps.mode] || '';
            const tone = TONES[TONE_ORDER[ps.i]];
            const modeLabel = ps.mode === 'full' ? 'Full stage' : ps.mode === 'skim' ? 'Skim' : 'Skip for you';
            const modeCls = 'pill ' + (ps.mode === 'full' ? 'p-lav' : ps.mode === 'skim' ? 'p-peach' : 'p-gray');
            const alts = st.alts.map(altVal), paidOpts = st.paidOpts.map(altVal);
            return (
              <li className="tl-item reveal" key={st.id}>
                <span className={'tl-dot ' + tone} aria-hidden="true">{ps.i + 1}</span>
                <div className={'card stage-card' + (open ? ' open' : '')}>
                  <button className="stage-head pressable" onClick={() => a.set({ open: Object.assign({}, s.open, { [st.id]: !open }) })} aria-expanded={open ? 'true' : 'false'}>
                    <span className={'ic deco ' + tone}><Ico n={st.icon} /></span>
                    <span className="sh-t">
                      <span className="sh-meta"><span className="pill p-gray"><span>{'Stage ' + (ps.i + 1)}</span></span><span className={modeCls}><span>{modeLabel}</span></span>{plan.focusStage === ps.i && <span className="pill p-pink"><span>Your focus</span></span>}</span>
                      <strong className="sh-title">{st.title}</strong>
                      <span className="sh-sub">{ps.weeksLabel + ' · ' + ps.hoursLabel}</span>
                    </span>
                    <span className="chev"><Ico n="i-chev" /></span>
                  </button>
                  <div className={'fold' + (open ? ' open' : '')}><div><div className="fold-in">
                    <p className="body2">{st.blurb}</p>
                    {!!note && <p className="modenote">{note}</p>}
                    <div className="blk"><h3 className="blk-h">What you need to know</h3><ul className="bul">{st.know.map((t) => <li key={t}>{t}</li>)}</ul></div>
                    <div className="two">
                      <div className="blk"><h3 className="blk-h">Best free resource</h3><button className="reslink pressable" onClick={() => a.go('topic', free.slug)}><b>{free.title}</b><small>{free.provider + ' · ' + free.time}</small></button></div>
                      <div className="blk"><h3 className="blk-h">Paid</h3>
                        {paid && <button className="reslink pressable" onClick={() => a.go('topic', paid.slug)}><b>{paid.title}</b><small>{VERDICTS[paid.verdict].label + ' · ' + paid.price}</small></button>}
                        {!paid && <p className="body2">{st.paidNote}</p>}
                      </div>
                    </div>
                    {alts.length > 0 && <div className="blk"><h3 className="blk-h">Free alternatives on the same topic</h3><div className="alts">{alts.map((x) => <AltLink a={x} key={x.url + x.title} />)}</div></div>}
                    {paidOpts.length > 0 && <div className="blk"><h3 className="blk-h">Paid options, with prices</h3><div className="alts">{paidOpts.map((x) => <AltLink a={x} key={x.url + x.title} />)}</div></div>}
                    <div className="blk"><h3 className="blk-h">What to build</h3><p className="body2">{st.build}</p>
                      {!!st.buildSlug && <button className="linkbtn pressable" onClick={() => a.go('project', st.buildSlug)}><span>Open the project brief</span><Ico n="i-arrow-r" /></button>}</div>
                    <div className="blk"><h3 className="blk-h">You are competent when</h3><p className="body2">{st.competent}</p></div>
                    <div className="blk"><h3 className="blk-h">Common mistakes and what to skip</h3><ul className="bul">{st.mistakes.map((t) => <li key={t}>{t}</li>)}</ul></div>
                  </div></div></div>
                </div>
              </li>
            );
          })}
        </ol>
        <aside className="rm-side">
          <div className="card sum reveal">
            <h2 className="h3">At a glance</h2>
            <div className="sum-r"><p className="blk-h">Estimated time</p><p>{sumTime}</p></div>
            <div className="sum-r"><p className="blk-h">Key projects</p><ul className="bul">{projs.map((t) => <li key={t}>{t}</li>)}</ul></div>
            <div className="sum-r"><p className="blk-h">Priority skills</p><ul className="tags">{skills.slice(0, 8).map((t) => <li className="tag" key={t}>{t}</li>)}</ul></div>
          </div>
          <FollowCard col title="This roadmap is the starting point." text="I update recommendations as tools and patterns change. Follow @aman.jsw for the living version." />
          <div className="actions reveal">
            <button className="btn pressable" onClick={() => a.go('learn')}><span>Start learning</span></button>
            <button className="btn btn-soft pressable" onClick={() => a.go('build')}><span>See projects</span></button>
            <button className="btn btn-ghost pressable" onClick={() => a.go('progress')}><span>Track progress</span></button>
          </div>
        </aside>
      </div>
    </section>
  );
}
