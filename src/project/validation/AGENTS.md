---
description: "Shared scripts and local and remote validation generation."
folderDescription: "Package scripts, Lefthook configuration, and GitHub Actions workflows reused across generated project types."
trigger: "Relevant when changing generated scripts, hooks, CI checks, release ordering, or validation performance."
---

# Package scripts

- Generate commands from enabled tools and capabilities resolved by `../toolchain/`.
- Support `format:fix`, `format:check`, `linter:fix`, `linter:check`, `tests`, `tests:watch`, `coverage`, `audit`, `audit:fix`, `check`, and `fix`.
- Generate `cspell:check` only when CSpell is enabled.
- Generate `type:check` only when no selected tool provides type checking through its own command or lint-check.
- Compose `check` from all enabled read-only validations without duplicate type checks.
- Compose `fix` from linter and formatter fix commands only.
- Allow project types to contribute additional scripts without duplicating shared scripts.

# Lefthook

- Run pre-commit fixes on staged files only.
- Run linter fix and formatter fix sequentially; re-stage their modifications.
- Run CSpell as a staged-file check after fixes only when CSpell is enabled; it is not an automatic fixer.
- Add a `commit-msg` hook for Commitlint only when Commitlint is enabled.
- Run pre-push checks on the full project: configured tests or coverage, audit, and type validation.
- When Oxlint performs type checking, use whole-project `linter:check`; otherwise use the resolved native type checker.
- Select tests or coverage through normalized configuration and run only one mode.

# GitHub Actions

- Run every enabled validation on the full project, including formatting, linting, spelling, type checking, commit-message validation, tests or configured coverage, and audit.
- Generate release workflows only when release.github or release.npm is enabled; GitHub Releases are recommended by default for both runtimes and npm publishing is disabled by default.
- Include only the selected release plugins, dependencies, and permissions. Omit Semantic Release and all release resources when both targets are disabled.
- Grant id-token: write only when npm Trusted Publishing is enabled.
- Use main for stable releases and insiders/canary for separate prerelease channels; group/* branches are validated but never release.
- Read exact runtime and package-manager versions from package.json engines and packageManager in generated workflows.
- Reuse prior validation only when exact tree/config matching is straightforward and reliable; otherwise run the full validation.
- Parallelize independent read-only checks; serialize mutations.
- Avoid repeated checkout, runtime setup, and dependency installation where jobs can share them.
- Cache package-manager stores using lockfile-derived keys; do not cache `node_modules`.
- Bound concurrency to avoid resource contention.

# Boundaries

- Keep shared validation behavior here for every project type.
- Consume resolved capabilities and commands from `../toolchain/`.
- Keep project-type-specific script contributions in the selected project-type module.
- Do not own runtime compatibility or filesystem writes.
