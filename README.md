# Qevora WorkRelay

**One workspace. Clear requests. Faster approvals.**

A premium client collaboration and project delivery platform for web design agencies — built as a clickable frontend MVP with Apple-inspired **Liquid Glass** design, light/dark themes, team & client chat, and a privacy-aware client portal.

> 📄 Full product documentation: [`Qevora_WorkRelay_Complete_Project_Documentation_v1.3_Workflow_Chart.docx`](./Qevora_WorkRelay_Complete_Project_Documentation_v1.3_Workflow_Chart.docx)

---

## ✨ What's inside (MVP scope — Documentation §11)

| Area | What works |
|------|-----------|
| **Overview** | Stat cards, project health, approval blockers, filterable recent activity |
| **Projects** | Search, status filters, project detail with tabs (overview / requests / approvals / files) |
| **Requests** | Create with validation (Zod), owner + due date, visibility (client/internal), status flow |
| **Approvals** | Approve / request changes with comments, full decision history timeline |
| **Chat** | Conversations, demo message send, replies, emoji reactions, search, typing indicator |
| **Files** | Drag-and-drop upload simulation, preview modal, version labels |
| **Clients** | Client list and **client portal** with privacy boundary (internal items hidden) |
| **Notifications** | Unread badges, popover + page, mark read, deep links |
| **Settings** | Light/Dark/System theme, compact density, profile & preference demos |
| **Command palette** | ⌘K / Ctrl+K — Spotlight-style search + quick actions |

**Privacy boundary (§11 DoD):** the client portal (`/portal`) shows *only* client-visible requests, files, approvals and project chats — internal notes and internal conversations never appear. Client actions (provide content, approve, request changes) update the same workspace state.

## 🎨 Design system (Documentation §6–7)

- **Liquid Glass** accent material: translucent navigation, top bar, popovers and modals; dense content stays on solid surfaces for readability
- Exact documented tokens — light `#F3F5FA` / dark `#0A1020`, accent `#6558D3` / `#A99BFF`
- Theme persistence via `localStorage`, system preference sync, no flash on load
- `prefers-reduced-motion` and `prefers-reduced-transparency` fallbacks

## 🛠 Tech stack (Documentation §8)

React 19 + TypeScript · Vite 7 · Tailwind CSS 4 · Radix UI primitives · Motion (`motion/react`) · Zustand · Lucide React · Zod · Vitest + Testing Library

## 🚀 Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc`) + production build |
| `npm test` | Vitest suite (stores, privacy boundary, theme persistence) |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

## 📁 Structure (Documentation §10)

```
src/
├── app/            # App shell, router, providers
├── components/
│   ├── ui/         # Buttons, dialogs, tabs, badges… (Radix primitives)
│   ├── glass/      # Liquid Glass panel primitive
│   ├── layout/     # Sidebar, topbar, command palette, toaster
│   └── feedback/   # Error boundary, toasts
├── features/       # dashboard, projects, requests, approvals,
│   ├──             # chat, clients, files, notifications, settings, portal
├── mocks/          # Seeded demo data (users, projects, requests…)
├── stores/         # Zustand: theme, workspace, chat, ui
├── services/       # Mock API adapters (future backend boundary — §9)
├── lib/            # cn(), dates, Zod validation schemas
├── styles/         # tokens.css, glass.css, globals.css
└── types/
```

## 🔭 What's intentionally mock (§1 scope)

This is the **frontend-first phase**: all data is seeded in `src/mocks/` and lives in Zustand state (resets on reload). Auth, realtime transport, secure file storage, and billing arrive in the backend phase (§15) — the `src/services/` adapters are the swap point.

## ☁️ Deploy (§15)

The build is fully static:

```bash
npm run build      # outputs dist/
```

- **GitHub Pages**: set Vite `base` to the repo path, publish `dist/`
- **Netlify / Vercel / Cloudflare Pages**: framework = Vite, output = `dist`

Never place real credentials, private client data, or secret API keys in this frontend-only demo.

---

© 2026 Qevora Software · MIT License
