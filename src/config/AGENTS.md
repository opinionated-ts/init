---
description: "User configuration contract and normalization."
folderDescription: "JSON configuration schema, loading, validation, defaults, and normalized project options."
trigger: "Relevant when changing config-file support, configuration types, defaults, or validation."
---

# Configuration contract

- Keep one configuration contract for JSON input, wizard answers, and the programmatic API.
- Treat external input as untrusted; validate before generation.
- Derive TypeScript types from the runtime schema where practical.
- Apply recommended defaults to omitted properties and preserve explicit user choices.
- Reject unsupported values and incompatible combinations with actionable errors.

# Version 1 options

- Support package projects with Bun or Node.js; Bun is the recommended wizard default.
- Treat runtime and package manager as independent configuration options; validate their compatibility.
- Default Bun projects to Bun as package manager and Node.js projects to pnpm.
- Keep exact runtime and package-manager versions configurable through JSON; write them to engines and packageManager in generated package.json.
- Require package name and description; offer MIT, Apache-2.0, or no license.
- Allow formatter, linter, and test runner overrides independently.
- Allow JSON to select every supported option, including combinations omitted from the wizard.
- Enable CSpell, Commitlint, and Lefthook by default with independent opt-outs.
- Treat release.github and release.npm as independent features. Default GitHub Releases to enabled and npm publishing to disabled for both runtimes.
- Include Semantic Release only when at least one release target is enabled; disabling both removes all release support.
- Make every optional generated feature configurable through JSON.
- Allow pre-push validation to select tests or coverage.
- Generate minimal local tool configs; do not use @opinionated-ts/config in version 1.

# Boundaries

- Keep the schema and normalized configuration independent of Clack and filesystem writes.
- Do not encode terminal presentation or generated file contents in the schema.
- Pass normalized options to `project/`; do not resolve runtime commands or generate files here.
