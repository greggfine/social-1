import { hours12 } from "./helpers"

it("should return 12 hour time", () => {
  expect(hours12(new Date())).toBeLessThanOrEqual(12)
})
