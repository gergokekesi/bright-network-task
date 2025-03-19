import { z } from "zod"

const configValidationSchema = z.object({
  JOBS_ENDPOINT: z.string(),
  USERS_ENDPOINT: z.string(),
})

export type Config = z.infer<typeof configValidationSchema>

let config: Config | undefined = undefined

export const getConfig = (): Config => {
  const validatedConfig = configValidationSchema.parse(process.env)

  if (!config) {
    config = {
      JOBS_ENDPOINT: validatedConfig.JOBS_ENDPOINT,
      USERS_ENDPOINT: validatedConfig.USERS_ENDPOINT,
    }
  }

  return config
}
