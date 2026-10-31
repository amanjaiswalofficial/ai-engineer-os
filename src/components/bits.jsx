import { IG_URL } from '../lib/storage.js';
import { hideImg } from '../data/helpers.js';

export const Ico = ({ n }) => <svg className="i"><use href={n.charAt(0) === '#' ? n : '#' + n} /></svg>;

export const Follow = ({ cls = 'btn btn-pink pressable' }) => (
  <a className={cls} href={IG_URL} target="_blank" rel="noopener" aria-label="Follow @aman.jsw on Instagram, opens in a new tab"><Ico n="i-ig" /><span>Follow @aman.jsw</span></a>
);

export const Fav = ({ a }) => (
  <span className="fav"><span className="fav-l">{a.letter}</span><img className="fav-i" src={a.icon} alt="" width="20" height="20" onError={hideImg} /></span>
);

export const AltLink = ({ a }) => (
  <a className="reslink alt" href={a.url} target="_blank" rel="noopener" aria-label={a.aria}>
    <span className="alt-top"><Fav a={a} /><b>{a.title}</b><span className={a.tagCls}><span>{a.tag}</span></span></span>
    <small>{a.meta}</small><small className="alt-n">{a.note}</small>
  </a>
);

export const FollowCard = ({ title, text, col, style, reveal = true }) => (
  <aside className={'card follow' + (col ? ' follow-col' : '') + (reveal ? ' reveal' : '')} style={style}>
    <div className="follow-body"><p className="follow-h">{title}</p><p className="follow-s">{text}</p></div>
    <Follow />
  </aside>
);
