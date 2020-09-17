import interpolateModel from "./interpolate"

describe("moveRootFrameToFileFrames", () => {
	it("should inherit array null values from parent", () => {
		// given
		const model = {
			file_frames: [
				{
					frame_values: [1, 2, 3],
				},
				{
					frame_inherit: true,
					frame_parent: 0,
					"frame_og:inheritDeep": true,
					frame_values: [null, 4, null],
				},
			],
		}
		const interpolated = interpolateModel(model)

		expect(interpolated.file_frames[1].frame_values).toStrictEqual([1, 4, 3])
	})

	it("removes DEEP_INHERITANCE parameter", () => {
		// given
		const model = {
			file_frames: [
				{
					"frame_og:inheritDeep": true,
				},
			],
		}
		const interpolated = interpolateModel(model)

		expect(interpolated.file_frames[0]["frame_og:inheritDeep"]).toBeUndefined()
	})
})
