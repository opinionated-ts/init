---
description: "Product scope and boundaries of the repository-generation package."
folderDescription: "Standalone package for creating local repositories from composable Opinionated TS project resources."
trigger: "Relevant to product scope, supported project types, generated-project ownership, and package boundaries."
---

# Product scope

- `@opinionated-ts/init` is an independent repository-creation CLI with a reusable programmatic API.
- Keep it focused on creating repositories; the future general Opinionated TS CLI may reuse its API alongside other capabilities.
- Keep generated projects self-contained and independent of this package after creation.

# Version 1

- Generate `package` projects only.
- Add `web` only when its generation resources and behavior are implemented.
- Compose output from selected files and fragments; never copy complete template repositories.

# Boundaries

- Generate files in a local destination, initialize Git on main, create one Conventional Commit, and add the v0.0.0 tag.
- Do not install dependencies or create remote repositories, configure remotes, or push.
- Keep remote repository creation out of version 1; a future feature may use the authenticated gh CLI.
- Keep generated dependencies and configuration owned by the generated project.
