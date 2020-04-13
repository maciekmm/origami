module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ["plugin:prettier/recommended", "plugin:react/recommended", "prettier"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parser: "babel-eslint",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: ["react", "prettier"],
	rules: {
		"react/prop-types": ["off"],
		"prettier/prettier": "error"
	},
	settings: {
		react: {
			version: "detect",
		},
	},
}
