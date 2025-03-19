import { Matcher } from "../types"
import { logger } from "../utils/logger"

const locationKeywords = ["currently in", "from", "to", "in"]
const relocationKeywords = ["relocate to", "looking to move to", "relocating to"]
const negativeLocationKeywords = ["outside of", "not in", "excluding"]

const extractLocationPreference = (bio: string): { preferred: string | null; excluded: string | null } => {
  const lowerCaseBio = bio.toLowerCase()

  for (const negativeKeyword of negativeLocationKeywords) {
    const negativeIndex = lowerCaseBio.indexOf(negativeKeyword)
    if (negativeIndex !== -1) {
      return { preferred: null, excluded: lowerCaseBio.substring(negativeIndex + negativeKeyword.length).trim() }
    }
  }

  for (const relocationKeyword of relocationKeywords) {
    const relocateIndex = lowerCaseBio.indexOf(relocationKeyword)
    if (relocateIndex !== -1) {
      return { preferred: lowerCaseBio.substring(relocateIndex + relocationKeyword.length).trim(), excluded: null }
    }
  }

  for (const keyword of locationKeywords) {
    const index = lowerCaseBio.indexOf(keyword)
    if (index !== -1) {
      return { preferred: lowerCaseBio.substring(index + keyword.length).trim(), excluded: null }
    }
  }

  return { preferred: null, excluded: null }
}

const doesLocationPreferenceMatchJobLocation = (
  preference: string | null,
  excluded: string | null,
  jobLocation: string
): number => {
  const lowerCaseJobLocation = jobLocation.toLowerCase()

  if (excluded) {
    return lowerCaseJobLocation.includes(excluded) ? 0 : 1
  }

  if (preference) {
    return preference.includes(lowerCaseJobLocation) ? 1 : 0
  }

  return 1
}

export const locationMatcher = (priority: number = 1): Matcher => {
  return {
    name: "Location Matcher",
    priority,
    isRelevant: (user) => {
      const lowerCaseBio = user.bio.toLowerCase()
      const allLocationRelatedKeywords = [...locationKeywords, ...relocationKeywords, ...negativeLocationKeywords]

      logger.silly(
        `User ${JSON.stringify(user)},matched keyword - ${allLocationRelatedKeywords.filter((keyword) =>
          lowerCaseBio.includes(keyword.toLowerCase())
        )}`
      )

      return allLocationRelatedKeywords.some((keyword) => lowerCaseBio.includes(keyword.toLowerCase()))
    },
    match: (user, job) => {
      const { preferred, excluded } = extractLocationPreference(user.bio)

      logger.silly(`User location preference - preferred: ${preferred}, excluded: ${excluded}`)

      return doesLocationPreferenceMatchJobLocation(preferred, excluded, job.location)
    },
  }
}
