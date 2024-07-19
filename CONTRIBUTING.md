# Contributing
Thanks for your interest in helping out 🙌! Here are a few key informations.

## Description
- The project is set as `pnpm` workspaces monorepo. 
- Uses `vite` for bundling and
- Uses `vitest` and `@vue/test-utils` for unit testing. 
- Uses `biomejs` for linting/formatting.
- Uses `changesets` for changelog/version/release management.

### Setup
Clone the repo and

```
pnpm install
```

### Work

1. Create a branch for your feature
1. Start dev server
    ```
    pnpm teleporte dev
    ```

1. Ensure current tests still pass and add new ones for the feature/fix.

    ```
    pnpm teleport test:unit
    ```
1. Add a descriptive changeset (optional)
   ```
    pnpm changeset add
   ```

### Play
If you want to see it visually working.

```
pnpm playground dev
```
