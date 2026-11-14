---
description: "Terminal interface and command-line adapter architecture."
folderDescription: "CLI argument handling, Clack wizard, and terminal feedback."
trigger: "Relevant when changing command parsing, interactive prompts, CLI output, or terminal flow."
---

# Responsibilities

- Parse CLI arguments and select interactive or JSON-configured creation.
- Use Clack for interactive prompts and terminal feedback.
- Call the shared project-creation API; do not implement configuration resolution or file generation here.
- Keep terminal input and presentation independent from the programmatic API.
- Consume localized content from `i18n/`; do not own locale catalogs here.

# Version 1 interaction

- Show only supported project types; version 1 offers `package`.
- Ask for runtime, required package name and description, license, recommended tools, and optional ecosystem libraries.
- Default the runtime selection to Bun; Node.js uses pnpm as its default package manager.
- Offer MIT, Apache-2.0, or no license, with no license as the default.
- Preselect recommended options; Enter accepts the current selection.
- Recommend GitHub Releases as enabled and npm publishing as disabled for both runtimes.
- Keep exact runtime/package-manager version overrides and advanced feature combinations in JSON configuration; JSON exposes every supported feature toggle.
- Do not install generated project dependencies; display the relevant install command after creation.

# Configuration mode

- `--config <path>` selects non-interactive creation.
- Delegate file loading, schema validation, and defaults to `config/`.
- Report validation and generation failures without duplicating their underlying logic.
