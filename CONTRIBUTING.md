# Contributing to AURA 🌿

Thank you for helping improve AURA.

## Development setup

1. Install Node.js 20 or newer.
2. Clone the repository.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Before opening a pull request, run:

```bash
npm run build
```

## Product principles

AURA is a self-care and journaling product, not a clinical or diagnostic service. Contributions should preserve:

- Calm, supportive, non-judgmental language.
- Privacy-first behavior and clear data ownership.
- Accessible keyboard and screen-reader experiences.
- Responsive mobile-first layouts.
- No advertising, third-party trackers, or unnecessary data collection.
- No diagnostic, treatment, or crisis-response claims from the product itself.

## Handling user data

Never add telemetry, analytics, advertising SDKs, or external data transmission without an explicit product/privacy review.

Do not place real user journal entries, mood records, passwords, API keys, or other sensitive information in source code, screenshots, issues, pull requests, or test fixtures.

## Pull requests

Keep changes focused. Explain what changed, how it was tested, and whether the change affects privacy, accessibility, safety, or deployment.
