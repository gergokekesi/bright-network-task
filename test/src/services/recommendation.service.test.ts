import { locationMatcher } from "../../../src/matchers/location.matcher"
import { JobService } from "../../../src/services/job.service"
import { createRecommendationService, RecommendationService } from "../../../src/services/recommendation.service"
import { UserService } from "../../../src/services/user.service"

describe("RecommendationService", () => {
  it("should return a list of recommendations", async () => {
    const jobService: JobService = {
      getJobs: jest.fn().mockResolvedValue([
        { title: "Software Developer", location: "London" },
        { title: "Software Developer", location: "Bristol" },
      ]),
    }
    const userService: UserService = {
      getUsers: jest.fn().mockResolvedValue([{ name: "Grace", bio: "Looking for software jobs in London" }]),
    }
    const recommendationService: RecommendationService = await createRecommendationService(
      jobService,
      userService,
      [locationMatcher()],
      0.7
    )
    const recommendations = await recommendationService.getRecommendations()
    expect(recommendations).toEqual({ Grace: [{ job: { title: "Software Developer", location: "London" }, score: 1 }] })
  })
})
