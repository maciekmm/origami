module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	ignorePatterns: ["dist/", "node_modules/"],
	extends: ["plugin:prettier/recommended", "plugin:react/recommended", "prettier", "plugin:jest/recommended"],
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
	plugins: ["react", "prettier", "jest"],
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
