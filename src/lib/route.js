function fromHash() {
  try {
    const h = (window.location.hash || '').replace(/^#\/?/, '');
    if (!h) return null;
    const p = h.split('/');
    if (['assess', 'result', 'roadmap', 'learn', 'build', 'progress', 'about'].indexOf(p[0]) < 0) return null;
    if (p[0] === 'learn' && p[1]) return { view: 'topic', param: p[1] };
    if (p[0] === 'build' && p[1]) return { view: 'project', param: p[1] };
    return { view: p[0], param: null };
  } catch (e) { return null; }
}
function toHash(view, param) {
  if (view === 'topic') return '#/learn/' + param;
  if (view === 'project') return '#/build/' + param;
  return view === 'home' ? '#/' : '#/' + view;
}
export { fromHash, toHash };
