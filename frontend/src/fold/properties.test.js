import { FRAME_RATE_PROPERTY, getComputedProperty } from "./properties"

describe("FRAME_RATE_PROPERTY", () => {
	it("should be a file property", () => {
		expect(FRAME_RATE_PROPERTY).toMatch(/^file_/)
	})

	it("should be in origuide namespace", () => {
		expect(FRAME_RATE_PROPERTY).toMatch(/^[^:]*_og:/)
	})
})

describe("getComputedProperty", () => {
	it("should return return the frame's property if it exists", () => {
		const frames = [{ prop: "value" }]

		const value = getComputedProperty(frames, 0, "prop")
		expect(value).toStrictEqual("value")
	})

	it("should return return undefnied if frame has no such property", () => {
		const frames = [{}]

		const value = getComputedProperty(frames, 0, "prop")
		expect(value).toStrictEqual(undefined)
	})

	it("should return parent's property if frame has no such property, but parent does", () => {
		const frames = [{ prop: "value" }, { frame_inherit: true, frame_parent: 0 }]

		const value = getComputedProperty(frames, 1, "prop")
		expect(value).toStrictEqual("value")
	})

	it("should reference the correct frame", () => {
		const frames = [{ prop: "value-0" }, { prop: "value-1" }]

		const value = getComputedProperty(frames, 1, "prop")
		expect(value).toStrictEqual("value-1")
	})

	it("should return recursively search for value until found or chain ends", () => {
		const frames = [
			{ prop: "value" },
			{ frame_inherit: true, frame_parent: 0 },
			{ frame_inherit: true, frame_parent: 1 },
		]

		const value = getComputedProperty(frames, 2, "prop")
		expect(value).toStrictEqual("value")
	})

	it("should interpolate array null values if frame_inheritDeep is defined", () => {
		const frames = [
			{ prop: [5, 3] },
			{
				frame_inherit: true,
				frame_inheritDeep: true,
				frame_parent: 0,
				prop: [null, 1],
			},
		]

		const value = getComputedProperty(frames, 1, "prop")
		expect(value).toStrictEqual([5, 1])
	})
})
