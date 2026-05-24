# Smaajobber Project Guidelines

## Language

This is a **Norwegian-language application**. All user-facing text, UI labels, field names, and domain identifiers must stay in Norwegian. Examples:
- Type fields: `tittel`, `beskrivelse`, `kategori`, `sted`, `dato`, `pris`, `enhet`, `rolle`, `navn`
- Screen names: `'landingsside'`, `'se_oppdrag'`, `'legg_ut_oppdrag'`, `'dashbord'`, `'finn_hjelper'`
- Do **not** translate Norwegian identifiers into English when adding or editing code.

Code comments and developer-facing strings may be in English.

## Architecture & Component Patterns

- **Functional components only** — no class components.
- **State is centralized in `App.tsx`**. Lift state up; do not introduce local state that should live in the parent.
- **Navigation** is handled via an `onNavigate(screen: Screen, transition?)` callback prop — do not introduce React Router or any client-side routing library.
- Transition types are `'push'`, `'push_back'`, and `'slide_up'` as defined in `App.tsx`.
- New screens must be added to the `Screen` union type in `src/types.ts`.
- Shared domain types (`Oppdrag`, `Hjelper`, `ChatMessage`, `Screen`) live in `src/types.ts` — add new shared types there, not inline.

## Tech Stack — Use What's Already Here

Do not introduce new libraries when an existing one covers the need:

| Need | Use |
|------|-----|
| Animations / transitions | `motion` (Motion.js) |
| Icons | `lucide-react` |
| Styling | Tailwind CSS 4 (utility classes + `index.css` custom classes) |
| AI features | `@google/genai` |

- Use the `.nordic-card` CSS class for card-style UI elements.
- Accent color: `#005cbd`. Background: `#f9f9f9`. Text: `#1b1b1b`.
- Fonts: `Inter` (body), `Plus Jakarta Sans` (display headings), `JetBrains Mono` (code).

## TypeScript

- **No `any` types.** Use proper types or `unknown` with narrowing.
- All shared interfaces and types belong in `src/types.ts`.
- The project targets ES2022 / ESNext modules — use modern syntax.

## Security (High Priority)

Apply these rules rigorously on every change:

### Secrets & Credentials
- **Never hardcode API keys, tokens, or credentials** in source files. All secrets must be loaded from environment variables at runtime.
- `.env` files must be listed in `.gitignore` — never commit them.
- The Google AI API key used by `AIChatWidget.tsx` must come from an environment variable (e.g., `import.meta.env.VITE_GOOGLE_API_KEY`), never be inlined.

### Input & Output Safety
- **Sanitize all user input** before using it in queries, API calls, or rendering. Never pass raw user input directly to AI prompts without validation.
- Avoid `dangerouslySetInnerHTML`. If HTML rendering is required, sanitize with a trusted library (e.g., DOMPurify).
- When displaying user-generated content (oppdrag titles, descriptions), rely on React's default escaping — do not bypass it.

### API & Network
- The Express server in `server.js` serves only static files — do not add routes that expose sensitive data or allow unauthenticated writes.
- Validate and sanitize any query parameters or path segments on the server.
- Use HTTPS in production; do not downgrade connections.

### Dependencies
- Keep dependencies up to date. Flag any new dependency that is unmaintained, poorly scoped, or requests unnecessary permissions.

## Build & Dev

```bash
npm install          # install deps
npm run dev          # Vite dev server
npm run build        # production build → dist/
node server.js       # serve dist/ via Express (port $PORT or 8080)
```
