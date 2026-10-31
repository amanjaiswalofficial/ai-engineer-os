export const IG_URL = 'https://www.instagram.com/aman.jsw/';
export const KEYS = { a: 'ai-engineer-os-assessment', p: 'ai-engineer-os-progress', s: 'ai-engineer-os-settings' };
const MEM = {};
let LS;
function ls() {
  if (LS !== undefined) return LS;
  try { const k = '__aios'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); LS = window.localStorage; } catch (e) { LS = null; }
  return LS;
}
export function readJSON(key, fb) { try { const s = ls(); const raw = s ? s.getItem(key) : MEM[key]; return raw ? JSON.parse(raw) : fb; } catch (e) { return fb; } }
export function writeJSON(key, val) { try { const raw = JSON.stringify(val); const s = ls(); if (s) s.setItem(key, raw); else MEM[key] = raw; } catch (e) { /* storage unavailable */ } }
export function mm(q) { try { return !!(window.matchMedia && window.matchMedia(q).matches); } catch (e) { return false; } }
