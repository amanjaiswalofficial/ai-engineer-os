import { Ico, Follow } from '../components/bits.jsx';

const SK = [
  ['Machine learning', ['scikit-learn', 'PyTorch', 'MLflow', 'Feature engineering', 'Model serving', 'Monitoring', 'LangGraph', 'Pydantic AI']],
  ['Data and streaming', ['Spark', 'Kafka', 'Flink', 'Iceberg', 'Airflow', 'Databricks', 'BigQuery', 'StarRocks']],
  ['Backend and infra', ['Python', 'FastAPI', 'Django', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP']]
];
const LinkOut = ({ href, children }) => <a className="linkbtn" href={href} target="_blank" rel="noopener"><span>{children}</span><Ico n="i-arrow-r" /></a>;

export default function About() {
  return (
    <section className="wrap narrow" style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 12 }}>
      <div className="card reveal" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span className="avatar" style={{ width: 64, height: 64, fontSize: 28 }} aria-hidden="true">A</span><div><h1 className="h2">I am Aman.</h1><p className="micro">ML and data engineer · Bangalore · @aman.jsw on Instagram</p></div></div>
        <p className="body2">I build machine learning, data and AI systems for a living, and I have done it for 7 years: risk models, recommenders, agent stacks, and the streaming and lakehouse infrastructure under them. I work in Python, Spark, Kafka, Flink and Iceberg, on AWS and GCP, at the scale where pipelines have to be cheap and reliable, not just correct. Now at Harness. Before that, CRED and Walmart.</p>
        <div className="cta-row">
          <LinkOut href="https://www.linkedin.com/in/amanjaiswalofficial">LinkedIn</LinkOut>
          <LinkOut href="https://github.com/amanjaiswalofficial">GitHub</LinkOut>
          <LinkOut href="https://medium.com/@amanjaiswalofficial">Medium</LinkOut>
        </div>
      </div>

      <div className="card exp reveal">
        <div className="exp-h"><h2 className="exp-co">Harness</h2><span className="exp-when">Now</span></div>
        <p className="exp-r">ML and data engineer</p>
      </div>

      <div className="card exp reveal">
        <div className="exp-h"><h2 className="exp-co">CRED</h2><span className="exp-when">From Nov 2023</span></div>
        <p className="exp-r">Software Engineer, machine learning and data</p>
        <ul className="bul">
          <li>Lifted bad-loan recall by about 9% and extended default prediction to 24 months on the enterprise risk models, using bureau, app, device and temporal features, including new bureau embeddings.</li>
          <li>Raised look-to-click conversion by about 10% on personalised rewards, with recommenders built on temporal, behavioural and affluence features plus novelty and diversity.</li>
          <li>Architected the org’s AI engineering stack (Pydantic AI, LangGraph, LiteLLM). The agents cut daily operations and support time by over 45%.</li>
          <li>Led the Delta Lake to Iceberg migration: about $200K saved a year, with 50K+ tables processed every minute for real-time query resolution (SQS, Glue, StarRocks, Superset).</li>
        </ul>
      </div>

      <div className="card exp reveal">
        <div className="exp-h"><h2 className="exp-co">Walmart</h2><span className="exp-when">Oct 2021 – Oct 2023</span></div>
        <p className="exp-r">Software Engineer III, data and machine learning</p>
        <ul className="bul">
          <li>Cut legal-invoice turnaround by 99.5% with an automated system on Kafka, supervised learning and Kubernetes.</li>
          <li>Built an ML system to track and recover register losses across 5,000+ stores (Spark, MLflow, FastAPI): about $2–5M a year.</li>
          <li>Built ETL and ML pipelines (Airflow, GCP) behind Power BI dashboards that track returns across e-commerce and stores: up to about $3M a year.</li>
        </ul>
      </div>

      <div className="card exp reveal">
        <div className="exp-h"><h2 className="exp-co">TO THE NEW</h2><span className="exp-when">Feb 2019 – Sep 2021</span></div>
        <p className="exp-r">Software Engineer · clients PwC and Majid Al Futtaim</p>
        <ul className="bul"><li>Made a complex tax-filing system handle more than 200% extra load at the same cost, using concurrency.</li></ul>
      </div>

      <div className="card exp reveal">
        <h2 className="exp-co">What I work with</h2>
        {SK.map((g) => <div className="skg" key={g[0]}><span className="eyebrow">{g[0]}</span><div className="sk2s">{g[1].map((t) => <span className="sk2" key={t}>{t}</span>)}</div></div>)}
      </div>

      <div className="card reveal">
        <h2 className="h3" style={{ marginBottom: 8 }}>Why I built this</h2>
        <p className="body2">Most "become an AI engineer" advice is either a 47-hour course or a pile of links. This is the opposite: an opinionated path that says what to learn, what to build and what to skip, with the reasoning shown. I also write on Medium and LinkedIn and have guided juniors on Codementor.</p>
      </div>
      <div className="card reveal">
        <h2 className="h3" style={{ marginBottom: 10 }}>What this is not</h2>
        <ul className="bul"><li>Not a course aggregator. Every resource gets a verdict.</li><li>Not a certificate. Two deployed projects with honest write-ups beat a PDF.</li><li>Not a tool-of-the-week feed. Frameworks change; the stages hold.</li></ul>
      </div>
      <div className="card follow reveal" style={{ padding: 28, background: 'var(--pink-wash)' }}><div className="follow-body"><p className="follow-h" style={{ fontSize: '1.5rem' }}>Follow for the living version</p><p className="follow-s">I break down AI engineering, production systems, and what is actually worth learning.</p></div>
        <Follow cls="btn btn-pink btn-lg pressable" /></div>
    </section>
  );
}
