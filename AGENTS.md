# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript single-page application. The main interface lives in `src/App.tsx`; global tokens and Liquid Glass material rules are in `src/index.css`. Audio enhancement calculations belong in `src/audioEnhancement.ts`. Keep unit and UI tests next to source files as `*.test.ts` or `*.test.tsx`. Static assets are served from `public/`, including hero media in `public/generated/` and `public/motion-sites/`. GitHub Pages deployment is defined in `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands

- `npm run dev` starts the Vite development server on `127.0.0.1`.
- `npm test` runs the Vitest suite once.
- `npm run lint` checks TypeScript and React source with oxlint.
- `npm run build` runs the TypeScript build and produces `dist/`.
- `npm run preview -- --port 4173` serves the production build for local review.

Run `npm test`, `npm run lint`, and `npm run build` before pushing changes that affect the site.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Match the existing two-space indentation, single quotes, semicolons, and explicit type aliases for shared domain types. Use `PascalCase` for components, `camelCase` for variables and functions, and kebab-case for CSS classes and asset filenames, for example `liquid-glass-audio-bg-v2.png`.

Extend the existing Liquid Glass token system before adding one-off colors. Prefer neutral white edge reflections and translucency over colored borders. Keep responsive behavior in the existing CSS media queries.

## Testing Guidelines

Use Vitest with Testing Library for interaction and accessibility checks. Test user-visible behavior and material contracts when editing `App.tsx` or `index.css`; `src/liquidGlassMaterial.test.ts` is the reference for glass tokens and hero assets. Name tests as concise behavior statements, such as `uses frosted glass by default on mobile viewports`.

## Commit & Pull Request Guidelines

Use short imperative commits, for example `Refine liquid glass material` or `Add generated hero background`. Keep unrelated work out of the commit. Pull requests should explain the user-facing change, list validation commands, link relevant issues, and include desktop and mobile screenshots for visual changes.

## Deployment & Configuration

Pushing `main` triggers the GitHub Pages workflow, which runs install, test, lint, and build before publishing `dist/`. Do not commit API keys, generated temporary files, or local logs.
