# Security Policy

## Scope

AURA V2 is currently a front-end demonstration that stores demo account and wellness data in the browser's localStorage.

This architecture is **not suitable for production authentication or sensitive wellness-data storage**.

## Reporting a security issue

Please do not publish credentials, private journal content, personal data, or an exploit demonstration in a public issue.

For a real deployment, configure a private security reporting channel in the GitHub repository (for example, GitHub private vulnerability reporting) and replace the contact details below with the maintainer's monitored security address.

**Maintainer contact:** replace this line with the project's security email before public release.

## Production security roadmap

Before handling real accounts or sensitive wellness information:

- Use a trusted authentication provider or secure server-side authentication.
- Never store plaintext passwords in browser storage or a database.
- Use secure, short-lived sessions and appropriate CSRF/XSS protections.
- Encrypt sensitive data in transit and at rest.
- Minimize collected data.
- Provide account deletion and data export.
- Define retention and backup policies.
- Add audit logging for administrative access.
- Review the privacy notice and applicable legal requirements before launch.
