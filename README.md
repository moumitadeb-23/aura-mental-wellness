# AURA — Daily Wellness Companion 🌿

<p align="center">
  <strong>A calm, privacy-first space for mood awareness, reflection, breathing, and small habits.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="docs/DEPLOYMENT.md">Deploy</a> ·
  <a href="docs/PRIVACY.md">Privacy</a> ·
  <a href="#safety-boundary">Safety</a>
</p>

## Overview

**AURA** is a responsive React/Vite self-care and journaling web app designed to help people build small, consistent habits around mood awareness, reflection, breathing, grounding, and everyday wellness.

AURA is intentionally **non-clinical**. It does not diagnose, treat, or replace professional mental-health care.

> **Live demo:** add your deployed URL here after deployment.

## ✨ Features

### 🌤️ Today
- Quick 1–5 mood check-in.
- Optional context tags such as sleep, work, social, health, study, exercise, and rest.
- Optional mood note.
- Gentle daily overview.

### 📔 Journal
- Free-form private reflections.
- Rotating guided prompts.
- Search, edit, and delete entries.
- Timestamps and browser-local persistence.

### 🌬️ Breathe & Ground
- Box breathing.
- Calm 4–6 breathing.
- 4–7–8 breathing.
- Animated visual breathing pacer.
- Interactive 5–4–3–2–1 grounding flow.

### 🌱 Habits
- Add up to four micro-habits.
- Edit or remove habits.
- Daily completion history.
- Automatic streaks without shame-based messaging.

### 📊 Insights
- Recent mood trend visualization.
- Calendar-style mood history.
- Gentle observations based only on information the user chooses to log.
- No diagnosis or prediction.

### 🆘 Support
- Persistent in-app access to support resources.
- India Tele-MANAS information.
- U.S. 988 Suicide & Crisis Lifeline information.
- Professional-support guidance.
- Support is not gated behind a wellness-data feature.

### 🔒 Privacy
- No analytics.
- No ads.
- No third-party trackers.
- Browser-local demo storage.
- JSON data export.
- Local wellness-data clearing.
- Clear explanation of the demo's security limitations.

### 📱 Accessibility & responsive design
- Mobile-first layouts.
- Mobile bottom navigation.
- Keyboard-friendly controls.
- Semantic labels and accessible button names.
- Reduced-motion support.
- Light and dark themes.

## 🛠️ Tech stack

- **React**
- **Vite**
- **JavaScript (ES modules)**
- **CSS**
- **Browser localStorage** for the demo
- **GitHub Actions** for build verification
- Deployment-ready for **Vercel** or **Netlify**

No external database, analytics SDK, advertising script, or AI service is required for the current demo.

## 📁 Project structure

```text
aura-mental-wellness/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── dependabot.yml
│   └── workflows/ci.yml
├── docs/
│   ├── DEPLOYMENT.md
│   ├── GITHUB_SETUP.md
│   └── PRIVACY.md
├── src/
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── .nvmrc
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── netlify.toml
├── package.json
├── README.md
├── SECURITY.md
└── vercel.json
```

## 🚀 Quick start

### Requirements

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open the local URL shown by Vite.

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🐙 GitHub

Recommended repository name:

`aura-mental-wellness`

For the complete first-push checklist, see [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md).

The repository includes a GitHub Actions workflow that installs dependencies and verifies the production build on pushes and pull requests.

## 🌐 Deployment

AURA is ready for a static Vite deployment.

- **Vercel:** import the GitHub repository and deploy. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
- **Netlify:** import the GitHub repository; the included `netlify.toml` defines the build settings.

After deployment, add the public URL to the **Live demo** line near the top of this README.

## 🔐 Privacy architecture

The current demo uses browser `localStorage` for:

- Demo account/session information.
- Mood check-ins.
- Journal entries.
- Habit data.
- Theme preference.

The demo does not send those values to an AURA server.

**Important:** this is not production-grade security. The demo stores passwords locally to demonstrate authentication. Do not use real passwords or sensitive personal information in a public demo. For production, replace the local authentication/storage layer with secure server-side authentication, authorization, encrypted storage, data export/deletion, and an appropriate privacy policy.

Read [`docs/PRIVACY.md`](docs/PRIVACY.md) for the full direction.

## 🛡️ Safety boundary

AURA is a **self-care and journaling tool**, not a diagnostic or treatment service.

It must not:

- Diagnose mental-health conditions.
- Present wellness trends as medical conclusions.
- Claim to replace therapy, medical care, or crisis services.
- Provide AI-generated clinical mental-health advice.
- Gate crisis resources behind account creation.

If someone is in immediate danger, they should contact local emergency services or an appropriate crisis resource. AURA's Support section provides prominent resource information, including India Tele-MANAS and the U.S. 988 Lifeline.

## 🧪 Testing checklist

Before a release, test:

- [ ] Create account.
- [ ] Sign in / sign out.
- [ ] Invalid credentials and validation states.
- [ ] Mood check-in with tags and note.
- [ ] Mood history and chart.
- [ ] Journal create/search/edit/delete.
- [ ] All breathing patterns and animation.
- [ ] Grounding exercise.
- [ ] Habit create/edit/delete/complete.
- [ ] Streak calculation.
- [ ] Insights.
- [ ] Support links.
- [ ] Dark mode.
- [ ] Mobile navigation.
- [ ] Keyboard navigation.
- [ ] Reduced-motion behavior.
- [ ] Refresh/persistence behavior.
- [ ] Production build with `npm run build`.

## 🗺️ Roadmap

### V2 — Current
- [x] Mood check-ins
- [x] Journal
- [x] Breathing
- [x] Grounding
- [x] Micro-habits
- [x] Insights
- [x] Support hub
- [x] Dark mode
- [x] Responsive navigation
- [x] Demo authentication
- [x] Privacy controls
- [x] GitHub CI
- [x] Deployment configuration

### V3 — Production direction
- [ ] Secure authentication
- [ ] Server-side data storage
- [ ] Per-user authorization
- [ ] Encrypted sensitive data
- [ ] Account deletion and export workflows
- [ ] Production privacy policy and terms
- [ ] Automated accessibility testing
- [ ] End-to-end tests
- [ ] Monitoring that respects privacy

## 📄 Documentation

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — development and contribution rules.
- [`SECURITY.md`](SECURITY.md) — current security limitations and production requirements.
- [`docs/PRIVACY.md`](docs/PRIVACY.md) — data-storage explanation and production privacy direction.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Vercel and Netlify deployment.
- [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md) — repository setup and release checklist.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — community expectations.

## License

MIT. See [`LICENSE`](LICENSE).

---

**AURA — small check-ins, quiet reflection, gentle progress. 🌿**
