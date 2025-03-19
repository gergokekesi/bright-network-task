import { Job, jobSchema } from "../types"
import { getConfig } from "../utils/config.util"

export type JobService = {
  getJobs: () => Promise<Job[]>
}

export const createJobService = (): JobService => {
  const config = getConfig()

  const getJobs = async (): Promise<Job[]> => {
    const response = await fetch(config.JOBS_ENDPOINT)

    if (!response.ok) {
      throw new Error("Failed to fetch jobs")
    }

    const jobs = await response.json()

    return jobs.map((job: any) => jobSchema.parse(job))
  }

  return {
    getJobs,
  }
}
