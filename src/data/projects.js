const PROJECTS = [
  { slug: 'doc-qa', title: 'Document Q&A with citations', stage: 2, hours: '12–16 h', done: 'Answers cite the exact source passage, and a 20-question eval proves it.', focus: ['rag', 'evals'],
    what: 'A service that answers questions over documents you choose, quotes the passages it used, and says "I don\'t know" when it has nothing relevant.',
    criteria: ['Every answer includes citations that link to source passages', 'A small eval set (20+ questions) with a pass/fail score you can re-run', 'Says "I don\'t know" when retrieval finds nothing relevant', 'Deployed with a public URL', 'README explaining your chunking and retrieval tradeoffs'],
    stack: ['Python and FastAPI', 'An embedding model and a vector index you can run locally (pgvector, Chroma or FAISS)', 'Any LLM API', 'A simple web page or Streamlit UI'],
    mistakes: ['Evaluating by eyeballing three answers', 'Chunking by fixed length without looking at what gets retrieved', 'Letting the model answer when retrieval returned junk'] },
  { slug: 'tool-agent', title: 'Tool-calling agent with step limits', stage: 2, hours: '10–14 h', done: 'It finishes tasks within a step and cost budget, and fails safely when it cannot.', focus: ['agents'],
    what: 'An agent with three or four real tools (search, a calculator, a database query, a file read) and a hard cap on steps and spend.',
    criteria: ['Hard limits on steps and tokens, enforced in code', 'Every tool call and result is logged and replayable', 'Handles tool errors and malformed arguments without looping', 'Refuses tasks outside its scope', 'A 10-task eval set with success rate and average steps', 'README explaining why an agent beats a fixed workflow here'],
    stack: ['Python', 'Any LLM API with tool calling', 'Structured logs or a small tracing setup'],
    mistakes: ['No stop condition, so a confused agent loops until the budget is gone', 'Ten tools when three would do', 'Hiding tool errors from the model'] },
  { slug: 'prod-rag', title: 'Production RAG with observability', stage: 3, hours: '16–20 h', done: 'You change the prompt and the CI eval tells you whether you broke something.', focus: ['rag', 'evals', 'deploy'],
    what: 'Take your Document Q&A project and make it operable: traces, cost and latency tracking, caching, and an eval that runs on every change.',
    criteria: ['Every request produces a trace you can inspect', 'Cost and latency per request are recorded and visible', 'An eval runs in CI and fails the build on regression', 'Prompts are versioned in the repo', 'A cache or fallback path for the slowest step', 'README with a short "what broke and how I found out" section'],
    stack: ['Your Document Q&A project', 'An open tracing tool or structured logs', 'GitHub Actions or similar for the eval run'],
    mistakes: ['Building a dashboard before the eval exists', 'An LLM judge nobody has checked against human labels', 'Logging prompts without redacting sensitive data'] },
  { slug: 'extraction', title: 'Structured extraction service', stage: 3, hours: '10–12 h', done: 'Field-level accuracy is measured, and bad outputs are repaired or rejected.', focus: ['deploy', 'evals'],
    what: 'An API that turns messy text (invoices, emails, job posts) into validated JSON, with retries, repair and a way to abstain.',
    criteria: ['Output validated against a schema; invalid output is retried or rejected', 'Field-level accuracy measured on a labelled set of 30+ documents', 'Can abstain with a reason instead of guessing', 'A batch endpoint with sensible timeouts and retries', 'Deployed with a public URL', 'README on which fields are hard, and why'],
    stack: ['Python, FastAPI and Pydantic', 'Any LLM API with structured outputs', 'A labelled sample you create yourself'],
    mistakes: ['Measuring "valid JSON" instead of correct fields', 'Never testing on messy inputs', 'Treating confidence as a vibe instead of a threshold you tuned'] }
];
const PROJ_BY = {}; PROJECTS.forEach((p) => { PROJ_BY[p.slug] = p; });
const FILTERS = [['all', 'All'], [0, 'Foundations'], [1, 'ML / Deep Learning'], [2, 'LLM engineering'], [3, 'Production AI'], [4, 'Portfolio']];
const FEATURED = ['effective-agents', 'dlai-agentic', 'hamel-evals', 'evals-maven'];
export { PROJECTS, PROJ_BY, FILTERS, FEATURED };
