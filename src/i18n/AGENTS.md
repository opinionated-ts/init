---
description: "Locale catalogs for human-readable application text."
folderDescription: "Language-specific text shared by CLI and programmatic application entry points."
trigger: "Relevant when adding locales or changing user-facing text."
---

# Locale organization

- Keep each language under its own directory, such as `en/`.
- Organize catalog content by application domain, not by UI component or entry point.
- Keep catalogs independent of CLI control flow and application logic.
- Store prompts, descriptions, errors, and status text here.
- Keep generated-project file contents in the relevant project-type generator.
- Reference catalog entries through stable, descriptive keys.
