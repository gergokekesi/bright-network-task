import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  verbose: true,
  setupFilesAfterEnv: ["./test/setup.ts"],
}

export default config
