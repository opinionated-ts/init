---
description: "Package-specific project composition."
folderDescription: "Package project behavior and files added on top of the shared project foundation."
trigger: "Relevant when changing package metadata, package entry points, exports, or package-only generated files."
---

# Package project

- Add only behavior and files specific to package projects.
- Reuse shared runtimes, validation, and files from the parent `project/` modules.
- Add package metadata, entry points, exports, tsdown configuration, and package-specific resources here.
- Require package name and description; set files to dist, docs, README.md, and LICENSE.
- Generate build, dev, and start scripts alongside package-specific metadata.
- Add release resources only when release.github or release.npm is enabled; GitHub Releases are enabled by default and npm publishing is disabled by default for both runtimes.
- Include the Semantic Release core and each destination plugin only when required by the selected release features; omit all release resources and dependencies when both targets are disabled.
- Use OIDC Trusted Publishing only when npm publishing is enabled.
- Contribute package-specific scripts only when they are not part of the shared script set.
- Return additional file definitions to the shared project composer.

# Boundaries

- Do not duplicate formatter, linter, test, audit, hook, or GitHub Actions setup.
- Do not own generic file writing or Git initialization.
- Keep web-specific behavior outside this directory.
