import { STAGES } from './stages.js';
const QUESTIONS = [
  { id: 'bg', title: 'Where are you starting from?', hint: 'Pick the closest one.', optional: false, options: [
    { v: 'beginner', label: 'Complete beginner', sub: 'New to programming', icon: '#i-leaf' },
    { v: 'python', label: 'Python developer', sub: 'Comfortable with scripts and small apps', icon: '#i-code' },
    { v: 'ds', label: 'Data scientist / ML engineer', sub: 'You train and evaluate models today', icon: '#i-brain' },
    { v: 'swe', label: 'Software engineer', sub: 'You ship production services', icon: '#i-server' },
    { v: 'other', label: 'Something else', sub: 'Adjacent field or career switch', icon: '#i-compass' }] },
  { id: 'goal', title: 'What are you aiming for?', hint: 'This decides what gets emphasised.', optional: false, options: [
    { v: 'job', label: 'My first AI engineering job', sub: 'Portfolio and interviews matter most', icon: '#i-briefcase' },
    { v: 'switch', label: 'Transition from software engineering', sub: 'Use what you already know', icon: '#i-route' },
    { v: 'better', label: 'Get better at production AI', sub: 'Evals, cost and reliability', icon: '#i-gauge' },
    { v: 'products', label: 'Build AI products', sub: 'Ship things people use', icon: '#i-rocket' },
    { v: 'explore', label: 'Explore, not sure yet', sub: 'Keep it light', icon: '#i-compass' }] },
  { id: 'ml', title: 'How much ML have you done?', hint: 'Be honest. It saves you time.', optional: false, options: [
    { v: 'none', label: 'None', sub: 'Never trained a model', icon: '#i-leaf' },
    { v: 'some', label: 'Some ML experience', sub: 'Courses or notebooks', icon: '#i-book' },
    { v: 'projects', label: 'Built ML projects', sub: 'End to end, not in production', icon: '#i-hammer' },
    { v: 'prod', label: 'Worked on production ML', sub: 'Models serving real traffic', icon: '#i-server' }] },
  { id: 'time', title: 'How much time can you give each week?', hint: 'Optional. We assume 5–10 hours if you skip.', optional: true, options: [
    { v: 'lt5', label: 'Under 5 hours', sub: 'Slow and steady', icon: '#i-clock' },
    { v: '5-10', label: '5–10 hours', sub: 'A realistic side-project pace', icon: '#i-clock' },
    { v: '10-15', label: '10–15 hours', sub: 'Serious momentum', icon: '#i-clock' },
    { v: '15+', label: '15+ hours', sub: 'Close to full time', icon: '#i-clock' }] },
  { id: 'focus', title: 'Anything you want to go deeper on?', hint: 'Optional. It flags the stages and projects to prioritise.', optional: true, options: [
    { v: 'rag', label: 'RAG and retrieval', sub: 'Search, chunking, citations', icon: '#i-layers' },
    { v: 'agents', label: 'Agents and tool calling', sub: 'Loops, tools, limits', icon: '#i-sparkles' },
    { v: 'evals', label: 'Evaluation and observability', sub: 'Know when it breaks', icon: '#i-circle-check' },
    { v: 'deploy', label: 'Deployment and production', sub: 'Cost, latency, reliability', icon: '#i-server' },
    { v: 'balanced', label: 'Balanced', sub: 'A bit of everything', icon: '#i-compass' }] }
];
const DEFAULTS = { bg: 'python', goal: 'job', ml: 'none', time: '5-10', focus: 'balanced' };
const HPW = { lt5: 4, '5-10': 7.5, '10-15': 12.5, '15+': 18 };
const HPW_LABEL = { lt5: 'Under 5 h/week', '5-10': '5–10 h/week', '10-15': '10–15 h/week', '15+': '15+ h/week' };
const HPW_SHORT = { lt5: '<5', '5-10': '5–10', '10-15': '10–15', '15+': '15+' };
const BG_LABEL = { beginner: 'Complete beginner', python: 'Python developer', ds: 'Data / ML background', swe: 'Software engineer', other: 'Career switcher' };
const GOAL_LABEL = { job: 'aiming for a first AI role', switch: 'moving from software engineering', better: 'getting better at production AI', products: 'building AI products', explore: 'exploring' };
const FOCUS_LABEL = { rag: 'focus on retrieval', agents: 'focus on agents', evals: 'focus on evals', deploy: 'focus on deployment' };
const FOCUS_STAGE = { rag: 2, agents: 2, evals: 3, deploy: 3 };

function makePlan(ans) {
  const a = Object.assign({}, DEFAULTS, ans || {});
  const modes = ['full', 'full', 'full', 'full', 'full'];
  if (a.bg === 'swe') modes[0] = 'skip'; else if (a.bg === 'python' || a.bg === 'ds') modes[0] = 'skim';
  if (a.ml === 'prod') modes[1] = 'skip'; else if (a.ml === 'projects' || a.bg === 'ds') modes[1] = 'skim';
  if (a.goal === 'better' || a.goal === 'explore') modes[4] = 'skim';
  const hpw = HPW[a.time] || 7.5;
  let cursor = 0, total = 0, trimmed = 0;
  const stages = STAGES.map((s, i) => {
    let h = s.hours;
    if (i === 0 && a.bg === 'beginner') h = Math.round(h * 1.5);
    if (i === 1 && a.ml === 'none' && a.bg !== 'ds') h = Math.round(h * 1.2);
    const f = modes[i] === 'skip' ? 0 : modes[i] === 'skim' ? 0.35 : 1;
    const hours = Math.round(h * f);
    const weeks = f === 0 ? 0 : Math.max(1, Math.ceil(hours / hpw - 0.001));
    const start = cursor + 1; cursor += weeks; total += hours;
    if (modes[i] !== 'full') trimmed++;
    const weeksLabel = weeks === 0 ? 'Skipped' : weeks === 1 ? 'Week ' + start : 'Weeks ' + start + '–' + cursor;
    return { i, mode: modes[i], hours, weeks, weeksLabel, hoursLabel: f === 0 ? 'Skipped' : '≈ ' + hours + ' h' };
  });
  const focusLabel = FOCUS_LABEL[a.focus] ? ' · ' + FOCUS_LABEL[a.focus] : '';
  return {
    a, stages, weeks: cursor, hours: total, trimmed, hpw, hpwShort: HPW_SHORT[a.time] || '5–10',
    summary: cursor + ' weeks at ' + (HPW_LABEL[a.time] || '5–10 h/week').replace('h/week', 'hours a week').toLowerCase().replace(/^./, (c) => c.toUpperCase()).replace(/^(.)/, '$1') + '. ' + (BG_LABEL[a.bg] || '') + ', ' + GOAL_LABEL[a.goal] + '.',
    subtitle: cursor + ' weeks · ' + (BG_LABEL[a.bg] || '') + ' · ' + GOAL_LABEL[a.goal] + focusLabel,
    focusStage: FOCUS_STAGE[a.focus] === undefined ? -1 : FOCUS_STAGE[a.focus]
  };
}
export { QUESTIONS, DEFAULTS, HPW, HPW_LABEL, HPW_SHORT, BG_LABEL, GOAL_LABEL, FOCUS_LABEL, FOCUS_STAGE, makePlan };
