import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const MOODS = [
  { v: 1, e: '😞', label: 'Low' },
  { v: 2, e: '😕', label: 'A little off' },
  { v: 3, e: '😐', label: 'Okay' },
  { v: 4, e: '🙂', label: 'Good' },
  { v: 5, e: '😊', label: 'Great' },
];
const TAGS = ['Sleep', 'Work', 'Social', 'Health', 'Family', 'Study', 'Exercise', 'Rest'];
const PROMPTS = [
  'What felt gentle or good today?',
  'What is taking up the most space in your mind?',
  'Name one small thing you are grateful for.',
  'What do you need a little more of tomorrow?',
  'What helped you get through today?',
  'If today had a colour, what would it be — and why?',
];
const DEFAULT_HABITS = [
  { id: 'h1', name: 'Drink water', icon: '💧', streak: 4, completed: [] },
  { id: 'h2', name: '10 min walk', icon: '🚶', streak: 2, completed: [] },
  { id: 'h3', name: 'No phone before bed', icon: '🌙', streak: 6, completed: [] },
];
const PATTERNS = {
  box: { label: 'Box', phases: [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4]], cycle: 16 },
  calm: { label: 'Calm', phases: [['Inhale', 4], ['Exhale', 6]], cycle: 10 },
  '4-7-8': { label: '4–7–8', phases: [['Inhale', 4], ['Hold', 7], ['Exhale', 8]], cycle: 19 },
};

function load(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function todayKey(date = new Date()) {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function uid(prefix = 'id') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function formatDate(iso) { return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }
function formatLongDate(date = new Date()) { return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }); }

function Icon({ name, size = 20 }) {
  const p = { stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16"/><path d="M8 7h8"/><path d="M8 11h8"/></>,
    wind: <><path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h14a3 3 0 1 1-3 3"/><path d="M3 16h7"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/></>,
    heart: <><path d="M20.8 8.9c0 5.1-8.8 10.2-8.8 10.2S3.2 14 3.2 8.9A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.7Z"/></>,
    life: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></>,
    moon: <><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="m6 7 1 14h10l1-14"/><path d="M9 7V4h6v3"/></>,
    edit: <><path d="m4 16-.7 4.7L8 20l11.4-11.4a2 2 0 0 0-2.8-2.8Z"/><path d="m15 7 2 2"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></>,
    shield: <><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z"/><path d="m9 12 2 2 4-4"/></>,
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...p}>{paths[name] || paths.heart}</svg>;
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login'); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  function submit(e) {
    e.preventDefault(); setError(''); setNotice(''); const users = load('auraUsers', {}); const normalized = email.trim().toLowerCase();
    if (mode === 'register') {
      if (!name.trim() || !normalized || password.length < 6) return setError('Please add your name, a valid email, and a password of at least 6 characters.');
      if (users[normalized]) return setError('An account with this email already exists.');
      users[normalized] = { name: name.trim(), password }; save('auraUsers', users); save('auraSession', { name: name.trim(), email: normalized }); onLogin({ name: name.trim(), email: normalized });
    } else {
      if (!users[normalized] || users[normalized].password !== password) return setError('That email or password does not match.');
      save('auraSession', { name: users[normalized].name, email: normalized }); onLogin({ name: users[normalized].name, email: normalized });
    }
  }
  function demo() { setEmail('demo@aura.local'); setPassword('aura1234'); const users = load('auraUsers', {}); users['demo@aura.local'] = { name: 'Moumita', password: 'aura1234' }; save('auraUsers', users); setNotice('Demo account filled in — press Enter AURA.'); }
  return <div className="auth-page">
    <div className="auth-art"><div className="art-glow glow-a"/><div className="art-glow glow-b"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><span>✦</span></div><div className="art-copy"><span className="eyebrow">AURA · DAILY WELLNESS</span><h2>A little room<br/>to come back<br/><em>to yourself.</em></h2><p>Small check-ins. Quiet reflection. Gentle habits.</p></div></div>
    <div className="auth-panel"><div className="auth-card"><div className="brand large"><span className="brand-mark">✦</span><span>AURA</span></div><div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button></div><p className="eyebrow center">A QUIETER SPACE FOR YOU</p><h1>{mode === 'login' ? 'Welcome back.' : 'Create your private space.'}</h1><p className="auth-sub">{mode === 'login' ? 'Pick up where you left off, gently.' : 'A small place for your mood, thoughts, and habits.'}</p>
      <form onSubmit={submit}>{mode === 'register' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label>}<label>Email address<input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email"/></label><label>Password<div className="password"><input value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" type={show ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/><button type="button" className="password-toggle" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></label>{mode === 'login' && <div className="form-row"><label className="check-label"><input type="checkbox"/> <span>Remember me</span></label><button type="button" className="text-button" onClick={() => setNotice('For this local demo, account recovery is not connected to email yet.')}>Forgot password?</button></div>}{error && <div className="form-error">{error}</div>}{notice && <div className="form-notice">{notice}</div>}<button className="primary full" type="submit">{mode === 'login' ? 'Enter AURA' : 'Create my space'} <Icon name="arrow" size={17}/></button></form>
      {mode === 'login' && <button className="demo-button" onClick={demo}>Use the demo account</button>}<div className="privacy-note"><Icon name="shield" size={16}/><span><b>Private by design.</b> This demo keeps account, mood, journal, and habit data in your browser only. Nothing is sent to a server.</span></div></div><p className="auth-footer">AURA is a self-care and journaling tool — not a diagnostic or treatment service.</p></div>
  </div>;
}

function Layout({ user, view, setView, onLogout, dark, setDark, children }) {
  const nav = [['home', 'Today', 'home'], ['journal', 'Journal', 'book'], ['breathe', 'Breathe', 'wind'], ['habits', 'Habits', 'check'], ['insights', 'Insights', 'chart'], ['resources', 'Support', 'life']];
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">✦</span><span>AURA</span></div><div className="side-tag">your daily companion</div><nav aria-label="Primary navigation">{nav.map(([id, label, ic]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon name={ic}/><span>{label}</span></button>)}</nav><div className="side-bottom"><button className="support-mini" onClick={() => setView('resources')}><Icon name="life" size={18}/><span><b>Need support?</b><small>Resources are always here.</small></span></button><button className="theme" onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'} size={18}/>{dark ? 'Light mode' : 'Dark mode'}</button><button className="logout" onClick={onLogout}><Icon name="logout" size={17}/> Sign out</button></div></aside><main className="main"><header className="topbar"><div><span className="mobile-brand">✦ AURA</span><p className="top-greeting">{view === 'home' ? 'Today is a good place to begin.' : view === 'resources' ? 'Support' : view[0].toUpperCase() + view.slice(1)}</p></div><div className="profile"><div className="avatar">{user.name?.[0]?.toUpperCase() || 'A'}</div><span>{user.name?.split(' ')[0]}</span></div></header><div className="content">{children}</div></main><nav className="mobile-nav" aria-label="Mobile navigation">{nav.slice(0, 5).map(([id, label, ic]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon name={ic} size={19}/><span>{label}</span></button>)}<button className={view === 'resources' ? 'active' : ''} onClick={() => setView('resources')}><Icon name="life" size={19}/><span>More</span></button></nav></div>;
}

function MoodCard({ moods, setMoods }) {
  const existing = moods[todayKey()]; const [mood, setMood] = useState(existing?.mood || null); const [tags, setTags] = useState(existing?.tags || []); const [note, setNote] = useState(existing?.note || '');
  useEffect(() => { const x = moods[todayKey()]; setMood(x?.mood || null); setTags(x?.tags || []); setNote(x?.note || ''); }, [moods]);
  function saveMood() { if (!mood) return; const next = { ...moods, [todayKey()]: { mood, tags, note, updatedAt: new Date().toISOString() } }; setMoods(next); save('auraMoods', next); }
  return <section className="card mood-card"><div className="section-head"><div><span className="eyebrow">MOOD CHECK-IN</span><h2>How are you arriving today?</h2></div><span className="soft-pill"><Icon name="shield" size={13}/> Private</span></div><div className="mood-row">{MOODS.map(x => <button key={x.v} className={'mood-option ' + (mood === x.v ? 'selected' : '')} onClick={() => setMood(x.v)} aria-label={`${x.label}, ${x.v} out of 5`}><span>{x.e}</span><small>{x.label}</small></button>)}</div><div className="tag-wrap"><span className="label">Anything influencing the day?</span><div className="chips">{TAGS.map(t => <button key={t} className={tags.includes(t) ? 'chip selected' : 'chip'} onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])}>{t}</button>)}</div></div><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="A few words, if you'd like…" rows="3"/><div className="card-action-row"><span className="tiny-copy">Your check-in stays in this browser.</span><button className="primary" onClick={saveMood}>{existing ? 'Update check-in' : 'Save check-in'} <Icon name="arrow" size={16}/></button></div></section>;
}

function Home({ moods, setMoods, journal, habits, setView }) {
  const user = load('auraSession', {}); const recent = Object.values(moods).slice(-7); const avg = recent.length ? (recent.reduce((a, b) => a + b.mood, 0) / recent.length).toFixed(1) : '—'; const completedToday = habits.filter(h => (h.completed || []).includes(todayKey())).length;
  return <><div className="hero"><div><span className="eyebrow">{formatLongDate().toUpperCase()}</span><h1>Hi, {user.name?.split(' ')[0] || 'friend'} <span>✦</span></h1><p>Check in, take a breath, and keep the small things moving.</p></div><button className="primary" onClick={() => document.getElementById('mood')?.scrollIntoView({ behavior: 'smooth' })}>Check in today <Icon name="arrow" size={17}/></button></div><div id="mood"><MoodCard moods={moods} setMoods={setMoods}/></div><div className="home-grid"><div className="card stat-card"><div className="stat-top"><span className="stat-icon">◒</span><span className="soft-pill">7 days</span></div><span className="eyebrow">RECENT MOOD</span><strong>{avg}</strong><small>{recent.length ? 'average from your recent check-ins' : 'log a mood to start a pattern'}</small></div><div className="card stat-card"><div className="stat-top"><span className="stat-icon">✎</span><span className="soft-pill">Private</span></div><span className="eyebrow">JOURNAL</span><strong>{journal.length}</strong><small>{journal.length === 1 ? 'reflection saved' : 'reflections saved'}</small></div><div className="card stat-card"><div className="stat-top"><span className="stat-icon">✓</span><span className="soft-pill">Today</span></div><span className="eyebrow">SMALL HABITS</span><strong>{completedToday}/{habits.length}</strong><small>gentle steps completed today</small></div><div className="card quote-card"><span>“</span><div><p>You don't have to fix everything today.</p><small>One small kind choice is enough.</small></div></div></div><div className="home-actions"><button className="card quick-action" onClick={() => setView('journal')}><span>Write a reflection</span><Icon name="arrow"/></button><button className="card quick-action" onClick={() => setView('breathe')}><span>Take two quiet minutes</span><Icon name="arrow"/></button><button className="card quick-action" onClick={() => setView('habits')}><span>See today's habits</span><Icon name="arrow"/></button></div></>;
}

function Journal({ journal, setJournal }) {
  const [text, setText] = useState(''); const [prompt, setPrompt] = useState(PROMPTS[0]); const [search, setSearch] = useState(''); const [editing, setEditing] = useState(null); const [showDelete, setShowDelete] = useState(null);
  function newPrompt() { let next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]; while (PROMPTS.length > 1 && next === prompt) next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]; setPrompt(next); }
  function saveEntry() { if (!text.trim()) return; const item = { id: editing || uid('journal'), date: editing ? journal.find(j => j.id === editing)?.date || new Date().toISOString() : new Date().toISOString(), updatedAt: new Date().toISOString(), text: text.trim() }; const next = editing ? journal.map(j => j.id === editing ? item : j) : [item, ...journal]; setJournal(next); save('auraJournal', next); setText(''); setEditing(null); }
  function editEntry(j) { setEditing(j.id); setText(j.text); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function deleteEntry(id) { const next = journal.filter(j => j.id !== id); setJournal(next); save('auraJournal', next); setShowDelete(null); if (editing === id) { setEditing(null); setText(''); } }
  const list = journal.filter(j => j.text.toLowerCase().includes(search.toLowerCase()));
  return <><PageTitle eyebrow="JOURNAL" title="Your thoughts, at your pace." subtitle="Nothing needs to sound polished here. This is just for you."/><div className="journal-layout"><section className="card editor"><div className="prompt"><span>TRY THIS</span><p>{prompt}</p><button className="ghost" onClick={newPrompt}>Another prompt ↻</button></div><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write whatever is on your mind…" rows="10" aria-label="Journal reflection"/><div className="editor-footer"><span>{text.length} characters · private by default</span><div><button className="secondary" onClick={() => { setText(''); setEditing(null); }}>Clear</button><button className="primary" onClick={saveEntry}>{editing ? 'Save changes' : 'Save reflection'} <Icon name="arrow" size={15}/></button></div></div></section><section><div className="search-wrap"><span>⌕</span><input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reflections…" aria-label="Search reflections"/></div>{list.length ? list.map(j => <article className="card entry" key={j.id}><div className="entry-top"><time>{formatDate(j.date)}</time><div className="entry-actions"><button onClick={() => editEntry(j)} aria-label="Edit reflection"><Icon name="edit" size={15}/></button><button onClick={() => setShowDelete(j.id)} aria-label="Delete reflection"><Icon name="trash" size={15}/></button></div></div><p>{j.text}</p>{showDelete === j.id && <div className="confirm-row"><span>Delete this reflection?</span><button className="secondary" onClick={() => setShowDelete(null)}>Keep</button><button className="danger" onClick={() => deleteEntry(j.id)}>Delete</button></div>}</article>) : <div className="card empty"><div>✦</div><h3>{search ? 'No reflections found' : 'No reflections yet'}</h3><p>{search ? 'Try a different word.' : 'Your first entry can be just a sentence.'}</p></div>}</section></div></>;
}

function PageTitle({ eyebrow, title, subtitle }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>; }

function Breathing() {
  const [pattern, setPattern] = useState('box'); const [running, setRunning] = useState(false); const [seconds, setSeconds] = useState(0); const [phaseIndex, setPhaseIndex] = useState(0); const [phaseRemaining, setPhaseRemaining] = useState(PATTERNS.box.phases[0][1]); const current = PATTERNS[pattern];
  useEffect(() => { setRunning(false); setSeconds(0); setPhaseIndex(0); setPhaseRemaining(PATTERNS[pattern].phases[0][1]); }, [pattern]);
  useEffect(() => { if (!running) return; const timer = setInterval(() => { setSeconds(s => s + 1); setPhaseRemaining(r => { if (r > 1) return r - 1; setPhaseIndex(i => (i + 1) % current.phases.length); return current.phases[(phaseIndex + 1) % current.phases.length][1]; }); }, 1000); return () => clearInterval(timer); }, [running, current, phaseIndex]);
  const phase = current.phases[phaseIndex][0]; const phaseDuration = current.phases[phaseIndex][1];
  return <><PageTitle eyebrow="BREATHING & GROUNDING" title="Make a little more room to breathe." subtitle="Follow the pace, or simply sit with the circle for a moment."/><div className="breath-layout"><section className="card breath-card"><div className="breath-status"><span>{running ? phase : 'READY'}</span><b>{running ? String(phaseRemaining).padStart(2, '0') : '—'}</b></div><div className={'breath-orb ' + (running ? 'breathing' : '')} style={{ '--cycle': `${current.cycle}s`, '--phase': `${phaseDuration}s` }}><div><span>{running ? phase : 'AURA'}</span><strong>{running ? phaseRemaining : '✦'}</strong><small>{running ? `${seconds}s session` : 'a moment for you'}</small></div></div><div className="pattern-tabs">{Object.entries(PATTERNS).map(([id, p]) => <button key={id} className={pattern === id ? 'selected' : ''} onClick={() => setPattern(id)}>{p.label}</button>)}</div><div className="breath-controls"><button className="primary" onClick={() => setRunning(!running)}>{running ? 'Pause session' : 'Start breathing'} <Icon name={running ? 'check' : 'arrow'} size={16}/></button>{running && <button className="secondary" onClick={() => { setRunning(false); setSeconds(0); setPhaseIndex(0); setPhaseRemaining(current.phases[0][1]); }}>Reset</button>}</div><p className="tiny-copy">Move at a comfortable pace. If a pattern feels uncomfortable, return to your natural breathing.</p></section><Grounding/></div></>;
}

function Grounding() {
  const steps = [['5', '👀', 'things you can see'], ['4', '🖐️', 'things you can feel'], ['3', '👂', 'things you can hear'], ['2', '🌿', 'things you can smell'], ['1', '🍵', 'thing you can taste']]; const [active, setActive] = useState(-1); const [answers, setAnswers] = useState({});
  return <section className="card ground-card"><span className="eyebrow">5–4–3–2–1</span><h2>Grounding, one sense at a time.</h2><p className="muted">If you feel scattered, gently notice what is around you.</p><div className="ground-progress"><span style={{ width: `${active < 0 ? 0 : ((active + 1) / steps.length) * 100}%` }}/></div>{steps.map(([num, icon, label], i) => <div className={'sense ' + (active === i ? 'active' : i < active ? 'done' : '')} key={num}><b>{num}</b><span>{icon}</span><div><strong>{label}</strong>{active === i ? <input autoFocus value={answers[num] || ''} onChange={e => setAnswers({ ...answers, [num]: e.target.value })} placeholder="Optional — name a few…"/> : <p>{answers[num] || (i < active ? 'Noticed ✓' : 'Tap to focus here')}</p>}</div><button onClick={() => setActive(i)} aria-label={`Focus on ${label}`}><Icon name="chevron" size={16}/></button></div>)}<button className="secondary fullish" onClick={() => { setActive(-1); setAnswers({}); }}>Start again</button></section>;
}

function Habits({ habits, setHabits }) {
  const [adding, setAdding] = useState(false); const [name, setName] = useState(''); const [icon, setIcon] = useState('🌱'); const [editing, setEditing] = useState(null);
  function toggle(id) { const day = todayKey(); const next = habits.map(h => h.id === id ? { ...h, completed: (h.completed || []).includes(day) ? (h.completed || []).filter(x => x !== day) : [...(h.completed || []), day] } : h); setHabits(next); save('auraHabits', next); }
  function saveHabit() { if (!name.trim()) return; let next; if (editing) next = habits.map(h => h.id === editing ? { ...h, name: name.trim(), icon } : h); else next = [...habits, { id: uid('habit'), name: name.trim(), icon, streak: 0, completed: [] }]; setHabits(next); save('auraHabits', next); setName(''); setIcon('🌱'); setEditing(null); setAdding(false); }
  function remove(id) { const next = habits.filter(h => h.id !== id); setHabits(next); save('auraHabits', next); }
  function streak(h) { let count = 0; const completed = new Set(h.completed || []); const d = new Date(); if (!completed.has(todayKey(d))) d.setDate(d.getDate() - 1); while (completed.has(todayKey(d)) && count < 365) { count++; d.setDate(d.getDate() - 1); } return count || h.streak || 0; }
  const today = todayKey(); const done = habits.filter(h => (h.completed || []).includes(today)).length;
  return <><PageTitle eyebrow="MICRO-GOALS" title="Small habits count." subtitle="Keep it kind and doable. There is no penalty for being human."/><div className="habit-header"><div><strong>{done}/{habits.length}</strong><span>small steps today</span></div><button className="primary" onClick={() => { setAdding(true); setEditing(null); setName(''); setIcon('🌱'); }} disabled={habits.length >= 4}><Icon name="plus" size={16}/> Add habit</button></div><div className="habit-list">{habits.map(h => { const isDone = (h.completed || []).includes(today); return <div className={'card habit ' + (isDone ? 'done' : '')} key={h.id}><button className="habit-check" onClick={() => toggle(h.id)} aria-label={isDone ? `Mark ${h.name} incomplete` : `Mark ${h.name} complete`}>{isDone ? '✓' : ''}</button><div className="habit-icon">{h.icon}</div><div className="habit-info"><h3>{h.name}</h3><p>{isDone ? 'Done for today — nicely done.' : 'A small step is still a step.'}</p></div><div className="streak"><strong>{streak(h)}</strong><span>day streak</span></div><div className="habit-actions"><button onClick={() => { setAdding(true); setEditing(h.id); setName(h.name); setIcon(h.icon); }} aria-label={`Edit ${h.name}`}><Icon name="edit" size={15}/></button><button onClick={() => remove(h.id)} aria-label={`Delete ${h.name}`}><Icon name="trash" size={15}/></button></div></div>})}</div>{adding && <div className="modal-backdrop" onClick={() => setAdding(false)}><div className="modal card" onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">{editing ? 'EDIT HABIT' : 'NEW HABIT'}</span><h2>{editing ? 'Make a small change.' : 'Choose something tiny.'}</h2></div><button onClick={() => setAdding(false)}>×</button></div><label>Habit name<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 10 min walk"/></label><label>Icon<input value={icon} onChange={e => setIcon(e.target.value.slice(0, 2))} placeholder="🌱"/></label><div className="modal-actions"><button className="secondary" onClick={() => setAdding(false)}>Cancel</button><button className="primary" onClick={saveHabit}>{editing ? 'Save changes' : 'Add habit'} <Icon name="arrow" size={15}/></button></div></div></div>}{!habits.length && <div className="card empty"><div>🌱</div><h3>A blank page can be a beginning.</h3><p>Add one tiny habit when you're ready.</p></div>}<div className="card gentle-note"><Icon name="heart" size={18}/><div><b>Keep goals tiny.</b><p>AURA is designed around consistency without shame. Missing a day does not erase the work you've already done.</p></div></div></>;
}

function LineChart({ moods }) {
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return { key: todayKey(d), label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3), day: d.getDate() }; });
  const values = days.map(d => moods[d.key]?.mood ?? null); const points = values.map((v, i) => v == null ? null : `${(i / 13) * 100},${100 - ((v - 1) / 4) * 100}`).filter(Boolean).join(' ');
  return <div className="line-chart"><div className="chart-y"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span></div><div className="chart-main"><div className="grid-lines">{[1,2,3,4,5].map(x => <span key={x}/>)}</div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Mood over the last 14 days">{points && <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}{values.map((v, i) => v ? <circle key={i} cx={(i / 13) * 100} cy={100 - ((v - 1) / 4) * 100} r="1.8"/> : null)}</svg><div className="chart-labels">{days.map((d, i) => <span key={i}>{i % 2 === 0 ? `${d.label} ${d.day}` : ''}</span>)}</div></div></div>;
}

function CalendarHeatmap({ moods }) {
  const days = Array.from({ length: 35 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (34 - i)); return { key: todayKey(d), date: d, mood: moods[todayKey(d)]?.mood }; });
  return <div className="heatmap"><div className="heat-grid">{days.map(d => <div key={d.key} className={`heat-cell mood-${d.mood || 0}`} title={`${d.date.toLocaleDateString()}: ${d.mood ? MOODS[d.mood - 1].label : 'No check-in'}`} aria-label={`${d.key}, ${d.mood ? MOODS[d.mood - 1].label : 'No check-in'}`}/>)}</div><div className="heat-legend"><span>Less</span>{[0,1,2,3,4,5].map(n => <i key={n} className={`heat-cell mood-${n}`}/>) }<span>More</span></div></div>;
}

function Insights({ moods, habits }) {
  const entries = Object.entries(moods).sort(([a], [b]) => a.localeCompare(b)); const vals = entries.map(([, x]) => x.mood); const avg = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : '—'; const sleepDays = entries.filter(([,x]) => x.tags?.includes('Sleep')); const sleepAvg = sleepDays.length ? (sleepDays.reduce((a,[,x])=>a+x.mood,0)/sleepDays.length).toFixed(1) : null; const habitDone = habits.reduce((a,h)=>a+(h.completed?.length||0),0);
  let observations = [];
  if (!entries.length) observations.push(['✦', 'Start with a few check-ins.', 'After you log a handful of days, AURA can reflect simple patterns back to you.']);
  else { observations.push(['◒', `Your logged mood average is ${avg}.`, 'This is a simple reflection of what you chose to record, not a measure of your overall wellbeing.']); if (sleepAvg) observations.push(['☾', `Sleep-tagged days average ${sleepAvg}.`, 'You can keep noticing whether rest feels connected to how your days arrive.']); else observations.push(['☾', 'Log a few sleep tags to see this pattern.', 'When you add context tags, AURA can compare them with your mood.']); observations.push(['✓', `${habitDone} habit check-ins so far.`, 'Consistency can be built one small action at a time.']); }
  return <><PageTitle eyebrow="INSIGHTS" title="Notice patterns, without judging them." subtitle="AURA only reflects what you choose to log. It does not diagnose or predict anything."/><div className="insight-grid"><section className="card chart-card"><div className="section-head"><div><span className="eyebrow">MOOD OVER TIME</span><h2>Your recent check-ins</h2></div><span className="soft-pill">Avg {avg}</span></div><LineChart moods={moods}/><div className="chart-caption"><span>Last 14 days</span><span>{entries.length} total check-ins</span></div></section><section className="card observations"><span className="eyebrow">GENTLE OBSERVATIONS</span>{observations.map(([ic,title,body],i)=><div className="observation" key={i}><span>{ic}</span><div><b>{title}</b><p>{body}</p></div></div>)}</section></div><section className="card calendar-card"><div className="section-head"><div><span className="eyebrow">MOOD CALENDAR</span><h2>A month of small check-ins.</h2></div><span className="soft-pill">Recent 35 days</span></div><CalendarHeatmap moods={moods}/></section></>;
}

function Resources() {
  return <><PageTitle eyebrow="SUPPORT HUB" title="You don't have to hold everything alone." subtitle="These resources are always available. If something feels urgent or unsafe, please reach out to a person or service that can help."/><section className="card crisis"><div className="crisis-icon"><Icon name="heart" size={23}/></div><div><span className="eyebrow">INDIA · 24/7</span><h2>Tele-MANAS</h2><p>Free government mental-health support. Call <strong>14416</strong> or <strong>1800-89-14416</strong>.</p><a href="https://dghs.mohfw.gov.in/national-mental-health-programme.php" target="_blank" rel="noreferrer">Official Government information ↗</a></div></section><div className="resource-grid"><article className="card resource"><span className="resource-num">01</span><h3>If you are in immediate danger</h3><p>Contact your local emergency service or go to the nearest emergency department. If possible, stay with someone you trust.</p></article><article className="card resource"><span className="resource-num">02</span><h3>Professional support</h3><p>A qualified mental-health professional can offer personalized care. AURA is not a substitute for professional care.</p><a href="https://www.mohfw.gov.in/" target="_blank" rel="noreferrer">Ministry of Health & Family Welfare ↗</a></article><article className="card resource"><span className="resource-num">03</span><h3>For U.S. users</h3><p>Call or text <strong>988</strong> for the 988 Suicide & Crisis Lifeline, available 24/7 in the U.S. and its territories.</p><a href="https://988lifeline.org/" target="_blank" rel="noreferrer">988 Lifeline ↗</a></article></div><section className="card privacy-panel"><div className="privacy-icon"><Icon name="shield"/></div><div><span className="eyebrow">PRIVACY & DATA</span><h2>Your data stays close.</h2><p>This demo stores AURA data in this browser's local storage. It is not uploaded to a server or shared with advertisers.</p><div className="privacy-actions"><button className="secondary" onClick={() => { const data = { exportedAt: new Date().toISOString(), moods: load('auraMoods', {}), journal: load('auraJournal', []), habits: load('auraHabits', []) }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `aura-data-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url); }}><Icon name="download" size={15}/> Export my data</button><button className="danger-outline" onClick={() => { if (window.confirm('Clear mood, journal, and habit data from this browser?')) { ['auraMoods','auraJournal','auraHabits'].forEach(k=>localStorage.removeItem(k)); window.location.reload(); } }}>Clear wellness data</button></div></div></section><div className="disclaimer">AURA is a self-care and journaling tool. It does not diagnose, treat, or replace professional mental-health care. If you are concerned about your safety, seek immediate human support.</div></>;
}

function App() {
  const [session, setSession] = useState(() => load('auraSession', null)); const [view, setView] = useState('home'); const [dark, setDark] = useState(() => load('auraDark', false)); const [moods, setMoods] = useState(() => load('auraMoods', {})); const [journal, setJournal] = useState(() => load('auraJournal', [])); const [habits, setHabits] = useState(() => load('auraHabits', DEFAULT_HABITS));
  useEffect(() => { save('auraDark', dark); document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { if (!localStorage.getItem('auraHabits')) save('auraHabits', habits); }, []);
  if (!session) return <Auth onLogin={setSession}/>;
  const logout = () => { localStorage.removeItem('auraSession'); setSession(null); setView('home'); };
  let page = view === 'home' ? <Home moods={moods} setMoods={setMoods} journal={journal} habits={habits} setView={setView}/> : view === 'journal' ? <Journal journal={journal} setJournal={setJournal}/> : view === 'breathe' ? <Breathing/> : view === 'habits' ? <Habits habits={habits} setHabits={setHabits}/> : view === 'insights' ? <Insights moods={moods} habits={habits}/> : <Resources/>;
  return <Layout user={session} view={view} setView={setView} onLogout={logout} dark={dark} setDark={setDark}>{page}</Layout>;
}

createRoot(document.getElementById('root')).render(<App/>);
