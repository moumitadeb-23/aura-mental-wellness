# AURA Deployment Guide 🚀

AURA is a Vite single-page application. The project includes deployment configuration for both Vercel and Netlify.

## Option A — Vercel (recommended)

### 1. Push the project to GitHub

Create a repository such as `aura-mental-wellness`, then from the project folder run:

```bash
git init
git add .
git commit -m "feat: initial AURA V2 release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aura-mental-wellness.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Import into Vercel

In Vercel, choose **Add New → Project**, import the GitHub repository, and deploy.

The repository already contains `vercel.json`. The expected settings are:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20+

### 3. Verify

After deployment, test registration, login, mood logging, journaling, breathing, habits, insights, dark mode, and support links on both desktop and mobile.

## Option B — Netlify

Import the same GitHub repository into Netlify.

`netlify.toml` already defines:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 20

## Local production check

Before deploying, run:

```bash
npm install
npm run build
npm run preview
```

## Custom domain

After the first successful deployment, connect your own domain in the hosting provider's domain settings. Then enable HTTPS and verify the final URL from a private/incognito browser window.

## Production warning

The current AURA V2 authentication is a demo-only localStorage flow. Do not market the deployed demo as secure account storage. For a real client launch, add a production backend/authentication layer before collecting real wellness or journal data.
