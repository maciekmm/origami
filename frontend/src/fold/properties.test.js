import { FRAME_RATE_PROPERTY } from "./properties"

describe("FRAME_RATE_PROPERTY", () => {
	it("should be a file property", () => {
		expect(FRAME_RATE_PROPERTY).toMatch(/^file_/)
	})

	it("should be in origuide namespace", () => {
		expect(FRAME_RATE_PROPERTY).toMatch(/^[^:]*_og:/)
	})
})
