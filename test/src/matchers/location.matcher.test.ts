import { locationMatcher } from "../../../src/matchers/location.matcher"
import { Job, Matcher, User } from "../../../src/types"

describe("LocationMatcher", () => {
  let matcher: Matcher

  beforeEach(() => {
    matcher = locationMatcher()
  })

  describe("isRelevant", () => {
    it("should return true if the user has a location keyword mentioned in their bio", async () => {
      const userWithLocation: User = { name: "Test User", bio: "I am currently in London" }
      expect(matcher.isRelevant(userWithLocation)).toBe(true)

      const userWithRelocation: User = { name: "Test User", bio: "I want to relocate to Manchester" }
      expect(matcher.isRelevant(userWithRelocation)).toBe(true)

      const userWithNegativeLocation: User = {
        name: "Test User",
        bio: "I am looking for jobs outside of Bristol",
      }
      expect(matcher.isRelevant(userWithNegativeLocation)).toBe(true)

      const userWithMultipleKeywords: User = {
        name: "Test User",
        bio: "I am from Sheffield and looking to move to London, not Birmingham",
      }
      expect(matcher.isRelevant(userWithMultipleKeywords)).toBe(true)
    })

    it("should return false if the user does not have a location keyword mentioned in their bio", async () => {
      const userWithoutLocation: User = { name: "Test User", bio: "I am a software developer" }
      expect(matcher.isRelevant(userWithoutLocation)).toBe(false)

      //This fails becasue the matcher is looking at the whole bio and "Looking" has "in" in it therefore it's considered a location keyword
      //Thought I'd leave this in to highlight the shortcomings of this matcher
      const userWithVagueBio: User = { name: "Test User", bio: "Looking for a new opportunity" }
      expect(matcher.isRelevant(userWithVagueBio)).toBe(false)
    })
  })

  describe("match", () => {
    const jobInLondon: Job = { title: "Software Developer", location: "London" }
    const jobInManchester: Job = { title: "Designer", location: "Manchester" }

    it("should return 1 if user prefers the job location", () => {
      const userPrefersLondon: User = { name: "Test User", bio: "I am currently in London" }
      expect(matcher.match(userPrefersLondon, jobInLondon)).toBe(1)

      const userPrefersManchester: User = { name: "Test User", bio: "I want to relocate to Manchester" }
      expect(matcher.match(userPrefersManchester, jobInManchester)).toBe(1)

      const userPrefersGenericLocation: User = { name: "Test User", bio: "I am looking for a job in London" }
      expect(matcher.match(userPrefersGenericLocation, jobInLondon)).toBe(1)

      const userPrefersLocationWithExtraWords: User = {
        name: "Test User",
        bio: "I am looking for a new role in London and surrounding areas",
      }
      expect(matcher.match(userPrefersLocationWithExtraWords, jobInLondon)).toBe(1)
    })

    it("should return 0 if user excludes the job location", () => {
      const userExcludesLondon: User = { name: "Test User", bio: "I am looking for jobs outside of London" }
      expect(matcher.match(userExcludesLondon, jobInLondon)).toBe(0)

      const userExcludesManchester: User = { name: "Test User", bio: "I am not in Manchester" }
      expect(matcher.match(userExcludesManchester, jobInManchester)).toBe(0)
    })

    it("should return 1 if user has no relevant location keywords", () => {
      const userWithNoLocationInfo: User = { name: "Test User", bio: "I am a skilled developer" }
      expect(matcher.match(userWithNoLocationInfo, jobInLondon)).toBe(1)
    })
  })
})
