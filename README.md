# Svelte Form Monorepo

A monorepo for `sv-kit-form` - a lightweight form library for SvelteKit built with Svelte 5 runes.

## Structure

```
svelte-form/
├── packages/
│   ├── sv-kit-form/     # The core form library
│   └── demo/             # Demo SvelteKit app
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development

Run the demo app (automatically uses the local form library):

```bash
pnpm dev
```

Or run the library in watch mode:

```bash
pnpm dev:lib
```

### Build

Build the library:

```bash
pnpm build
```

Build the demo:

```bash
pnpm build:demo
```

## Packages

### sv-kit-form

The core form library with Svelte 5 runes. Located in `packages/sv-kit-form/`.

Features:
- 🚀 Built with Svelte 5 runes
- 📝 Simple validation
- 🎯 TypeScript support
- ⚡ Zero dependencies

See [packages/sv-kit-form/README.md](packages/sv-kit-form/README.md) for detailed documentation.

### demo

A SvelteKit app showcasing how to use `sv-kit-form`. Located in `packages/demo/`.

## Publishing

To publish the library to npm:

1. Update the version in `packages/sv-kit-form/package.json`
2. Build the library: `pnpm build`
3. Publish: `pnpm publish:lib`

Or use changesets for versioning:

```bash
pnpm changeset
pnpm changeset version
pnpm publish:lib
```

## Development Workflow

1. Make changes to the library in `packages/sv-kit-form/src/`
2. The demo app will automatically pick up changes via workspace linking
3. Test your changes in the demo app
4. Build and publish when ready

## GitHub Setup

To use this library in other projects from GitHub:

```bash
pnpm add github:yourusername/svelte-form#workspace=sv-kit-form
```

Or after publishing to npm:

```bash
pnpm add sv-kit-form
```
