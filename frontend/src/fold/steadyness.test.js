import {
	isSteady,
	STEADY_STATE_CLASS,
	getSteadyFrameIds,
	markFrameSteady,
	getNextSteadyFrameId,
	getPreviousSteadyFrameId,
} from "./steadyness"

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
		const frame = { frame_classes: [STEADY_STATE_CLASS] }
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
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		// given
		const frames = [steadyFrame, {}, {}, steadyFrame, {}]
		// when
		const steadyFrames = getSteadyFrameIds(frames)
		// then
		expect(steadyFrames).toStrictEqual([0, 3])
	})
})

describe("getNextSteadyFrameId", () => {
	it("should return id of the next steady frame", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [steadyFrame, {}, {}, steadyFrame, {}]
		const currentFrameId = 1

		const nextSteadyFrameId = getNextSteadyFrameId(frames, currentFrameId)
		expect(nextSteadyFrameId).toStrictEqual(3)
	})

	it("should return the last frame if current frame is after the last steady frame", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [steadyFrame, {}, {}, {}, {}]
		const currentFrameId = 1

		const nextSteadyFrameId = getNextSteadyFrameId(frames, currentFrameId)
		expect(nextSteadyFrameId).toStrictEqual(4)
	})

	it("should return the current frame if current frame is steady", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [steadyFrame, {}, steadyFrame, steadyFrame, {}]
		const currentFrameId = 2

		const nextSteadyFrameId = getNextSteadyFrameId(frames, currentFrameId)
		expect(nextSteadyFrameId).toStrictEqual(2)
	})
})

describe("getPreviousSteadyFrameId", () => {
	it("should return id of the previous steady frame", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [steadyFrame, {}, {}, steadyFrame, {}]
		const currentFrameId = 4

		const previousSteadyFrameId = getPreviousSteadyFrameId(
			frames,
			currentFrameId
		)
		expect(previousSteadyFrameId).toStrictEqual(3)
	})

	it("should return the first frame if current frame is before the first steady frame", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [{}, {}, {}, steadyFrame, {}]
		const currentFrameId = 1

		const previousSteadyFrameId = getPreviousSteadyFrameId(
			frames,
			currentFrameId
		)
		expect(previousSteadyFrameId).toStrictEqual(0)
	})

	it("should return the current frame if current frame is steady", () => {
		const steadyFrame = { frame_classes: [STEADY_STATE_CLASS] }
		const frames = [steadyFrame, {}, steadyFrame, steadyFrame, {}]
		const currentFrameId = 3

		const previousSteadyFrameId = getPreviousSteadyFrameId(
			frames,
			currentFrameId
		)
		expect(previousSteadyFrameId).toStrictEqual(3)
	})
})

describe("STEADY_STATE", () => {
	it("should be in origuide namespace", () => {
		expect(STEADY_STATE_CLASS).toMatch(/^origuide:/)
	})
})

describe("markFrameSteady", () => {
	it("should add steady class to frame if frame has no classes", () => {
		// given
		const frame = {}
		// when
		markFrameSteady(frame)
		// then
		expect(frame.frame_classes).toStrictEqual([STEADY_STATE_CLASS])
	})

	it("should add steady class and retain others", () => {
		// given
		const dummyClass = "dummy-class"
		const frame = {
			frame_classes: [dummyClass],
		}
		// when
		markFrameSteady(frame)
		// then
		expect(frame.frame_classes).toContain(STEADY_STATE_CLASS)
		expect(frame.frame_classes).toContain(dummyClass)
		expect(frame.frame_classes).toHaveLength(2)
	})

	it("should not add steady class if steady class is already set", () => {
		// given
		const classes = [STEADY_STATE_CLASS, "dummy-class"]
		const frame = {
			frame_classes: classes,
		}
		// when
		markFrameSteady(frame)
		// then
		expect(frame.frame_classes).toBe(classes)
	})
})
