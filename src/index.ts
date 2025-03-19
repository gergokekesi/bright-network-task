import { experienceLevelMatcher } from "./matchers/experienceLevel.matcher"
import { locationMatcher } from "./matchers/location.matcher"
import { roleMatcher } from "./matchers/role.matcher"
import { createJobService } from "./services/job.service"
import { createRecommendationService } from "./services/recommendation.service"
import { createUserService } from "./services/user.service"
import { logger } from "./utils/logger"

const main = async () => {
  try {
    logger.info("Running job recommender...\n")

    const jobService = createJobService()
    const userService = createUserService()

    const users = await userService.getUsers()
    const jobs = await jobService.getJobs()

    const { recommend } = await createRecommendationService(
      [locationMatcher(), roleMatcher(), experienceLevelMatcher()],
      0.7
    )

    logger.info(`Recommended jobs for all users:`)
    users.forEach((user) => {
      logger.info(`Name: ${user.name}`)
      logger.info(`Bio: ${user.bio}`)
      logger.info(`Recommendations:`)
      const recommendations = recommend(user, jobs)
      if (recommendations.length === 0) {
        logger.info(`- No recommendations found`)
      } else {
        recommendations.forEach((recommendation) => {
          logger.info(`- ${recommendation.job.title} in ${recommendation.job.location} (${recommendation.score})`)
        })
      }
      logger.info(`---------------------------------`)
    })
  } catch (error) {
    logger.error("An error occurred: ", error)
  }
}

main()
