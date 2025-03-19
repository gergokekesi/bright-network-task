import { Matcher } from "../types"

const levelKeywords = ["intern", "internship", "senior", "junior"]

export const experienceLevelMatcher = (priority: number = 1): Matcher => {
  return {
    name: "Experience Level Matcher",
    priority,
    isRelevant: (user) => {
      const userBio = user.bio.toLowerCase()
      return levelKeywords.some((keyword) => userBio.includes(keyword))
    },
    match: (user, job) => {
      const userBio = user.bio.toLowerCase()
      const jobTitle = job.title.toLowerCase()
      if (
        levelKeywords.some((keyword) => userBio.includes(keyword)) &&
        levelKeywords.some((keyword) => jobTitle.includes(keyword))
      ) {
        return 1
      }
      return 0
    },
  }
}
