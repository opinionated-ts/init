export { projectConfigSchema } from "./schema";
export type { ProjectConfig, ProjectConfigInput } from "./schema";

import { projectConfigSchema } from "./schema";

export function normalizeProjectConfig(input: unknown) {
  return projectConfigSchema.parse(input);
}
