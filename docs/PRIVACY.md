# AURA Privacy Notes 🔒

## Current demo architecture

AURA V2 is a browser-only demonstration. The app uses `localStorage` for its demo account/session, mood check-ins, journal entries, habit data, and theme preference.

That means the current demo does not send those values to an AURA server.

### Important limitation

Browser storage is not the same as production-grade secure storage. In particular, the demo authentication stores a password locally so the sign-in flow can be demonstrated. **Do not use real passwords or sensitive personal information in a deployed demo.**

## Production direction

A production AURA deployment should use:

1. Secure authentication with password hashing or a trusted identity provider.
2. Server-side authorization so users can access only their own records.
3. TLS/HTTPS for data in transit.
4. Encryption and access controls for stored wellness data.
5. Data export and account deletion.
6. Clear retention and backup policies.
7. Minimal data collection.
8. A reviewed privacy policy appropriate to the countries where AURA is offered.

## Safety boundary

AURA is a self-care and journaling companion. It should not present itself as a therapist, diagnostic system, medical device, or substitute for professional care.

Support and crisis resources should remain easy to reach and should never depend on a user's willingness to create an account.
