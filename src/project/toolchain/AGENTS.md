---
description: "Shared runtime and toolchain resolution for generated projects."
folderDescription: "Bun and Node.js defaults, supported tool overrides, command mappings, and runtime-specific generated files."
trigger: "Relevant when changing runtime defaults, tool support, compatibility, commands, or runtime-specific files."
---

# Runtime support

- Keep Bun and Node.js implementations separate under `bun/` and `node/`.
- Default Bun projects to Bun as runtime and package manager, with its formatter, linter, and test runner.
- Default Node.js projects to Node.js with pnpm, Oxfmt, Oxlint, and Vitest.
- Resolve runtime and package manager independently from normalized configuration, validate supported combinations, and preserve the runtime-specific defaults.
- Resolve exact runtime and package-manager versions from normalized configuration and write them to package.json engines and packageManager.
- Resolve formatter, linter, and test runner independently; JSON may select supported mixed combinations.
- Apply these shared runtime defaults to every project type.

# Type checking

- Use Bun's native type checker through `bun check --no-script` when a separate type-check command is required.
- Enable Oxlint `options.typeCheck` when Oxlint is selected and type validation is enabled.
- Avoid duplicate type checking when Oxlint includes type diagnostics.

# Audit

- Use `bun audit` and `bun audit fix` for Bun projects.
- Resolve Node.js audit commands from the configured package manager.

# Boundaries

- Own runtime defaults, tool compatibility, executable mappings, and runtime-specific file fragments.
- Pass resolved capabilities and commands to `../validation/`.
- Do not generate aggregate package scripts, hooks, or GitHub Actions here.
- Do not place project-type-specific behavior in runtime implementations.
