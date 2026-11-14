import { z } from "zod";

const exactVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const ecosystemPackagePattern = /^@opinionated-ts\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

const runtimeNames = ["bun", "node"] as const;
const packageManagerNames = ["bun", "pnpm"] as const;

const runtimeNameSchema = z.enum(runtimeNames);
const packageManagerNameSchema = z.enum(packageManagerNames);
const exactVersionSchema = z.string().regex(exactVersionPattern);
const licenseSchema = z.enum(["MIT", "Apache-2.0", "none"]);

const runtimeVersions = {
  bun: "1.4.4",
  node: "26.13.0",
} satisfies Record<z.infer<typeof runtimeNameSchema>, string>;

const packageManagerVersions = {
  bun: runtimeVersions.bun,
  pnpm: "12.19.0",
} satisfies Record<z.infer<typeof packageManagerNameSchema>, string>;

const defaultPackageManagers = {
  bun: "bun",
  node: "pnpm",
} satisfies Record<z.infer<typeof runtimeNameSchema>, z.infer<typeof packageManagerNameSchema>>;

const defaultTools = {
  bun: {
    formatter: "bun",
    linter: "bun",
    testRunner: "bun",
  },
  node: {
    formatter: "oxfmt",
    linter: "oxlint",
    testRunner: "vitest",
  },
} as const;

const supportedPackageManagers = {
  bun: ["bun", "pnpm"],
  node: ["bun", "pnpm"],
} as const satisfies Record<
  z.infer<typeof runtimeNameSchema>,
  readonly z.infer<typeof packageManagerNameSchema>[]
>;

const projectSchema = z
  .object({
    type: z.literal("package").default("package"),
    name: z.string().trim().min(1).max(214).regex(packageNamePattern),
    description: z.string().trim().min(1),
    destination: z.string().trim().min(1).default("."),
    license: licenseSchema.default("none"),
  })
  .strict();

const runtimeSchema = z
  .object({
    name: runtimeNameSchema.optional(),
    version: exactVersionSchema.optional(),
  })
  .strict()
  .optional();

const packageManagerSchema = z
  .object({
    name: packageManagerNameSchema.optional(),
    version: exactVersionSchema.optional(),
  })
  .strict()
  .optional();

const toolsSchema = z
  .object({
    formatter: z.enum(["bun", "oxfmt"]).optional(),
    linter: z.enum(["bun", "oxlint"]).optional(),
    testRunner: z.enum(["bun", "vitest"]).optional(),
  })
  .strict()
  .optional();

const featuresSchema = z
  .object({
    typeCheck: z.boolean().optional(),
    cspell: z.boolean().optional(),
    commitlint: z.boolean().optional(),
    lefthook: z.boolean().optional(),
    release: z
      .object({
        github: z.boolean().optional(),
        npm: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();

const validationSchema = z
  .object({
    prePush: z.enum(["tests", "coverage"]).optional(),
  })
  .strict()
  .optional();

const ecosystemPackagesSchema = z
  .array(z.string().regex(ecosystemPackagePattern))
  .refine((packages) => new Set(packages).size === packages.length)
  .optional();

export const projectConfigSchema = z
  .object({
    project: projectSchema,
    runtime: runtimeSchema,
    packageManager: packageManagerSchema,
    tools: toolsSchema,
    features: featuresSchema,
    validation: validationSchema,
    ecosystemPackages: ecosystemPackagesSchema,
  })
  .strict()
  .superRefine((config, context) => {
    const runtimeName = config.runtime?.name ?? "bun";
    const packageManagerName = config.packageManager?.name;

    if (
      packageManagerName !== undefined &&
      !supportedPackageManagers[runtimeName].includes(packageManagerName)
    ) {
      context.addIssue({
        code: "custom",
        path: ["packageManager", "name"],
        message: "The selected package manager is not supported by this runtime.",
      });
    }
  })
  .transform((config) => {
    const runtimeName = config.runtime?.name ?? "bun";
    const packageManagerName = config.packageManager?.name ?? defaultPackageManagers[runtimeName];

    return {
      project: config.project,
      runtime: {
        name: runtimeName,
        version: config.runtime?.version ?? runtimeVersions[runtimeName],
      },
      packageManager: {
        name: packageManagerName,
        version: config.packageManager?.version ?? packageManagerVersions[packageManagerName],
      },
      tools: {
        formatter: config.tools?.formatter ?? defaultTools[runtimeName].formatter,
        linter: config.tools?.linter ?? defaultTools[runtimeName].linter,
        testRunner: config.tools?.testRunner ?? defaultTools[runtimeName].testRunner,
      },
      features: {
        typeCheck: config.features?.typeCheck ?? true,
        cspell: config.features?.cspell ?? true,
        commitlint: config.features?.commitlint ?? true,
        lefthook: config.features?.lefthook ?? true,
        release: {
          github: config.features?.release?.github ?? true,
          npm: config.features?.release?.npm ?? false,
        },
      },
      validation: {
        prePush: config.validation?.prePush ?? "tests",
      },
      ecosystemPackages: config.ecosystemPackages ?? [],
    };
  });

export type ProjectConfigInput = z.input<typeof projectConfigSchema>;
export type ProjectConfig = z.output<typeof projectConfigSchema>;
