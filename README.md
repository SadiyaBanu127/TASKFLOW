# Taskflow

Taskflow is a frontend-only task management dashboard built with React, TypeScript, Vite, and Tailwind CSS. This repository currently contains the responsive Phase 1 workspace shell and dashboard. Task and project management features are planned for later development phases and are not represented as complete yet.

## Current features

- Responsive dashboard layout with mobile navigation drawer.
- Workspace navigation for the planned task, board, project, calendar, analytics, and settings sections.
- Collapsible desktop sidebar with its preference saved in local storage.
- Light and dark appearance toggle with its preference saved in local storage.
- Keyboard shortcut `Ctrl+K` or `⌘K` to open search; `Escape` closes popovers.
- Dashboard empty states for a new workspace.
- Vercel configuration for Vite builds and React Router SPA route fallback.

## Technology

- React 18 and TypeScript
- Vite 6
- Tailwind CSS 3
- React Router DOM
- Lucide React
- Recharts (for upcoming chart features)

## Requirements

- Node.js 20 or later
- npm

## Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Keep the detected Vite framework settings: install with `npm install`, build with `npm run build`, and output from `dist`.
4. Deploy. `vercel.json` sends client-side routes to the Vite entry page so direct navigation and refreshes work.

You can also deploy with the Vercel CLI:

```bash
npm install --global vercel
vercel
```

## Project structure

```text
src/
  App.tsx       Application shell and Phase 1 dashboard
  index.css     Tailwind layers and responsive design system
  main.tsx      React entry point and router setup
index.html      Vite HTML entry point
vercel.json     Vercel build settings and SPA route fallback
```

## Roadmap

Task CRUD and local persistence, Kanban drag-and-drop, project management, calendar, analytics, profile settings, demo authentication, and automated tests are planned for later phases.
