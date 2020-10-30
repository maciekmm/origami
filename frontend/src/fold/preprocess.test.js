import preprocessFOLDModel, {
	setDefaultFrameRate,
	moveRootFrameToFileFrames,
	DEFAULT_FRAME_RATE,
	markFramesToInheritDeeply,
	normalizeCoordinates,
} from "./preprocess"

import { FRAME_RATE_PROPERTY } from "./properties"

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

describe("moveRootFrameToFileFrames", () => {
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

	it("should not prepend frames if viewer does not contain a root frame", () => {
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
	it("should set default framerate if viewer does not specify it", () => {
		// given
		const model = {}
		// when
		setDefaultFrameRate(model)
		// then
		expect(model[FRAME_RATE_PROPERTY]).toStrictEqual(DEFAULT_FRAME_RATE)
	})

	it("should not set default framerate if viewer specifies its own", () => {
		// given
		const model = {}
		model[FRAME_RATE_PROPERTY] = "44"
		// when
		setDefaultFrameRate(model)
		// then
		expect(model[FRAME_RATE_PROPERTY]).not.toStrictEqual(DEFAULT_FRAME_RATE)
	})
})

describe("markFramesToInheritDeeply", () => {
	it("should mark all frames as deeply inherent", () => {
		const model = modelFactory()
		const preprocessedModel = preprocessFOLDModel(model)

		markFramesToInheritDeeply(preprocessedModel)

		preprocessedModel.file_frames.forEach((frame) => {
			expect(frame).toHaveProperty("frame_og:inheritDeep")
		})
	})
})

describe("normalizeCoordinates", () => {
	it("does nothing if perfectly bound", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[-1, -1, -1],
						[1, 1, 1],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
	})

	it("scales model up if too small", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[-0.5, -0.5, -0.5],
						[0.5, 0.5, 0.5],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
	})

	it("scales model down if too big", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[-2, -2, -2],
						[2, 2, 2],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
	})

	it("translates model to center if off-center", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[0, 0, 0],
						[2, 2, 2],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
	})

	it("translates model to center if off-center and scales if not-scaled", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[0, 0, 0],
						[1, 1, 1],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
	})

	it("scales the model according to the first frame and keeps same scale factor throughout all frames", () => {
		const model = {
			file_frames: [
				{
					frame_title: "",
					vertices_coords: [
						[0, 0, 0],
						[1, 1, 1],
					],
				},
				{
					frame_title: "",
					vertices_coords: [
						[0, 0, 0],
						[2, 2, 2],
					],
				},
			],
		}

		normalizeCoordinates(model)
		expect(model.file_frames[0].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[1, 1, 1],
		])
		expect(model.file_frames[1].vertices_coords).toStrictEqual([
			[-1, -1, -1],
			[3, 3, 3],
		])
	})
})
