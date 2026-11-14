---
description: "Shared project-generation composition and project-type boundaries."
folderDescription: "Common runtime tooling, validation, reusable files, and project-type-specific generators."
trigger: "Relevant when changing generated-project composition, shared defaults, or project-type integrations."
---

# Shared project foundation

- Keep defaults common to generated project types in this directory.
- Generate minimal editable local configuration files; do not use @opinionated-ts/config in version 1.
- Resolve runtime tools and exact runtime/package-manager versions in `toolchain/`.
- Generate common scripts, hooks, and workflows in `validation/`.
- Store cross-project generated files in `resources/shared/`.
- Keep project-type-specific behavior under its own directory, such as `package/`.

# Composition

- Start with the shared foundation selected from normalized configuration.
- Add only resources, dependencies, scripts, hooks, workflows, and permissions required by enabled features.
- If a resource serves multiple features, include it while at least one dependent feature is enabled; omit it when all are disabled.
- Add only the selected project type's files and script contributions.
- Let project types extend shared output instead of duplicating runtime or validation setup.
- Return one deterministic file plan to `generation/`.

# Boundaries

- Keep CLI interaction in `cli/` and configuration normalization in `config/`.
- Keep filesystem writes and Git initialization in `generation/`.
- Create a project-type directory only when that type is implemented.
- Keep generated projects independent of `@opinionated-ts/init`.
