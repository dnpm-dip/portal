# DNPM:DIP Portal - Agent Guide

The DNPM:DIP Portal is a modular web application for the German Network for Personalized Medicine (Deutsches Netzwerk für Personalisierte Medizin). It provides a user interface for managing and visualizing medical data across specialized domains such as Molecular Tumor Boards (MTB) and Rare Diseases (RD).

## Setup

- **Node.js**: `>=16.0.0` (tested on Node 22)
- **Package Manager**: npm with workspaces (monorepo)

### Commands

```bash
npm install                # Install dependencies and symlink packages
npm run build              # Build all packages (Nx dependency-ordered)
npm run test               # Run tests across all packages
npm run lint               # Lint all packages
npm run lint:fix           # Lint with auto-fix
npm run dev                # Start portal dev server (Nuxt HMR)
```

### Workspace-specific commands

```bash
npm run dev --workspace=packages/portal       # Dev server
npm run build --workspace=packages/core       # Build a specific package
npm run test --workspace=packages/mtb         # Test a specific package
```

## Documentation

Detailed guides are available in the `.agents/` directory:

- [Project Structure](.agents/structure.md) — Monorepo layout, packages, and dependency layers
- [Architecture](.agents/architecture.md) — Component architecture, state management, and data flow
- [Testing](.agents/testing.md) — Test setup, conventions, and commands
- [Conventions](.agents/conventions.md) — Tooling, coding standards, and workflow rules

## Commits

- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
