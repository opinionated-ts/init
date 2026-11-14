---
description: "Application source architecture and module boundaries."
folderDescription: "CLI, configuration, localization, generic file generation, and shared and type-specific project composition."
trigger: "Relevant when changing source modules, public API boundaries, or dependencies between application areas."
---

# Modules

- `cli/` adapts terminal input and output to the application API.
- `config/` loads, validates, and normalizes user configuration.
- `i18n/` owns locale catalogs shared by all application entry points.
- `project/` composes shared project defaults with project-type-specific output.
- `generation/` validates destinations, writes file plans, and initializes local Git.

# Application flow

- Expose the reusable creation API through `src/index.ts`.
- Route CLI and programmatic calls through the same normalized configuration and project pipeline.
- Let `project/` resolve shared tooling and compose the selected project type.
- Pass the resulting deterministic file plan to `generation/`.

# Boundaries

- Keep terminal interaction in `cli/` and user-facing text in `i18n/`.
- Keep configuration parsing and validation in `config/`.
- Keep shared runtimes, validation setup, and common generated files in `project/`.
- Keep project-specific additions under `project/<type>/`; reuse shared defaults instead of duplicating them.
- Keep filesystem writes and Git operations in `generation/`.
- Create the initial Conventional Commit and v0.0.0 tag only after successful file generation; do not install dependencies.
- Do not make generated projects depend on this package or its API.
