import { VERDICTS } from './resources.js';
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
const NOICON = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function favOf(url, title) {
  let host = ''; try { host = new URL(url).hostname; } catch (e) { host = ''; }
  return { icon: host ? 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64' : NOICON, letter: (title || '?').trim().charAt(0).toUpperCase(), host };
}
function hideImg(e) { try { e.target.style.display = 'none'; } catch (x) { /* noop */ } }
function tagOf(price) {
  if (/^Paid/i.test(price)) return ['Paid', 'pill p-peach'];
  if (/^Free to audit|^Free ·.*(Pro|certificate)/i.test(price)) return ['Free + paid', 'pill p-lav'];
  if (/^Free/i.test(price)) return ['Free', 'pill p-mint'];
  if (/^Book/i.test(price)) return ['Book', 'pill p-gray'];
  return ['Check site', 'pill p-gray'];
}
function altVal(a) { const f = favOf(a.u, a.t), tg = tagOf(a.price); return { title: a.t, url: a.u, meta: a.p + ' · ' + a.price + ' · ' + a.kind + ' · via ' + a.via, note: a.note, aria: a.t + ', ' + tg[0] + ', opens in a new tab', icon: f.icon, letter: f.letter, iconErr: hideImg, tag: tg[0], tagCls: tg[1] }; }
function wallCard(r) { const v = VERDICTS[r.verdict] || VERDICTS.worth; return { cls: 'pill ' + v.cls, label: v.label, title: r.title, provider: r.provider }; }
export { clamp, NOICON, favOf, hideImg, tagOf, altVal, wallCard };
