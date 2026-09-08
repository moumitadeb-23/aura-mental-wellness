# GitHub Setup Checklist 🐙

## Recommended repository name

`aura-mental-wellness`

## First push

Run these commands from the AURA project folder:

```bash
git init
git add .
git commit -m "feat: launch AURA V2"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aura-mental-wellness.git
git push -u origin main
```

## Repository settings

Recommended GitHub settings:

- Add a short repository description: `A calm, privacy-first daily wellness companion built with React and Vite.`
- Add topics: `react`, `vite`, `wellness`, `journaling`, `mood-tracker`, `accessibility`, `privacy-first`
- Set the repository homepage to the deployed AURA URL once available.
- Enable the included GitHub Actions workflow.
- Enable Dependabot version updates.
- Add a real security contact before public release.

## Release checklist

- [ ] `npm run build` passes locally.
- [ ] GitHub Actions build passes.
- [ ] README has the live demo URL.
- [ ] Screenshots are current and contain no real private data.
- [ ] No `.env` files, passwords, tokens, or personal data are committed.
- [ ] Privacy and security limitations are clearly documented.
- [ ] Support/crisis links are tested.
