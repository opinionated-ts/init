---
description: "Generic project file planning, writing, and local Git initialization."
folderDescription: "Project creation engine shared by all project-type composers."
trigger: "Relevant when changing file planning, destination handling, writes, or Git initialization."
---

# Creation pipeline

- Accept a deterministic file plan from `project/`.
- Validate destination paths and detect conflicts before writing.
- Write only planned files to the requested local destination.
- Initialize local Git on main after successful file generation.
- Create exactly one initial Conventional Commit and a v0.0.0 tag pointing to it.
- Do not install generated project dependencies.
- Keep filesystem and Git operations independent of CLI rendering.

# Boundaries

- Do not resolve user configuration, runtime compatibility, or project-specific files here.
- Keep project composition and generated content in `project/`.
- Do not create remote repositories or update existing projects.
- Do not add a runtime dependency from generated projects to `@opinionated-ts/init`.
