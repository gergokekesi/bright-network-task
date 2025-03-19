import { roleMatcher } from "../../../src/matchers/role.matcher"
import { Matcher } from "../../../src/types"

describe("roleMatcher", () => {
  let matcher: Matcher

  beforeEach(() => {
    matcher = roleMatcher()
  })

  test("isRelevant should always return true", () => {
    const user = { name: "Test User", bio: "Software Engineer" }
    expect(matcher.isRelevant(user)).toBe(true)
  })

  test("match should return 1 if there's an exact word match between job title and user bio", () => {
    const user = { name: "Test User", bio: "Experienced software engineer with a focus on backend development." }
    const job = { title: "Senior Software Engineer", location: "London" }

    expect(matcher.match(user, job)).toBe(1)
  })

  test("match should return 0.85 if there's an close word match between job title and user bio", () => {
    const user = { name: "Test User", bio: "softwaer enginerr" }
    const job = { title: "Software Engineer", location: "London" }

    expect(matcher.match(user, job)).toBeCloseTo(0.857)
  })
})
