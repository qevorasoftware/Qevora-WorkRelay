# Qevora WorkRelay

**One workspace. Clear requests. Faster approvals.**

A client collaboration and project delivery platform for web design agencies — rebuilt with an **Apple pure minimal** design language: white canvas, hairline borders, SF-style typography, one accent color, zero decoration.

> 📄 Product documentation: [`Qevora_WorkRelay_Complete_Project_Documentation_v1.3_Workflow_Chart.docx`](./Qevora_WorkRelay_Complete_Project_Documentation_v1.3_Workflow_Chart.docx)

## Design language

| Principle | How it shows up |
|-----------|----------------|
| Chrome disappears | Hairlines + whitespace do the work; the only translucency is the sidebar/topbar chrome (macOS-style) |
| One accent | Apple blue `#0071E3` (dark: `#0A84FF`) — primary actions and key status only |
| Type carries it | System font stack (`-apple-system`/SF), semibold tracking-tight headings, Apple gray hierarchy `#1D1D1F / #6E6E73 / #86868B` |
| Lists over card grids | iCloud-style divided rows with chevrons, not decorated tiles |
| Motion is feedback only | 150/250ms Apple easing; no ambient loops, no page-load theatrics |
| Light default, true dark | `#F5F5F7` canvas + white cards / `#000` + `#1C1C1E`, follows doc §7 |

## Features (Documentation §11 P1)

Overview dashboard (stats, delivery pulse chart, needs attention) · Projects + detail · Requests (create, status flow, visibility) · Approvals (decisions + history timeline) · Chat (replies, reactions, search) · Files (drag-drop upload simulation, preview) · Clients · Notifications · Settings (theme, density) · Client portal with privacy boundary · ⌘K command palette

## Stack (Documentation §8)

React 19 + TypeScript · Vite 7 · Tailwind CSS 4 · Radix UI · Motion · Zustand · Lucide · Zod · Vitest

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm test         # unit tests (stores, privacy boundary, theme)
```

## Deploy (Documentation §15)

Static build → GitHub Pages via `.github/workflows/deploy-pages.yml` (base path `/Qevora-WorkRelay/`, HashRouter). Netlify/Vercel work too — output is `dist/`.

Data is mocked in `src/mocks/` (frontend-first phase). `src/services/` adapters are the future backend boundary.

---

© 2026 Qevora Software · MIT License
