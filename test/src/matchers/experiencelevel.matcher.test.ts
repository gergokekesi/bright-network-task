import { experienceLevelMatcher } from "../../../src/matchers/experienceLevel.matcher"
import { Job, Matcher, User } from "../../../src/types"

describe("ExperienceLevelMatcher", () => {
  let matcher: Matcher

  beforeEach(() => {
    matcher = experienceLevelMatcher()
  })

  describe("isRelevant", () => {
    it("should return true if the user bio contains 'internship'", async () => {
      const user: User = { name: "Test User", bio: "Seeking an internship opportunity." }
      expect(matcher.isRelevant(user)).toBe(true)
    })

    it("should return true if the user bio contains 'senior'", async () => {
      const user: User = { name: "Test User", bio: "I am a senior developer." }
      expect(matcher.isRelevant(user)).toBe(true)
    })

    it("should return false if the user bio does not contain any relevant keywords", async () => {
      const user: User = { name: "Test User", bio: "I am a software developer with experience." }
      expect(matcher.isRelevant(user)).toBe(false)
    })

    /*This fails due to the implementation of the isRelevant method in the experienceLevelMatcher
     * this is because the check used is a simple 'includes' which will return true if the keyword is part of another word
     */
    it("should return false if a relevant keyword is part of another word", async () => {
      const user: User = { name: "Test User", bio: "I am interning at a company." }
      expect(matcher.isRelevant(user)).toBe(false)
    })
  })

  describe("match", () => {
    const jobSeniorDev: Job = { title: "Senior Software Developer", location: "London" }
    const jobJuniorDev: Job = { title: "Junior Front-End Engineer", location: "Manchester" }
    const jobIntern: Job = { title: "Marketing Intern", location: "Birmingham" }
    const jobNoLevel: Job = { title: "Software Engineer", location: "Bristol" }

    const userSenior: User = { name: "Senior User", bio: "I have senior-level experience." }
    const userJunior: User = { name: "Junior User", bio: "Looking for a junior role." }
    const userIntern: User = { name: "Intern User", bio: "I am an intern." }
    const userNoLevel: User = { name: "Generic User", bio: "I am a developer." }

    it("should return 1 if both user bio and job title contain a level keyword", () => {
      expect(matcher.match(userSenior, jobSeniorDev)).toBe(1)
      expect(matcher.match(userJunior, jobJuniorDev)).toBe(1)
      expect(matcher.match(userIntern, jobIntern)).toBe(1)
    })

    it("should return 0 if user bio contains a level keyword but job title does not", () => {
      expect(matcher.match(userSenior, jobNoLevel)).toBe(0)
      expect(matcher.match(userJunior, jobNoLevel)).toBe(0)
      expect(matcher.match(userIntern, jobNoLevel)).toBe(0)
    })

    it("should return 0 if job title contains a level keyword but user bio does not", () => {
      expect(matcher.match(userNoLevel, jobSeniorDev)).toBe(0)
      expect(matcher.match(userNoLevel, jobJuniorDev)).toBe(0)
      expect(matcher.match(userNoLevel, jobIntern)).toBe(0)
    })

    it("should return 0 if neither user bio nor job title contains a level keyword", () => {
      expect(matcher.match(userNoLevel, jobNoLevel)).toBe(0)
    })
  })
})
