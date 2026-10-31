import { QUESTIONS, makePlan } from '../data/assessment.js';
import { clamp } from '../data/helpers.js';
import { Ico, FollowCard } from '../components/bits.jsx';

const TONES = ['t-lav', 't-mint', 't-peach', 't-pink', 't-blue'];

export function Assess({ s, a }) {
  const step = clamp(s.step, 0, 4), qd = QUESTIONS[step], cur = s.answers[qd.id], last = step === 4;
  const next = () => {
    if (!s.answers[qd.id] && !qd.optional) return;
    if (!last) { a.set({ step: step + 1 }); a.scrollTop(); return; }
    a.finishAssessment();
  };
  const skip = () => { if (!last) { a.set({ step: step + 1 }); a.scrollTop(); } else a.finishAssessment(); };
  const back = () => { if (step === 0) a.go('home'); else { a.set({ step: step - 1 }); a.scrollTop(); } };
  return (
    <section className="wrap narrow">
      <div className="as-top">
        <button className="linkbtn pressable" onClick={back}><Ico n="i-arrow-l" /><span>Back</span></button>
        <span className="micro">{'Step ' + (step + 1) + ' of 5'}</span>
      </div>
      <div className="dots" role="progressbar" aria-label="Assessment progress" aria-valuemin="1" aria-valuemax="5" aria-valuenow={step + 1}>
        {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i === step ? 'dot now' : i < step ? 'dot on' : 'dot'}></span>)}
      </div>
      <h1 className="h2" id="aios-q">{qd.title}</h1>
      <p className="q-hint">{qd.hint}</p>
      <div className="opts" role="radiogroup" aria-labelledby="aios-q">
        {qd.options.map((o, i) => (
          <button key={o.v} className={(cur === o.v ? 'opt sel' : 'opt') + ' pressable'} role="radio" aria-checked={cur === o.v} onClick={() => a.set({ answers: Object.assign({}, s.answers, { [qd.id]: o.v }) })}>
            <span className={'ic deco ' + TONES[i % 5]}><Ico n={o.icon} /></span>
            <span className="opt-t"><strong>{o.label}</strong><small>{o.sub}</small></span>
            <span className="opt-check"><Ico n="i-check" /></span>
          </button>
        ))}
      </div>
      <div className="as-actions">
        {qd.optional && <button className="btn btn-ghost btn-lg pressable" style={{ flex: '0 0 auto' }} onClick={skip}><span>Skip</span></button>}
        <button className="btn btn-lg pressable" onClick={next} disabled={!cur && !qd.optional}><span>{last ? 'Generate my roadmap' : 'Next'}</span><Ico n="i-arrow-r" /></button>
      </div>
    </section>
  );
}

export function Result({ s, a }) {
  const plan = makePlan(s.assessment || s.answers);
  return (
    <section className="wrap narrow" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 12 }}>
      <div className="card result-card reveal">
        <div className="ring-wrap">
          <svg className="ring" viewBox="0 0 120 120" aria-hidden="true"><circle className="ring-bg" cx="60" cy="60" r="52"></circle><circle className="ring-fg" data-ring="1" cx="60" cy="60" r="52" strokeDasharray="326.7" strokeDashoffset="0" transform="rotate(-90 60 60)"></circle></svg>
          <div className="ring-c"><span className="ring-num" data-count={plan.weeks}></span><span className="ring-unit">weeks</span></div>
        </div>
        <h1 className="h2">Your path is ready</h1>
        <p className="body2">{plan.summary}</p>
        <div className="stats">
          <div className="stat"><b data-count={plan.hours}></b><span>total hours</span></div>
          <div className="stat"><b>{plan.hpwShort}</b><span>hours a week</span></div>
          <div className="stat"><b data-count={plan.trimmed}></b><span>stages trimmed</span></div>
        </div>
        <button className="btn btn-lg pressable" onClick={() => a.go('roadmap')}><span>See my roadmap</span><Ico n="i-arrow-r" /></button>
      </div>
      <FollowCard title="This roadmap is the starting point." text="I update recommendations as tools and patterns change. Follow @aman.jsw for the living version." />
    </section>
  );
}
