export function downloadTextFile(text, name) {
	const a = document.createElement("a")
	const type = name.split(".").pop()
	a.href = URL.createObjectURL(
		new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` })
	)
	a.download = name
	a.click()
}

export function convertToFileName(name) {
	return name
		.replace(/^[0-9]+/, "") // file names can't start with a digit
		.replace(/[^a-z0-9]/gi, "_") // only allow alphanumeric characters
		.toLowerCase()
}
