import { STAGES } from '../data/stages.js';
import { RESOURCES } from '../data/resources.js';
import { wallCard } from '../data/helpers.js';
import { Ico, Follow, FollowCard } from '../components/bits.jsx';

const TONES = ['t-lav', 't-mint', 't-peach', 't-pink', 't-blue'];
const TONE_ORDER = [1, 2, 0, 3, 4];
const TOPICS = [['#977FEF', 'Python'], ['#6FD9AE', 'FastAPI'], ['#FDAE63', 'Structured outputs'], ['#FF8FC4', 'RAG'], ['#7C93F6', 'Tool calling'], ['#977FEF', 'Agents'], ['#6FD9AE', 'Evals'], ['#FDAE63', 'Tracing'], ['#FF8FC4', 'Cost and latency'], ['#7C93F6', 'Docker'], ['#977FEF', 'Embeddings'], ['#6FD9AE', 'Testing']];
const STEPS = [
  { n: '1', title: 'Answer a few questions', text: 'Five taps, about two minutes. Nothing leaves your device.' },
  { n: '2', title: 'Get your roadmap', text: 'Stages trimmed to what you already know, in the order that makes sense.' },
  { n: '3', title: 'Learn, build, track', text: 'Read the reviews, ship the projects, tick things off as you go.' }
];
const SKIPS = [
  ['A 40-hour “Python from zero” course', 'If you can already code: ship one small deployed service instead.'],
  ['Three web frameworks before you ship one', 'Pick one. Put it on a public URL.'],
  ['Paid prompt-engineering bootcamps', 'The free docs and your own evals teach more.'],
  ['Reading every agent framework’s docs', 'Learn the loop first. Frameworks are a thin layer on top.'],
  ['Tutorials you follow without changing anything', 'Rebuild it with your own data and see what breaks.']
];
const WORDS = [['Become'], ['an'], ['AI'], ['engineer.'], ['Learn'], ['what'], ['matters.'], ['Skip', 1], ['the', 1], ['rest.', 1]];

const Wall = ({ list }) => (
  <div className="wall-row">
    {list.map((r, i) => (
      <div className="card vc" key={i}><span className={r.cls}><span>{r.label}</span></span><p className="vc-t">{r.title}</p><p className="vc-p">{r.provider}</p></div>
    ))}
  </div>
);

export default function Home({ a, webglFailed }) {
  return (
    <div>
      <div className="sp" aria-hidden="true"></div>
      <section className="hero2" id="aios-hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="pill p-lav reveal"><Ico n="i-sparkles" /><span>Free · no sign-up</span></span>
            <h1 className="h0">{WORDS.map((w, i) => [<span className={'hw' + (w[1] ? ' em' : '')} key={i}><span>{w[0]}</span></span>, i < WORDS.length - 1 ? ' ' : null])}</h1>
            <p className="lead reveal">A free, personalised roadmap to becoming an AI engineer: what to learn, what to build, and which courses are not worth your time.</p>
            <div className="cta-row reveal">
              <button className="btn btn-lg pressable" onClick={a.startAssessment}><span>Find your path</span><Ico n="i-arrow-r" /></button>
              <button className="btn btn-ghost btn-lg pressable" onClick={a.scrollSample}><span>See the base path</span></button>
            </div>
            <p className="micro reveal">2–3 minutes. Your answers stay on this device.</p>
          </div>
        </div>
        <div className="cue"><div className="wrap cue-in"><span className="cue-t">Why this is different</span><button className="cue-b pressable" onClick={a.scrollNext} aria-label="Scroll to the next section"><Ico n="i-arrow-r" /></button></div></div>
      </section>

      <div className="marq deco" aria-hidden="true"><div className="marq-track">
        {TOPICS.map((t, i) => <span className="mq" key={i}><i style={{ background: t[0] }}></i>{t[1]}</span>)}
        {TOPICS.map((t, i) => <span className="mq" aria-hidden="true" key={'b' + i}><i style={{ background: t[0] }}></i>{t[1]}</span>)}
      </div></div>

      <section className="seq" aria-label="Why this exists"><div className="seq-stick"><div className="wrap seq-in"><div className="seq-box">
        <p className="seq-l">Most AI roadmaps are a pile of links.</p>
        <p className="seq-l">47 hours of video.</p>
        <p className="seq-l">Three frameworks that change by spring.</p>
        <p className="seq-l">And no idea what to <span className="k">skip</span>.</p>
        <p className="seq-l">This one comes from 7 years of shipping production ML.</p>
        <p className="seq-l">At Harness, CRED and Walmart.</p>
        <p className="seq-l">Risk models. Recommenders. AI agents. Petabytes of data.</p>
        <p className="seq-l">So here is what to <span className="k">learn</span>, what to <span className="k">build</span>, and what to <span className="k">ignore</span>.</p>
      </div><div className="seq-dots deco" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></section>

      <section className="wrap sec-tight">
        <div className="nums">
          <div className="stat2"><b data-cv="5">5</b><span>stages, trimmed to what you do not know yet</span></div>
          <div className="stat2"><b data-cv="12">12</b><span>resources reviewed with a verdict</span></div>
          <div className="stat2"><b data-cv="4">4</b><span>portfolio projects with checkable criteria</span></div>
          <div className="stat2"><b data-cv="2">2</b><span>minutes to get your own roadmap</span></div>
        </div>
      </section>

      <section className="wrap sec" id="aios-sample">
        <div className="stack-h">
          <span className="eyebrow">The base path</span>
          <h2 className="h2 reveal">Five stages. Yours gets trimmed to what you do not already know.</h2>
        </div>
        <div className="path-grid">
          <div className="path-side deco" aria-hidden="true">
            <div className="stage"><canvas id="aios-path3d" className="stage-canvas"></canvas>
              {webglFailed && <div className="stage-fallback"><span className="t-mint"></span><span className="t-peach"></span><span className="t-lav"></span><span className="t-pink"></span><span className="t-blue"></span></div>}
              <ul className="legend">
                {STAGES.map((x, i) => <li className="leg" key={x.id}><span className={'ldot ' + TONES[TONE_ORDER[i]]}></span><span>{x.short}</span></li>)}
              </ul>
            </div>
          </div>
          <div className="stack">
            {STAGES.map((x, i) => (
              <article className={'sk sk-' + ['mint', 'peach', 'lav', 'pink', 'blue'][i]} key={x.id}>
                <div className="sk-l"><span className="sk-num" aria-hidden="true">{String(i + 1)}</span><span className="pill"><span>{'≈ ' + x.hours + ' h'}</span></span></div>
                <div className="sk-r">
                  <p className="pv-n">{'Stage ' + (i + 1)}</p>
                  <h3 className="sk-t">{x.title}</h3>
                  <p className="sk-b">{x.blurb}</p>
                  <p className="sk-build"><strong>Build:</strong> <span>{x.build}</span></p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="center"><button className="btn btn-lg pressable" onClick={a.startAssessment}><span>Personalise this path</span><Ico n="i-arrow-r" /></button></div>
      </section>

      <section className="band">
        <div className="wrap">
          <span className="eyebrow">What to skip</span>
          <h2 className="band-h">Half of getting good is knowing what not to do.</h2>
          <ul className="skl">
            {SKIPS.map((x) => <li className="skl-i" key={x[0]}><span className="skl-t"><span className="skl-x">{x[0]}</span></span><span className="skl-v">{x[1]}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="wall">
        <div className="wrap">
          <span className="eyebrow">Reviews</span>
          <h2 className="h2 sec-h reveal">Every resource gets a verdict, not just a link.</h2>
          <button className="btn btn-soft pressable" onClick={a.goLearn}><span>Read the reviews</span><Ico n="i-arrow-r" /></button>
        </div>
        <div className="wall-rows deco" aria-hidden="true">
          <Wall list={RESOURCES.slice(0, 6).map(wallCard)} />
          <Wall list={RESOURCES.slice(6, 12).map(wallCard)} />
        </div>
      </section>

      <section className="wrap sec">
        <h2 className="h2 sec-h reveal">How it works</h2>
        <ol className="hiw">
          {STEPS.map((st) => (
            <li className="card get reveal" key={st.n}>
              <span className="hiw-n" data-pop="1" aria-hidden="true">{st.n}</span>
              <h3 className="h3">{st.title}</h3>
              <svg className="hiw-svg deco" aria-hidden="true" viewBox="0 0 120 10"><path data-draw="1" d="M3 6 C 20 1, 38 9, 58 5 S 100 2, 117 6" /></svg>
              <p className="body2">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap sec who">
        <div className="who-head">
          <span className="eyebrow">Who is behind this</span>
          <h2 className="h2 reveal">Built by an ML engineer who ships at scale.</h2>
          <p className="lead reveal">Aman Jaiswal. 7 years building production ML, data and AI systems: risk models, recommenders, agent stacks, and the streaming data infrastructure under them.</p>
        </div>
        <div className="nums">
          <div className="stat2"><b>~<span data-cv="9">9</span>%</b><span>uplift in bad-loan recall on CRED’s risk models</span></div>
          <div className="stat2"><b><span data-cv="99.5">99.5</span>%</b><span>faster legal-invoice processing at Walmart</span></div>
          <div className="stat2"><b>$<span data-cv="200">200</span>K</b><span>saved a year migrating CRED’s lakehouse to Iceberg</span></div>
          <div className="stat2"><b><span data-cv="5">5</span>K+</b><span>Walmart stores covered by an ML loss-recovery system</span></div>
        </div>
        <div className="cos">
          <article className="card co reveal"><div className="co-top"><span className="co-name">Harness</span><span className="pill p-mint"><span>Now</span></span></div><p className="co-role">ML and data engineer</p><p className="co-d">Machine learning and data systems.</p></article>
          <article className="card co reveal"><div className="co-top"><span className="co-name">CRED</span><span className="pill p-gray"><span>Before</span></span></div><p className="co-role">ML and data engineer</p><p className="co-d">Credit risk, recommendations, AI agents and the data platform at petabyte scale.</p></article>
          <article className="card co reveal"><div className="co-top"><span className="co-name">Walmart</span><span className="pill p-gray"><span>Before</span></span></div><p className="co-role">Software Engineer III, data and ML</p><p className="co-d">Streaming, Spark and ML pipelines across 5,000+ stores.</p></article>
        </div>
        <div className="cta-row reveal" style={{ marginTop: 28 }}>
          <button className="btn btn-soft btn-lg pressable" onClick={a.goAbout}><span>Read my background</span><Ico n="i-arrow-r" /></button>
          <Follow cls="btn btn-pink btn-lg pressable" />
        </div>
      </section>

      <section className="wrap close">
        <h2 className="h0 close-h reveal">Your path is two minutes away.</h2>
        <div className="cta-row reveal"><button className="btn btn-lg pressable" onClick={a.startAssessment}><span>Find your path</span><Ico n="i-arrow-r" /></button></div>
      </section>

      <section className="wrap sec">
        <FollowCard title="Want ongoing updates as the field changes?" text="I break down AI engineering, production systems, and what is actually worth learning." />
      </section>
    </div>
  );
}
