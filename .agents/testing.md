# Testing

## Framework

- **Jest** with **SWC** compiler for fast test execution
- Tests are organized in `test/` directories within each package

## Commands

```bash
# Run all tests across the monorepo
npm run test

# Run tests for a specific package
npm run test --workspace=packages/core
npm run test --workspace=packages/mtb
npm run test --workspace=packages/rd
```

## Prerequisites

Before running tests, ensure all packages are built:

```bash
npm run build
```

This is required because packages depend on each other's build output.

## Test File Conventions

- Test files use the `.spec.ts` extension
- Tests live in a `test/` directory within each package
- Mirror the source structure inside `test/` directories

## Writing Tests

- Import from the package's public API (the `src/index.ts` barrel export)
- Use TypeScript with ESM syntax
- Follow existing test patterns in the package you're modifying
