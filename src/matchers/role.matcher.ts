import { Matcher } from "../types"
import stringSimilarity from "../utils/stringSimilarity"

export const roleMatcher = (priority: number = 1): Matcher => {
  return {
    name: "Role Matcher",
    priority,
    isRelevant: (_user) => {
      return true
    },
    match: (user, job) => {
      const userBio = user.bio.toLowerCase()
      const jobTitle = job.title.toLowerCase()

      const jobTitleWords = jobTitle.split(" ")
      const userBioWords = userBio.split(" ")

      if (jobTitleWords.length === 0) {
        return 0
      }

      let maxSimilarity = 0

      for (const word1 of jobTitleWords) {
        for (const word2 of userBioWords) {
          const similarity = stringSimilarity(word1, word2)
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity
          }
        }
      }

      return maxSimilarity
    },
  }
}
