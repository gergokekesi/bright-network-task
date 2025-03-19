import { locationMatcher } from "../../../src/matchers/location.matcher"
import { JobService } from "../../../src/services/job.service"
import { createRecommendationService, RecommendationService } from "../../../src/services/recommendation.service"
import { UserService } from "../../../src/services/user.service"

describe("RecommendationService", () => {
  it("should return a list of recommendations", async () => {
    const user = { name: "Grace", bio: "I am currently in London" }
    const jobs = [
      { title: "Software Developer", location: "London" },
      { title: "Software Developer", location: "Bristol" },
    ]

    const recommendationService: RecommendationService = await createRecommendationService([locationMatcher()], 0.7)

    const { recommend } = recommendationService
    expect(recommend(user, jobs)).toEqual([{ job: { title: "Software Developer", location: "London" }, score: 1 }])
  })
})
