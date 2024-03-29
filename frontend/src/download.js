import interpolateModel from "@fold/interpolate"

function downloadTextFile(text, name) {
	const a = document.createElement("a")
	const type = name.split(".").pop()
	a.href = URL.createObjectURL(
		new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` })
	)
	a.download = name
	a.click()
}

function convertToFileName(name) {
	return name
		.replace(/^[0-9]+/, "") // file names can't start with a digit
		.replace(/[^a-z0-9]/gi, "_") // only allow alphanumeric characters
		.toLowerCase()
}

export function downloadModel(model) {
	const exported = interpolateModel(model)
	const title = model.file_title || "model"
	const exportableTitle = convertToFileName(title)
	downloadTextFile(JSON.stringify(exported), `${exportableTitle}.fold`)
}

export function modelToBase64(model) {
	// TODO: btoa does not support UTF-8
	// https://attacomsian.com/blog/javascript-base64-encode-decode
	const interpolated = interpolateModel(model)
	return btoa(JSON.stringify(interpolated))
}
