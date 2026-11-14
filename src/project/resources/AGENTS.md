---
description: "Shared generated files and fragments for all project types."
folderDescription: "Reusable static project files common across runtimes and project types."
trigger: "Relevant when adding or changing common generated files and resource composition."
---

# Resource design

- Store individual files and reusable fragments, never complete project snapshots.
- Keep resources shared across project types in `shared/`.
- Keep runtime-specific files with their implementation under `../toolchain/<runtime>/`.
- Keep type-specific files under `../<type>/resources/`.
- Associate optional resources with the feature or features that require them.
- Include a resource if at least one dependent feature is enabled; omit it when all dependent features are disabled.
- Apply the same rule to related dependencies and generated configuration files.
- Declare destinations, selection conditions, dependencies, or conflicts only when needed.
- Keep selection deterministic from normalized configuration.
- Generate minimal files for recommended defaults.

# Boundaries

- Keep shared scripts, hooks, and workflows in `../validation/`.
- Do not duplicate runtime-specific or project-type-specific files here.
- Leave filesystem writes to `../../generation/`.
