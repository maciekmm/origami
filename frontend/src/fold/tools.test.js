import { isSteady, STEADY_STATE, getSteadyFrameIds } from "./tools"

describe("isSteady", () => {
	it("should be false if frame has no classes", () => {
		// given
		const frame = {}
		// when
		const steady = isSteady(frame)
		// then
		expect(steady).toBe(false)
	})

	it("should be true if frame has a steady state class", () => {
		// given
		const frame = { frame_classes: [STEADY_STATE] }
		// when
		const steady = isSteady(frame)
		// then
		expect(steady).toBe(true)
	})

	it("should be false if frame does not have a steady state class", () => {
		// given
		const frame = { frame_classes: [] }
		// when
		const steady = isSteady(frame)
		// then
		expect(steady).toBe(false)
	})
})

describe("getSteadyFrameIds", () => {
	it("should return empty array if no steady frames are found", () => {
		// given
		const frames = []
		// when
		const steadyFrames = getSteadyFrameIds(frames)
		// then
		expect(steadyFrames).toStrictEqual([])
	})

	it("should return ids of steady frames", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE] }
		// given
		const frames = [steadyFrame, {}, {}, steadyFrame, {}]
		// when
		const steadyFrames = getSteadyFrameIds(frames)
		// then
		expect(steadyFrames).toStrictEqual([0, 3])
	})
})

describe("STEADY_STATE", () => {
	it("should be in origuide namespace", () => {
		expect(STEADY_STATE).toMatch(/^origuide:/)
	})
})
