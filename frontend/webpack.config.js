const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyWebPackPlugin = require("copy-webpack-plugin")

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
	},
	resolve: {
		alias: {
			"@dom-components": path.resolve("src/components/dom/"),
			"@three-components": path.resolve("src/components/three/"),
			"@fold": path.resolve("src/fold/"),
			"@store": path.resolve("src/store/"),
		},
	},
	devServer: {
		contentBase: "./dist",
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.html$/,
				use: "html-loader",
			},
			{
				test: /\.css$/,
				exclude: /public\/style\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
						},
					},
				],
			},
			{
				test: /public\/.*\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.fold$/i,
				loader: "json-loader",
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "src/index.html",
			filename: "index.html",
		}),
		new CopyWebPackPlugin({
			patterns: [
				{
					from: "_redirects",
					to: ".",
				},
			],
		}),
	],
}
