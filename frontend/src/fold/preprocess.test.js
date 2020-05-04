import preprocessFOLDModel, {
	setDefaultFrameRate,
	moveRootFrameToFileFrames,
	DEFAULT_FRAME_RATE,
} from "./preprocess"

import { FRAME_RATE_PROPERTY } from "./properties"

describe("moveRootFrameToFileFrames", () => {
	const modelFactory = () => {
		return {
			file_author: "Origuide",
			file_classes: ["animation", "origuide:guide"],
			frame_title: "",
			frame_classes: ["creasePattern", "origuide:steady_state"],
			frame_attributes: ["3D"],
			vertices_coords: [[-1, -1, 0]],
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [[-1, -1, 0]],
				},
			],
		}
	}

	it("should remove frame from root", () => {
		// given
		const model = modelFactory()
		// when
		moveRootFrameToFileFrames(model)
		// then
		;[
			"frame_title",
			"frame_classes",
			"frame_attributes",
			"vertices_coords",
		].forEach((prop) => expect(model).not.toHaveProperty(prop))
	})

	it("should retain root properties", () => {
		// given
		const model = modelFactory()
		// when
		moveRootFrameToFileFrames(model)
		// then
		;["file_author", "file_classes"].forEach((prop) =>
			expect(model).toHaveProperty(prop)
		)
	})

	it("should prepend frames with root frame", () => {
		// given
		const model = modelFactory()
		const framesAfterTransformation = [
			{
				frame_title: "",
				frame_classes: ["creasePattern", "origuide:steady_state"],
				frame_attributes: ["3D"],
				vertices_coords: [[-1, -1, 0]],
			},
			{
				frame_title: "",
				vertices_coords: [[-1, -1, 0]],
			},
		]
		// when
		moveRootFrameToFileFrames(model)
		// then
		expect(model.file_frames).toStrictEqual(framesAfterTransformation)
	})

	it("should not prepend frames if model does not contain a root frame", () => {
		// given
		const model = {
			file_author: "Dummy",
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [[-1, -1, 0]],
				},
			],
		}
		// when
		moveRootFrameToFileFrames(model)
		// then
		expect(model.file_frames).toHaveLength(1)
	})
})

describe("setDefaultFrameRate", () => {
	it("should set default framerate if model does not specify it", () => {
		// given
		const model = {}
		// when
		setDefaultFrameRate(model)
		// then
		expect(model[FRAME_RATE_PROPERTY]).toStrictEqual(DEFAULT_FRAME_RATE)
	})

	it("should not set default framerate if model specifies its own", () => {
		// given
		const model = {}
		model[FRAME_RATE_PROPERTY] = "44"
		// when
		setDefaultFrameRate(model)
		// then
		expect(model[FRAME_RATE_PROPERTY]).not.toStrictEqual(DEFAULT_FRAME_RATE)
	})
})

describe("preprocessFOLDModel", () => {
	it("should work in-place for performance reasons", () => {
		// given
		const model = {
			file_frames: [{}],
		}
		// when
		const output = preprocessFOLDModel(model)
		// then
		expect(output).toBe(model)
	})
})
