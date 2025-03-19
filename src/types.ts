import { z } from "zod"

export const jobSchema = z.object({
  title: z.string(),
  location: z.string(),
})
export type Job = z.infer<typeof jobSchema>

export const userSchema = z.object({
  name: z.string(),
  bio: z.string(),
})
export type User = z.infer<typeof userSchema>

export interface Matcher {
  name: string
  priority: number
  match: (user: User, job: Job) => number
  isRelevant: (user: User) => boolean
}
