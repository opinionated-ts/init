import { describe, expect, it } from "vitest";

import { normalizeProjectConfig, projectConfigSchema } from "@/config";

const project = {
  name: "example-package",
  description: "An example package",
};

describe("projectConfigSchema", () => {
  it("applies Bun defaults", () => {
    const config = normalizeProjectConfig({ project });

    expect(config).toEqual({
      project: {
        ...project,
        type: "package",
        destination: ".",
        license: "none",
      },
      runtime: {
        name: "bun",
        version: "1.4.4",
      },
      packageManager: {
        name: "bun",
        version: "1.4.4",
      },
      tools: {
        formatter: "bun",
        linter: "bun",
        testRunner: "bun",
      },
      features: {
        typeCheck: true,
        cspell: true,
        commitlint: true,
        lefthook: true,
        release: {
          github: true,
          npm: false,
        },
      },
      validation: {
        prePush: "tests",
      },
      ecosystemPackages: [],
    });
  });

  it("applies Node.js defaults without coupling the package manager to the runtime", () => {
    const config = normalizeProjectConfig({
      project,
      runtime: {
        name: "node",
      },
    });

    expect(config.runtime).toEqual({
      name: "node",
      version: "26.13.0",
    });
    expect(config.packageManager).toEqual({
      name: "pnpm",
      version: "12.19.0",
    });
    expect(config.tools).toEqual({
      formatter: "oxfmt",
      linter: "oxlint",
      testRunner: "vitest",
    });
  });

  it.each([
    { runtime: "bun", packageManager: "pnpm" },
    { runtime: "node", packageManager: "bun" },
  ])(
    "accepts independent runtime and package-manager selections",
    ({ runtime, packageManager }) => {
      const config = normalizeProjectConfig({
        project,
        runtime: { name: runtime },
        packageManager: { name: packageManager },
      });

      expect(config.runtime.name).toBe(runtime);
      expect(config.packageManager.name).toBe(packageManager);
    },
  );

  it("preserves explicit versions, tools, features, and project options", () => {
    const config = normalizeProjectConfig({
      project: {
        ...project,
        destination: "../output",
        license: "MIT",
      },
      runtime: {
        name: "node",
        version: "27.0.0",
      },
      packageManager: {
        name: "bun",
        version: "1.5.0",
      },
      tools: {
        formatter: "oxfmt",
        linter: "bun",
        testRunner: "vitest",
      },
      features: {
        typeCheck: false,
        cspell: false,
        commitlint: true,
        lefthook: false,
        release: {
          github: false,
          npm: true,
        },
      },
      validation: {
        prePush: "coverage",
      },
      ecosystemPackages: ["@opinionated-ts/result"],
    });

    expect(config).toMatchObject({
      project: {
        destination: "../output",
        license: "MIT",
      },
      runtime: {
        name: "node",
        version: "27.0.0",
      },
      packageManager: {
        name: "bun",
        version: "1.5.0",
      },
      tools: {
        formatter: "oxfmt",
        linter: "bun",
        testRunner: "vitest",
      },
      features: {
        typeCheck: false,
        cspell: false,
        commitlint: true,
        lefthook: false,
        release: {
          github: false,
          npm: true,
        },
      },
      validation: {
        prePush: "coverage",
      },
      ecosystemPackages: ["@opinionated-ts/result"],
    });
  });

  it("keeps release targets independent when both are disabled", () => {
    const config = normalizeProjectConfig({
      project,
      features: {
        release: {
          github: false,
          npm: false,
        },
      },
    });

    expect(config.features.release).toEqual({
      github: false,
      npm: false,
    });
  });

  it("applies defaults independently to partially configured features", () => {
    const config = normalizeProjectConfig({
      project,
      features: {
        cspell: false,
        release: {
          npm: true,
        },
      },
    });

    expect(config.features).toEqual({
      typeCheck: true,
      cspell: false,
      commitlint: true,
      lefthook: true,
      release: {
        github: true,
        npm: true,
      },
    });
  });

  it("rejects unsupported project types and package managers", () => {
    expect(
      projectConfigSchema.safeParse({
        project: {
          ...project,
          type: "web",
        },
      }).success,
    ).toBe(false);

    expect(
      projectConfigSchema.safeParse({
        project,
        packageManager: {
          name: "npm",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid package identity and non-exact versions", () => {
    expect(
      projectConfigSchema.safeParse({
        project: {
          name: "Invalid Name",
          description: project.description,
        },
      }).success,
    ).toBe(false);

    expect(
      projectConfigSchema.safeParse({
        project,
        runtime: {
          version: "^1.4.4",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects unknown options, invalid ecosystem packages, and duplicate selections", () => {
    expect(
      projectConfigSchema.safeParse({
        project,
        features: {
          releases: true,
        },
      }).success,
    ).toBe(false);

    expect(
      projectConfigSchema.safeParse({
        project,
        ecosystemPackages: ["some-other-package"],
      }).success,
    ).toBe(false);

    expect(
      projectConfigSchema.safeParse({
        project,
        ecosystemPackages: ["@opinionated-ts/result", "@opinionated-ts/result"],
      }).success,
    ).toBe(false);
  });
});
