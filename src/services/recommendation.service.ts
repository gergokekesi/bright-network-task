import { UserService } from "./user.service"
import { JobService } from "./job.service"
import { logger } from "../utils/logger"
import { Job, Matcher, User } from "../types"

type Recommendation = {
  job: Job
  score: number
}

export type RecommendationService = {
  getRecommendations: () => Promise<Record<string, Recommendation[]>>
}

export const createRecommendationService = async (
  jobService: JobService,
  userService: UserService,
  matchers: Matcher[],
  cutoff: number = 0.7
): Promise<RecommendationService> => {
  const jobs = await jobService.getJobs()
  const users = await userService.getUsers()

  const getRecommendations = async (): Promise<Record<string, Recommendation[]>> => {
    const recommendations: Record<string, Recommendation[]> = {}

    users.forEach((user: User) => {
      const userRecommendations: Recommendation[] = []

      logger.verbose(`Matching ${user.name}`)
      logger.verbose(`User bio: ${user.bio}`)

      const relevantMatchers = matchers.filter((matcher) => matcher.isRelevant(user))

      logger.verbose(`Relevant matchers: ${relevantMatchers.map((matcher) => matcher.name).join(", ")}`)

      jobs.forEach((job: Job) => {
        let totalWeightedScore = 0
        let totalPriority = 0

        logger.verbose(`Job title: ${job.title}`)
        logger.verbose(`Job location: ${job.location}`)

        relevantMatchers.forEach((matcher: Matcher) => {
          const score = matcher.match(user, job)

          logger.verbose(`${matcher.name} score: ${score}, weighted score: ${score * matcher.priority}`)

          totalWeightedScore += score * matcher.priority
          totalPriority += matcher.priority
        })

        const averageScore = totalPriority > 0 ? totalWeightedScore / totalPriority : 0
        const roundedScore = Math.round(averageScore * 100) / 100
        logger.verbose(`Average score: ${roundedScore}\n`)

        userRecommendations.push({ job, score: roundedScore })
      })

      const recommendedJobs = userRecommendations
        .filter((recommendation) => recommendation.score > cutoff)
        .sort((a, b) => b.score - a.score)

      recommendations[user.name] = recommendedJobs
    })

    return recommendations
  }

  return {
    getRecommendations,
  }
}
