// Verbatim from the original Main.dc.html
const alt = (t, p, u, price, kind, via, note) => ({ t, p, u, price, kind, via, note });
const STAGES = [
  { id: 's1', title: 'Engineering foundations', short: 'Foundations', icon: '#i-code', hours: 16,
    blurb: 'Ship a small, typed, tested service end to end. Everything later sits on this.',
    know: ['Python you can read cold: typing, dataclasses or Pydantic, async basics', 'HTTP APIs, JSON, retries and timeouts', 'Git, pytest, Docker and one place to deploy', 'A test harness that copes with non-deterministic output, because evals start here', 'Enough SQL to answer a question without an ORM'],
    free: 'fastapi', paid: null, paidNote: 'Skip paid courses here. The docs plus one small deployed service teach more than any bootcamp module.',
    build: 'A typed FastAPI service with tests, a Dockerfile and a public URL.', buildSlug: null,
    competent: 'You can take an empty folder to a deployed, tested endpoint without following a tutorial.',
    mistakes: ['Starting a 40-hour "Python from zero" course when you can already code', 'Learning three web frameworks instead of shipping one', 'Skipping tests because it is "just a prototype"'],
    skills: ['Python', 'APIs', 'Docker', 'Testing'],
    alts: [
      alt('Python for Everybody', 'Charles Severance', 'https://www.py4e.com/', 'Free', 'Course', 'KDnuggets, Scrimba', 'Slow and gentle. Skip it if you write Python daily.'),
      alt('CS50 Introduction to Programming with Python', 'Harvard', 'https://cs50.harvard.edu/python', 'Free', 'Course', 'KDnuggets, Scrimba', 'Tighter than py4e, with problem sets that make you type the code.'),
      alt('Docker curriculum', 'docker-curriculum.com', 'https://docker-curriculum.com/', 'Free', 'Tutorial', 'KDnuggets', 'Enough Docker to containerise and ship one service. Do not go deeper yet.'),
      alt('Test-Driven Development with Python', 'Harry Percival', 'https://www.obeythetestinggoat.com/pages/book.html', 'Book', 'Book', 'KDnuggets', 'Learn testing now. LLM apps are harder to test than normal software, so the habit pays twice.')
    ],
    paidOpts: [
      alt('AI Engineer Path', 'Scrimba', 'https://scrimba.com/the-ai-engineer-path-c02v', 'Paid · Pro from $24.50/mo billed annually', 'Interactive course', 'Scrimba', 'About 11 hours, JavaScript-first. Fine if you are a web dev. The seller wrote the article that recommends it.'),
      alt('AI Engineer in Python path', 'Dataquest', 'https://www.dataquest.io/path/ai-engineer/', 'Paid · price not shown in sources', 'Guided path', 'Dataquest', 'About 207 hours over 33 courses, roughly 11 months at 5 hours a week. Only worth it if you need the structure.')
    ],
    checks: [{ id: 'chk-0', text: 'I can take an empty folder to a deployed, tested endpoint.' }] },
  { id: 's2', title: 'ML and deep learning', short: 'ML', icon: '#i-brain', hours: 24,
    blurb: 'Enough ML to judge a model: data splits, metrics, embeddings and why things fail.',
    know: ['Train, validation and test splits, and what leakage looks like', 'Precision, recall, calibration, and why accuracy lies', 'Gradient descent, overfitting and regularisation', 'Embeddings and the idea behind attention', 'PyTorch basics'],
    free: 'fastai', paid: null, paidNote: 'Skip paid ML specialisations unless you want the theory. You need working intuition, not a transcript.',
    build: 'A classifier or ranker with a held-out set, a baseline and a written error analysis.', buildSlug: null,
    competent: 'You can explain why a metric moved and spot leakage in someone else\'s notebook.',
    mistakes: ['Chasing leaderboards', 'Deriving backprop before training a single model', 'Training from scratch when fine-tuning or prompting would do'],
    skills: ['PyTorch', 'Metrics', 'Embeddings'],
    alts: [
      alt('Machine Learning Crash Course', 'Google', 'https://developers.google.com/machine-learning/crash-course', 'Free', 'Course', 'dataskew', 'The fastest honest pass over splits, metrics and overfitting.'),
      alt('Neural networks playlist', '3Blue1Brown', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', 'Free', 'Video', 'dataskew', 'Build the picture before the code. Short and worth it.'),
      alt('The Illustrated Transformer', 'Jay Alammar', 'https://jalammar.github.io/illustrated-transformer/', 'Free', 'Article', 'dataskew, Louis Bouchard', 'Read it once so attention stops being a black box.'),
      alt('Hugging Face LLM Course', 'Hugging Face', 'https://huggingface.co/learn/llm-course/chapter1/1', 'Free', 'Course', 'Louis Bouchard', 'Runnable notebooks, text-heavy. Needs self-discipline.'),
      alt('MIT 6.S191 Introduction to Deep Learning', 'MIT', 'https://introtodeeplearning.com/', 'Free', 'Lectures', 'dataskew', 'Heavier than you need. Take it only if you like lectures.')
    ],
    paidOpts: [
      alt('Machine Learning Specialization', 'Andrew Ng · Coursera', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Free to audit · certificate $49/mo', 'Course', 'Scrimba', 'About 95 hours. The standard for fundamentals, with nothing on LLM engineering. Audit it, do not pay for the certificate.'),
      alt('Hands-On Large Language Models', 'Alammar and Grootendorst', 'https://www.llm-book.com/', 'Paid book', 'Book', 'Louis Bouchard', 'A good bridge from classical ML to LLMs, if you prefer a book to videos.')
    ],
    checks: [{ id: 'chk-1', text: 'I can explain why a metric moved and spot leakage.' }] },
  { id: 's3', title: 'LLM engineering', short: 'LLMs', icon: '#i-sparkles', hours: 30,
    blurb: 'Prompts, structured outputs, tools, retrieval and agents, with the judgement to know when not to.',
    know: ['Prompting as interface design: system prompts and structured outputs', 'Tool calling and the agent loop', 'Embeddings, chunking, hybrid search and reranking', 'What goes in the context window, and what does not', 'MCP: what it is and when exposing a tool through it is worth the work', 'When a fixed workflow beats an agent'],
    free: 'effective-agents', paid: null, paidNote: 'You do not need to pay for this stage. If you want a live cohort for accountability, see the paid options below, and check the syllabus covers evals and deployment, not only agents.',
    build: 'Document Q&A with citations and a 20-question eval, then a tool-calling agent with step limits.', buildSlug: 'doc-qa',
    competent: 'Given a bad answer, you can tell whether retrieval, the prompt or the model caused it.',
    mistakes: ['Framework-hopping every week', 'Fine-tuning before you have evals', 'Shopping for vector databases before you have a retrieval metric'],
    skills: ['RAG', 'Tool calling', 'Structured outputs', 'Prompt design'],
    alts: [
      alt('Anthropic Academy', 'Anthropic', 'https://www.anthropic.com/learn', 'Free', 'Courses', 'Louis Bouchard', 'Official courses on the API, MCP and Claude Code. Check each course page for what it covers.'),
      alt('Contextual Retrieval', 'Anthropic', 'https://www.anthropic.com/news/contextual-retrieval', 'Free', 'Article', 'Louis Bouchard', 'The clearest short piece on why naive chunking loses context, and what to do about it.'),
      alt('Writing effective tools for agents', 'Anthropic Engineering', 'https://www.anthropic.com/engineering/writing-tools-for-agents', 'Free', 'Article', 'Louis Bouchard', 'Most agent bugs are tool-design bugs. Read this before you add a fifth tool.'),
      alt('12-Factor Agents', 'Dex Horthy', 'https://github.com/humanlayer/12-factor-agents', 'Free', 'Repo', 'Louis Bouchard', 'Opinionated, and mostly right: own your prompts, control flow and context.'),
      alt('MCP course', 'Hugging Face', 'https://huggingface.co/learn/mcp-course/', 'Free', 'Course', 'Louis Bouchard', 'MCP now shows up in nearly every 2026 roadmap. Learn the protocol once.'),
      alt('Large Language Model Agents', 'UC Berkeley', 'https://llmagents-learning.org/f24', 'Free', 'Lectures', 'Scrimba', 'About 24 hours of research-level depth. Great if you like theory, slow if you want to ship.')
    ],
    paidOpts: [
      alt('Agentic AI', 'Andrew Ng · DeepLearning.AI', 'https://www.deeplearning.ai/courses/agentic-ai', 'Free to audit · Pro $25/mo billed annually or $30/mo', 'Course', 'DeepLearning.AI', 'About 10 hours. Auditing gives you the videos and forum. Quizzes, labs and the certificate need Pro.'),
      alt('Building AI Agents for Enterprise', 'Beyond Vectors', 'https://beyondvectors.com/', 'Paid · ₹50,000', 'Live cohort', 'Beyond Vectors', 'Six weekends, live. Covers RAG, tools, evals and production. The October 2026 cohort has started, so check for the next one.'),
      alt('Learn AI Agents and Learn Context Engineering', 'Scrimba', 'https://scrimba.com/learn-ai-agents-c034', 'Paid · Pro from $24.50/mo billed annually', 'Interactive course', 'Scrimba', 'About 3 hours in JavaScript. Narrow, so use it as a supplement.')
    ],
    checks: [{ id: 'chk-2', text: 'I can trace a bad answer to retrieval, the prompt or the model.' }] },
  { id: 's4', title: 'Production AI', short: 'Production', icon: '#i-server', hours: 30,
    blurb: 'Evals, tracing, cost and latency. The part that separates a demo from a product.',
    know: ['Error analysis, golden sets and the pitfalls of LLM judges', 'Tracing and observability for LLM calls', 'Cost and latency budgets, caching and fallbacks', 'Guardrails and failure modes', 'Prompt versioning and regression tests in CI', 'Testing for prompt injection and unauthorised tool use'],
    free: 'hamel-evals', paid: 'evals-maven', paidNote: '',
    build: 'Production RAG with tracing, cost and latency tracking, and an eval that runs in CI.', buildSlug: 'prod-rag',
    competent: 'You can change a prompt and know within ten minutes whether you broke something.',
    mistakes: ['Building dashboards before you have an eval', 'Trusting an LLM judge nobody has checked against human labels', 'Leaving cost and latency for later'],
    skills: ['Evals', 'Observability', 'Cost control', 'CI for prompts'],
    alts: [
      alt('A Field Guide to Rapidly Improving AI Products', 'Hamel Husain', 'https://hamel.dev/blog/posts/field-guide/', 'Free', 'Article', 'Louis Bouchard', 'The error-analysis workflow in practice. Read it right after the evals post.'),
      alt('Ragas', 'Ragas', 'https://docs.ragas.io/en/stable/', 'Free · open source', 'Tool', 'dataskew, Louis Bouchard', 'Useful metrics for RAG. Check them against your own labels before trusting them.'),
      alt('Arize Phoenix', 'Arize', 'https://arize.com/docs/phoenix', 'Free · open source', 'Tool', 'Louis Bouchard', 'Tracing and evals you can run locally. A good first observability tool.'),
      alt('Langfuse prompt management', 'Langfuse', 'https://langfuse.com/docs/prompts/get-started', 'Check site', 'Tool', 'dataskew', 'Prompt versioning plus traces. One of several; pick one and stop shopping.'),
      alt('OWASP Top 10 for LLM Applications', 'OWASP', 'https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/', 'Free', 'Reference', 'Louis Bouchard', 'Prompt injection and unsafe tool use are the failures you will actually meet.'),
      alt('MLOps Zoomcamp', 'DataTalksClub', 'https://github.com/DataTalksClub/mlops-zoomcamp', 'Free', 'Course', 'Scrimba', 'About 9 weeks on deployment, monitoring and CI/CD. Classic MLOps rather than LLMs, but the production habits transfer.')
    ],
    paidOpts: [
      alt('AI Evals For Engineers and PMs', 'Hamel Husain and Shreya Shankar · Maven', 'https://maven.com/parlance-labs/evals', 'Paid · $4,400', 'Live cohort', 'Maven', 'The most direct course on evals. Expensive. Do the free posts and previews first.'),
      alt('AI Engineering Cohort', 'Gaurav Sen and Tanishq Singh', 'https://aiengg.dev/', 'Paid · $2,200', 'Live cohort', 'aiengg.dev', 'Six weeks: agentic design, retrieval, evals and security, CI/CD, observability, and a capstone.'),
      alt('AI Engineering', 'Chip Huyen · O\'Reilly', 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/', 'Paid book', 'Book', 'dataskew, Louis Bouchard', 'The best single reference. Read the evaluation chapters first.')
    ],
    checks: [{ id: 'chk-3', text: 'I can change a prompt and know within ten minutes if I broke something.' }] },
  { id: 's5', title: 'Portfolio and interviews', short: 'Portfolio', icon: '#i-briefcase', hours: 20,
    blurb: 'Turn two projects into proof: public URLs, honest write-ups, and a story you can tell.',
    know: ['How to scope and write up a project: problem, approach, tradeoffs, failures', 'LLM system design questions', 'Reading a job post for real AI engineering work', 'Talking through your eval results with numbers', 'A short recorded walkthrough of one project, which most candidates skip'],
    free: 'applied-llms', paid: 'bootcamps', paidNote: '',
    build: 'Polish two projects: public URL, README with tradeoffs, and a short write-up of what failed.', buildSlug: null,
    competent: 'You can walk through a project\'s failure modes unprompted, with numbers.',
    mistakes: ['Ten half-finished repos', 'A README that only lists features', 'Collecting certificates instead of shipping'],
    skills: ['Writing', 'System design', 'Communication'],
    alts: [
      alt('AI Engineer projects', 'roadmap.sh', 'https://roadmap.sh/ai-engineer/projects', 'Check site', 'Project ideas', 'roadmap.sh', 'Starter briefs. Pick one and make it yours with real data.'),
      alt('Start AI Engineering', 'Louis Bouchard', 'https://github.com/louisfb01/start-ai-engineering', 'Free', 'Repo', 'Louis Bouchard', 'A curated list with difficulty ratings and project ideas.'),
      alt('Designing Real-World AI Agents workshop', 'Paul Iusztin', 'https://github.com/iusztinpaul/designing-real-world-ai-agents-workshop', 'Free', 'Repo', 'Louis Bouchard', 'A worked example of an agent project structured like production.'),
      alt('Example capstone: ReconAI', 'Public repo', 'https://github.com/tamilarasu-ravi/recon-ai', 'Free', 'Repo', 'aiengg.dev', 'One public capstone from the aiengg.dev cohort. Use it to see what a finished write-up looks like.'),
      alt('AI engineer interview guide', 'Interview Query', 'https://www.interviewquery.com/p/ai-engineer-interview-questions', 'Check site', 'Guide', 'Interview Query', 'A vendor guide, but useful to see the question shapes.')
    ],
    paidOpts: [],
    checks: [{ id: 'chk-4a', text: 'Two projects have a public URL and a README with tradeoffs.' }, { id: 'chk-4b', text: 'I can walk through a project\'s failure modes with numbers.' }] }
];

const MODE_NOTES = [
  { skip: 'You already ship services, so skip this stage. Use the docs as a reference if a tool is unfamiliar.', skim: 'Skim: confirm you can containerise, test and deploy a small service, then move on.' },
  { skip: 'You have shipped models to production. Skip this stage and dip into embeddings later if you need to.', skim: 'Skim: refresh metrics and embeddings. Skip the from-scratch material.' },
  {}, {},
  { skim: 'Skim: keep this light. A short write-up per project is enough.' }
];
export { alt, STAGES, MODE_NOTES };
